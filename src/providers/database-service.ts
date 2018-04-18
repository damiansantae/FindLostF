import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


@Injectable()
export class DatabaseService {

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);
  private userID : string;

  constructor(private platform: Platform, private sqlite: SQLite) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;

          this.createTables().then(() => {
            this.dbReady.next(true);
          });
        })

    });
  }

  private createTables() {

    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS data (
        userid TEXT PRIMARY KEY,
      partyid TEXT
    );`
      , {})
      .catch((err) => console.log("error detected creating tables", err));

  }


  private isReady() {
    return new Promise((resolve, reject) => {
      //if dbReady is true, resolve
      if (this.dbReady.getValue()) {
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else {
        this.dbReady.subscribe((ready) => {
          if (ready) {
            resolve();
          }
        });
      }
    })
  }


 
  /**
   * Funcion que almacena en la bd el identificador de usuario 
   * almacenado en firebase
   * @param uid 
   */
  storeUID(uid) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql( `INSERT INTO data(userid) VALUES ('${uid}');`, [])
        .then(()=> {
this.userID = uid;
        })  .catch((err) => console.log(err)); 
      })
  }

    /**
   * Funcion que almacena en la bd el identificador de party
   * del usuario 

   * @param uid 
   */
  storePartyID(partyId) {
    return this.isReady()
      .then(() => {
        return this.database.executeSql( `UPDATE data SET 
        partyid = '${partyId}'
        WHERE userid = '${this.userID}';`,
         [])
          .catch((err) => console.log(err)); 
      })
  }

/**
 * Se obtiene el UID del usuario identificado en la sesion
 */
  getMyUID() {
    return this.isReady()
      .then(() => {
        return this.database.executeSql("SELECT * from data", [])
          .then((data) => {
            let UID : string = data.rows.item(0).userid;
            return UID;
          })
          .catch((err) => console.log(err)); 
      })
  }

  getMyPartyID() {
    return this.isReady()
      .then(() => {
        return this.database.executeSql("SELECT * from data", [])
          .then((data) => {
            let UID : string = data.rows.item(0).partyid;
            return UID;
          })
          .catch((err) => console.log(err)); 
      })
  }
/**
 * Función que elimina de la BD la información del usuario logueado
 * Esta función es llamada cuando el usuario se desloguea
 */
  deleteAllData() {
    return this.isReady()
      .then(() => {
        return this.database.executeSql("DELETE FORM data", [])
          .then((data) => {
            let UID : string = data.rows.item(0).userid;
            return UID;
          })
          .catch((err) => console.log(err)); 
      })
  }


  getuid() {
    return '_' + Math.random().toString(36).substr(2, 9);

  }



}
