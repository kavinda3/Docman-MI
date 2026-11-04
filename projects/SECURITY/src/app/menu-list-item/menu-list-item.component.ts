import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {NavItem} from '../nav-item';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { SecurityService } from '../../shared/security-service.service';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent implements OnInit {
  expanded: boolean=false;
  @HostBinding('attr.aria-expanded')
  @Input()  item!: NavItem;
  @Input() depth: number =0;

  constructor(public router: Router,public securityService:SecurityService) {
   
  }
  ngOnInit(): void {
  }
  onItemSelected(item: NavItem) {
    
    if (!item.children || !item.children.length) {
      if(item.route=="logout"){
        this.securityService.Logout();
        window.location.href = this.securityService.baseurl; 
      }else{
        this.router.navigate([item.route]);
      } 
    
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }

  }
}
