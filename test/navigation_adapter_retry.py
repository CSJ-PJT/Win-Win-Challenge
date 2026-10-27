#!/usr/bin/env python3
"""Compile the real adapter against controlled SDK doubles; no Android runtime or network.
The doubles implement only the consumed API surface, not NaviHelper's service internals.
Actual SDK compatibility is checked separately by the Android Gradle build.
"""
import json
from pathlib import Path
import subprocess
import tempfile

SOURCES = json.loads(r'''{"android/content/Context.java":"package android.content; public class Context { public Context getApplicationContext(){return this;} }","kotlin/Unit.java":"package kotlin; public final class Unit { public static final Unit INSTANCE=new Unit(); private Unit(){} }","ai/pleos/playground/navi/constants/NaviErrorCode.java":"package ai.pleos.playground.navi.constants; public enum NaviErrorCode { TEST_ERROR }","ai/pleos/playground/navi/helper/listener/NaviHelperEventListener.java":"package ai.pleos.playground.navi.helper.listener; import ai.pleos.playground.navi.constants.NaviErrorCode; public abstract class NaviHelperEventListener { public abstract void onRoutingCompleted(); public abstract void onError(NaviErrorCode error); }","ai/pleos/playground/navi/helper/NaviHelper.java":"package ai.pleos.playground.navi.helper;\nimport android.content.Context; import java.util.*; import java.util.function.*; import kotlin.Unit; import ai.pleos.playground.navi.helper.listener.NaviHelperEventListener;\npublic final class NaviHelper {\n public static final List<NaviHelper> instances=new ArrayList<>(); public static int initCalls,routeCalls; public static boolean throwNext;\n public Supplier<Unit> success; public Function<Throwable,Unit> failure; public int released,added,removed;\n public NaviHelper(Context c){instances.add(this);}\n public void initialize(Supplier<Unit> ok,Function<Throwable,Unit> fail){initCalls++; success=ok; failure=fail; if(throwNext){throwNext=false;throw new IllegalStateException(\"controlled initialize exception\");}}\n public void addListener(NaviHelperEventListener l){added++;} public void removeListener(NaviHelperEventListener l){removed++;}\n public void requestRoute(Object route){routeCalls++;} public void release(){released++;}\n public static void reset(){instances.clear();initCalls=0;routeCalls=0;throwNext=false;}\n}","kr/co/ansimdonghaeng/RouteFactory.java":"package kr.co.ansimdonghaeng; final class RouteFactory { static Object sample(){return new Object();} }","kr/co/ansimdonghaeng/NavigationAdapterRetryTest.java":"package kr.co.ansimdonghaeng;\nimport android.content.Context; import ai.pleos.playground.navi.helper.NaviHelper; import java.util.*;\npublic final class NavigationAdapterRetryTest {\n static void check(boolean v,String message){if(!v)throw new AssertionError(message);}\n public static void main(String[] args){\n  NaviHelper.reset(); List<String> statuses=new ArrayList<>(); NavigationAdapter a=new NavigationAdapter(new Context(),statuses::add);\n  a.requestSampleRoute();check(NaviHelper.routeCalls==0,\"Disconnected adapter must not request route\");\n  a.connect();a.connect();check(NaviHelper.initCalls==1,\"Concurrent manual presses must not duplicate initialization\");\n  NaviHelper failed=NaviHelper.instances.get(0);failed.failure.apply(new IllegalStateException(\"controlled exhausted initialization failure\"));\n  check(!a.isConnected(),\"Failed callback must leave disconnected\");\n  a.connect();check(NaviHelper.initCalls==2,\"Retry after terminal failure must initialize again; actual=\"+NaviHelper.initCalls);\n  NaviHelper retry=NaviHelper.instances.get(1);check(retry!=failed&&failed.released==1,\"Retry must use fresh SDK object after disposing failed one\");\n  failed.success.get();check(!a.isConnected(),\"Stale successful callback from failed attempt must be ignored\");\n  retry.success.get();check(a.isConnected()&&retry.added==1,\"New attempt may connect and register one listener\");\n  a.connect();check(NaviHelper.initCalls==2,\"Connected manual press must not reconnect\");\n  a.requestSampleRoute();check(NaviHelper.routeCalls==1,\"Only connected route request forwarded to controlled double\");\n  a.close();check(!a.isConnected()&&retry.released==1&&retry.removed==1,\"Close must detach listener and release\");\n  retry.success.get();check(!a.isConnected(),\"Late callback after close must not revive connection\");\n  NaviHelper.reset();NavigationAdapter b=new NavigationAdapter(new Context(),s->{});NaviHelper.throwNext=true;\n  try{b.connect();throw new AssertionError(\"Controlled initialize exception must propagate\");}catch(IllegalStateException expected){}\n  b.connect();check(NaviHelper.initCalls==2,\"Synchronous initialize exception must permit retry\");\n  check(NaviHelper.instances.get(0).released==1,\"Throwing attempt must be released\");\n  b.close();\n  System.out.println(\"OK NavigationAdapter retry contract: controlled JVM SDK double only; vehicle/network requests=0\");\n }\n}"}''')

def main():
    root = Path(__file__).resolve().parents[1]
    adapter = root / "android/app/src/main/java/kr/co/ansimdonghaeng/NavigationAdapter.java"
    with tempfile.TemporaryDirectory(prefix="ansim-navigation-retry-") as temp:
        work = Path(temp)
        sources = dict(SOURCES)
        sources["kr/co/ansimdonghaeng/NavigationAdapter.java"] = adapter.read_text(encoding="utf-8")
        paths = []
        for name, content in sources.items():
            path = work / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")
            paths.append(str(path))
        classes = work / "classes"
        subprocess.run(["javac", "-encoding", "UTF-8", "-d", str(classes), *paths], check=True)
        subprocess.run(["java", "-ea", "-cp", str(classes),
                        "kr.co.ansimdonghaeng.NavigationAdapterRetryTest"], check=True)

if __name__ == "__main__":
    main()
