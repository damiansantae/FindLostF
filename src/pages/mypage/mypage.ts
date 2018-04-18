import { LocationTrackerProvider } from './../../providers/location-tracker/location-tracker';
import { BackgroundMode } from '@ionic-native/background-mode';
import { UserModel } from './../../providers/UserModel';

import { Component } from '@angular/core';
import {AuthenticationProvider} from "../../providers/authentication";
import {
  AlertController, App, LoadingController, ModalController, NavController, NavParams, Refresher
} from 'ionic-angular';
import {LoginPage} from "../login/login";
import { RestProvider } from '../../providers/rest/rest';




@Component({
  selector: 'page-mypage',
  templateUrl: 'mypage.html'
})
export class MyPage {

  

  public joinedUsers : UserModel [] = [];
  public isActiveState : boolean;
public hasParty : boolean;
public partyid : string;
public isButtonHidden : boolean = false;

  constructor(private _AUTH: AuthenticationProvider,
    private appCrtl: App, public alertCtrl: AlertController,
  public httpController: RestProvider, private backgroundMode: BackgroundMode, private locationTracker: LocationTrackerProvider) {
    this.isActiveState =  false;

    httpController.getSearchers().
    then((result) => {
      for (var key in result) {
        let i = 0;
        if (result.hasOwnProperty(key)) {
          console.log('user tiene la clave ' + key);
          var object = result[key];
          this.joinedUsers.push(object);
          console.log ("usuario con id "+object.userid);
        }
      }
    });

    httpController.checkFirstTime()
    .then((result)=>{

      let object = JSON.parse(JSON.stringify(result));
      console.log(object.exists);
      this.hasParty = object.exists;
      if(this.hasParty){
        this.partyid = object.partyid;
      this.isActiveState = object.isactive;

  
      }
    });

  }

/**
 * Funcion que conecta con el Controlador para 
 * eliminar un usuario no desado de la lista de buscadores
 * @param searcher 
 */
  removeSearcher (searcher){
    this.httpController.removeSearcher(searcher.id)
    .then (()=>{

      const index = this.joinedUsers.indexOf(searcher);
      this.joinedUsers.splice(index, 1);
      
    })
  }


  /**
   * Funcion que se conecta con el puente de comunicacion del server 
   * para cambiar el identificador de la party
   */
  refreshId (){
    this.httpController.updatePartyId()
    .then((result)=>{
      this.partyid = JSON.stringify(result).replace(/['"]+/g, '');
    })
  }

  /**
   * Funcion llamada para finalizar la sesion del usuario logueado
   * Se comunica con el provider de Autenticacion y si todo ha salido 
   * correctamente devuelve al usuario a la pagina de inicio de sesion
   */
  askForLogOut() {
    this._AUTH.logOut()
      .then((val) => {
        this.appCrtl.getRootNav().setRoot(LoginPage);
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  /**
   * Funcion que se comunica con el provider para cambiar
   * el estado de la party, si la sesion estaba iniciada se finaliza,
   * y viceversa
   */
  changePartyState (){
    if (this.isActiveState){
      this.isButtonHidden = true;
      this.httpController.stopParty()
      .then(()=>{
        this.isActiveState = !this.isActiveState
      this.isButtonHidden = false;
     this.backgroundMode.disable();
this.locationTracker.stopTracking();
this.locationTracker.dismissTimer();
      });
    }
   
    else {
      this.isButtonHidden = true;
      
      this.httpController.restartParty().then(()=>{
        this.isActiveState = !this.isActiveState
      this.isButtonHidden = false;
      this.backgroundMode.enable();
      this.locationTracker.startTracking();
      this.locationTracker.initimer();
        
      });

    }

  }


	 /**
    * Funcion que genera un GUID
    */
    private guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    /**
     * Controla el pulsado del boton "iniciar"
     */
  private createParty(){
    this.httpController.startParty()
    .then((result) => {
     console.log(result);
    })
    .catch( (err)=> {
console.error(err);
    });

  }
  }
