import { AuthenticationProvider } from './../authentication';
import { UserModel } from './../UserModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Http, Response, RequestOptionsArgs } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'; import { HttpModule } from '@angular/http';
import { auth } from 'firebase';



/*
  Provider/Controlador puente entre el cliente y el servidor, se encarga de realizar 
  las peticiones al servidor
*/
@Injectable()
export class RestProvider {

  apiUrl = 'https://santamaria-damian-tfg-server.herokuapp.com';
  apiUrl2 = 'http://localhost:8080';

  

  constructor(public http: HttpClient, public http1: Http, private _AUTH: AuthenticationProvider) {
    console.log('Hello RestProvider Provider');
  }

  /**
   * Petición POST al servidor para comenzar una party de búsqueda para el usuario
   *  
   */
  startParty() {
    let uid = this._AUTH.getUUID();
    console.log("POST startParty con userid: "+uid);
    
   let body = JSON.stringify({'userId': uid});
   return new Promise((resolve, reject) => {
   this.http.post(this.apiUrl2+'/create-party',body,{     
      headers: new HttpHeaders().set('Content-Type', 'application/json')
   }) 
   .subscribe(res => {
    resolve(res);
  }, (err) => {
    reject(err);
    console.log(err);
  });
});
}

/**
   * Petición POST al servidor para obtener los usuarios que se 
   * encuentran en la búsqueda del usuario perdido 
   * 
   */
  getSearchers() {
    let uid = this._AUTH.getUUID();
    console.log("POST getSearchers con userid: "+uid);
    let body = JSON.stringify({'userId': uid});
    return new Promise((resolve, reject) => {
    this.http.post(this.apiUrl2+'/get-searchers',body,{     
       headers: new HttpHeaders().set('Content-Type', 'application/json')
    }) 
    .subscribe(res => {
     resolve(res);
   }, (err) => {
     reject(err);
     console.log(err);
   });
 });
 }

