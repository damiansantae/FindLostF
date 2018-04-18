import { UserModel } from './../../providers/UserModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomePage } from './../home/home';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import {Component} from '@angular/core';
import { RestProvider } from '../../providers/rest/rest';
import { UuidValidator } from '../../validators/uuid';




@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
  })
  
  export class SearchPage{
     public input:string;
     public partySearching: boolean = false;
     private partyVal: string;
     private searchForm : FormGroup;
     public lostFriends : UserModel [] =[];

    constructor(public navCtrl: NavController, public httpController: RestProvider, public alertCtrl: AlertController, private _FB: FormBuilder,private uuidValidator : UuidValidator, 
    private toastCntrl: ToastController){
    this.getLostFriends();

  
    }
    goToFriend(){
        this.navCtrl.push(HomePage);
    }

    /**
     * Metodo que recoge el identificador escrito por el usuario
     * en la barra de busqueda
     * @param ev 
     */
    searchParty (ev :any){
      this.partyVal = ev;
      if(UuidValidator.isValid(this.partyVal)){

      
      this.partySearching = true;
      this.httpController.searchParty(this.partyVal)
      .then((result)=>{
        let object = JSON.parse(JSON.stringify(result));
        let partyExists = object.exists;
        if(partyExists){
         this.presentConfirmationAlert();
        }else{
this.presentNotificationAlert();
        }
      })
    }else{
      this.presentToast();
    }
      
    }

    /**
     * Funcion que crea un dialogo para notificar al usuario de que se ha encontrado una 
     * party correspondiente con el id y le pregunta si desea unirse a ella
     */
   private presentConfirmationAlert() {
      let alert = this.alertCtrl.create({
        title: 'Party encontrada',
        message: 'Se ha encontrado un party con dicho identificador, ¿desea unirse a la party?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              alert.dismiss();
            }
          },
          {
            text: 'Unirse',
            handler: () => {
              console.log('Unirse clicked');
              this.httpController.joinParty(this.partyVal)
            .then(()=>{
              alert.dismiss();
              
            })           }
          }
        ]
      });
      alert.present();
    }


    /**
     * Funcion que crea un dialogo para notificar al usuario de que no se ha encontrado
     * una party con el id que ha suministrado
     */
   private presentNotificationAlert() {
      let alert = this.alertCtrl.create({
        title: 'Party no encontrada',
        subTitle: 'No se ha encontrado ninguna party con el identificador escrito',
        buttons: ['OK']
      });
      alert.present();
    }

/**
 * Funcion que muestra un toast notificando al usuario de que siga un patron correcto 
 * para la busqueda de una party
 */
   private  presentToast() {
      let toast = this.toastCntrl.create({
        message: 'Inserte un identificador de party válido',
        duration: 3000,
        position: 'bottom',
        showCloseButton : true,
        closeButtonText : "Ok"

      });
    
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      toast.present();
    }

    /**
     * Funcion que solicita al controlador buscar en la bd las parties a las que 
     * el usuario esta conectado
     */
    private getLostFriends(){
      this.httpController.getLostFriends()
      .then((result)=>{
        for (var key in result) {
          let i = 0;
          if (result.hasOwnProperty(key)) {
            console.log('user tiene la clave ' + key);
            var object = result[key];
            this.lostFriends.push(object);
            console.log ("usuario con id "+object.id+" e email: "+object.email);
          }
        }
      })

    }
    removeFriend(friend){
      this.httpController.removeLostFriend(friend.id)
      .then (()=>{
  console.log("dentro de then");
        const index = this.lostFriends.indexOf(friend);
        this.lostFriends.splice(index, 1);
        
      })

    }
   
  }

