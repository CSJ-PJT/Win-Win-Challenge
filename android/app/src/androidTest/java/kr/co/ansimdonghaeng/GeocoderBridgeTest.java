package kr.co.ansimdonghaeng;

import android.app.Activity;
import android.content.Intent;
import android.location.Geocoder;
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

/** One public-place real Geocoder bridge request; no saved visit writes or fake responses.
 * Callback capture is instrumentation observation, not a primary-button usability test. */
@RunWith(AndroidJUnit4.class)
public final class GeocoderBridgeTest {
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
        fail("Real Geocoder callback/bridge readiness timed out");
    }
    @Test public void publicPlaceThroughActualBridge() throws Exception {
        android.app.Instrumentation ins=InstrumentationRegistry.getInstrumentation();
        Intent launch=ins.getTargetContext().getPackageManager().getLaunchIntentForPackage(ins.getTargetContext().getPackageName());
        assertNotNull(launch);launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Activity a=ins.startActivitySync(launch);
        ins.runOnMainSync(()->browser=web(a.getWindow().getDecorView()));
        assertNotNull(browser);
        until("document.readyState==='complete' && typeof window.onAddressResults==='function' && typeof VehicleBridge.searchAddress==='function'",15000);
        String before=js("JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))");
        boolean present=Geocoder.isPresent();Log.i("HandoffGeocoder","GEOCODER_PRESENT="+present);
        assertTrue("No Geocoder provider on this device",present);
        long start=SystemClock.uptimeMillis();
        try {
            js("(()=>{window.__qaGeoOriginal=window.onAddressResults;window.__qaGeoResult=null;window.onAddressResults=function(id,places,message){if(id==='geo-qa-public'){window.__qaGeoResult={id:id,count:places.length,valid:places.every(p=>Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)),message:message||''};}return window.__qaGeoOriginal.apply(this,arguments);};VehicleBridge.searchAddress('서울시청','geo-qa-public');return true;})()");
            until("window.__qaGeoResult!==null",30000);
            String raw=js("JSON.stringify(window.__qaGeoResult)");
            JSONObject r=new JSONObject(new JSONArray("["+raw+"]").getString(0));
            int count=r.getInt("count");
            Log.i("HandoffGeocoder","GEOCODER_REAL_CALLBACK count="+count+" valid="+r.getBoolean("valid")+" elapsedMs="+(SystemClock.uptimeMillis()-start)+" error="+(!r.getString("message").isEmpty()));
            assertTrue("Real Geocoder returned no places: "+r.getString("message"),count>0&&count<=5);
            assertTrue("Invalid coordinates in actual bridge results",r.getBoolean("valid"));
            assertTrue("Real lookup returned an error",r.getString("message").isEmpty());
            String after=js("JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))");
            assertTrue("Saved localStorage changed during lookup",before.equals(after));
            Log.i("HandoffGeocoder","GEOCODER_BRIDGE_OK SAVED_STATE_UNCHANGED");
        } finally {
            js("(()=>{if(window.__qaGeoOriginal)window.onAddressResults=window.__qaGeoOriginal;delete window.__qaGeoOriginal;delete window.__qaGeoResult;return true;})()");
        }
    }
}
