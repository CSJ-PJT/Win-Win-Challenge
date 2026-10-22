package kr.co.ansimdonghaeng;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.view.Gravity;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.TextView;
import org.json.JSONObject;
import java.io.ByteArrayInputStream;
import java.util.Set;

/** Native container for the bundled, synthetic-data presentation. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final Set<String> ASSETS = new java.util.HashSet<>(java.util.Arrays.asList("index.html", "core.js", "app.js", "style.css"));
    private WebView web;
    private TextView blocker;
    private CarRestrictionMonitor carMonitor;
    private NavigationAdapter navigation;
    private boolean automotive;
    private boolean uxKnown = false;
    private boolean uxRestricted = true;
    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        automotive = getPackageManager().hasSystemFeature(PackageManager.FEATURE_AUTOMOTIVE);
        FrameLayout frame = new FrameLayout(this);
        web = new WebView(this);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        web.setBackgroundColor(Color.rgb(16,27,43));
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(false);
        web.getSettings().setJavaScriptCanOpenWindowsAutomatically(false);
        web.getSettings().setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        web.addJavascriptInterface(new Bridge(), "VehicleBridge");
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return !"https".equals(request.getUrl().getScheme()) || !HOST.equals(request.getUrl().getHost());
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String name = request.getUrl().getPath();
                if (name != null && name.startsWith("/")) name = name.substring(1);
                if ("https".equals(request.getUrl().getScheme()) && HOST.equals(request.getUrl().getHost()) && ASSETS.contains(name)) {
                    try {
                        String mime = name.endsWith(".js") ? "text/javascript" : name.endsWith(".css") ? "text/css" : "text/html";
                        return new WebResourceResponse(mime, "UTF-8", getAssets().open(name));
                    } catch (Exception ignored) { }
                }
                return new WebResourceResponse("text/plain", "UTF-8", 403, "Blocked", java.util.Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
            }
            @Override public void onPageFinished(WebView view, String url) {
                report(automotive ? "AAOS 환경: CarUxRestrictions 확인 중. 경로·위치·인계는 별도 검증이 필요합니다." : "일반 Android 로컬 시연. 실제 차량 신호·Pleos 내비게이션은 연결되지 않았습니다.");
            }
        });
        frame.addView(web, new FrameLayout.LayoutParams(-1,-1));
        blocker = new TextView(this);
        blocker.setBackgroundColor(Color.rgb(16,27,43));
        blocker.setTextColor(Color.WHITE);
        blocker.setTextSize(22);
        blocker.setGravity(Gravity.CENTER);
        blocker.setPadding(48,48,48,48);
        blocker.setText("차량 상태를 확인하고 있습니다.\n\n주행 중이거나 상태가 불명확하면\n인계 확인 화면을 조작할 수 없습니다.\n\n안전하게 주차한 후 이용해 주세요.");
        blocker.setClickable(true);
        blocker.setFocusable(true);
        blocker.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_YES);
        frame.addView(blocker,new FrameLayout.LayoutParams(-1,-1));
        setContentView(frame);
        frame.setOnApplyWindowInsetsListener((v,insets)-> {
            v.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());
            return insets;
        });
        blocker.setVisibility(automotive ? View.VISIBLE : View.GONE);
        if (automotive) {
            try {
                carMonitor = new CarRestrictionMonitor(this, (known,restricted) -> runOnUiThread(() -> {
                    uxKnown=known; uxRestricted=restricted;
                    blocker.setVisibility(!known || restricted ? View.VISIBLE : View.GONE);
                    web.setImportantForAccessibility(!known || restricted ? View.IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS : View.IMPORTANT_FOR_ACCESSIBILITY_AUTO);
                }));
                carMonitor.start();
            } catch (Throwable e) { uxKnown=false; blocker.setVisibility(View.VISIBLE); }
        }
        web.loadUrl("https://" + HOST + "/index.html");
    }
    private boolean mayUseNativeNavigation() { return automotive && uxKnown && !uxRestricted; }
    private void report(String status) {
        if(web!=null) runOnUiThread(() -> web.evaluateJavascript("window.onNativeNavigationStatus && window.onNativeNavigationStatus("+JSONObject.quote(status)+");",null));
    }
    private void initializeNavigation() {
        if (!mayUseNativeNavigation()) { report("NaviHelper 시험은 UX 제한이 해제된 AAOS/Pleos 환경에서만 가능합니다."); return; }
        try {
            if(navigation==null) navigation=new NavigationAdapter(this,this::report);
            navigation.connect();
        } catch(Throwable e) { report("NaviHelper 연결 실패: " + e.getClass().getSimpleName()); }
    }
    public final class Bridge {
        @JavascriptInterface public void checkNavigation() { runOnUiThread(() -> initializeNavigation()); }
        @JavascriptInterface public void requestSampleRoute() {
            runOnUiThread(() -> {
                if(!mayUseNativeNavigation()){ report("차량 UX 상태를 확인할 수 없거나 제한 중입니다."); return; }
                if(navigation==null || !navigation.isConnected()){ initializeNavigation(); report("SDK 연결을 확인한 뒤 예제 경로 시험을 다시 선택하세요."); return; }
                new AlertDialog.Builder(MainActivity.this).setTitle("SDK 공식 예제 목적지로 경로 요청")
                    .setMessage("가상 유치원의 위치가 아닙니다. Pleos 문서의 42dot 예제 좌표로 내비게이션 경로를 요청합니다. 정차된 시험용 에뮬레이터에서만 확인하세요. 인계 상태는 변경하지 않습니다.")
                    .setNegativeButton("취소",null).setPositiveButton("예제 경로 요청",(d,w)-> {
                        if(mayUseNativeNavigation()) navigation.requestSampleRoute(); else report("차량 조건이 바뀌어 요청을 중단했습니다.");
                    }).show();
            });
        }
    }
    @Override protected void onResume(){super.onResume();if(carMonitor!=null)carMonitor.refresh();}
    @Override protected void onDestroy(){if(carMonitor!=null)carMonitor.close();if(navigation!=null)navigation.close();if(web!=null){web.removeJavascriptInterface("VehicleBridge");web.destroy();}super.onDestroy();}
}
