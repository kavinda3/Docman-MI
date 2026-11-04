import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-request-file',
  templateUrl: './request-file.component.html',
  styleUrls: ['./request-file.component.scss']
})
export class RequestFileComponent implements OnInit {

  today =new Date();
    
     dataSourceTable: MatTableDataSource<Element>;
      dataSourcebyContractNo: MatTableDataSource<Element>;
      dataSourceTRNNo: MatTableDataSource<Element>;
      dataSourceLocation: MatTableDataSource<Element>;
      dataSourceMain: MatTableDataSource<Element>;
      dataSourceContractNo: MatTableDataSource<Element>;
      expandedElement: any;
     // @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
     // displayedColumns = ['doccode', 'docname', 'status', 'statusremark', 'cmtdate','Errors/CMT52','DOCIsuuedDate','DOCIsuuedtoName','IssuedRemark','DOCReturnDate'];
     displayedColumns = ['doccode', 'docname', 'status', 'statusremark', 'cmtdate','Errors/CMT52','DOCIsuuedDate','DOCIsuuedtoName','IssuedRemark','DOCReturnDate'];
     dataSourceTablenew: DocTableData[] = []; 
     displayedColumnsnew = ['Request_No', 'Request_Date','Request_User','Confirm','Approve','Transfer'];
     displayedLocColumnsnew = ['Location_Code', 'Location_Name'  ];
      displayedMainColumns = ['Contract_No', 'Vehicle_No' ,'Hirer_Name','Approve','Remark','Delete' ];
     req_no:string="";
     to_user:string="";
     from_name:string=""
     pendingreqNo:string=""
     request_no:string=""
     userInput = '';
     isDasabled_transferNo:boolean=true;
     isDasabled_Loc:boolean=true;
     isDasabled_contractNo:boolean=true;
     isDasabled_from_name:boolean=true;
     isDasabled_to_user:boolean=true;
     isDasabled_authchk:boolean=true
     isDasabled_transferedchk:boolean=true
     isDasabled_bsdchk:boolean=true
     isDasabled_Date:boolean=false;
     isDasabled_to_loc:boolean=true;
     isbuttonDelete:boolean=false;
     isAuthorize:boolean=false;
     isBSD:boolean=false;
     isTransfered:boolean=false
     isDasabled_Authoriser:boolean=true;
     isDasabled_remark:boolean=true;
     isDasabled_request_no:boolean=true;
     toLocation:string="";    
     fromLocation:string=""
     isPromptVisible = false;
     isPromptLocVisible = false;
     showPromptCard: boolean = false;
     additionalInput: string = '';  // Data for the prompt card
     selectedTrnNo: string = '';
     selectedLocationCode: string = '';
     Location :any=[];
     PermissionList :any=[];
     Authoriser :any=[];
     Main :any=[];
     location:string=""
     locationname:string=""
      DocList :any=[];
      ContractList:any=[];
      TRNNoList:any=[];
      strMsg:string="";
      AllDataList :any=[];
      VehicleTypeList:any=[]
      options: string[] = ['Option 1', 'Option 2', 'Option 3'];
      selectedValuedrp: string = '';
      hirername : string = "";
      newVehicleNo:string=""
      vehicle_type:string="";
      boolRights:boolean=false;
      isDasabled_btnApprove:boolean=false;
      activated_date:string="";
      dummyfile_creationdate:string="";
      credit_officer:string="";
      remark : string = "";
      rackno:string="";
      last_user:string="";
      strFileActRemark:string="";
      file_location:string=""
      strFileActstatus:string="";
      checkscaned:boolean=false;
      btnApproveLabel:string="All Approve"
      strAuthAssignee:string=""
      checkactive:boolean=false;
      loccode:string="";
      reciveddate:string=""
      loc:boolean=false;
      dmcode:string=""
      customValue=""
      contractNo : string = "";
      DataTable = new MatTableDataSource<any>();
      vehicleNo : string = "";
      customer_name : string = "";
      hirer_name : string = "";   
      product_code : string = "";
      product_redirectpath : string = ""
      isDasabled_btnPrint=false
      ischkApprove:boolean=false;
      searchQuery = '';
      page = 0;
      pageSize = 10;
      btnName:string = "Save";
      countryCtrl: FormControl;
      filteredCountry: Observable<any[]>;
      selectedValue: string | undefined;
      searchText: string = '';             // Holds the full contract list (paginated)
      filteredContractList: any[] = []; 
      DataTablenew:any=[];
      header:any=[];
      details:any=[];   
      isCardVisible=false
      isViewTable=false
      totalRecords = 1000000;
      status:string=""
      Authstatus:string=""
      Authorizeuser:string=""
      locCode:string=""
      strMode:string=""
      locationcode:string=""
      strType:string=""
      strUser:string=""
      isDasabled_btnNew=true
      isDasabled_btnEdit=true
      isDasabled_btnClear=true
      isDasabled_btnCancelRequest=false
      isDasabled_btnSave=false
      SZ_REQ_USER:string=""
      strFornName:string="frmRequestFile";
      reason:string=""
      isRejectShow:boolean=false
      newItem: string = '';
      items: string[] = [];
      Username:string=""
      isDasabled_btnReject=true
      constructor(private route: ActivatedRoute,private snackBar: MatSnackBar,private dragulaService: DragulaService,public securityService:SecurityService,private http: HttpClient) {
        //this.dataSource = new MatTableDataSource();
      
        this.dataSourceTable = new MatTableDataSource();
        this.dataSourceTRNNo = new MatTableDataSource();
        this.dataSourceLocation = new MatTableDataSource();
        this.dataSourceMain = new MatTableDataSource();
        this.dataSourcebyContractNo = new MatTableDataSource();
        this.dataSourceContractNo=new MatTableDataSource();
        this.countryCtrl = new FormControl();
        this.filteredCountry = this.countryCtrl.valueChanges.pipe(
          startWith(''),
          map((country) =>
            country ? this.filtercountry(country) : this.ContractList.slice()
          )
        );
      }
     
