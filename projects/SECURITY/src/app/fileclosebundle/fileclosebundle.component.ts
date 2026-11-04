import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fileclosebundle',
  templateUrl: './fileclosebundle.component.html',
  styleUrls: ['./fileclosebundle.component.scss']
})
export class FileclosebundleComponent implements OnInit {

  today =new Date();
  
   dataSourceTable: MatTableDataSource<Element>;
    dataSourcebyContractNo: MatTableDataSource<Element>;
    expandedElement: any;
 
   // displayedColumns = ['doccode', 'docname', 'status', 'statusremark', 'cmtdate','Errors/CMT52','DOCIsuuedDate','DOCIsuuedtoName','IssuedRemark','DOCReturnDate'];
   displayedColumns = ['seqno', 'contractno', 'hirername', 'vehicleno', 'changestatus', 'actions'];
   dataSourceTablenew: DocTableData[] = []; 
    displayedColumnsnew = ['Batch_No', 'Date', 'EnterUser', 'Complete'];
    DocList :any=[];
    ContractList:any=[];
    AllDataList :any=[];
    VehicleTypeList:any=[]
    options: string[] = ['Option 1', 'Option 2', 'Option 3'];
    selectedValuedrp: string = '';
    batchNo : string = "";
    newVehicleNo:string=""
    vehicle_type:string="";
    dataSourceBatchNo: MatTableDataSource<Element>;
    activated_date:string="";
    dummyfile_creationdate:string="";
    credit_officer:string="";
    Username:string=""
    lblBatchInfo:string=""
    remark : string = "";
    rackno:string="";
    last_user:string="";
    strFileActRemark:string="";
    file_location:string=""
    strFileActstatus:string="";
    checkscaned:boolean=false;
    selectedBatchNo: string = '';
    checkactive:boolean=false;
    loccode:string="";
    reciveddate:string=""
    loc:boolean=false;
    cboBundleNo:boolean=true;
    dmcode:string=""
    customValue=""
    contractNo : string = "";
    bundleNo: string = "";
    vehicleNo : string = "";
    isDasabled_contractNo:boolean=true
    customer_name : string = "";
    boolCompleteBundle:boolean = false;
    product_code : string = "";
    product_redirectpath : string = ""
    searchQuery = '';
    page = 0;
    pageSize = 10;
    BTList: any = [];
    DList: any = [];
    btnName:string = "Save";
    countryCtrl: FormControl;
    boolBatchComple=false
    filteredCountry: Observable<any[]>;
    selectedValue: string | undefined;
    contrctNo: string = '';             // Holds the full contract list (paginated)
    filteredContractList: any[] = []; 
    DataTable :any=[];     
    isCardVisible=false
    isViewTable=false
    totalRecords = 1000000;
    fileLocation:string="BSD"
    Location :any=[];
    strEnterUser:string = "";
    strStartDate:string = "";
    boolReopenBundle:boolean = false;
    isDasabled_fileloc:boolean=true
    isPromptVisible = false;
    isDasabled_btnNew:boolean=true
    BatchNoList:any=[];
    Bundle: any = [];
    BundleDetails: any = [];
    btnResetBundle=true
     nxtBundleNo:number= 0;
    lblBundleInfo:string=""
    lblReopen:string=""
    isvisibleSavebtn=true
    isDasabled_btnEdit=true
    date: string = new Date().toISOString().split('T')[0];
    isDasabled_btnDelete=false
    dtpBatchDate=false
    isDasabled_BatchNo=false
    isDisableCompleteBundle=false
    Bundlestatus="Load Bundle"
    chkComplete: boolean = false;
    btnType:string=""
    lblMode: string = "CLOSE FILE BUNDLE";
    isreadonlyContract=true
    str:String = "";
    strMode: string = "";
    isvisibleSelectVehNoCmb=true
    isvisibleSelectVehNoText=false
    constructor(private snackBar: MatSnackBar,private dragulaService: DragulaService,public securityService:SecurityService,private http: HttpClient) {
      //this.dataSource = new MatTableDataSource()
       this.dataSource = new MatTableDataSource();
      this.dataSourceBatchNo = new MatTableDataSource();
      this.dataSourceTable = new MatTableDataSource();
      this.dataSourcebyContractNo = new MatTableDataSource();
      this.countryCtrl = new FormControl();
      this.filteredCountry = this.countryCtrl.valueChanges.pipe(
        startWith(''),
        map((country) =>
          country ? this.filtercountry(country) : this.ContractList.slice()
        )
      );
    }
     //dataSource: MatTableDataSource<Element>;
     dataSource = new MatTableDataSource<any>();
    applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
   NewClick(){
     this.Clear();
     this.isDasabled_btnNew=false
     this.isDasabled_btnEdit=false
     this.isvisibleSavebtn=true
     this.strFileActstatus="Active"
     this.isCardVisible=true
     this.checkactive=true
     this.isreadonlyContract=false
     this.btnType="New"
     this.isvisibleSelectVehNoCmb=false
     this.isvisibleSelectVehNoText=true
     this.last_user="New"
   }
   EditClick(){
     this.Clear();
     this.isDasabled_btnNew=false
     this.isvisibleSavebtn=true
     this.isDasabled_btnEdit=false
     //this.strFileActstatus="Active"
     //this.isCardVisible=true
     //this.checkactive=true
     this.isreadonlyContract=false
     this.isvisibleSelectVehNoCmb=true
     this.isvisibleSelectVehNoText=false
     this.btnType="Edit"
   }
   //  applyFilter(event: Event) {
   //    const filterValue = (event.target as HTMLInputElement).value;
   //    this.dataSource.filter = filterValue.trim().toLowerCase();
   //  }
  
