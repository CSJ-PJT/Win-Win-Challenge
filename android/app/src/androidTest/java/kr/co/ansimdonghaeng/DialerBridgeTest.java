package kr.co.ansimdonghaeng;
import android.app.Activity;
import android.app.Instrumentation;
import android.content.Intent;
import android.os.SystemClock;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.util.Log;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.Until;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import static org.junit.Assert.*;

/** Opens ACTION_DIAL only with a synthetic number. Never presses a dialer control,
 * reads contacts/call history, takes a dialer screenshot, or sends ACTION_CALL. */
@RunWith(AndroidJUnit4.class)
public final class DialerBridgeTest {
    private WebView browser;
    private WebView web(View v){
        if(v instanceof WebView)return (WebView)v;
        if(v instanceof ViewGroup)for(int i=0;i<((ViewGroup)v).getChildCount();i++){WebView w=web(((ViewGroup)v).getChildAt(i));if(w!=null)return w;}
        return null;
    }
    private String js(String expr)throws Exception{
        CountDownLatch done=new CountDownLatch(1);final String[] out={null};
        InstrumentationRegistry.getInstrumentation().runOnMainSync(()->browser.evaluateJavascript("(function(){return ("+expr+");})()",r->{out[0]=r;done.countDown();}));
        assertTrue("WebView callback timeout",done.await(8,TimeUnit.SECONDS));return out[0];
    }
    private void ready()throws Exception{
        long end=SystemClock.uptimeMillis()+15000;
        while(SystemClock.uptimeMillis()<end){if("true".equals(js("document.readyState==='complete' && typeof VehicleBridge.openDialer==='function'")))return;SystemClock.sleep(200);}
        fail("Bridge not ready");
    }
    private Activity launch(Instrumentation ins,Intent launch){
        Activity a=ins.startActivitySync(launch);
        ins.runOnMainSync(()->browser=web(a.getWindow().getDecorView()));
        assertNotNull(browser);return a;
    }
    @Test public void opensDialScreenWithoutPlacingCall()throws Exception{
        Instrumentation ins=InstrumentationRegistry.getInstrumentation();
        Intent launch=ins.getTargetContext().getPackageManager().getLaunchIntentForPackage(ins.getTargetContext().getPackageName());
        assertNotNull(launch);launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        launch(ins,launch);ready();
        String before=js("JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))");
        String pkg=ins.getTargetContext().getPackageManager().resolveActivity(new Intent(Intent.ACTION_DIAL,android.net.Uri.parse("tel:5550100")),0).activityInfo.packageName;
        AtomicBoolean safeIntent=new AtomicBoolean(false);
        Instrumentation.ActivityMonitor monitor=new Instrumentation.ActivityMonitor(){
            @Override public Instrumentation.ActivityResult onStartActivity(Intent intent){
                if(Intent.ACTION_CALL.equals(intent.getAction()))throw new AssertionError("ACTION_CALL forbidden");
                if(Intent.ACTION_DIAL.equals(intent.getAction())){
                    assertEquals("tel:5550100",String.valueOf(intent.getData()));
                    safeIntent.set(true);
                }
                return null; // Observe actual dispatch; do not fake the external Activity.
            }
        };
        ins.addMonitor(monitor);
        try{
            js("(()=>{VehicleBridge.openDialer('5550100');return true;})()");
            long end=SystemClock.uptimeMillis()+10000;
            while(!safeIntent.get()&&SystemClock.uptimeMillis()<end)SystemClock.sleep(100);
            assertTrue("Actual ACTION_DIAL dispatch not observed",safeIntent.get());
            UiDevice device=UiDevice.getInstance(ins);
            assertTrue("Resolved dialer package not on screen",device.wait(Until.hasObject(By.pkg(pkg)),10000));
            Log.i("HandoffDialer","ACTION_DIAL_OBSERVED DIALER_PACKAGE_VISIBLE NO_CALL_ACTION");
        }finally{
            ins.removeMonitor(monitor);
            launch(ins,launch);ready();
        }
        String after=js("JSON.stringify(Object.keys(localStorage).sort().map(k=>[k,localStorage.getItem(k)]))");
        assertTrue("Saved visit changed",before.equals(after));
        Log.i("HandoffDialer","DIALER_BRIDGE_OK RETURNED_TO_QA SAVED_STATE_UNCHANGED");
    }
}
