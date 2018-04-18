import { RestProvider } from './../rest/rest';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { timer } from 'rxjs/observable/timer';

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {
  public watch: any;
  public lat: number =0;
  public lon: number= 0;

  constructor(public zone: NgZone, private backgroundGeolocation: BackgroundGeolocation, private geolocation: Geolocation ,private httpService: RestProvider) {
    console.log('Hello LocationTrackerProvider Provider');
  }


  startTracking(){

    // Background Tracking
 
  let config = {
    desiredAccuracy: 0,
    stationaryRadius: 20,
    distanceFilter: 10,
    debug: true,
    interval: 2000
  };
 
  this.backgroundGeolocation.configure(config).subscribe((location) => {
 
    console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
 
    this.zone.run(() => {
      this.lat = location.latitude;
      this.lon = location.longitude;
    });
 
  }, (err) => {
 
    console.log(err);
 
  });
 
  // Turn ON the background-geolocation system.
  this.backgroundGeolocation.start();
 
 
  // Foreground Tracking
 
let options = {
  frequency: 3000,
  enableHighAccuracy: true
};
 
this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
 
  console.log(position);
 
  // Run update inside of Angular's zone
  this.zone.run(() => {
    this.lat = position.coords.latitude;
    this.lon = position.coords.longitude;
  });
 
});

  }

  stopTracking(){
    console.log('stopTracking');
 
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }

  timer :any;
  //Funcion loop que recoge datos de localizacion cada 10 segundos y se lo comunica al controlador de peticiones
  initimer(){
    this.timer = Observable.timer(2000,10000)
   .subscribe(t=> {

      console.log("Timer iniciado");

      this.httpService.shareLocation(this.lat, this.lon);
       
    });

   
}
/**
 * Funcion que se desuscribe al timer iniciado
 */
dismissTimer(){
  console.log("unsuscribing timer");
  this.timer.unsubscribe();
      
}


}