    @ViewChild(MatPaginator, { static: false })
    set paginator(v: MatPaginator) {
      this.dataSourceTable.paginator = v;
    }
   @ViewChild('paginator2') set paginator2(v: MatPaginator) {
    this.dataSource.paginator = v;
  }
    private searchSubject: Subject<string> = new Subject<string>();
    ngOnInit(): void {
      setInterval(() => { this.today = new Date(); }, 1000);
      this.onLoadVehicleType()
      this.securityService.GetIsUserActive().subscribe(data => {
        this.Username = data.username;
      });
      this.onLoadLocation()     
      this.date = new Date().toISOString().split('T')[0];
      //this.onLoad();
      this.searchSubject.pipe(
       debounceTime(500),                     // Wait 500ms after the user stops typing
       distinctUntilChanged(),                // Only trigger if search query has changed
       switchMap(contrctNo => this.loadItems(contrctNo)) // Fetch new data based on search
     ).subscribe(data => {
       // Once the observable emits the data, update your filtered list
       this.filteredContractList = this.prepareContractList(data);
       this.customer_name=this.filteredContractList[0].Customer_Name
     });
     
    }
    closePrompt() {
    this.isPromptVisible = false; // Hide the custom prompt
    //this.userInput = ''; // Clear the input field
  }
    ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator2;
     //this.dataSourceTable.paginator = this.paginator;
   }
    onLoadLocation(){
       this.securityService.GetLocation().subscribe(data => {
         this.Location = this.prepareLocationList(data);
       }, error => {
         console.error('Error fetching doc types:', error);
       });
     }
  onDoubleClick() {
    this.loadBatchNo();
    this.isPromptVisible = true;
  }
   loadBatchNo() {
    this.securityService.GetBatchNo().then(data => {
      this.BatchNoList = this.prepareBatchNoList(data);
      this.dataSourceBatchNo.data = this.BatchNoList;
    });
  }
  prepareBatchNoList(rows:any) {
       const res=[];
       for(let i=0;i<rows.length;i++) {
         res.push({
          SZ_BATCH_NO:rows[i].SZ_BATCH_NO,
          SZ_ENTER_DATE:rows[i].SZ_ENTER_DATE,
          SZ_ENTER_USER:rows[i].SZ_ENTER_USER,
          iCOMPLETE:rows[i].iCOMPLETE,
         });
       }
       return res;
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
    
    //Insert Doc header Functions
    SaveDocDetails(){
     this.isDasabled_btnNew=true
     this.isDasabled_btnEdit=false
     this.isDasabled_btnDelete=false
 
      if((this.batchNo!="" && this.batchNo!=null) || (this.bundleNo!="" && this.bundleNo!=null)|| (this.dataSource.data.length>0)){
        var CloseData = {"strBatchNo":this.batchNo,"strbundleNo":this.bundleNo,"strClosedDate":this.date,"boolComplete":this.chkComplete,"strEnteruser":this.Username};
       // this.securityService.AddDocHeader(DocData,this.DocList).subscribe(c=>{
       this.securityService.AddCloseBundle(CloseData,this.dataSource.data,this.Username).subscribe(response => {
          this.snackBar.open(response, 'Close', {
           duration: 3000,
           panelClass: ['snackbar-success'],
           verticalPosition: 'top' 
         });
        
            this.onLoad();
            this.Clear();
         });
      }else {
       this.snackBar.open('Check Inputs', 'Close', {
         duration: 3000,
         panelClass: ['snackbar-warning']
       });
     }
    }
  
    Clear(){
      this.DataTable=[];
      this.DocList=[];
      this.contrctNo="";
      this.dataSource.data=[]
      this.lblBatchInfo=""
      this.customer_name="";
      this.product_code = "";
      this.product_redirectpath=""
      this.isDasabled_btnNew=false
      this.isvisibleSavebtn=true
      this.strFileActstatus=""
      this.isCardVisible=false
      this.checkactive=false
      this.last_user=""
      this.chkComplete=false
      this.bundleNo=""
      this.activated_date=""
      this.reciveddate=""
      this.dummyfile_creationdate=""
      this.credit_officer=""
      this.lblBundleInfo=""
      this.remark=""
      this.batchNo=""
      this.isDasabled_btnNew=true
      //this.isDasabled_btnEdit=false
      this.isreadonlyContract=true
      this.isDasabled_btnEdit=true
      this.rackno=""
      this.DataTable=[]
      this.isvisibleSelectVehNoCmb=false
      this.isvisibleSelectVehNoText=true
      this.strFileActRemark=""
      this.vehicleNo=""
    }
  
    onLoad(){
     this.securityService.GetContract().then(data=>{
       this.ContractList = this.prepareContractList(data);
       this.dataSourceTable.data = this.ContractList;
     });
   }
   onEnterBatchNo(){
    this.fnLoadCloseFileBatch("");
   }
   // Triggered on user input
   onSearch(): void {
     this.searchSubject.next(this.contrctNo); // Push search query into the stream
     this.contractNo=this.contrctNo;
     this.onLoadData(this.contractNo);
   }

   // Load items from the backend (with search query)
   loadItems(searchQuery: string): Observable<any> {
     // Returning the observable from the service directly
     return this.securityService.getContractsforDrpDwn(searchQuery, this.page, this.pageSize);
   }
   onLoadData(selectedValue: string):void{
     this.securityService.GetDataContract(selectedValue).subscribe(data => {        
       this.DataTable = this.prepareDataList(data);      
       this.dataSourcebyContractNo.data = this.DataTable; 
       this.customer_name=data[0].strCustName;
 
       this.isCardVisible=true
       this.isViewTable=true
     }, error => {
       console.error('Error fetching doc types:', error);
     });
   }
   onGetAllData():void{
     
     this.securityService.GetAllDataList(this.vehicleNo,this.contractNo,this.btnType).subscribe(data => {
         this.AllDataList = data;  
            if (this.AllDataList[0].strReturnmsg=="Exists") {
           this.snackBar.open('Already Exist the Vehicle No', 'Close', {
             duration: 3000,
             panelClass: ['snackbar-warning'],  // optional custom styling
             verticalPosition: 'top' 
           });
           return;
       }
         this.batchNo=this.AllDataList[0].strHirer
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
         this.fileLocation=this.AllDataList[0].strLocName
         this.vehicle_type=this.AllDataList[0].strVehicleType
         //this.reciveddate=new Date(this.AllDataList[0].strReceivedDate).toISOString().split('T')[0];
         this.convertreciveddate(this.AllDataList[0]?.strReceivedDate)
         this.convertDate(this.AllDataList[0]?.strActDate)
         this.loc=this.AllDataList[0].boolLoc
         this.dmcode=this.AllDataList[0].strDmcode
         this.onLoadTable({ pageIndex: 0, pageSize: 10,
           length: 0});
     }, error => {
       console.error('Error fetching doc types:', error);
     });
     
   }
    onRowClicked(row: any) {
    this.batchNo=row.SZ_BATCH_NO; // Assign TRN_No to textbox
    this.isPromptVisible = false;
    this.fnLoadCloseFileBatch("");
    //this.onLoadMain();
    //this.locCode=this.location
    //this.LoadAuthorizer();
  }
  fnLoadCloseFileBatch(strLoadStatus:string){   
    if (this.batchNo == "") {
      
    }
    if(this.batchNo.indexOf("CBT") === -1){   
      this.batchNo = 'CBT' + this.batchNo.padStart(5, '0');
    }
    this.lblReopen = "";
    this.securityService.fnGetCloseFileBatch(this.batchNo,this.Username).subscribe(data => {
      this.isvisibleSavebtn = false;
      this.fnClearBundle()
      this.Bundlestatus = "Load Bundle";
      this.lblBatchInfo = "";
      this.BTList = this.prepareContractList(data[0].BT);
      this.BTList = data[0].BT;
      if (this.BTList) {
        this.btnResetBundle = false;
        this.boolBatchComple = (this.BTList.BOOL_COMPLETE);
        this.isDasabled_BatchNo = true;
        this.str = this.str.padStart(31);
        this.lblBatchInfo = "Batch No " + this.batchNo + "  : Started By " + this.BTList.SZ_ENTER_USER + " at " + this.BTList.DT_ENTER_DATE.slice(0, 10);
        if (this.boolBatchComple) {
          
          this.lblBatchInfo += "\n" + this.str + ": Completed by " + this.BTList.SZ_COMPLETE_USER + " at " + this.BTList.DT_COMPLETE_DATE.slice(0, 10);

        }
        else {
          this.lblBatchInfo += "\n" + this.str + ": Not Completed Yet";
        }
        this.cboBundleNo = false;
        this.fnSetTotalBundles();

      }
      else {
        this.btnResetBundle = true;
         this.snackBar.open('Invalid Close File Batch' , 'Invalid Close File Batch', {
          duration: 5000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
      }
     
    });
    
  }
  BundleClick() {
    if (this.Bundlestatus == "Load Bundle") {
      if (this.bundleNo == "" || this.bundleNo == null) {
        this.snackBar.open('Pleae select the bundle number', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
      }
      else {
        this.Bundlestatus = "Reset Bundle";
        this.fnLoadBundle(this.batchNo, this.bundleNo);
      }
    }
   
    else {
      this.Bundlestatus = "Load Bundle";
      this.fnLoadCloseFileBatch("");
    }
  }

  fnSetMode(pMode:string) {
    

      if (pMode == "new") {
        this.strMode = "new";
        this.lblMode = "CREATE NEW BUNDLE";
        this.fnActiveCtrl(true);
        //txtBatchNo.Text = "xxx";
        this.isDasabled_BatchNo = true;
        this.isvisibleSavebtn = true;

      }
      else if (pMode == "edit") {
        this.strMode = "edit";

      }
      else if (pMode.toUpperCase() == "CLEAR") {
        this.strMode = "clear";
        this.lblMode = "CLOSE FILE BUNDLE";
        this.batchNo = "";
        this.isDasabled_BatchNo = false;
        this.Bundle= [];
        this.cboBundleNo = true;
        this.lblBatchInfo = "";
        this.lblBundleInfo = "";
        this.chkComplete= false;
        this.isDisableCompleteBundle = false;
        //gvCloseFile.ReadOnly = true;
        this.isDasabled_contractNo = true;
        this.Bundle=[];
        this.dataSource.data = [];
        this.contrctNo = "";
        this.btnResetBundle = true;
        this.dtpBatchDate = true;
        this.isvisibleSavebtn = true;

      }
  }
  fnActiveCtrl(val:boolean) {
    this.isDasabled_contractNo =! val;
    this.dtpBatchDate = !val;
    //gvCloseFile.ReadOnly = !val;
  }
  fnLoadBundle(batchNo: string, bundleNo: string) {
      this.securityService.fnGetBundle(this.batchNo, this.bundleNo).subscribe(data => {
      this.BundleDetails = data[0].BD;
      this.cboBundleNo = true;
      this.lblBundleInfo = "Bundle No " + bundleNo;
        if (this.BundleDetails) {
          this.lblReopen = "";
          this.boolCompleteBundle = this.BundleDetails.BOOL_COMPLETE;
          this.boolReopenBundle = this.BundleDetails.BOOL_REOPEN;
          this.strEnterUser = this.BundleDetails.SZ_ENTER_USER;
          this.strStartDate = this.BundleDetails.DT_BUNDLE_START.slice(0, 10);
          this.lblBundleInfo += "\nStarted by " + this.strEnterUser + " at " + this.strStartDate;
        
         if (this.boolCompleteBundle) {
          this.isDasabled_contractNo = true;
          this.isvisibleSavebtn = false;
          this.isDisableCompleteBundle
          this.isDisableCompleteBundle = true;
          this.chkComplete = true;
          this.lblBundleInfo += "\nCompleted by " + this.BundleDetails.SZ_COMPLETE_USER + " at " +this.BundleDetails.DT_COMPLETE.slice(0, 10);
        }
        else{
          //gvCloseFile.ReadOnly = false;
           this.isDisableCompleteBundle = false;
           this.chkComplete = false;
           this.isDasabled_contractNo = false;
           this.isvisibleSavebtn = true;
           if (this.boolReopenBundle)
           {
             this.isDasabled_contractNo = false;
             this.isDisableCompleteBundle = true;
             this.lblReopen = "REOPEN";
             this.lblBundleInfo += "\nReopen by " + this.BundleDetails.SZ_LAST_REOPEN_USER + " at " + this.BundleDetails.DT_LAST_REOPEN.slice(0, 10);
           }
        }
      }
      else{
        //gvCloseFile.ReadOnly = false;
          this.lblBundleInfo += "\nNew Bundle";
          this.isDisableCompleteBundle = false;
          this.chkComplete = false;
          this.isDasabled_contractNo = false;
          this.isvisibleSavebtn = true;
      }
       this.DList = this.prepareDList(data[0].D);       
       this.dataSource.data = this.prepareDList(data[0].D)
       
    });
  }
    prepareDList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        SZCONTRACTNO: rows[i].SZCONTRACTNO,
        SZHIRER: rows[i].SZHIRER,
        SZVEHICLENO: rows[i].SZVEHICLENO,
        SZ_CHANGE_STATUS: rows[i].SZ_CHANGE_STATUS,
        ISEQ: rows[i].ISEQ.toString(),
      });
    }
    return res;
  }
  onDeleteRow(element: any): void {
    if (this.lblReopen == "REOPEN") {
      element.SZ_CHANGE_STATUS = 'REM';
    }
    else {
      const data = this.dataSource.data;
      const index = data.indexOf(element);
      if (index > -1) {
        data.splice(index, 1);  // Remove the row from data array
        this.dataSource.data = data;  // Update the datasource
      }
    }

  // Optionally update your dataSource to trigger UI refresh
  this.dataSource.data = [...this.dataSource.data];
}

   fnSetTotalBundles(){
    this.securityService.fnGetNextBundle(this.batchNo).subscribe(data => {
      this.nxtBundleNo =(data);
      this.generateBundleNumbers(this.nxtBundleNo);
    });
  } 
   generateBundleNumbers(iTotBundle: number): void {
    this.Bundle = [];
     if (this.boolBatchComple) {
       iTotBundle = iTotBundle - 1;
     }
    for (let i = 0; i < iTotBundle; i++) {
      this.Bundle.push(i + 1);
    }
  }
  fnClearBundle() {
    this.Bundle=[];
    this.dataSource.data = [];
    this.lblBundleInfo = "";
    this.chkComplete = false;
    this.isDisableCompleteBundle = true;
    this.contrctNo = "";


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
    @ViewChild('paginator1') set paginator1(v: MatPaginator) {
    this.dataSourceBatchNo.paginator = v;
  }
  fnAddFileToGrid() {
    if (this.contrctNo == "") {
       this.snackBar.open('Contract number is empty' , 'Close', {
          duration: 5000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
    }
    if (this.bundleNo.trim() == "") {
       this.snackBar.open('Invalid Bundle' , 'Close', {
          duration: 5000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
    }
 this.securityService.fnGetDMContractDetail(this.contrctNo, this.batchNo).subscribe(
      (data: any) => {
        const receivedData = Array.isArray(data) ? data : [data];

        if (receivedData[0]?.D?.length > 0) {
          // ✅ Directly update the existing first row
          //receivedData[0].D[0].SZHIRER = 'John Doe';
          receivedData[0].D[0].SZ_CHANGE_STATUS = this.boolReopenBundle?"ADD":"DEFAULT";
          receivedData[0].D[0].ISEQ = (this.dataSource.data.length + 1).toString();
        }
        // Display message if strContractNo is empty/null
        if (!receivedData[0].D[0]?.SZCONTRACTNO) {
          const msg = receivedData[0]?.strmsg || 'No contract found.';
          this.snackBar.open(msg, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning'],
            verticalPosition: 'top'
          });
        } 
        else {
          const currentData = this.dataSource.data || [];

          // ✅ Check if already exists by contract number (or vehicle no)
          const alreadyExists = currentData.some(
            (row: any) => row.SZCONTRACTNO === receivedData[0].D[0].SZCONTRACTNO
          );

          if (alreadyExists) {
            this.snackBar.open('This contract already exists in the table.', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-warning'],
              verticalPosition: 'top'
            });
          } else {
            // Append if new
            this.dataSource.data = [...currentData, ...receivedData[0].D];
          }
        }

        // Clear form fields after success
        this.contrctNo = "";
        //this.hirer_name = "";
        //this.searchText = "";
      },
      (error) => {
        this.snackBar.open(error.error.ExceptionMessage, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
      }
    );   
    

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
   onLoadTable(event: PageEvent): void {
     this.securityService.GetDocTable(this.dmcode).subscribe(data => {
        this.DocList = this.prepareLoadTable(data);
        this.dataSourceTable.data = this.DocList;
     }, error => {
       console.error('Error fetching doc types:', error);
     });
   }
  
   prepareContractList(rows:any) {
     const res=[];
     for(let i=0;i<rows.length;i++) {
       res.push({
         ContractNo:rows[i].strContractNo,
         Customer_Name:rows[i].strCustomerName
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
        // CustomerName:rows[i].strCustName
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
         CmtDate: rows[i].strCmtDate ? this.parseDateOnly( rows[i].strCmtDate)  : null,
         Errors:rows[i].strErrors,
         DOCIsuuedDate: rows[i].strDOCIssuedDate ? this.parseDateOnly( rows[i].strDOCIssuedDate)  : null,   
         IssuedToName:rows[i].strIssuedToName,
         IssuedRemark:rows[i].strIssuedRemark,
         DOCReturnDate: rows[i].strDOCReturnDate ? this.parseDateOnly(rows[i].strDOCReturnDate)  : null  
       });
     }
     return res;
   }
   parseDateOnly(str:String) {
   if (!str) return null;
   const [day, month, year] = str.split(' ')[0].split('/');
   return new Date(Number(year), Number(month) - 1, Number(day)); // JS months are 0-based
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
//  export interface DocData {
//    strDmcode:string
//    strContractNo:string;
//    strVehicleNo:string;
//    strHirer:string;
//    strActDate:string;
//    strFileActRemark:string;
//    strFileIssRemark:string;
//    strReceivedDate:string;
//    strDumFCreationDate:string
//    strCrdOfficer:string
//    strVehicleType:string;
//    boolChkActive:boolean
//    boolchkScanned:boolean
//    strCustName:string
//  }
 
 
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
   CmtDate: Date
 }
 export interface CloseData {
  strBatchNo: string
  strbundleNo: string;
  strClosedDate: string;
  boolComplete: boolean;
  strEnteruser: string;
}