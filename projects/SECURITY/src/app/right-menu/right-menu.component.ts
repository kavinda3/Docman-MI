import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../shared/security-service.service';

@Component({
  selector: 'app-right-menu',
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.scss']
})
export class RightMenuComponent implements OnInit {

  constructor(public securityService:SecurityService) { }
  Username: string = "";  
  ngOnInit(): void {
      this.securityService.GetIsUserActive().subscribe(data => {
      this.Username = data.username;
  });
  }

}
