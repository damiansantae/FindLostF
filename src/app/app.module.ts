import { LocationTrackerProvider } from './../providers/location-tracker/location-tracker';
import { SignupPage } from './../pages/signup/signup';
import { ResetPasswordPage } from './../pages/reset-pwd/reset-pwd';
import { LoginPage } from './../pages/login/login';
import {DatabaseService} from "../providers/database-service";
import {SQLite} from "@ionic-native/sqlite";
import { MyPage } from './../pages/mypage/mypage';
import { TabsPage } from './../pages/tabs/tabs';
import { Gyroscope } from '@ionic-native/gyroscope';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';
import {CameraPreview} from '@ionic-native/camera-preview'
import {Geolocation} from '@ionic-native/geolocation';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { HttpClientModule } from '@angular/common/http';
import { DeviceOrientation, DeviceOrientationCompassHeading} from '@ionic-native/device-orientation';
import { RestProvider } from '../providers/rest/rest';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule }  from 'angularfire2/database';
import { AuthenticationProvider } from '../providers/authentication';
import { environment } from '../enviroments/enviroments';
import { UuidValidator } from '../validators/uuid';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';




@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    SearchPage,
    ResetPasswordPage,
    SignupPage,
    MyPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    SearchPage,
    LoginPage,
    ResetPasswordPage,
    SignupPage,

    MyPage
  ],
  providers: [
    BackgroundMode,
    LocationTrackerProvider,
    BackgroundGeolocation,
    HTTP,   
    UuidValidator, 
    StatusBar,
    SplashScreen,
    CameraPreview,
    Geolocation,
    DeviceMotion,
    DeviceOrientation,
    Gyroscope,
    SQLite,
   DatabaseService,
    AuthenticationProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
    LocationTrackerProvider
  ]
})
export class AppModule {}
