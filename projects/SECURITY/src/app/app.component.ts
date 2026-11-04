import { Component } from '@angular/core';
import { SecurityService } from '../shared/security-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']  
})

export class AppComponent {
  title = 'MI';
  username: string = "";
  constructor(public securityService:SecurityService) {
  
    }

  ngOnInit(){
   
    //const username = sessionStorage.getItem('uname');
    // Storing a simple value
    //const user = { name: 'John', age: 30 };
    //sessionStorage.setItem('user', JSON.stringify(user));
    //alert('Data saved!'+this.username);

  }
  
}
