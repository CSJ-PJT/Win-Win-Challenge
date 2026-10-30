#!/usr/bin/env python3
"""Read-only APK certificate gate, not an installer or signature verifier.
Compare a byte-verified copy of the installed APK to a candidate APK.
0: certificate sets match (NOT install approval); 2: mismatch; 3: unreadable.
Package/version/lineage, full apksigner verification and data policy are separate.
No ADB commands, keystores, credentials, device mutations or APK rewriting.
"""
import argparse
import hashlib
import json
import struct
from pathlib import Path

SCHEMES = {0x7109871a, 0xf05368c0, 0x1b93ad61}

def lp(data, offset=0):
    if offset + 4 > len(data):
        raise ValueError("Truncated length prefix")
    size = struct.unpack_from("<I", data, offset)[0]
    end = offset + 4 + size
    if end > len(data):
        raise ValueError("Length prefix outside container")
    return data[offset + 4:end], end

def leaf_certificates(value):
    signers, end = lp(value)
    if end != len(value):
        raise ValueError("Trailing signer bytes")
    leaves, pos = set(), 0
    while pos < len(signers):
        signer, pos = lp(signers, pos)
        signed, _ = lp(signer)
        _, cert_offset = lp(signed)  # digests
        certificates, _ = lp(signed, cert_offset)
        leaf, _ = lp(certificates)
        if not leaf:
            raise ValueError("Missing leaf certificate")
        leaves.add(hashlib.sha256(leaf).hexdigest())
    if not leaves:
        raise ValueError("Missing signer")
    return sorted(leaves)

def inspect_apk(path):
    data = Path(path).read_bytes()
    eocd = data.rfind(bytes.fromhex("504b0506"))
    if eocd < 0 or eocd + 22 > len(data):
        raise ValueError("Missing ZIP end record")
    comment = struct.unpack_from("<H", data, eocd + 20)[0]
    if eocd + 22 + comment != len(data):
        raise ValueError("Invalid ZIP end record")
    cd = struct.unpack_from("<I", data, eocd + 16)[0]
    if cd < 32 or cd > eocd or data[cd - 16:cd] != b"APK Sig Block 42":
        raise ValueError("Missing supported APK signing block")
    size = struct.unpack_from("<Q", data, cd - 24)[0]
    start = cd - size - 8
    if size < 24 or start < 0 or struct.unpack_from("<Q", data, start)[0] != size:
        raise ValueError("Invalid signing-block size")
    pos, sets = start + 8, []
    while pos < cd - 24:
        if pos + 12 > cd - 24:
            raise ValueError("Truncated signing entry")
        length = struct.unpack_from("<Q", data, pos)[0]
        end = pos + 8 + length
        if length < 4 or end > cd - 24:
            raise ValueError("Signing entry outside block")
        ident = struct.unpack_from("<I", data, pos + 8)[0]
        if ident in SCHEMES:
            sets.append(leaf_certificates(data[pos + 12:end]))
        pos = end
    if pos != cd - 24 or not sets or any(s != sets[0] for s in sets):
        raise ValueError("Missing or inconsistent scheme certificates")
    return {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(),
            "leaf_certificate_sha256": sets[0]}

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--installed-apk", required=True)
    p.add_argument("--candidate-apk", required=True)
    p.add_argument("--output")
    a = p.parse_args()
    result = {"scope": "certificate equality only", "signature_verified": False,
              "package_version_lineage_verified": False, "installation_authorized": False,
              "device_actions": "none"}
    try:
        result["installed"] = inspect_apk(a.installed_apk)
        result["candidate"] = inspect_apk(a.candidate_apk)
        match = result["installed"]["leaf_certificate_sha256"] == result["candidate"]["leaf_certificate_sha256"]
        result["status"] = "CERTIFICATES_MATCH_NOT_INSTALL_APPROVAL" if match else "CERTIFICATE_MISMATCH"
        code = 0 if match else 2
    except (OSError, ValueError, struct.error):
        # Never echo file contents, exception data or command-line credentials.
        result["status"] = "UNREADABLE_OR_UNSUPPORTED_APK"
        code = 3
    text = json.dumps(result, ensure_ascii=False, indent=2)
    if a.output:
        Path(a.output).write_text(text + "\n", encoding="utf-8")
    print(text)
    return code

if __name__ == "__main__":
    raise SystemExit(main())
