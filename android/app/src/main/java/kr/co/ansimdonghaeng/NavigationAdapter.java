package kr.co.ansimdonghaeng;

import android.content.Context;
import java.util.function.Consumer;
import ai.pleos.playground.navi.helper.NaviHelper;
import ai.pleos.playground.navi.helper.listener.NaviHelperEventListener;
import ai.pleos.playground.navi.constants.NaviErrorCode;
import kotlin.Unit;

/** Actual NaviHelper adapter. A route request is not successful routing or person handoff. */
final class NavigationAdapter {
    private final NaviHelper helper;
    private final Consumer<String> status;
    private boolean connected;
    private boolean initialized;
    private final NaviHelperEventListener listener=new NaviHelperEventListener(){
        @Override public void onRoutingCompleted(){status.accept("NaviHelper 경로 탐색 완료 콜백 수신. 인계 상태는 변경하지 않습니다.");}
        @Override public void onError(NaviErrorCode error){status.accept("NaviHelper 오류: "+error);}
    };
    NavigationAdapter(Context context,Consumer<String> status){this.status=status;helper=new NaviHelper(context.getApplicationContext());}
    boolean isConnected(){return connected;}
    void connect(){
        if(connected){status.accept("NaviHelper 서비스 연결됨. 실차·시설 연동 검증 완료를 의미하지 않습니다.");return;}
        if(initialized){status.accept("NaviHelper 연결 결과를 기다리는 중입니다.");return;}
        initialized=true;
        helper.initialize(()->{connected=true;helper.addListener(listener);status.accept("NaviHelper 서비스 연결 콜백 수신.");return Unit.INSTANCE;},error->{connected=false;status.accept("NaviHelper 연결 실패. 이 환경에서 경로 요청을 사용할 수 없습니다.");return Unit.INSTANCE;});
    }
    void requestSampleRoute(){
        if(!connected){status.accept("NaviHelper 미연결. 요청하지 않았습니다.");return;}
        try{
            helper.requestRoute(RouteFactory.sample());
            status.accept("NaviHelper 예제 경로 요청을 전달했습니다. 완료 콜백 전에는 성공으로 표시하지 않습니다.");
        }catch(Exception e){status.accept("NaviHelper 요청 실패: "+e.getClass().getSimpleName());}
    }
    void close(){connected=false;try{helper.removeListener(listener);helper.release();}catch(Exception ignored){}}
}
