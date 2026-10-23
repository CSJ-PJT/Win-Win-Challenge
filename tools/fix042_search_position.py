from pathlib import Path
R=Path(__file__).resolve().parents[1]
p=R/'web/app.js';s=p.read_text()
needle="    return `<label class=\"edit-field\"><span>${VISIT_FIELDS[key]}${optional?'':' <i>·</i>'}</span>"
extra='''    if(key==='address')return `<div class="edit-field address-field"><div class="address-field-heading"><label for="field-address">도착지 주소</label>${btn('search-address','주소 검색','outlined',canWrite())}</div><input name="address" id="field-address" type="text" maxlength="180" autocomplete="off" value="${escapeHTML(v)}" placeholder="도로명 주소 또는 건물 이름" ${readonly?'disabled':''}></div>`;
'''
if 'address-field-heading' not in s:
 assert needle in s
 s=s.replace(needle,extra+needle)
 old="${btn('search-address',icon('pin')+' 주소 검색','outlined',canWrite())}"
 assert s.count(old)==1;s=s.replace(old,'')
 old="    if(panel==='editor'){$('field-address')?.focus({preventScroll:true});}"
 assert old in s
 s=s.replace(old,"    if(panel==='editor'){document.querySelector('.dialog>header .icon-button')?.focus({preventScroll:true});}")
 p.write_text(s)
p=R/'web/style.css';s=p.read_text()
if '.address-field-heading{' not in s:
 s+='''\n/* Keep address search visible next to the active input, including with the keyboard open. */
.address-field{grid-column:1/-1}
.address-field-heading{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}
.address-field-heading label{flex:1;min-width:0}
.address-field-heading .button{width:auto;flex:none;min-height:44px;padding:8px 14px;border-radius:10px;font-size:.9em;margin:0}
'''
 p.write_text(s)
print('Search control now sits next to the address field')
