import { SearchPage } from './../search/search';
import { Component, NgModule } from '@angular/core';
import { NavController,Platform,  ModalController } from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import {Geolocation, GeolocationOptions} from '@ionic-native/geolocation';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope';
import { DeviceOrientation, DeviceOrientationCompassHeading,DeviceOrientationCompassOptions } from '@ionic-native/device-orientation';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import {Observable} from 'rxjs/Rx';
import { RestProvider } from '../../providers/rest/rest';
import { timer } from 'rxjs/observable/timer';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private modal :any;
  public orientated:boolean = false;
  public toRight:boolean = false;
  public toRightType:number;
  public toLeftType:number;
  private isCameraOpen:boolean = true;
  private currentDeviceCompass: any;
  private currentDeviceLocation :any;
  public distance: any;
  public test: any;

private destination = {
  lat:  28.072000,
  long: -15.451768
};

public destination_places :any;


  constructor(private modalCtrl: ModalController,private platform: Platform, public navCtrl: NavController, 
    private deviceMotion: DeviceMotion,private deviceOrientation: DeviceOrientation
    ,private gyroscope: Gyroscope,private geolocation:Geolocation
    , private cameraPreview: CameraPreview, public restProvider: RestProvider) {

      this.getFriendLocation();
    
    
    // camera options (Size and location). In the following example, the preview uses the rear camera and display the preview in the back of the webview
      const cameraPreviewOpts: CameraPreviewOptions = {
        x: 0,
        y: 0,
        width: window.screen.width,
        height: window.screen.height,
        camera: 'rear',
        tapPhoto: false,
        previewDrag: true,
        toBack: true,
        alpha: 1
      };
      
      // start camera
      this.cameraPreview.startCamera(cameraPreviewOpts).then(
        (res) => {
          console.log(res)
        },
        (err) => {
          console.log(err)
        });
  }


  
  backButtonAction(){
  
    this.cameraPreview.stopCamera();
    this.constante.unsubscribe();
    this.Motionsubscription.unsubscribe();
    this.subscription.unsubscribe();
    this.subscriptionOrientation.unsubscribe();

    console.log("Dentro de back");
        this.navCtrl.setRoot(SearchPage);  
}


  getFriendLocation() {
    /* 
    this.restProvider.post()
    .then(data => {
      console.log(data);
    });
    */
  }

 timer :any;
  //Funcion loop que recoge datos del compas cada segundo
  ngOnInit(){
    let timer = Observable.timer(2000,1000);
    timer.subscribe(t=> {
      this.compareBearing(this.currentDeviceCompass,
      this.bearingTo(this.currentDeviceLocation,this.destination));
      
    

console.log('Grados a los que se encuentra el destino: '+this.bearingTo(this.currentDeviceLocation,this.destination));
console.log("Orientacion del dispositivo: "+this.currentDeviceCompass);
this.distance = this.getKilometros(this.destination.lat,this.destination.long,this.currentDeviceLocation.lat,this.currentDeviceLocation.lon);

       
    });
}
/**
 * Funcion que calcula si el dispositivo se encuentra orientado hacia el objetivo
 * @param deviceOrientation 
 * @param shouldBe 
 */
  private compareBearing(deviceOrientation,shouldBe ){
    if(shouldBe-10<deviceOrientation && deviceOrientation<shouldBe+10){
      //Appear arrow
      this.orientated = true;

      console.log(this.orientated);
    }else{
      this.orientated = false;
      
      //Dissapear arrow 
      var result: number;
      result = shouldBe-deviceOrientation;
      if(result>0){
      
        this.toRight = true;

        if(result<=90){
          this.toRightType = 0;

        }else if(result>90 && result<=180){
          this.toRightType = 1;

        }else if(result>180 && result<=270){
          this.toRightType = 2;

          
        }else if(result>180 && result<=345){
          this.toRightType = 3;
          
          
        }
      }else{
        
        this.toRight = false;

        if(result>=-90){
          this.toLeftType = 0;


        }else if(result<-90 && result>=-180){
          this.toLeftType = 1;

        }else if(result<-180 && result>=-270){
          this.toLeftType = 2;

          
        }else if(result<-270 && result>=-345){
          this.toLeftType = 3;
          
        }
      }
      console.log(this.orientated);

    }

  }
  /**Funcion que refresca la pantalla*/
  refresh(){
    window['location'].reload();
  }

  /**Funcion que para la camara */
  switchCamera(){
    if(this.isCameraOpen){
      this.cameraPreview.stopCamera();
    }
    else{
     this.rebootCamera();
  }
  this.isCameraOpen = !this.isCameraOpen;
  }

  /*
  Configuracion de subscripcion a geolocalización
  */
