import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crpending',
  templateUrl: './crpending.component.html',
  styleUrls: ['./crpending.component.scss']
})
export class CrpendingComponent implements OnInit {
  today =new Date();
  constructor() { }
  reportType:string=""
  ngOnInit(): void {
    setInterval(() => { this.today = new Date();}, 1000);
  }

}
