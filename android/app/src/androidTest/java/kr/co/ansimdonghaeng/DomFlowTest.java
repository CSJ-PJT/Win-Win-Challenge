package kr.co.ansimdonghaeng;

import android.app.Activity;
import android.content.Intent;
import android.os.SystemClock;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.util.Log;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.json.JSONObject;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

/** DOM interaction through Android instrumentation, without remote debugging or state hooks.
 * Uses a synthetic visit. Run only on an exclusively reserved QA device. */
@RunWith(AndroidJUnit4.class)
public final class DomFlowTest {
    private WebView browser;
    private WebView web(View v) {
        if(v instanceof WebView)return (WebView)v;
        if(v instanceof ViewGroup)for(int i=0;i<((ViewGroup)v).getChildCount();i++){
            WebView found=web(((ViewGroup)v).getChildAt(i));if(found!=null)return found;
        }
        return null;
    }
    private String js(String expression) throws Exception {
        CountDownLatch done=new CountDownLatch(1);AtomicReference<String> value=new AtomicReference<>();
        InstrumentationRegistry.getInstrumentation().runOnMainSync(()->
            browser.evaluateJavascript("(function(){return ("+expression+");})()",r->{value.set(r);done.countDown();}));
        assertTrue("WebView callback timed out",done.await(8,TimeUnit.SECONDS));
        return value.get();
    }
    private void until(String expression) throws Exception {
        long end=SystemClock.uptimeMillis()+15000;
        while(SystemClock.uptimeMillis()<end){if("true".equals(js(expression)))return;SystemClock.sleep(200);}
        fail("DOM condition timed out: "+expression);
    }
    private void click(String selector) throws Exception {
        String q=JSONObject.quote(selector);
        until("!!document.querySelector("+q+") && !document.querySelector("+q+").disabled");
        assertEquals("true",js("(()=>{const e=document.querySelector("+q+");if(!e||e.disabled)return false;e.scrollIntoView({block:'center'});e.click();return true;})()"));
        SystemClock.sleep(400);
    }
    private void action(String name) throws Exception {click("[data-action='"+name+"']");}
    private void role(String name) throws Exception {click(".demo-role-tab[data-role='"+name+"']");}
    private void text(String text) throws Exception {until("document.body.innerText.includes("+JSONObject.quote(text)+")");}
    private void input(String selector,String value) throws Exception {
        assertEquals("true",js("(()=>{const e=document.querySelector("+JSONObject.quote(selector)+");if(!e)return false;e.value="+JSONObject.quote(value)+";e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));return true;})()"));
    }
    @Test public void primaryButtonsCompleteBothRolesAndEasyArrival() throws Exception {
        android.app.Instrumentation ins=InstrumentationRegistry.getInstrumentation();
        Intent intent=ins.getTargetContext().getPackageManager().getLaunchIntentForPackage(ins.getTargetContext().getPackageName());
        assertNotNull(intent);intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Activity activity=ins.startActivitySync(intent);
        ins.runOnMainSync(()->browser=web(activity.getWindow().getDecorView()));
        assertNotNull("Main WebView missing",browser);
        text("안심동행");role("vehicle");action("open-visits");
        click("[data-action='choose-visit'][data-scenario='kindergarten']");
        action("edit-destination");input("#field-address","서울 중구 세종대로 110");
        click("#visitForm button[type='submit']");action("depart");action("arrive");
        role("facility");
        if("true".equals(js("!!document.querySelector('[data-action=ready]')")))action("ready");
        role("vehicle");action("issue");
        String raw=js("document.querySelector('.pin-code strong').textContent");
        String pin=new org.json.JSONArray("["+raw+"]").getString(0);
        assertTrue("Displayed connection number invalid",pin.matches("[0-9]{6}"));
        action("sender");text("인계자가 확인했어요");role("facility");input("#codeInput",pin);
        action("receiver");text("인수를 완료했어요");role("guardian");text("인계를 마쳤어요");
        Log.i("HandoffDom","PRIMARY_HANDOFF_OK");
        role("visitor");action("easy-senior");action("consent");action("notify");text("도착 소식을");
        role("facility");action("ack");role("visitor");text("담당자가 확인했어요");
        Log.i("HandoffDom","EASY_ARRIVAL_ACK_OK");
    }
}
