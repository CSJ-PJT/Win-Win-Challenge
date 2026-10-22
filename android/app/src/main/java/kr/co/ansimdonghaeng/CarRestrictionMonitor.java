package kr.co.ansimdonghaeng;

import android.car.Car;
import android.car.drivingstate.CarUxRestrictions;
import android.car.drivingstate.CarUxRestrictionsManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.ServiceConnection;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;

/** Conservative native interaction guard. Missing/disconnected state remains blocked. */
final class CarRestrictionMonitor {
    interface Callback { void update(boolean known, boolean restricted); }
    private final Context context;
    private final Callback callback;
    private final Handler handler=new Handler(Looper.getMainLooper());
    private Car car;
    private CarUxRestrictionsManager manager;
    private boolean closed;
    private final CarUxRestrictionsManager.OnUxRestrictionsChangedListener listener=this::accept;
    private final Runnable poll=new Runnable(){public void run(){if(!closed){refresh();handler.postDelayed(this,3000);}}};
    CarRestrictionMonitor(Context context,Callback callback){this.context=context;this.callback=callback;}
    void start(){
        callback.update(false,true);
        car=Car.createCar(context,new ServiceConnection(){
            @Override public void onServiceConnected(ComponentName name,IBinder service){
                try{manager=(CarUxRestrictionsManager)car.getCarManager(Car.CAR_UX_RESTRICTION_SERVICE);manager.registerListener(listener);refresh();}
                catch(Exception e){callback.update(false,true);}
            }
            @Override public void onServiceDisconnected(ComponentName name){manager=null;callback.update(false,true);}
        });
        car.connect();handler.post(poll);
    }
    private void accept(CarUxRestrictions restrictions){
        if(restrictions==null){callback.update(false,true);return;}
        callback.update(true,restrictions.isRequiresDistractionOptimization() || restrictions.getActiveRestrictions()!=CarUxRestrictions.UX_RESTRICTIONS_BASELINE);
    }
    void refresh(){try{if(manager==null)callback.update(false,true);else accept(manager.getCurrentCarUxRestrictions());}catch(Exception e){callback.update(false,true);}}
    void close(){closed=true;handler.removeCallbacksAndMessages(null);try{if(manager!=null)manager.unregisterListener();}catch(Exception ignored){}try{if(car!=null)car.disconnect();}catch(Exception ignored){}}
}
