import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';
import { Routes, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-pendingrequest',
  templateUrl: './pendingrequest.component.html',
  styleUrls: ['./pendingrequest.component.scss']
})
export class PendingrequestComponent implements OnInit {

 today =new Date();
   
     dataSource: MatTableDataSource<Element>;
     expandedElement: any;
     
     displayedColumns = ['RequestNo', 'Location','Requestuser', 'RequestDate','Approve' ];
     PendingList :any=[];
     location_code : number = 0;
     location_name : string = "";
     selectedStatus:string=""
     req_no:string="";
     btnName:string = "Save";
     lblHeader:string="";
     isTSRButtonVisible:boolean=false;
     isApprove:boolean=false;
     selectedTrnNo: string = '';
     constructor(private router: Router,private dragulaService: DragulaService,public securityService:SecurityService) {
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
   
     ngOnInit(): void {
       setInterval(() => { this.today = new Date();}, 1000);
     }
   
     ngAfterViewInit(): void {
       //this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
   
      //Location Functions
     EditLocation(locationCode:string){
       this.btnName = "Edit";
       this.location_code = parseInt(locationCode);
       for(var i=0;i<this.PendingList.length;i++){
         if(this.PendingList[i].ProductID==locationCode){
           this.location_name = this.PendingList[i].LocationCode;
         }
       }
     }
     onApprove(){
      this.isTSRButtonVisible=true;
      this.isApprove=false
     }
     onNotApprove(){
      this.isApprove=true
      this.isTSRButtonVisible=false;
     }
     //Product Functions
    //  SaveProduct(){
    //    if(this.location_name!="" && this.location_name!=null && this.location_code !=null ){
    //      var locationData = {"strLocationCode":this.location_code.toString(),"strLocationName":this.location_name};
    //      this.securityService.AddLocation(locationData).subscribe(c=>{
    //        alert(c);
    //         // this.onLoad();
    //          this.Clear();
    //       });
    //    }else{
    //      alert("Check Inputs");
    //    }
    //  }
   
     Clear(){
       this.location_code=0;
       this.location_name="";
       this.btnName="Save";
     }
     onRadioChange(i:number) {
      //const selectedValue = event.target.value;
      this.lblHeader= i === 0 ? " - Pending Request To Be Approved by BSD" : " - Pending Request To Be Transfered by BSD";
      this.securityService.GetLoadPendingList(i).subscribe(data => {      
        this.PendingList = this.preparePendingList(data);
        this.dataSource.data = this.PendingList;
      });
     }
      onRowClicked(row: any) {
        this.selectedStatus = row.approve ? 'Approved' : 'Not Approved';
        this.req_no = row.ReqNo; // Assign TRN_No to textbox
          const myValue = this.req_no;
          if(this.selectedStatus === 'Approved') {
              this.router.navigate(['/transferfile', myValue]);
          }
          else{
              this.router.navigate(['/requestfile', myValue  ]);
          }
     }
   
     preparePendingList(rows:any) {
       const res=[];
       for(let i=0;i<rows.length;i++) {
         res.push({
            ReqNo:rows[i].strReqNo, 
            ReqDate:rows[i].dtReqDate.split('T')[0], 
            ReqUser:rows[i].strReqUser,
            LocCode:rows[i].strLocCode, 
            LocName:rows[i].strLocName,
            approve:rows[i].boolapprove
         });
       }
       return res;
     }
   
   }
   export interface Location {
     strLocationCode: string;
     strLocation: string;
   }
   