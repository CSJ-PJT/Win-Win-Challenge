package kr.co.ansimdonghaeng;
import android.content.Context;
import android.content.Intent;
import android.os.SystemClock;
import android.util.Log;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.StaleObjectException;
import androidx.test.uiautomator.Until;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.io.File;
import java.util.List;
import java.util.ArrayList;
import static org.junit.Assert.*;

/** Real network and Android accessibility; no Javascript test hooks. */
@RunWith(AndroidJUnit4.class)
public final class LiveAddressTest {
    private UiDevice device;
    private File output;
    private UiObject2 visible(String text,boolean contains){
        // WebView can replace accessibility nodes between lookup and bounds access.
        // Retry the query, never reuse the stale node or treat it as a missing control.
        for(int attempt=0;attempt<3;attempt++){
            try {
                List<UiObject2> all=new ArrayList<>(device.findObjects(contains?By.textContains(text):By.text(text)));
                all.addAll(device.findObjects(contains?By.descContains(text):By.desc(text)));
                for(UiObject2 el:all)if(!el.getVisibleBounds().isEmpty())return el;
                return null;
            } catch(StaleObjectException e){
                if(attempt==2)throw e;
                SystemClock.sleep(150);
            }
        }
        return null;
    }
    private UiObject2 find(String text, boolean contains) {
        long end=SystemClock.uptimeMillis()+22000;
        while(SystemClock.uptimeMillis()<end){
            UiObject2 el=visible(text,contains);if(el!=null)return el;
            SystemClock.sleep(350);
        }
        device.takeScreenshot(new File(output,"failure.png"));
        throw new AssertionError("Missing visible control: "+text);
    }
    private UiObject2 scrollFind(String text){
        for(int i=0;i<8;i++){
            UiObject2 el=visible(text,true);if(el!=null)return el;
            device.swipe(device.getDisplayWidth()/2,device.getDisplayHeight()*7/10,device.getDisplayWidth()/2,device.getDisplayHeight()*3/10,20);
            SystemClock.sleep(400);
        }
        return find(text,true);
    }
    private void tap(String text){tap(text,false);}
    private void tap(String text,boolean contains){
        for(int attempt=0;attempt<3;attempt++){
            try {find(text,contains).click();SystemClock.sleep(700);return;}
            catch(StaleObjectException e){if(attempt==2)throw e;SystemClock.sleep(150);}
        }
    }
    private void shot(String name){device.takeScreenshot(new File(output,name+".png"));}
    private void launchApp(Context context,Intent launch) throws Exception {
        // Wait for Home before starting the Activity; otherwise a delayed Home
        // transition can cover the app. Shell start also avoids background-start rules.
        device.pressHome();device.waitForIdle();
        String component=launch.getComponent().flattenToShortString();
        String result=device.executeShellCommand("am start -W -n "+component);
        assertTrue("App not in foreground after launch: "+result,
            device.wait(Until.hasObject(By.pkg(context.getPackageName())),10000));
    }
    private void hideKeyboard() throws Exception {
        if(device.executeShellCommand("dumpsys input_method").contains("mInputShown=true")){
            device.pressBack();SystemClock.sleep(500);
        }
    }
    private void openOfficialDestinationEditor() throws Exception {
        // Start a synthetic visit through product controls even when a previous
        // saved visit, role or completion screen was restored. Never clear data.
        // The restored role can be facility, which intentionally has no visit picker.
        tap("인계자");
        tap("방문 변경");
        tap("유치원 등원",true);
        tap("인계자");
        // Move the destination action away from the bottom transient toast.
        device.swipe(device.getDisplayWidth()/2,device.getDisplayHeight()*7/10,
            device.getDisplayWidth()/2,device.getDisplayHeight()*4/10,20);
        SystemClock.sleep(500);
        if(visible("도착지 입력하기",false)!=null)tap("도착지 입력하기");
        else {scrollFind("도착지 변경");tap("도착지 변경");}
        find("도착지 저장",false);
        Log.i("HandoffAddress","OFFICIAL_TEST_VISIT_READY");
    }
    @Test public void officialAddressReturnsToTheVisit() throws Exception {
        Context context=InstrumentationRegistry.getInstrumentation().getTargetContext();
        device=UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
        output=context.getExternalFilesDir("address-qa");assertNotNull(output);output.mkdirs();
        device.wakeUp();
        Intent launch=context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        assertNotNull(launch);assertNotNull(launch.getComponent());
        try {
            launchApp(context,launch);
            openOfficialDestinationEditor();
            UiObject2 address=device.findObject(By.res("field-address"));
            if(address==null){
                for(UiObject2 el:device.findObjects(By.clazz("android.widget.EditText"))){
                    if(!el.getVisibleBounds().isEmpty()&&(el.getText()==null||el.getText().isEmpty())){address=el;break;}
                }
            }
            assertNotNull("Address input not found",address);
            address.setText("세종대로 110");SystemClock.sleep(500);
            shot("00-keyboard-search");tap("주소 검색");
            UiObject2 selected=find("서울 중구 세종대로 110",true);
            shot("01-official-results");tap("서울 중구 세종대로 110",true);
            find("도착지 저장",false);hideKeyboard();
            UiObject2 returned=device.findObject(By.res("field-address"));
            String value=returned==null?"":returned.getText();
            if(value==null||!value.contains("세종대로 110")){
                value="";for(UiObject2 el:device.findObjects(By.clazz("android.widget.EditText")))value+=String.valueOf(el.getText());
            }
            assertTrue("Selected address not returned: "+value,value.contains("세종대로 110"));
            scrollFind("04524");shot("02-returned-address");
            tap("도착지 저장");scrollFind("세종대로 110");scrollFind("방문 시작하기");
            shot("03-saved-address");
            launchApp(context,launch);SystemClock.sleep(1200);
            scrollFind("세종대로 110");scrollFind("04524");shot("04-restored-address");
            Log.i("HandoffAddress","LIVE_POSTCODE_ROUNDTRIP_OK");
        } finally {shot("last-screen");device.dumpWindowHierarchy(new File(output,"window.xml"));}
    }
}

