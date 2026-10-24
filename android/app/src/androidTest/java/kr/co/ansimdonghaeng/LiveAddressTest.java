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
    private void hideKeyboard() throws Exception {
        if(device.executeShellCommand("dumpsys input_method").contains("mInputShown=true")){
            device.pressBack();SystemClock.sleep(500);
        }
    }
    @Test public void officialAddressReturnsToTheVisit() throws Exception {
        Context context=InstrumentationRegistry.getInstrumentation().getTargetContext();
        device=UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
        output=context.getExternalFilesDir("address-qa");assertNotNull(output);output.mkdirs();
        device.wakeUp();device.pressHome();
        Intent launch=context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        assertNotNull(launch);launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TASK);context.startActivity(launch);
        try {
            tap("도착지 입력하기");find("도착지 저장",false);
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
            device.pressHome();context.startActivity(launch);SystemClock.sleep(1200);
            scrollFind("세종대로 110");scrollFind("04524");shot("04-restored-address");
            Log.i("HandoffAddress","LIVE_POSTCODE_ROUNDTRIP_OK");
        } finally {shot("last-screen");device.dumpWindowHierarchy(new File(output,"window.xml"));}
    }
}

