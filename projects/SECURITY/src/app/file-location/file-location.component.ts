import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, Observable, of } from 'rxjs';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-file-location',
  templateUrl: './file-location.component.html',
  styleUrls: ['./file-location.component.scss']
})
export class FileLocationComponent implements OnInit {

   today =new Date();
  
    dataSource: MatTableDataSource<Element>;
    expandedElement: any;
    
    displayedColumns = ['LocationCode', 'location_name','edit'  ];
    LocationList :any=[];
    location_code : string = "";
    location_name : string = "";
    isVisibleSavebtn=false
    isVisibleEditbtn=false
    strFornName:string="frmFileLocation";
    lblstatus:string=""
    isVisibleNewbtn=true
    boolRights:boolean=false;
    btnName:string = "Save";
    Username:string="";
  
    constructor(private snackBar: MatSnackBar,private dragulaService: DragulaService,public securityService:SecurityService) {
      this.dataSource = new MatTableDataSource();
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
    @ViewChild(MatPaginator, { static: false })
    set paginator(v: MatPaginator) {
      this.dataSource.paginator = v;
    }
  @ViewChild(MatSort) sort!: MatSort;
    ngOnInit(): void {
      setInterval(() => { this.today = new Date();}, 1000);
      this.onLoad();
      this.securityService.GetIsUserActive().subscribe(data => {
            this.Username = data.username;         
        });
    }
  
    ngAfterViewInit(): void {
      //this.dataSource.sort = this.sort;
     this.dataSource.paginator = this.paginator;
    

  this.dataSource.sort = this.sort;
   }
  
     //Location Functions
    EditLocation(locationCode:string,locationName:string){
      this.btnName = "Edit";
      this.location_name = (locationName);
      this.location_code = (locationCode);
      // for(var i=0;i<this.LocationList.length;i++){
      //   if(this.LocationList[i].ProductID==locationCode){
      //     this.location_name = this.LocationList[i].LocationCode;
      //   }
      // }
      this.isVisibleNewbtn=false
      this.isVisibleEditbtn=true
      this.isVisibleSavebtn=false
       this.lblstatus="- EDIT"
    }
    NewLocation(){
      this.Clear();
      this.lblstatus="- NEW"
      this.isVisibleSavebtn=true
      this.isVisibleNewbtn=false
      this.isVisibleEditbtn=false
      this.getMaxLocCode();
    }
    //Save location Functions
    async SaveLocation(){
       const hasPermission = await this.PermissionCheck("NEW");
      this.PermissionCheck("SAVE")
      if (hasPermission) {
      //if(this.boolRights){
      if(this.location_name!="" && this.location_name!=null && this.location_code !=null ){
        var locationData = {"strLocationCode":this.location_code.toString(),"strLocationName":this.location_name,"strUserName":this.Username};
       this.securityService.AddLocation(locationData).subscribe(response => {
        this.snackBar.open(response, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top' 
        });

        this.onLoad();
        this.Clear();
      });
    } else {
      this.snackBar.open('Please enter both File Location Name and Location No', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
    }
  }
    }
  UpdateLocation(){
      if(this.location_name!="" && this.location_name!=null && this.location_code !=null ){
        var locationData = {"strLocationCode":this.location_code.toString(),"strLocationName":this.location_name,"strUserName":this.Username}; 
        this.securityService.UpdateLocation(locationData).subscribe(response => {
        this.snackBar.open(response, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top' 
        });

        this.onLoad();
        this.Clear();
      });
    } else {
      this.snackBar.open('Please enter both File Location Name and Location No', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
    }
  }
  
    Clear(){
      this.location_code="";
      this.location_name="";
      this.isVisibleNewbtn=true
      this.isVisibleSavebtn=false
      this.isVisibleEditbtn=false
      this.btnName="Save";
       this.lblstatus=""
    }

  PermissionCheck(strActionName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    this.securityService.GetUserRightsFor(this.strFornName, strActionName, this.Username)
      .subscribe({
        next: (userPermission: any) => {
          this.boolRights = userPermission.boolRights;
          resolve(userPermission.boolRights); // ✅ return result
        },
        error: (error) => {
          const errorMsg =
            error?.error?.ExceptionMessage || error?.ExceptionMessage || error?.statusText || 'An unexpected error occurred';

          console.error(error);

          this.snackBar.open(errorMsg, 'Close', {
            duration: 4000,
            panelClass: ['snackbar-warning'],
            verticalPosition: 'top'
          });

          resolve(false); // ✅ fail safe
        }
      });
  });
}   
    onLoad(){
      this.securityService.GetAllFileLocation().then(data=>{
        this.LocationList = this.prepareLocationList(data);
        this.dataSource.data = this.LocationList;
      });
    }
    getMaxLocCode(){
      this.securityService.GetMaxFileLocationCode().then(data=>{
        this.location_code = String(data).padStart(3, '0');
      });
    }
    prepareLocationList(rows:any) {
      const res=[];
      for(let i=0;i<rows.length;i++) {
        res.push({
          FileLocation:rows[i].strLocation,
          LocationCode:rows[i].strLocationCode
        });
      }
      return res;
    }
  
  }
  export interface Location {
    strLocationCode: string;
    strLocationName: string;
    strUserName: string;
  }
  