 /**
  * Peticion POST para obtener el nombre de los usuarios propietarios 
  * de las partys a la que el usuario esta unido
  */
 getLostFriends() {
  let uid = this._AUTH.getUUID();
  console.log("POST getFriends con userid: "+uid);
  let body = JSON.stringify({'userId': uid});
  return new Promise((resolve, reject) => {
  this.http.post(this.apiUrl2+'/get-lost-friends',body,{     
     headers: new HttpHeaders().set('Content-Type', 'application/json')
  }) 
  .subscribe(res => {
   resolve(res);
 }, (err) => {
   reject(err);
   console.log(err);
 });
});
}


/**
 * Peticion POST al servidor para unirse a una party de búsqueda de usuario
 *
 * @param partyId 
 */
joinParty(partyId) {
  let body = JSON.stringify({'userId': this._AUTH.getUUID(), 'partyId': partyId});
  return new Promise((resolve, reject) => {
  this.http.post(this.apiUrl2+'/join-party',body,{     
     headers: new HttpHeaders().set('Content-Type', 'application/json')
  }) 
  .subscribe(res => {
   resolve(res);
 }, (err) => {
   reject(err);
   console.log(err);
 });
});
}

/**
 * Peticion POST al servidor para buscar si existe un partyid determinado en la bd
 *
 * @param partyId 
 */
searchParty(partyId) {
  let body = JSON.stringify({'partyId': partyId});
  return new Promise((resolve, reject) => {
  this.http.post(this.apiUrl2+'/search-party',body,{     
     headers: new HttpHeaders().set('Content-Type', 'application/json')
  }) 
  .subscribe(res => {
   resolve(res);
 }, (err) => {
   reject(err);
   console.log(err);
 });
});
}

/**
 * Peticion POST al servidor para obtener los datos de localizacion de un usuario determinado
 * @param partyId 
 */
getFriendLocation(partyId) {
  let body = JSON.stringify({'userId': this._AUTH.getUUID(), 'partyId': partyId});
  return new Promise((resolve, reject) => {
  this.http.post(this.apiUrl2+'/friend-location',body,{     
     headers: new HttpHeaders().set('Content-Type', 'application/json')
  }) 
  .subscribe(res => {
   resolve(res);
 }, (err) => {
   reject(err);
   console.log(err);
 });
});
}

/**
 * Peticion POST al servidor para compartir la ubicacion actual del dispositivo
 * @param lat
 * @param lon 
 */
shareLocation(lat,lon) {
  console.log('share location rest with latitude: '+lat+' and longitude '+lon)
  let body = JSON.stringify({'latitude': lat, 'longitude': lon, 'userId': this._AUTH.getUUID()});
  return new Promise((resolve, reject) => {
  this.http.post(this.apiUrl2+'/share-location',body,{     
     headers: new HttpHeaders().set('Content-Type', 'application/json')
  }) 
  .subscribe(res => {
   resolve(res);
 }, (err) => {
   reject(err);
   console.log(err);
 });
});
}

/**
 * Peticion POST al server para elminar un determinado usuario
 * de la lista de buscadores
 * @param searcherId 
 */
removeSearcher(searcherId) {
  let obj = {
    'searcherId': searcherId,
    'userId' : this._AUTH.getUUID()
  };
  let body = JSON.stringify(obj);
  return new Promise((resolve, reject) => {
  this.http.post(this.apiUrl2+'/remove-searcher',body,{     
     headers: new HttpHeaders().set('Content-Type', 'application/json')
  }) 
  .subscribe(res => {
   resolve(res);
 }, (err) => {
   reject(err);
   console.log(err);
 });
});
}

removeLostFriend(friendid) {
  let obj = {
    'friendID': friendid,
    'userId' : this._AUTH.getUUID()
  };
  let body = JSON.stringify(obj);
  return new Promise((resolve, reject) => {
  this.http.post(this.apiUrl2+'/remove-lost-friend',body,{     
     headers: new HttpHeaders().set('Content-Type', 'application/json')
  }) 
  .subscribe(res => {
   resolve(res);
 }, (err) => {
   reject(err);
   console.log(err);
 });
});
}
/**
 * Peticion POST para actualizar el identificador de la party perteneciente al usuario
 * 
 */
updatePartyId() {
  let body = JSON.stringify({'userId': this._AUTH.getUUID() });
  return new Promise((resolve, reject) => {
  this.http.post(this.apiUrl2+'/update-party',body,{     
     headers: new HttpHeaders().set('Content-Type', 'application/json')
  }) 
  .subscribe(res => {
   resolve(res);
 }, (err) => {
   reject(err);
   console.log(err);
 });
});
}

/**
 * Peticion POST para detener la party iniciada por el usuario
 * para que nadie pueda buscarlo
 */
stopParty (){
  let body = JSON.stringify({ 'userId': this._AUTH.getUUID() });
  return new Promise((resolve, reject) => {
    this.http.post(this.apiUrl2+'/stop-party',body,{     
       headers: new HttpHeaders().set('Content-Type', 'application/json')
    }) 
    .subscribe(res => {
     resolve(res);
   }, (err) => {
     reject(err);
     console.log(err);
   });
  });
}
/**
 * Peticion POST para reanudar la party detenida previamente
 */
restartParty (){
  let body = JSON.stringify({ 'userId': this._AUTH.getUUID() });
  return new Promise((resolve, reject) => {
    this.http.post(this.apiUrl2+'/restart-party',body,{     
       headers: new HttpHeaders().set('Content-Type', 'application/json')
    }) 
    .subscribe(res => {
     resolve(res);
   }, (err) => {
     reject(err);
     console.log(err);
   });
  });

}
/**
 * Peticion POST para comprobar si el usuario tiene iniciada una party a su nombre
 */
checkFirstTime (){
  let body = JSON.stringify({ 'userId': this._AUTH.getUUID() });
  return new Promise((resolve, reject) => {
    this.http.post(this.apiUrl2+'/check-firstime',body,{     
       headers: new HttpHeaders().set('Content-Type', 'application/json')
    }) 
    .subscribe(res => {
     resolve(res);
   }, (err) => {
     reject(err);
     console.log(err);
   });
  });

}

isLocationShared (){
  let body = JSON.stringify({ 'userId': this._AUTH.getUUID() });
  return new Promise((resolve, reject) => {
    this.http.post(this.apiUrl2+'/is-location-shared',body,{     
       headers: new HttpHeaders().set('Content-Type', 'application/json')
    }) 
    .subscribe(res => {
     resolve(res);
   }, (err) => {
     reject(err);
     console.log(err);
   });
  });

}
  

}