locationOptions : GeolocationOptions = {
  enableHighAccuracy : true,
  timeout : 500

};
  subscription = this.geolocation.watchPosition()
                              .subscribe(position => {
                                this.currentDeviceLocation = {
  lat: position.coords.latitude,
  lon: position.coords.longitude
};
});

/**
 * Funcion que calula los radianes de un determinado angulo en grados
 */
rad = function(x) {return x*Math.PI/180;}
/**
 * Funcion que calcula los grados a partir de radianes
 */
toDegrees = function(x) {return x*180/Math.PI;}

/**
 * Funcion que calcula la distancia existente entre dos determinados puntos geolocalizados
 * 
 */
getKilometros = function(lat1,lon1,lat2,lon2)
{

var R = 6378.137; //Radio de la tierra en km
var dLat = this.rad( lat2 - lat1 );
var dLong = this.rad( lon2 - lon1 );
var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.rad(lat1)) * Math.cos(this.rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
var d = R * c;
return d.toFixed(3); //Retorna tres decimales
}


 options: GyroscopeOptions = {
  frequency: 500
};
 constante = this.gyroscope.watch(this.options)
 .subscribe((orientation: GyroscopeOrientation) => {
    console.log("Gyroscope: "+ orientation.x*100, orientation.y*100, orientation.z*100);
 });

 orientationOptions : DeviceOrientationCompassOptions = {
   frequency : 500
   
 };
 subscriptionOrientation = this.deviceOrientation.watchHeading(this.orientationOptions).subscribe(
  (data: DeviceOrientationCompassHeading) => 
  this.currentDeviceCompass = data.trueHeading
 
  
);



bearingTo = function(userLocation,destinationLocation) {

  // tanθ = sinΔλ⋅cosφ2 / cosφ1⋅sinφ2 − sinφ1⋅cosφ2⋅cosΔλ
  // see mathforum.org/library/drmath/view/55417.html for derivation

  var φ1 = this.rad(userLocation.lat),
   φ2 = this.rad(destinationLocation.lat);
  //console.log('φ1 '+φ1);
  
  var Δλ = this.rad(destinationLocation.long-userLocation.lon);
  //console.log('Δλ '+Δλ);
  var y = Math.sin(Δλ) * Math.cos(φ2);
  //console.log('y:'+y);
  var x = Math.cos(φ1)*Math.sin(φ2) -
          Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
         // console.log('x: '+x)
  var θ = Math.atan2(y, x);
 // console.log('θ: '+θ);
 var result = (this.toDegrees(θ)+360) % 360;
  return result;
};


motionOptions : DeviceOrientationCompassOptions = {
  frequency : 500
  
};

 Motionsubscription = this.deviceMotion.watchAcceleration(this.motionOptions).subscribe((acceleration: DeviceMotionAccelerationData) => {
  console.log("Aceleracion actual: x:"+acceleration.x);
});



private rebootCamera() {
  const cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: window.screen.height,
    camera: 'rear',
    tapPhoto: false,
    previewDrag: true,
    toBack: true,
    alpha: 1
  };
  
  // start camera
  this.cameraPreview.startCamera(cameraPreviewOpts).then(
    (res) => {
      console.log(res)
    },
    (err) => {
      console.log(err)
    });
}

}
