import { LocationTrackerProvider } from './../../providers/location-tracker/location-tracker';

import { RestProvider } from './../../providers/rest/rest';
import { MyPage } from './../mypage/mypage';
import { Component } from '@angular/core';
import { HomePage } from '../home/home'
import { SearchPage } from '../search/search';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MyPage;
  tab2Root = SearchPage;
  


  constructor(private backgroundMode: BackgroundMode, private httpService: RestProvider, private locationTracker : LocationTrackerProvider) {

    httpService.isLocationShared().
    then((result)=>{
      let isactive  = JSON.stringify(result).replace(/['"]+/g, '');
      console.log("Is locationshared esta activa la sesion de party: "+isactive)
      if(isactive == 'true'){
        console.log("Dentro de if !!!");
backgroundMode.enable();
locationTracker.startTracking();
locationTracker.initimer();
      }
    });
  }

 

  

}
