// Go full screen
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
// Go full screen

import { Component, OnInit , HostListener } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SecurityService } from '../../shared/security-service.service';
declare var $:any;   // popper

@Component({
  selector: 'app-mi-nav',
  templateUrl: './mi-nav.component.html',
  styleUrls: ['./mi-nav.component.scss']
})

export class MiNavComponent implements OnInit {

  events: string [] = [];
  NavList :any=[];
  opened: boolean = true;
  mode: MatDrawerMode ='side';
  showToggle: string = 'show';
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  
  ProductItemList: any[] =[];
  Username : string = '';
  
  // constructor() { }

  // go full screen
  constructor(@Inject(DOCUMENT) private document: any,public securityService:SecurityService,private router: Router) { }
  
  elem: any;
  navItems: NavItem[] = []
  // {
  //   displayName: 'Dashboard',
  //   iconName: 'dashboard',
  //   route: 'home',
  // },  
  // {
  //   displayName: 'Configuration',
  //   iconName: 'accessibility',
  //   route: '/configuration',
  // }, 
  // {
  //   displayName: 'Details',
  //   iconName: 'dashboard',
  //   route: 'devfestfl',
            
  //   children: [
  //   {
  //     displayName: 'Company Details',
  //     iconName: 'home',
  //     route: '/companydetails',
  //   },
  //   {
  //     displayName: 'Category Details',
  //     iconName: 'category',
  //     route: '/category'
  //   },
  //   {
  //     displayName: 'Security Details',
  //     iconName: 'security',
  //     route: '/securitydetails'
  //   }]
  // },
  // {
  //   displayName: 'Buy Details',
  //   iconName: 'format_bold',
  //   route: 'buy',
  // },     
  // {
  //   displayName: 'Sell Details',
  //   iconName: 'attach_money',
  //   route: 'sell',
  // },
  // {
  //   displayName: 'Movements',
  //   iconName: 'autorenew',
  //   route: 'movements',        
  // },
  // {
  //   displayName: 'Market Price',
  //   iconName: 'move_to_inbox',
  //   route: 'marketprice',  
  // },
  // {
  //   displayName: 'Reports',
  //   iconName: 'library_books',
  //   route: 'reports',        
  // },
  // {
  //   displayName: 'Logout',
  //   iconName: 'exit_to_app',
  //   route: 'logout',              
  // }];
  
  ngOnInit() {

// Live code
this.securityService.GetIsUserActive().subscribe({
  next: (data) => {
    console.log(data.username);
    this.Username = data.username;
    
    if (this.Username != "") {
      this.securityService.getNavItems(this.Username).subscribe({
        next: (items) => {
          this.navItems = items;
        },
        error: (err) => {
          console.error('Error fetching nav items', err);
        }
      });
    }
  },
  error: (err) => {
    console.error("GetIsUserActive failed", err);
  }
});

//UAT CODE

  //  this.securityService.getNavItems(this.Username).subscribe({
  //       next: (items) => {
  //         this.navItems = items;
  //       },
  //       error: (err) => {
  //         console.error('Error fetching nav items', err);
  //       }
  //     });
    

    $(function() {

      $("[data-toggle=popover]").popover({
          html : true,
          content: function() {
              var content = $(this).attr("data-popover-content");
              return $(content).children(".popover-body").html();
          },
          title: function() {
              var title = $(this).attr("data-popover-content");
              return $(title).children(".popover-heading").html();
          }
      });
  });
  // popper


  // full screen
  this.elem = document.documentElement;
  // full screen


this.getScreenWidth().subscribe(width => {
   if (width < 959) {
    this.showToggle = 'show';
    this.mode = 'over';
    this.opened = false;
  }
  else if (width > 959) {
    this.showToggle = 'hide';
    this.mode = 'side';
    this.opened = true;
  }
});

this.securityService.GetCurrentUser().subscribe(data=>{
  this.Username = data;
});

}
   //navItems: any[] = [];

openMultipleTabs(item: any) {
  item.routes.forEach((route: string) => {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([route])
    );

    window.open(url, '_blank');
  });
}
openInNewTab(route: string) {
  const url = this.router.serializeUrl(
    this.router.createUrlTree([route])
  );

  window.open(url, '_blank');
}
// go full screen
openFullscreen() {
if (this.elem.requestFullscreen) {
  this.elem.requestFullscreen();
} else if (this.elem.mozRequestFullScreen) {
  /* Firefox */
  this.elem.mozRequestFullScreen();
} else if (this.elem.webkitRequestFullscreen) {
  /* Chrome, Safari and Opera */
  this.elem.webkitRequestFullscreen();
} else if (this.elem.msRequestFullscreen) {
  /* IE/Edge */
  this.elem.msRequestFullscreen();
}

}
// go full screen

getScreenWidth(): Observable<number> {
return this.screenWidth$.asObservable();
}

logout(){
  this.securityService.Logout();
  localStorage.clear();
    sessionStorage.clear();
    this.clearCookies();
   //window.location.href = 'http://192.168.100.51:81/DocmanLogin';
   window.location.href = 'http://192.168.100.85:81/DocmanLogin';
  //location.href = this.cseService.baseurl;
  //window.location.replace(this.securityService.loginurl);
  //this.dashboardService.redirectToLoginPage();
}
 private clearCookies() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
  }
logout1(){
  alert("logout 2")
}

@HostListener('window:resize', ['$event'])

onResize(event:any) {
this.screenWidth$.next(event.target.innerWidth);
}



}
export interface NavItem {
  displayName: string;
  iconName: string;
  route: string;
  children?: NavItem[];
}