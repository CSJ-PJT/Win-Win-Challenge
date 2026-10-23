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
import org.junit.Test;
import org.junit.runner.RunWith;
import java.io.File;
import java.util.List;
import static org.junit.Assert.*;

/** Uses the real provider and Android accessibility, not a JS test hook. */
@RunWith(AndroidJUnit4.class)
public final class LiveAddressTest {
    private UiDevice device;
    private File output;
    private UiObject2 find(String text, boolean contains) {
        long end=SystemClock.uptimeMillis()+22000;
        while(SystemClock.uptimeMillis()<end){
            UiObject2 el=device.findObject(contains?By.textContains(text):By.text(text));
            if(el==null)el=device.findObject(contains?By.descContains(text):By.desc(text));
            if(el!=null && !el.getVisibleBounds().isEmpty())return el;
            SystemClock.sleep(350);
        }
        device.takeScreenshot(new File(output,"failure.png"));
        throw new AssertionError("Missing visible control: "+text);
    }
    private void tap(String text){find(text,false).click();SystemClock.sleep(700);}
    private void shot(String name){device.takeScreenshot(new File(output,name+".png"));}
    @Test public void officialAddressReturnsToTheVisit() throws Exception {
        Context context=InstrumentationRegistry.getInstrumentation().getTargetContext();
        device=UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
        output=context.getExternalFilesDir("address-qa");assertNotNull(output);output.mkdirs();
        device.wakeUp();device.pressHome();
        Intent launch=context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        assertNotNull(launch);launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TASK);context.startActivity(launch);
        try {
            find("도착지 입력하기",false);tap("도착지 입력하기");find("도착지 저장",false);
            UiObject2 address=device.findObject(By.res("field-address"));
            if(address==null){
                List<UiObject2> inputs=device.findObjects(By.clazz("android.widget.EditText"));
                for(UiObject2 el:inputs){if(!el.getVisibleBounds().isEmpty()&&(el.getText()==null||el.getText().isEmpty())){address=el;break;}}
            }
            assertNotNull("Address input not found",address);
            address.setText("세종대로 110");SystemClock.sleep(500);
            tap("주소 검색");
            UiObject2 selected=find("서울 중구 세종대로 110",true);
            shot("01-official-results");selected.click();
            find("도착지 저장",false);
            UiObject2 returned=device.findObject(By.res("field-address"));
            String value=returned==null?"":returned.getText();
            if(value==null||!value.contains("세종대로 110")){
                value="";for(UiObject2 el:device.findObjects(By.clazz("android.widget.EditText")))value+=String.valueOf(el.getText());
            }
            assertTrue("Selected address not returned: "+value,value.contains("세종대로 110"));
            find("04524",true);shot("02-returned-address");
            tap("도착지 저장");find("방문 시작하기",false);find("세종대로 110",true);
            shot("03-saved-address");Log.i("HandoffAddress","LIVE_POSTCODE_ROUNDTRIP_OK");
        } finally {shot("last-screen");device.dumpWindowHierarchy(new File(output,"window.xml"));}
    }
}
