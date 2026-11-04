import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { clear } from 'console';

@Component({
  selector: 'app-formauthorizer',
  templateUrl: './formauthorizer.component.html',
  styleUrls: ['./formauthorizer.component.scss']
})
export class FormauthorizerComponent implements OnInit {

 today =new Date();
 
   dataSource: MatTableDataSource<Element>;
   dataSourceTable: MatTableDataSource<Element>;
   expandedElement: any;
   
   displayedColumns = ['LoginName', 'AuthName','Email'  ];
   DocList :any=[];
   DocTypes :any=[];
   AuthList :any=[];
   DocTypesTable :any=[];
   docCode : string = "";
   docName : string = "";
   docType : string = "";
   product_redirectpath : string = ""
   Location :any=[];
   AuthUser :any=[];
   authUser:string=""
   isCardVisible:Boolean=false;
   fromLocation:string=""
   btnName:string = "Save";
   isVisibleShow=true;
   isVisibleReset=false
   strFornName:string="frmAuthorizer";
   isVisibleTable=false
   boolRights:boolean=false;
   userEmail:string=""
   stroption:string=""
   Username : string = "";  
   constructor(private snackBar: MatSnackBar,private dragulaService: DragulaService,public securityService:SecurityService) {
     this.dataSource = new MatTableDataSource();
     this.dataSourceTable = new MatTableDataSource();
   }
 
   @ViewChild(MatPaginator, { static: false })
   set paginator(v: MatPaginator) {
     this.dataSourceTable.paginator = v;
   }
 
   ngOnInit(): void {
       this.securityService.GetIsUserActive().subscribe(data => {
      this.Username = data.username;
     //alert('Data saved!'+data);
  });
     setInterval(() => { this.today = new Date();}, 1000);     
     this.onLoadLocation();
   }
   Show(){
    this.isCardVisible=true
    this.isVisibleReset=true
    this.isVisibleShow=false
    this.isVisibleTable=true
    this.onLoad();
    this.securityService.GetAuthUser().subscribe(data => {
      this.AuthUser = this.prepareAuthUserList(data);
    }, error => {
      console.error('Error fetching doc types:', error);
    });
   }
   Reset(){
    this.Clear()
    this.isCardVisible=false
    this.isVisibleShow=true
    this.isVisibleReset=false
     this.isVisibleTable=false
   }
   ngAfterViewInit(): void {
     //this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  onLoadLocation(){
    this.securityService.GetLocation().subscribe(data => {
      this.Location = this.prepareLocationList(data);
    }, error => {
      console.error('Error fetching doc types:', error);
    });
  }
   onGetUserEmail(){
    this.securityService.GetUserEmail(this.authUser).then(data => {
      this.userEmail = data;
    }, error => {
      console.error('Error fetching doc types:', error);
    });
   } 
 PermissionCheck(strActionName: string) {
  this.securityService.GetUserRightsFor(this.strFornName, strActionName, this.Username)
    .subscribe({
      next: (userPermission: any) => {
        this.boolRights = userPermission.boolRights;
      },
      error: (error) => {
        // Try to extract a readable message
        const errorMsg =
          error?.error?.ExceptionMessage || error?.ExceptionMessage || error?.statusText || 'An unexpected error occurred';

        console.error(error);

        this.snackBar.open(errorMsg, 'Close', {
          duration: 4000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
      }
    });
}
   EditDocMaster(DocCode:string){
     this.btnName = "Edit";
     this.docCode = (DocCode);
     for(var i=0;i<this.DocTypesTable.length;i++){
       if(this.DocTypesTable[i].DocCode==this.docCode){
         this.docCode = this.DocTypesTable[i].DocCode;
         this.docName = this.DocTypesTable[i].DocName;
         this.docType = this.DocTypesTable[i].DocType;
       }
     }
   }
   prepareLocationList(rows:any) {
    const res=[];
    for(let i=0;i<rows.length;i++) {
      res.push({
        strLocCode:rows[i].strLocationCode,
        strLocName:rows[i].strLocation
        //ProductRedirectPath:rows[i].strProductRedirectPath
      });
    }
    return res;
  }
    prepareAuthUserList(rows:any) {
    const res=[];
    for(let i=0;i<rows.length;i++) {
      res.push({
        strLoginName:rows[i].strLoginName,
        strUserName:rows[i].strUserName
        //ProductRedirectPath:rows[i].strProductRedirectPath
      });
    }
    return res;
  }
  
  AddAuthUser(){
    this.PermissionCheck("SAVE");
    if(this.boolRights){
     if(this.userEmail!="" && this.userEmail!=null && this.stroption!=""&& this.stroption!=null && this.fromLocation!=""&& this.fromLocation!=null){
       var authData = {"strOption":this.stroption,"strLocation":this.fromLocation,"strUserName":this.authUser,"strEmail":this.userEmail,"strUser":this.Username};
      this.securityService.AddAuthUser(authData).subscribe(c=>{
          this.snackBar.open(c, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            verticalPosition: 'top' 
          });

          this.onLoad();
          this.Clear();
        });
      } else {
      this.snackBar.open('Check inputs', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
    }
    }
  }
   Clear(){
     this.userEmail="";
     this.authUser="";
     this.fromLocation = "";
   }
 
   onLoad(){
     this.securityService.GetAuthorizer(this.stroption,this.fromLocation).subscribe(data => {
       this.AuthList = this.prepareAuthorizerList(data);
       this.dataSource.data = this.AuthList;
     }, error => {
       console.error('Error fetching doc types:', error);
     });
   }

   prepareProductList(rows:any) {
     const res=[];
     for(let i=0;i<rows.length;i++) {
       res.push({
         ProductID:rows[i].iProductID,
         ProductName:rows[i].strProductName,
         ProductCode:rows[i].strProductCode,
         ProductRedirectPath:rows[i].strProductRedirectPath
       });
     }
     return res;
   }
 
   prepareDocTypeList(rows:any) {
     const res=[];
     for(let i=0;i<rows.length;i++) {
       res.push({
         DocCode:rows[i].strDoccode,
         DocName:rows[i].strDocName,
         DocType:rows[i].strDocType,
         DocSeq:rows[i].iDisplaySeq
         //ProductRedirectPath:rows[i].strProductRedirectPath
       });
     }
     return res;
   }
 prepareAuthorizerList(rows:any) {
     const res=[];
     for(let i=0;i<rows.length;i++) {
       res.push({
         LoginName:rows[i].strLoginName,
         UserName:rows[i].strUserName,
         Option:rows[i].strOption,
         LocCode:rows[i].strLocCode,
         Email:rows[i].strEmail
         //ProductRedirectPath:rows[i].strProductRedirectPath
       });
     }
     return res;
   }
   onLoadTable():void{
     this.securityService.GetDoctypes(this.docType,2).subscribe(data => {
       this.DocTypesTable = this.prepareDocTypeList(data);
       this.dataSourceTable.data = this.DocTypesTable;
     }, error => {
       console.error('Error fetching doc types:', error);
     });
   }
 }
 export interface DocType {
   strDocCode: string;
   strDocType: string;
   strDocName: string;
 }
 export interface AuthUser {
  strOption:string
  strLocation:string
  strUserName: string;
  strEmail: string;
  strUser:string
}
 