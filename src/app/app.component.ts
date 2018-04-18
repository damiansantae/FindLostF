import { LoginPage } from './../pages/login/login';
import { TabsPage } from './../pages/tabs/tabs';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import {Geolocation} from '@ionic-native/geolocation';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope';
import {App, ViewController} from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(private app: App, private platform: Platform, private geolocation:Geolocation,statusBar: StatusBar, splashScreen: SplashScreen, private cameraPreview: CameraPreview) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    
    });

    platform.registerBackButtonAction(() => {
      let nav = app.getActiveNav();
      let activeView: ViewController = nav.getActive();
      if(activeView != null){
        if (typeof activeView.instance.backButtonAction === 'function')
          activeView.instance.backButtonAction();
        else nav.parent.select(0); // goes to the first tab
      }
    });
  }
 

}

