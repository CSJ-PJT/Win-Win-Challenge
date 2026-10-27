package kr.co.ansimdonghaeng;

import android.content.Context;
import java.util.function.Consumer;
import ai.pleos.playground.navi.helper.NaviHelper;
import ai.pleos.playground.navi.helper.listener.NaviHelperEventListener;
import ai.pleos.playground.navi.constants.NaviErrorCode;
import kotlin.Unit;

/** Actual NaviHelper adapter. A route request is not successful routing or person handoff. */
final class NavigationAdapter {
    private final Context context;
    private NaviHelper helper;
    private final Consumer<String> status;
    private boolean connected;
    private boolean initialized;
    private final NaviHelperEventListener listener=new NaviHelperEventListener(){
        @Override public void onRoutingCompleted(){status.accept("NaviHelper 경로 탐색 완료 콜백 수신. 인계 상태는 변경하지 않습니다.");}
        @Override public void onError(NaviErrorCode error){status.accept("NaviHelper 오류: "+error);}
    };
    NavigationAdapter(Context context,Consumer<String> status){this.context=context.getApplicationContext();this.status=status;}
    synchronized boolean isConnected(){return connected;}
    synchronized void connect(){
        if(connected){status.accept("NaviHelper 서비스 연결됨. 실차·시설 연동 검증 완료를 의미하지 않습니다.");return;}
        if(initialized){status.accept("NaviHelper 연결 결과를 기다리는 중입니다.");return;}
        final NaviHelper attempt=new NaviHelper(context);
        helper=attempt;
        initialized=true;
        try {
            attempt.initialize(()->{
                synchronized(NavigationAdapter.this){
                    if(helper!=attempt)return Unit.INSTANCE;
                    connected=true;
                    attempt.addListener(listener);
                    status.accept("NaviHelper 서비스 연결 콜백 수신.");
                }
                return Unit.INSTANCE;
            },error->{
                synchronized(NavigationAdapter.this){
                    if(helper!=attempt)return Unit.INSTANCE;
                    clearAttempt(attempt);
                    status.accept("NaviHelper 연결 실패. 연결 상태를 확인한 뒤 다시 시도해 주세요.");
                }
                return Unit.INSTANCE;
            });
        } catch(RuntimeException | LinkageError error) {
            clearAttempt(attempt);
            throw error;
        }
    }
    private void clearAttempt(NaviHelper attempt){
        if(helper!=attempt)return;
        helper=null;
        connected=false;
        initialized=false;
        try{attempt.removeListener(listener);}catch(Exception ignored){}
        try{attempt.release();}catch(Exception ignored){}
    }
    synchronized void requestSampleRoute(){
        if(!connected || helper==null){status.accept("NaviHelper 미연결. 요청하지 않았습니다.");return;}
        try{
            helper.requestRoute(RouteFactory.sample());
            status.accept("NaviHelper 예제 경로 요청을 전달했습니다. 완료 콜백 전에는 성공으로 표시하지 않습니다.");
        }catch(Exception e){status.accept("NaviHelper 요청 실패: "+e.getClass().getSimpleName());}
    }
    synchronized void close(){if(helper!=null)clearAttempt(helper);}
}
