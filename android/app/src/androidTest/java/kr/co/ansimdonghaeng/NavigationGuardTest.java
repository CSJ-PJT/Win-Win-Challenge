package kr.co.ansimdonghaeng;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

/** Observes actual non-automotive bridge refusals without altering native UX flags.
 * No NaviHelper initialization, service binding, routes, state writes or fake responses. */
@RunWith(AndroidJUnit4.class)
public final class NavigationGuardTest {
    private WebView browser;
    private WebView web(View v) {
        if(v instanceof WebView)return (WebView)v;
        if(v instanceof ViewGroup)for(int i=0;i<((ViewGroup)v).getChildCount();i++){
            WebView w=web(((ViewGroup)v).getChildAt(i));if(w!=null)return w;
        }
        return null;
    }
    private String js(String expr) throws Exception {
        CountDownLatch done=new CountDownLatch(1);AtomicReference<String> value=new AtomicReference<>();
        InstrumentationRegistry.getInstrumentation().runOnMainSync(()->
            browser.evaluateJavascript("(function(){return ("+expr+");})()",r->{value.set(r);done.countDown();}));
        assertTrue("WebView callback timed out",done.await(8,TimeUnit.SECONDS));return value.get();
    }
    private void until(String expr,long timeout) throws Exception {
        long end=SystemClock.uptimeMillis()+timeout;
        while(SystemClock.uptimeMillis()<end){if("true".equals(js(expr)))return;SystemClock.sleep(200);}
        fail("Native guard callback/bridge readiness timed out");
    }
    @Test public void nonAutomotiveBridgeRefusalsPreserveState() throws Exception {
        android.app.Instrumentation ins=InstrumentationRegistry.getInstrumentation();
        assertFalse("This test requires the actual non-automotive phone",
            ins.getTargetContext().getPackageManager().hasSystemFeature(PackageManager.FEATURE_AUTOMOTIVE));
        Intent launch=ins.getTargetContext().getPackageManager().getLaunchIntentForPackage(ins.getTargetContext().getPackageName());
        assertNotNull(launch);launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Activity a=ins.startActivitySync(launch);
        ins.runOnMainSync(()->browser=web(a.getWindow().getDecorView()));
        assertNotNull(browser);
        until("document.readyState==='complete' && typeof window.onNativeNavigationStatus==='function' && typeof VehicleBridge.checkNavigation==='function' && typeof VehicleBridge.requestSampleRoute==='function'",15000);
        java.lang.reflect.Field adapter=a.getClass().getDeclaredField("navigation");
        adapter.setAccessible(true);
        assertNull("Navigation adapter must not already be initialized",adapter.get(a));
        String before=js("JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))");
        try {
            js("(()=>{window.__qaNavOriginal=window.onNativeNavigationStatus;window.__qaNavStatuses=[];window.onNativeNavigationStatus=function(msg){window.__qaNavStatuses.push(String(msg));return window.__qaNavOriginal.apply(this,arguments);};VehicleBridge.checkNavigation();return true;})()");
            until("window.__qaNavStatuses.length===1",8000);
            assertEquals("true",js("window.__qaNavStatuses[0]==='NaviHelper 시험은 UX 제한이 해제된 AAOS/Pleos 환경에서만 가능합니다.'"));
            assertEquals("true",js("document.body.innerText.includes(window.__qaNavStatuses[0])"));
            assertNull("checkNavigation initialized an adapter on non-automotive device",adapter.get(a));
            Log.i("HandoffNavigationGuard","CHECK_NAVIGATION_DENIED CALLBACK_AND_TOAST_OK ADAPTER_NULL");
            js("(()=>{VehicleBridge.requestSampleRoute();return true;})()");
            until("window.__qaNavStatuses.length===2",8000);
            assertEquals("true",js("window.__qaNavStatuses[1]==='차량 UX 상태를 확인할 수 없거나 제한 중입니다.'"));
            assertEquals("true",js("document.body.innerText.includes(window.__qaNavStatuses[1])"));
            assertNull("requestSampleRoute initialized an adapter on non-automotive device",adapter.get(a));
            String after=js("JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))");
            assertTrue("Saved localStorage changed during guard checks",before.equals(after));
            Log.i("HandoffNavigationGuard","SAMPLE_ROUTE_DENIED CALLBACK_AND_TOAST_OK ADAPTER_NULL");
            Log.i("HandoffNavigationGuard","NAVIGATION_GUARD_OK NON_AUTOMOTIVE_ACTUAL SAVED_STATE_UNCHANGED");
        } finally {
            js("(()=>{if(window.__qaNavOriginal)window.onNativeNavigationStatus=window.__qaNavOriginal;delete window.__qaNavOriginal;delete window.__qaNavStatuses;return true;})()");
        }
    }
}