     applyFilter(event: Event) {
       const filterValue = (event.target as HTMLInputElement).value;
       this.dataSourceTRNNo.filter = filterValue.trim().toLowerCase();
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

  deleteRow(element: any) {
  const data = this.DataTable.data;
  const index = data.indexOf(element);
  if (index > -1) {
    data.splice(index, 1);  // Remove the row from data array
    this.DataTable.data = data;  // Update the datasource
  }
}
  
  submitValue() {
    this.securityService.GetDataContractinRequestFile(this.searchText, true).subscribe(
      (data: any) => {
        const receivedData = Array.isArray(data) ? data : [data];

        // Display message if strContractNo is empty/null
        if (!receivedData[0]?.strContractNo) {
          const msg = receivedData[0]?.strmsg || 'No contract found.';
          this.snackBar.open(msg, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning'],
            verticalPosition: 'top'
          });
        } else {
          const currentData = this.DataTable.data || [];

          // ✅ Check if already exists by contract number (or vehicle no)
          const alreadyExists = currentData.some(
            (row: any) => row.strContractNo === receivedData[0].strContractNo
          );

          if (alreadyExists) {
            this.snackBar.open('This contract already exists in the table.', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-warning'],
              verticalPosition: 'top'
            });
          } else {
            // Append if new
            this.DataTable.data = [...currentData, ...receivedData];
          }
        }

        // Clear form fields after success
        this.vehicleNos = [];
        this.hirer_name = "";
        this.searchText = "";
      },
      (error) => {
        console.error('Error fetching doc types:', error);
        this.snackBar.open('Failed to fetch contract data.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          verticalPosition: 'top'
        });
      }
    );
  }


     onRowClicked(row: any) {
       this.req_no = row.strReqNo; // Assign TRN_No to textbox
       this.isPromptVisible = false;       
       this.onLoadMain("Exist");
       this.ischkApprove=true
       //this.locCode=this.location
       //this.LoadAuthorizer();
     }
     onRowLocClicked(row: any) {
      this.location = row.strLocCode; // Assign TRN_No to textbox
      this.locationname=row.strLocName;
      this.header.SZLOC_CODE = row.strLocCode;
      this.isPromptLocVisible = false;
      this.LoadAuthorizer()
    }
    @ViewChild('paginator1') set paginator1(v: MatPaginator) {
      this.dataSourceTRNNo.paginator = v;
    }
  
    @ViewChild('paginator2') set paginator2(v: MatPaginator) {
      this.dataSourceLocation.paginator = v;
    }

    @ViewChild('paginator3') set paginator3(v: MatPaginator) {
      this.dataSourceMain.paginator = v;
    }
    @ViewChild('paginator4') set paginator4(v: MatPaginator) {
      this.dataSourceMain.paginator = v;
    }  
      ngAfterViewInit() {
        // this.dataSourceTRNNo.paginator = this.paginator1;
        // this.dataSourceLocation.paginator = this.paginator2;
      }
      
      private searchSubject: Subject<string> = new Subject<string>();
      ngOnInit(): void {
        
        const id = this.route.snapshot.paramMap.get('id');
        if (id != null && id != "") {
          this.req_no = id; // Assign TRN_No to textbox
          this.pendingreqNo=id
          this.isPromptVisible = false;       
          this.isBSD = true;   
          this.ischkApprove=false
          this.onLoadMain("Pending");          
          this.isDasabled_request_no = true;
          this.isRejectShow=true;
        }
           this.securityService.GetIsUserActive().subscribe(data => {
            this.Username = data.username;         
        });
        setInterval(() => { this.today = new Date();}, 1000);
    
        this.onLoadVehicleType()
        this.reciveddate=new Date().toISOString().split('T')[0];
        this.onLoadLocation();
        //this.onLoad();
        this.searchSubject.pipe(
         debounceTime(500),                     // Wait 500ms after the user stops typing
         distinctUntilChanged(),                // Only trigger if search query has changed
     
       ).subscribe(data => {
         // Once the observable emits the data, update your filtered list
         this.filteredContractList = this.prepareReqNoList(data);
        // this.customer_name=this.filteredContractList[0].Customer_Name
       });
       
      }
    
    //   ngAfterViewInit(): void {
    //    //this.dataSource.sort = this.sort;
    //   this.dataSourceTRNNo.paginator = this.paginator;
    // }
    fnSetMode(pMode:string){

    }
 async newClick() {  
    const hasPermission = await this.PermissionCheck("NEW");
    this.PermissionCheck("NEW")
    if (hasPermission) {
      this.ischkApprove = true
      this.ngOnInit();
      this.isDasabled_transferNo = true;
      this.reciveddate = this.today.toISOString().split('T')[0];
      this.convertDate(this.reciveddate)
      this.isDasabled_from_name = false;
      this.isDasabled_to_user = false;
      this.isDasabled_Date = true;
      this.isDasabled_to_loc = false;
      this.isDasabled_Authoriser = false;
      this.fnEnableControl(false)
      this.isDasabled_remark = false;
      this.isDasabled_request_no = true;
      this.isDasabled_contractNo = false;
      this.isDasabled_authchk = true;
      this.isDasabled_Loc = false;
      this.req_no = "xx"
      this.strMode = "New";
      this.strType = "- New"
      this.isDasabled_btnNew = false
      this.isDasabled_btnEdit = false
      this.isDasabled_btnClear = true
      this.isDasabled_btnSave = true
      this.header.SZ_REQ_USER = this.Username;
      this.isDasabled_transferNo=true
    }
    else {
        // ❌ Permission denied
        this.snackBar.open('Permission Denied!!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
      }
  }
  
     editClick(){
       this.ischkApprove=true
       this.isDasabled_transferNo=false;
       this.isDasabled_from_name=false;
       this.isDasabled_to_user=true;
       this.isDasabled_Date=true;
       this.fnEnableControl(false)
       this.isDasabled_to_loc=false;
       this.isDasabled_Authoriser=false;
       this.isDasabled_remark=false;
       this.isDasabled_request_no=true;
       this.isDasabled_contractNo=true;
       this.isDasabled_Loc=true;
       this.isDasabled_btnNew=false 
       this.isDasabled_btnEdit=false
       this.isDasabled_btnClear=true
       this.isDasabled_btnSave=true
       this.isDasabled_authchk=false;
       this.strMode="Edit";
       this.strType="- Edit"
     }
    
     onKeyPress(event: KeyboardEvent) {
       if (event.key === 'Enter') {
         // this.loadItems({pageIndex: 0, pageSize: 10,
         //   length: 0});
         this.loadItems();
         // Show the prompt card when Enter key is pressed
         this.isPromptVisible = true;
 
       }
     }
     onKeyPressLoc(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        // this.loadItems({pageIndex: 0, pageSize: 10,
        //   length: 0});
        //this.loadItems();
        // Show the prompt card when Enter key is pressed
        this.isPromptLocVisible = true;

      }
    }
     submitPrompt() {
       if (this.additionalInput) {
         alert(`You entered: ${this.additionalInput}`);
         this.closePrompt(); // Close the prompt after submission
       } else {
         alert('Please provide more details!');
       }
     }
     onDoubleClick() {
       this.loadItems();
       this.isPromptVisible = true;
     }
     onDoubleLocClick() {
      this.loadItems();
      this.isPromptLocVisible = true;
    }
     closePrompt() {
       this.isPromptVisible = false; // Hide the custom prompt
       this.userInput = ''; // Clear the input field
     }
     closeLocPrompt() {
      this.isPromptLocVisible = false; // Hide the custom prompt
      this.userInput = ''; // Clear the input field
    }
     onLoadLocation(){
       this.securityService.GetLoc().then(data => {
         this.Location = this.prepareLocationList(data);
         this.dataSourceLocation.data = this.Location;
       }, error => {
         console.error('Error fetching doc types:', error);
       });
     }
     LoadAuthorizer(){     
      if(this.strMode=="New"){
        this.locCode=this.location;
      }
      else{
        this.locCode=this.locationcode
      }
      
      this.securityService.GetAuthorisers(this.locCode).subscribe(data => {
        this.Authoriser = this.prepareAuthoriserList(data);
      }, error => {
        console.error('Error fetching doc types:', error);
      });
    }
     onLoadMain(strMethod:string){
      this.securityService.GetRequestFileMain(this.req_no,"REQ").subscribe(data => {   
        this.DataTable.data= this.prepareDetailsList(data[0].Details);    
        //this.details = this.prepareDetailsList(data[0].Details);
        this.dataSourceMain.data = this.details;
        this.header=data[0].Header;  
        this.req_no= this.header.SZ_REQ_NO;    
        this.isDasabled_transferNo=true;
        this.reciveddate = this.header.DT_REQ_DATE?.slice(0, 10);
        this.isAuthorize=this.header.BOOL_CONFIRM
        this.isDasabled_authchk=false
        this.locationcode=this.header.SZLOC_CODE
        this.isDasabled_btnPrint=true
        this.Authorizeuser = this.header.SZ_AUTH_ASSIGNEE?.toUpperCase();
        this.LoadAuthorizer();
        //this.header.BOOL_CONFIRM = chkConfirm.Checked ? 1 : 0;
        this.status = "Entered by " + this.header.SZ_ENTER_USER + " @ " +this.header.DT_REQ_DATE?.slice(0, 10) ;
        if (this.header.SZ_LASTUPDATE_USER != "")
        {
          this.status += "\nLast Updated by " + this.header.SZ_LASTUPDATE_USER + " @ " + this.header.DT_LAST_UPDATE?.slice(0, 10);
          
        }
        
        if (this.header.BOOL_CONFIRM)
          {
              this.Authstatus =this.header.DT_CONFIRM?.slice(0, 10) + "\n @" + this.header.SZ_CONFIRM_TIME;
              this.isDasabled_btnCancelRequest = false;                   
              this.isDasabled_btnSave = false;       
              this.isDasabled_btnNew = false;  
              this.isDasabled_btnEdit = false;                               
              this.isDasabled_Authoriser = true; 
              this.fnEnableControl(true)             
          }
          else
          {
             this.isDasabled_Authoriser = false;
             this.isDasabled_btnCancelRequest= true;
              if (this.header.BOOL_CANCEL)
              {
                 this.isDasabled_Authoriser = true;
                 this.fnEnableControl(true) 
                 this.isDasabled_btnSave = false;         
                  this.isDasabled_btnCancelRequest = false;              
                  this.status += "<br>Canceled by " + this.header.SZ_CANCEL_USER + " @ " + this.header.DT_CANCEL_DATE?.slice(0, 10) ;
              }
              else
              {
                 this.isDasabled_btnCancelRequest = true;
                 this.isDasabled_btnSave = true;
              }
              if (this.header.BOOL_BSD_REJECT)
              {
                this.isDasabled_btnSave = false;
                this.isbuttonDelete=true
                this.isDasabled_Authoriser = true;
                this.isDasabled_authchk = true;
                this.status += "<br>Rejected by " + this.header.SZ_BSD_REJECT_USER + " Reason:" +this.header.SZ_BSD_REJECT_REASON + " @ " + this.header.DT_BSD_REJECT_DATE?.slice(0, 10);
                this.status += " <br> Total files " +  this.DataTable.data.length;
              }

          }
          if (this.header.BOOL_APPROVE)
          {
              this.status += "<br>Approved by " + this.header.SZ_APPR_USER + " @ " + this.header.DT_APPR_DATE?.slice(0, 10) + " time : " + this.header.SZ_BSD_APPR_TIME;
              this.status += " <br> Total files " +  this.DataTable.data.length;
          }
          if(this.header.BOOL_TRANSFER)
          {
              this.isbuttonDelete=true
              this.status += "<br>Transfer by " + this.header.SZ_TRANS_USER + " @ " +  this.header.DT_TRANS_DATE?.slice(0, 10) ;
              this.status +="<br>File Count "+this.DataTable.data.length
          }
          this.strAuthAssignee=this.header.SZ_AUTH_ASSIGNEE;
         
          if(strMethod=="Exist"){
            this.isBSD = this.header.BOOL_APPROVE;
           // this.ischkApprove=true;
          }
          
          this.isTransfered = this.header.BOOL_TRANSFER;
          if (this.pendingreqNo != "")
          {              
              this.isDasabled_btnApprove = true;
              this.isDasabled_bsdchk = true;
              this.isbuttonDelete=true;
              //this.isBSD = true;
              this.isDasabled_btnSave = true;
              this.isDasabled_btnEdit = false;
              this.isDasabled_btnNew = false;
             // this.ischkApprove=false;
              //this.isRejectShow=false;
          }
     }, error => {
       console.error('Error fetching doc types:', error);
     });
     }
     prepareMainList(rows:any) {
      const res=[];
      for(let i=0;i<rows.length;i++) {
        res.push({
          strContract_No:rows[i].strLocationCode,
          strVehicle_No:rows[i].strLocation,
          strHirer_Name:rows[i].strLocationCode,
          strApprove:rows[i].strLocation,
          strRemark:rows[i].strLocation,
          //ProductRedirectPath:rows[i].strProductRedirectPath
        });
      }
      return res;
    }
   allApprove() {
  if (this.btnApproveLabel === "All Approve") {
    this.DataTable.data.forEach((item: any) => {
      item.CONT_APPROVE = true;
    });
    this.btnApproveLabel = "Unapprove All";
    this.ischkApprove = true; // disable checkboxes
  } else {
    this.DataTable.data.forEach((item: any) => {
      item.CONT_APPROVE = false;
    });
    this.btnApproveLabel = "All Approve";
    this.ischkApprove = false; // enable checkboxes
  }

  this.DataTable._updateChangeSubscription();
}
 PrintReport() {
      const REQNO = this.req_no;
      const userId = 'docman';

     // const url = `http://localhost:44368/api/SecurityModuleAPI/getReqNotereport?REQNO=${encodeURIComponent(REQNO)}`;
      const url = `http://192.168.100.51:81/DocmanLogin/api/SecurityModuleAPI/getReqNotereport?REQNO=${encodeURIComponent(REQNO)}`;
      window.open(url, '_blank');
    }
   fnEnableControl(pVal:boolean){    
    this.isDasabled_transferNo = pVal;
    this.isDasabled_Loc = pVal;
    this.isDasabled_Date = true;
    this.isDasabled_contractNo = pVal;
    this.isDasabled_authchk = pVal;
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
     prepareAuthoriserList(rows:any) {
      const res=[];
      for(let i=0;i<rows.length;i++) {
        res.push({
          SZLOGINNAME:rows[i].strLoginName,
          SZUSERNAME:rows[i].strUserName
          //ProductRedirectPath:rows[i].strProductRedirectPath
        });
      }
      return res;
    }
     prepareDetailsList(rows:any) {
      const res=[];
      for(let i=0;i<rows.length;i++) {
        res.push({
          strContractNo:rows[i].SZCONTRACTNO,
          strVehicleNo:rows[i].SZVEHICLENO,
          strCustName:rows[i].SZHIRER,
          CONT_APPROVE:rows[i].BOOL_CONT_APPROVE,
          REMARK:rows[i].SZ_REMARK,

          //ProductRedirectPath:rows[i].strProductRedirectPath
        });
      }
      return res;
    }

      Clear(){
        this.req_no="";
        this.reciveddate="";
        this.location = "";
        this.header.SZ_REQ_USER=""
        this.searchText=""
        this.details=[];
        this.dataSourceMain.data = this.details;
        this.isAuthorize=false
        this.Authorizeuser=""
        this.isBSD=false
        this.isTransfered=false
        this.status=""
        this.Authoriser=[]
        this.btnName="Save";
        this.Authstatus=""
        this.header.SZLOC_CODE=""
        this.header.SZLOC_NAME=""
        this.strType=""
        this.isDasabled_btnNew=true
        this.isDasabled_btnEdit=true
        this.isDasabled_btnClear=true
        this.isDasabled_btnSave=false
        this.vehicleNo=""
        this.hirer_name=""
        this.DataTable.data=[]
        this.isDasabled_btnPrint=false
        this.isDasabled_btnCancelRequest=false
      }
    
   
     // loadItems(event: PageEvent): void {
     //   this.securityService.GetTrnNo(this.searchQuery, event.pageIndex, event.pageSize).subscribe(data => {
     //     this.totalRecords = data.totalRecords; 
     //     this.TRNNoList = this.prepareTrnNoList(data);
     //     this.dataSourceTRNNo.data = this.TRNNoList;
     //   });
     // }
     loadItems(){
       this.securityService.GetReqNo("REQ").then(data=>{
         this.TRNNoList = this.prepareReqNoList(data);
         this.dataSourceTRNNo.data = this.TRNNoList;
       });
     }
    //  loadLocation(){
    //   this.securityService.GetLoc().then(data=>{
    //     this.TRNNoList = this.prepareReqNoList(data);
    //     this.dataSourceTRNNo.data = this.TRNNoList;
    //   });
    // }
     
     // Triggered on user input
onCheckboxChange(event: Event): void {
  const isChecked = (event.target as HTMLInputElement).checked;
   //this.strUser='ISHARA.C'
// alert("aUTHORISEUSER : "+this.Authorizeuser +"|"+"this.strAuthAssignee:"+this.strAuthAssignee);
  if (this.Authorizeuser === "") {
    // Prevent selection by unchecking
    this.isAuthorize = false;

    // Optionally revert checkbox's visual state manually (extra safe step)
    (event.target as HTMLInputElement).checked = false;

    // Show warning
    this.snackBar.open("Authorizer is not selected", 'Close', {
      duration: 3000,
      panelClass: ['snackbar-warning'],
      verticalPosition: 'top'
    });  
  } 
  else if(this.Username!=this.strAuthAssignee){
    this.isAuthorize = false;
    (event.target as HTMLInputElement).checked = false;
    this.snackBar.open("You have not been assign as the authorizer in this request.", 'Close', {
      duration: 3000,
      panelClass: ['snackbar-warning'],
      verticalPosition: 'top'
    });        
  }
  
  else if(this.Authorizeuser!=this.strAuthAssignee){
    this.isAuthorize = false;
    (event.target as HTMLInputElement).checked = false;
    this.snackBar.open("You have not been assign as the authorizer in this request1.", 'Close', {
      duration: 3000,
      panelClass: ['snackbar-warning'],
      verticalPosition: 'top'
    });        
  }
  else {
    this.isAuthorize = isChecked;
  }
}
     onSearch(): void {
       this.req_no; // Assign TRN_No to textbox
       this.isPromptVisible = false;       
       this.onLoadMain("Exist");
       this.ischkApprove=true
     }
   
    
    //  onLoadData(selectedValue: string):void{
    //    this.securityService.GetDataContract(selectedValue).subscribe(data => {        
    //      this.hirer_name=data[0].strCustName;
    //      this.vehicleNo=data[0].strVehicleNo
   
    //    }, error => {
    //      console.error('Error fetching doc types:', error);
    //    });
    //  }
    vehicleNos: string[] = [];
    onLoadData(selectedValue: string): void {

   this.securityService.GetDataContract(selectedValue).subscribe(data => {        

            if (data && data.length > 0) {

                this.hirer_name = data[0].strCustName =='' ?data[1].strCustName:data[0].strCustName;

               // Get all vehicle numbers
               this.vehicleNos = data.map((x: any) => x.strVehicleNo);

               console.log(this.vehicleNo);
            }

         },
         error => {
            console.error('Error fetching contract data:', error);
         }
      );
}
    async clickSavebutton() {
    const hasPermission = await this.PermissionCheck("NEW");
    this.PermissionCheck("NEW")
    if (hasPermission) {
      //this.PermissionCheck("SAVE")
     // if (this.boolRights == true) {
        this.SaveReqFileDetails("Save")
      }
    }
     clickCancelRequestbutton(){
      this.fnEnableControl(true)
      this.SaveReqFileDetails("Cancel")
     }
     clickRejectbutton(){
      this.SaveReqFileDetails("Reject")
     }
  SaveReqFileDetails(strModeType: string) {
    if (this.Validate() == true) {

      var reqFileData = { "strReqNo": this.req_no?.toUpperCase(), "strReqDate": this.reciveddate, "strLocation": this.location, "strLocationCode": this.header.SZLOC_CODE, "strReqUser": this.header.SZ_REQ_USER?.toUpperCase(), "strHirerName": this.hirer_name?.toUpperCase(), "strAuthorizer": this.Authorizeuser?.toUpperCase(), "boolAuthorize": this.isAuthorize, "strAuthStatus": this.Authstatus?.toUpperCase(), "boolBsd": this.isBSD, "boolTransfered": this.isTransfered, "strReasonReject": this.reason?.toUpperCase() };
      // this.securityService.AddDocHeader(DocData,this.DocList).subscribe(c=>{

      this.securityService.AddreqFile(reqFileData, this.DataTable.data, strModeType, this.Username)
        .subscribe({
          next: (response) => {
            this.snackBar.open(response, 'Close', {
              duration: 24000,
              panelClass: ['snackbar-success'],
              verticalPosition: 'top'
            });

            this.isDasabled_btnNew = true;
            this.isDasabled_btnEdit = true;
            this.Clear();
          },
          error: (error) => {
            const errorMsg = error.error.ExceptionMessage || 'An unexpected error occurred';

            this.snackBar.open(errorMsg, 'Close', {
              duration: 4000,
              panelClass: ['snackbar-warning'],
              verticalPosition: 'top'
            });

          }
        });
        
    }
    
  }
      
     Validate(){
      if(this.req_no==""){
         this.snackBar.open('Invalid Request No', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning']
          });
          return false
        }
      else if(this.header.SZ_REQ_USER==""){
         this.snackBar.open('Invalid Request User', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning']
          });
           return false
      }
      else if(this.header.SZLOC_CODE==""){
         this.snackBar.open('Invalid Request Location', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning']
          });
           return false
      }
      else if(this.DataTable.data.length == 0){
         this.snackBar.open('Enter file detail', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning']
          });
           return false
      }
      else if(this.Authorizeuser==""||this.Authorizeuser==null){
         this.snackBar.open('Enter Auth User', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning']
          });
           return false
      }
      return true
     }
     onGetAllData():void{
       this.securityService.GetAllDataList(this.vehicleNo,this.contractNo,"").subscribe(data => {
           this.AllDataList = data;   
           this.hirername=this.AllDataList[0].strHirer
           this.vehicle_type=this.AllDataList[0].strVehicleType
          // this.activated_date= this.AllDataList[0].strActDate 
          
           //this.dummyfile_creationdate=this.AllDataList[0].strDumFCreationDate==""?"":new Date(this.AllDataList[0].strDumFCreationDate).toISOString().split('T')[0];
          // this.dummyfile_creationdate=this.AllDataList[0].strDumFCreationDate==""?"":new Date(this.AllDataList[0].strDumFCreationDate).toISOString().split('T')[0];
          this.convertdummyfile_creationdate(this.AllDataList[0]?.strDumFCreationDate)
          this.credit_officer=this.AllDataList[0].strCrdOfficer
           this.remark =this.AllDataList[0].strRemark
           this.rackno=this.AllDataList[0].strRackNo
           this.last_user=this.AllDataList[0].strLastUser
           this.strFileActRemark=this.AllDataList[0].strFileActRemark
           this.strFileActstatus=this.AllDataList[0].strFileActStatus
           this.checkscaned=this.AllDataList[0].boolchkScanned
           this.checkactive=this.AllDataList[0].boolchkActive
           this.loccode=this.AllDataList[0].strLocCode
           this.vehicle_type=this.AllDataList[0].strVehicleType
           //this.reciveddate=new Date(this.AllDataList[0].strReceivedDate).toISOString().split('T')[0];
           this.convertreciveddate(this.AllDataList[0]?.strReceivedDate)
           this.convertDate(this.AllDataList[0]?.strActDate)
           this.loc=this.AllDataList[0].boolLoc
           this.dmcode=this.AllDataList[0].strDmcode
           // this.onLoadTable({ pageIndex: 0, pageSize: 10,
           //   length: 0});
       }, error => {
         console.error('Error fetching doc types:', error);
       });
       
     }
     convertDate(strActDate:string){
       if (strActDate) {
         // Split the date and time (DD/MM/YYYY and AM/PM part)
         const [dateStr, timeStr] = strActDate.split(' ');
   
         // Split date into components (DD/MM/YYYY)
         const [day, month, year] = dateStr.split('/');
   
         // Create a new Date object using the components
         const formattedDate = new Date(
           parseInt(year),  // year
           parseInt(month) - 1,  // month (JavaScript uses 0-based months)
           parseInt(day)  // day
         );
   
         // Check if the date is valid
         if (!isNaN(formattedDate.getTime())) {
           // Convert the date to YYYY-MM-DD format
           this.activated_date = formattedDate.toISOString().split('T')[0];
           console.log('Formatted activated_date:', this.activated_date);
         } else {
           console.error('Invalid date format:', strActDate);
           this.activated_date = '';  // Set default or handle error
         }
       } else {
         console.error('strActDate is null or undefined');
         this.activated_date = '';  // Set default value or handle missing date
       }
     }
     convertdummyfile_creationdate(strDumFCreationDate:string){
       if (strDumFCreationDate) {
         // Split the date and time (DD/MM/YYYY and AM/PM part)
         const [dateStr, timeStr] = strDumFCreationDate.split(' ');
   
         // Split date into components (DD/MM/YYYY)
         const [day, month, year] = dateStr.split('/');
   
         // Create a new Date object using the components
         const formattedDate = new Date(
           parseInt(year),  // year
           parseInt(month) - 1,  // month (JavaScript uses 0-based months)
           parseInt(day)  // day
         );
   
         // Check if the date is valid
         if (!isNaN(formattedDate.getTime())) {
           // Convert the date to YYYY-MM-DD format
           this.dummyfile_creationdate = formattedDate.toISOString().split('T')[0];
           console.log('Formatted activated_date:', this.activated_date);
         } else {
           console.error('Invalid date format:', strDumFCreationDate);
           this.dummyfile_creationdate = '';  // Set default or handle error
         }
       } else {
         console.error('strActDate is null or undefined');
         this.dummyfile_creationdate = '';  // Set default value or handle missing date
       }
     }
     convertreciveddate(strReceivedDate:string){
       if (strReceivedDate) {
         // Split the date and time (DD/MM/YYYY and AM/PM part)
         const [dateStr, timeStr] = strReceivedDate.split(' ');
   
         // Split date into components (DD/MM/YYYY)
         const [day, month, year] = dateStr.split('/');
   
         // Create a new Date object using the components
         const formattedDate = new Date(
           parseInt(year),  // year
           parseInt(month) - 1,  // month (JavaScript uses 0-based months)
           parseInt(day)  // day
         );
   
         // Check if the date is valid
         if (!isNaN(formattedDate.getTime())) {
           // Convert the date to YYYY-MM-DD format
           this.reciveddate = formattedDate.toISOString().split('T')[0];
           console.log('Formatted activated_date:', this.activated_date);
         } else {
           console.error('Invalid date format:', strReceivedDate);
           this.reciveddate = '';  // Set default or handle error
         }
       } else {
         console.error('strActDate is null or undefined');
         this.reciveddate = '';  // Set default value or handle missing date
       }
     }
     onLoadVehicleType(){
       this.securityService.GetVehicleTypes().subscribe(data => {
         this.VehicleTypeList = this.prepareVehicleTypeList(data);
       });
     }
     // onLoadTable(event: PageEvent): void {
     //   this.securityService.GetDocTable(this.dmcode).subscribe(data => {
     //      this.DocList = this.prepareLoadTable(data);
     //      this.dataSourceTable.data = this.DocList;
     //   }, error => {
     //     console.error('Error fetching doc types:', error);
     //   });
     // }
    
    
     prepareReqNoList(rows:any) {
       const res=[];
       for(let i=0;i<rows.length;i++) {
         res.push({
          strReqNo:rows[i].strReqNo,
          strReqDate:rows[i].strReqDate,
          strReqUser:rows[i].strReqUser,
          iConfirm:rows[i].iConfirm,
          iApprove:rows[i].iApprove,
          iTransfer:rows[i].iTransfer
         });
       }
       return res;
     }

     prepareVehicleTypeList(rows:any) {
       const res=[];
       for(let i=0;i<rows.length;i++) {
         res.push({
           ISeq:rows[i].iseq,
           Vehicle_type:rows[i].strVehicleType
         });
       }
       return res;
     }
     prepareDataList(rows:any) {
       const res=[];
       for(let i=0;i<rows.length;i++) {
         res.push({
           VehicleNo:rows[i].strVehicleNo,
           CustomerName:rows[i].strCustName
         });
       }
       return res;
     }
     prepareLoadTable(rows:any) {
       const res=[];
       for(let i=0;i<rows.length;i++) {
         res.push({
           DocCode:rows[i].strDocCode,
           DocName:rows[i].strDocName,
           Status:rows[i].strStatus,
           RemarkofFile:rows[i].strRemarkofFile,
           CmtDate:rows[i].strCmtDate,
           Errors:rows[i].strErrors,
           DOCIsuuedDate:rows[i].strDOCIssuedDate,
           IssuedToName:rows[i].strIssuedToName,
           IssuedRemark:rows[i].strIssuedRemark,
           DOCReturnDate:rows[i].strDOCReturnDate
         });
       }
       return res;
     }
     filtercountry(name: string) {
       let arr = this.ContractList.filter(
         (country: { ContractNo: string; }) => country.ContractNo.toLowerCase().indexOf(name.toLowerCase()) === 0
       );
   
       return arr.length ? arr : [{ name: 'No Item found', code: 'null' }];
     }
     onSelectionChange(value: string) {
       if (value !== 'custom') {
         this.customValue = ''; // Clear custom input if another option is selected
       }
     }
     newVehicleenter(){
       if(this.vehicleNo==="custom"){
         this.selectedValuedrp="custom"
       }
     }
     updateValue() {
       this.selectedValuedrp = this.customValue; // Sync custom input with selected value
     }
    }
   
   
    export interface Product {
      iProductID: number;
      strProductName: string;
      strProductCode: string;
      strProductRedirectPath:String;
    }
    export interface DatabyContractNo {
     strVehicleNo: string;
     strCustName:string;
   }
   export interface DataList {
     // strHirerName: string;
     // strVehicleType: string;
     // strActivatedDate: string;
     // strDummyFileCreateDate: string;
     // strCreditOfficer: string;
     // strRemarks: string;
   }
   export interface Element {
     name: string;
     position: number;
     weight: number;
     symbol: string;
     fav: string;
   }
   export interface VehicleList {
     seq: number;
     vehiclt_type: number;
   }
   export interface reqFileDate {
     strContractNo:string;
     CONT_APPROVE:number;
     strVehicleNo:string;
     strHirer:string;
     strActDate:string;
     strFileActRemark:string;
     strFileIssRemark:string;
     strReceivedDate:string;
     strDumFCreationDate:string
     strCrdOfficer:string
     strVehicleType:string;
     boolChkActive:boolean
     boolchkScanned:boolean
   }
   
   export interface requestFileData {
    strReqNo:string
    strReqDate:string;
    strLocation:string;
    strLocationCode:string;
    strReqUser:string;
    strHirerName:string;
    boolAuthorize:boolean;
    strAuthorizer:string
    strAuthStatus:string
    boolBsd:boolean;
    boolTransfered:boolean
    strReasonReject:string
  }
   export interface DocTableData {
     DocCode: string;
     DocName: string;
     Status: string;
     RemarkofFile: string;
     DOCIsuuedDate: string; // Or Date type, depending on your needs
     Errors: string;
     DOCReturnDate: string;
     IssuedToName: string;
     IssuedRemark: string;
     cmtDate:string;
   }

   export interface Location {
     strLocCode: string;
     strLocName: string;
   }