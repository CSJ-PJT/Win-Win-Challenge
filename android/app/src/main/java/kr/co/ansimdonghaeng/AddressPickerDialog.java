package kr.co.ansimdonghaeng;

import android.app.Activity;
import android.app.Dialog;
import android.graphics.Color;
import android.net.Uri;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.ConsoleMessage;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import org.json.JSONObject;
import java.io.ByteArrayInputStream;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/** Isolated address webview: third-party frames never get the application's native bridge. */
final class AddressPickerDialog extends Dialog {
    interface Result { void receive(JSONObject result, String error); }
    private static final String HOST="appassets.androidplatform.net";
    private static final Set<String> REMOTE=new HashSet<>(Arrays.asList(
        "t1.kakaocdn.net","postcode.map.kakao.com","postcode.map.daum.net",
        "t1.daumcdn.net","ssl.daumcdn.net"));
    private final WebView browser;
    private final String requestId;
    private final Result callback;
    private boolean finished=false;
    private static boolean remoteAllowed(Uri uri){
        return "https".equals(uri.getScheme()) && uri.getUserInfo()==null && uri.getPort()==-1 && REMOTE.contains(uri.getHost());
    }
    AddressPickerDialog(Activity activity,String query,String id,Result onResult){
        super(activity, android.R.style.Theme_Material_Light_NoActionBar);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        requestId=id;callback=onResult;
        LinearLayout root=new LinearLayout(activity);root.setOrientation(LinearLayout.VERTICAL);root.setBackgroundColor(Color.WHITE);
        LinearLayout bar=new LinearLayout(activity);bar.setPadding(16,8,16,8);
        TextView title=new TextView(activity);title.setText("주소 검색");title.setTextColor(Color.rgb(24,46,42));title.setTextSize(22);
        bar.addView(title,new LinearLayout.LayoutParams(0,ViewGroup.LayoutParams.WRAP_CONTENT,1));
        Button close=new Button(activity);close.setText("닫기");close.setOnClickListener(v->dismiss());bar.addView(close);
        root.addView(bar);
        browser=new WebView(activity);
        browser.getSettings().setJavaScriptEnabled(true);
        browser.getSettings().setDomStorageEnabled(true);
        browser.getSettings().setAllowFileAccess(false);
        browser.getSettings().setAllowContentAccess(false);
        browser.getSettings().setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        browser.getSettings().setJavaScriptCanOpenWindowsAutomatically(false);
        // No addJavascriptInterface here. A verified main-frame navigation returns only the selected address.
        browser.setWebChromeClient(new WebChromeClient(){
            @Override public boolean onConsoleMessage(ConsoleMessage m){
                if("ADDRESS_PICKER_READY".equals(m.message()))android.util.Log.i("HandoffAddress","ADDRESS_PICKER_READY");
                if(m.messageLevel()==ConsoleMessage.MessageLevel.ERROR)android.util.Log.e("HandoffAddress",m.message());
                return true;
            }
        });
        browser.setWebViewClient(new WebViewClient(){
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){
                Uri uri=request.getUrl();
                if(request.isForMainFrame()&&"https".equals(uri.getScheme())&&HOST.equals(uri.getHost())&&"/postcode-result".equals(uri.getPath())){
                    accept(uri);return true;
                }
                if(request.isForMainFrame())return !("https".equals(uri.getScheme())&&HOST.equals(uri.getHost())&&"/postcode.html".equals(uri.getPath()));
                return !remoteAllowed(uri);
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
                Uri uri=request.getUrl();String file=uri.getLastPathSegment();
                if("https".equals(uri.getScheme())&&HOST.equals(uri.getHost())&&("postcode.html".equals(file)||"address.js".equals(file))){
                    try{return new WebResourceResponse(file.endsWith(".js")?"text/javascript":"text/html","UTF-8",activity.getAssets().open(file));}catch(Exception ignored){}
                }
                if(remoteAllowed(uri))return null;
                return new WebResourceResponse("text/plain","UTF-8",403,"Blocked",java.util.Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));
            }
        });
        root.addView(browser,new LinearLayout.LayoutParams(-1,0,1));setContentView(root);
        root.setOnApplyWindowInsetsListener((v,insets)->{v.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());return insets;});
        setOnDismissListener(d->{if(!finished){finished=true;callback.receive(null,"");}browser.stopLoading();browser.destroy();});
        try{
            JSONObject opts=new JSONObject();opts.put("query",query);opts.put("requestId",id);
            browser.loadUrl("https://"+HOST+"/postcode.html#"+Uri.encode(opts.toString()));
        }catch(Exception e){finished=true;callback.receive(null,"주소 검색을 열지 못했어요.");}
    }
    private void accept(Uri uri){
        if(finished)return;
        try{
            JSONObject payload=new JSONObject(uri.getFragment());
            if(!requestId.equals(payload.optString("requestId")))return;
            JSONObject data=payload.getJSONObject("result");String address=data.optString("address","").trim();
            if(address.isEmpty()||address.length()>180||address.matches(".*[\\x00-\\x1F\\x7F].*"))throw new IllegalArgumentException();
            JSONObject result=new JSONObject();result.put("address",address);
            String zip=data.optString("postcode","");result.put("postcode",zip.matches("[0-9]{5}")?zip:"");
            String building=data.optString("buildingName","");result.put("buildingName",building.substring(0,Math.min(80,building.length())));
            result.put("latitude",JSONObject.NULL);result.put("longitude",JSONObject.NULL);
            finished=true;callback.receive(result,"");android.util.Log.i("HandoffAddress","ADDRESS_SELECTED");dismiss();
        }catch(Exception e){finished=true;callback.receive(null,"선택한 주소를 다시 확인해 주세요.");dismiss();}
    }
}
