import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
import { ActivatedRoute } from '@angular/router';
import { Sort } from '@angular/material/sort';
@Component({
  selector: 'app-transfer-file',
  templateUrl: './transfer-file.component.html',
  styleUrls: ['./transfer-file.component.scss']
})
export class TransferFileComponent implements OnInit {

  today = new Date();

  dataSourceTable: MatTableDataSource<Element>;
  dataSourcebyContractNo: MatTableDataSource<Element>;
  dataSourceTRNNo: MatTableDataSource<Element>;
  dataSourceRequestNo: MatTableDataSource<Element>;
  expandedElement: any;
  // @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  // displayedColumns = ['doccode', 'docname', 'status', 'statusremark', 'cmtdate','Errors/CMT52','DOCIsuuedDate','DOCIsuuedtoName','IssuedRemark','DOCReturnDate'];
  displayedColumns = ['doccode', 'docname', 'status', 'statusremark', 'cmtdate', 'Errors/CMT52', 'DOCIsuuedDate', 'DOCIsuuedtoName', 'IssuedRemark', 'DOCReturnDate'];
  dataSourceTablenew: DocTableData[] = [];
  displayedColumnsnew = ['TRN_No', 'Date', 'Enter_User', 'Confirmed', 'Acknowledged'];
  displayedColumnsRequest = ['Request_No', 'Date', 'Request_User'];
  transfer_no: string = "";
  to_user: string = "";
  from_name: string = ""
  request_no: string = ""
  userInput = '';
  isPromptRequestVisible = false
  isDasabled_transferNo: boolean = true;
  isDasabled_from_name: boolean = true;
  isDasabled_to_user: boolean = true;
  private trnCache: any[] | null = null;
  isDasabled_btnNew: boolean = true;
  isDeletebutton: boolean = false;
  isDasabled_btnEdit: boolean = true;
  isDasabled_Date: boolean = true;
  isDasabled_to_loc: boolean = true;
  isDasabled_from_loc: boolean = true;
  totalCount: number = 0;
  isDasabled_remark: boolean = true;
  isDasabled_request_no: boolean = true;
  toLocation: string = "";
  fromLocation: string = ""
  actDate: string = "";
  isPromptVisible = false;
  showPromptCard: boolean = false;
  additionalInput: string = '';  // Data for the prompt card
  selectedTrnNo: string = '';
  Location: any = [];
  location: string = ""
  RequserList: any = [];

  DocList: any = [];
  ContractList: any = [];
  TRNNoList: any = [];
  RequestList: any = [];
  AllDataList: any = [];
  VehicleTypeList: any = []
  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedValuedrp: string = '';
  hirername: string = "";
  newVehicleNo: string = ""
  vehicle_type: string = "";
  activated_date: string = "";
  dummyfile_creationdate: string = "";
  credit_officer: string = "";
  remark: string = "";
  rackno: string = "";
  last_user: string = "";
  strFileActRemark: string = "";
  file_location: string = ""
  strFileActstatus: string = "";
  checkscaned: boolean = false;
  checkactive: boolean = false;
  btnApproveLabel:string="All Approve"
  strTrnType: string = ""
  loccode: string = "";
  reciveddate: string = ""
  canceleddate: string = ""
  loc: boolean = false;
  dmcode: string = ""
  customValue = ""
  contractNo: string = "";
  vehicleNo: string = "";
  customer_name: string = "";
  boolRights: boolean = false;
  hirer_name: string = "";
  product_code: string = "";
  product_redirectpath: string = ""
  searchQuery = '';
  page = 0;
  pageSize = 10;
  btnName: string = "Save";
  countryCtrl: FormControl;
  filteredCountry: Observable<any[]>;
  selectedValue: string | undefined;
  searchText: string = '';             // Holds the full contract list (paginated)
  filteredContractList: any[] = [];
  DataTable = new MatTableDataSource<any>();
  RequestListTable = new MatTableDataSource<any>();
  isCardVisible = false
  isViewTable = false
  strFornName: string = "frmTransferNote";
  totalRecords = 10000000;
  isConfirmchk: boolean = false;
  isAcknowledgedchk: boolean = false;
  isAckknowledgeChk: boolean = false;
  isConfirm: boolean = false;
  isAckknowledge: boolean = false;
  status: string = "";
  displayedMainColumns = ['Contract_No', 'Vehicle_No', 'Hirer_Name', 'Received', 'Remark', 'Delete'];
  ischkReceived: boolean = false;
  isDasabled_contractNo: boolean = true;
  isDasabled_btnClear = false
  isDasabled_btnPrint = false
  isDasabled_btnSave = false
  Username: string = ""
  isDasabled_btnCancelTransfer = false
  isDasabled_btnApprove:boolean=false;
  isDasabled_btnReTransfer = false
  isRemark: boolean = false
  iCount: number = 0;
  strMode: string = ""
  Transferstatus: string = ""
  header: any = [];
  txtVisibleLocation = false
  cmbVisibleLocation = true
  isDasabled_SelectAll = false
  lblMode: string = "";
  sortColumn = 'SZ_TRN_NO';
sortDirection = 'DESC';
  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar, private dragulaService: DragulaService, public securityService: SecurityService, private http: HttpClient) {
    //this.dataSource = new MatTableDataSource();
    this.dataSourceTable = new MatTableDataSource();
    this.dataSourceTRNNo = new MatTableDataSource();
    this.dataSourceRequestNo = new MatTableDataSource();
    this.dataSourcebyContractNo = new MatTableDataSource();
    this.countryCtrl = new FormControl();
    this.filteredCountry = this.countryCtrl.valueChanges.pipe(
      startWith(''),
      map((country) =>
        country ? this.filtercountry(country) : this.ContractList.slice()
      )
    );
  }

  //  applyFilter(event: Event) {
  //    const filterValue = (event.target as HTMLInputElement).value;
  //    this.dataSource.filter = filterValue.trim().toLowerCase();
  //  }
  onSortChange(sort: Sort) {

  if (!sort.direction) {
    this.sortColumn = 'SZ_TRN_NO';
    this.sortDirection = 'DESC';
  } else {
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction.toUpperCase();
  }

  this.loadItems(1, this.pageSize);
}
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTRNNo.filter = filterValue.trim().toLowerCase();
    this.dataSourceRequestNo.filter = filterValue.trim().toLowerCase();
  }
  onRowClicked(row: any) {
    this.transfer_no = row.TrnNo; // Assign TRN_No to textbox
    this.isPromptVisible = false;
    this.onLoadMain();
  }
  onRowReqClicked(row: any) {
    this.request_no = row.strReqNo; // Assign TRN_No to textbox
    this.isPromptRequestVisible = false;
    this.onLoadReqMain();
  }
  onLoadReqMain() {
    this.securityService.GetRequestFileMain(this.request_no,"TRANS").subscribe(data => {
      this.RequestListTable.data = this.prepareDetailsList(data[0].Details);
      this.header = data[0].Header;
      if (data[0].header) {

      }
      this.remark = "Requested By " + this.header.SZ_REQ_USER;
      if (this.request_no == "NA") {
        this.isDasabled_contractNo = true;
      }
      else {
        this.isDasabled_contractNo = false;
      }

    })
  }
     allApprove() {
  if (this.btnApproveLabel === "All Approve") {
    this.RequestListTable.data.forEach((item: any) => {
      item.BOOL_RECEIVED = true;
    });
    this.btnApproveLabel = "Unapprove All";
    //this.ischkReceived = true; // disable checkboxes
  } else {
    this.RequestListTable.data.forEach((item: any) => {
      item.BOOL_RECEIVED = false;
    });
    this.btnApproveLabel = "All Approve";
   // this.ischkReceived = false; // enable checkboxes
  }

  this.RequestListTable._updateChangeSubscription();
}
  onLoadReqData() {
    this.securityService.GetTransferFileMain(this.transfer_no).subscribe(data => {
      this.DataTable.data = this.prepareDetailsList(data[0].Details);
      this.header = data[0].Header;

      if (this.request_no == "NA") {
        this.isDasabled_contractNo = false;
      }
      else {
        this.isDasabled_contractNo = true;
      }
      this.remark = "Requested By " + this.header.strReqUser;
      //this.isAuthorize=this.header.BOOL_CONFIRM
    })
  }
  onLoadMain() {
    this.securityService.GetTransferFileMain(this.transfer_no).subscribe(data => {
      this.RequestListTable.data = this.prepareDetailsList(data[0].Details);
      this.header = data[0].Header;
      this.from_name = data[0].Header.SZ_FROM_USER
      this.transfer_no = data[0].Header.SZ_TRN_NO
      this.fromLocation = data[0].Header.SZ_FROM_LOC
      this.request_no = data[0].Header.SZ_REQ_NO
      this.toLocation = data[0].Header.SZ_TO_LOC
      this.to_user = data[0].Header.SZ_TO_USER
      this.strTrnType = data[0].Header.SZ_TRN_TYPE
      this.remark = data[0].Header.SZ_REMARK
      this.isConfirm = data[0].Header.BOOL_CONFIRM
      this.isAckknowledge = data[0].Header.BOOL_ACK
      this.Transferstatus = data[0].Header.SZ_REMARK
      this.convertReceivedDate(data[0].Header?.DT_TRN_DATE)
      if (this.header) {
        this.isDasabled_btnPrint = true
        this.isDasabled_btnReTransfer = false
      }
      if (this.isConfirm) {
        this.fnEnableControl(true);
        this.isDasabled_btnCancelTransfer = false;
        this.Transferstatus += "Entered by " + data[0].Header.SZ_ENTER_USER + " @ " + this.reciveddate;
        this.isDasabled_btnSave = true;
        this.isAckknowledge = true;
        this.ischkReceived = false
        this.isDasabled_btnCancelTransfer=false
        this.isAckknowledgeChk = false;
        this.isRemark = true
        this.isDasabled_SelectAll = true
         this.isDeletebutton=true
         this.isDasabled_btnApprove=true
      }
      else {
        this.isDasabled_btnApprove=true
        this.isDasabled_SelectAll = false;
        this.ischkReceived = false
        this.isRemark = false
        this.isAckknowledge = true;
        this.isAckknowledgeChk = true;
        if (data[0].Header.BOOL_CANCEL) {
          this.Transferstatus += "\nCanceled by " + data[0].Header.SZ_CANCEL_USER + " @ " + this.canceleddate;
          //lblStatus.ForeColor = Color.Maroon;
          this.isDasabled_btnSave = false;
        }
        else {
          this.isDasabled_btnReTransfer = true;
          this.isDasabled_btnCancelTransfer = true;
          this.isDasabled_btnSave = true;
        }
      }
      if (data[0].Header.BOOL_ACK) {
        this.isDasabled_SelectAll = false;
        this.Transferstatus += "Received by " + data[0].Header.SZ_ACK_USER + " @ " + this.actDate;
        this.fnEnableControl(true);
        this.isAckknowledgeChk = true;
        this.isDasabled_btnSave = false;
        this.isDasabled_btnReTransfer = true;
        this.ischkReceived = true;
        this.isRemark = false
        this.isDeletebutton=true
      }
      this.isAckknowledge = data[0].Header.BOOL_ACK
      this.isConfirm = data[0].Header.BOOL_CONFIRM
    }

    )
   
  }
  fnClear() {
    this.transfer_no = "";
    this.DataTable.data = [];
    this.RequestListTable.data = [];
    this.to_user = "";
    this.from_name = ""
    this.request_no = ""
    this.toLocation = "";
    this.fromLocation = ""
    this.isDasabled_transferNo = true;
    this.isDasabled_from_name = true;
    this.isDasabled_to_user = true;
    this.isDasabled_Date = true;
    this.isDasabled_to_loc = true;
    this.isDasabled_from_loc = true;
    this.isDasabled_remark = true;
    this.isDasabled_request_no = true;
    this.reciveddate = new Date().toISOString().split('T')[0];
    this.remark = "";
    this.isConfirmchk = false;
    this.isAckknowledgeChk = false;
    this.ischkReceived = false;
    this.isRemark = false
    this.isAckknowledge = false;
    this.Transferstatus = "";
    this.isConfirm = false;
    this.isDasabled_btnEdit = true
    this.isDasabled_btnNew = true     
    this.isDasabled_btnClear = false
    this.isDasabled_btnPrint = false
    this.isDasabled_btnCancelTransfer = false
    this.isDasabled_btnReTransfer = false
    this.isDasabled_btnSave = false
    this.lblMode = 'File Transfer'
  }
  fnSetMode(pMode: string) {

    if (pMode == "new") {
      this.strMode = "new";
      this.lblMode = "FILE TRANSFER - NEW";
      this.fnEnableControl(false);
      this.isDasabled_btnNew = true;
      this.isDasabled_btnEdit = false;
      this.transfer_no = "xx";
      this.isDasabled_transferNo = true;
      this.isDasabled_btnPrint = true;
      this.isDasabled_btnSave = true;
      this.isDasabled_btnCancelTransfer = false;
      //dtpTrnDate.Focus();
      this.strTrnType = "";
      this.ischkReceived = false;
      this.isRemark = false
      this.isDasabled_SelectAll = true;
      this.isAckknowledgeChk = true;
      this.isDasabled_btnReTransfer = true;
      this.isDasabled_btnClear = true
      this.isDasabled_btnPrint = false
      this.isDasabled_btnReTransfer = false
      this.isDasabled_btnSave = true
      this.isDasabled_btnNew = false
      this.isConfirmchk=false

    }
    else if (pMode == "Edit") {
      this.strMode = "edit";
      this.lblMode = "File Transfer - EXISTING";
      //this.fnClear();
      this.fnEnableControl(false);
      this.isDasabled_btnNew = false;
      this.isDasabled_btnEdit = false;
      this.isDasabled_btnPrint = false;
      this.isDasabled_btnSave = true;
      this.isDasabled_btnCancelTransfer = false;
      this.isDasabled_transferNo = false;
      this.isDasabled_btnClear = true;
      this.strTrnType = "";
      this.isDasabled_btnReTransfer = true;
      this.isConfirmchk=false
    }
    else if (pMode == "clear") {
      this.strMode = "";
      this.fnClear();
      this.lblMode = "FILE TRANSFER";
      this.isDasabled_btnNew = false;
      this.isDasabled_btnEdit = false;
      this.fnEnableControl(false);
      this.isDasabled_btnPrint = true;
      this.isDasabled_btnSave = true;
      this.isDasabled_btnCancelTransfer = false;
      this.isDasabled_transferNo = false;
      this.isDasabled_btnReTransfer = true;
      this.strTrnType = "";
    }

  }

  fnEnableControl(pVal: boolean) {
    this.isDasabled_transferNo = pVal;
    this.isDasabled_from_name = pVal;
    this.isDasabled_from_loc = pVal;
    this.isDasabled_to_loc = pVal;
    this.isDasabled_to_user = pVal;
    this.isDasabled_request_no = pVal;
    this.isDasabled_Date = pVal;
    this.isDasabled_contractNo = pVal;
    this.isConfirmchk = pVal;
    this.isAckknowledgeChk = pVal;
    this.ischkReceived = pVal;
    this.isRemark = pVal;
    this.isDasabled_remark = pVal;

  }

  prepareDetailsList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        strContractNo: rows[i].SZCONTRACTNO,
        strVehicleNo: rows[i].SZVEHICLENO,
        strCustName: rows[i].SZHIRER,
        BOOL_RECEIVED: rows[i].BOOL_RECEIVED,
        REMARK: rows[i].SZ_REMARK,

        //ProductRedirectPath:rows[i].strProductRedirectPath
      });
    }
    return res;
  }

  fnLoadTrn(transfer_no: string) {
    this.Transferstatus = ""
  }
 @ViewChild('paginator') set paginator(v: MatPaginator) {
    this.RequestListTable.paginator = v;
  }
  @ViewChild('paginator1') set paginator1(v: MatPaginator) {
    this.dataSourceTRNNo.paginator = v;
  }
  @ViewChild('paginator2') set paginator2(v: MatPaginator) {
    this.dataSourceRequestNo.paginator = v;
  }
  // @ViewChild('paginator3') set paginator3(v: MatPaginator) {
  //   this.dataSourceMain.paginator = v;
  // }
  private searchSubject: Subject<string> = new Subject<string>();
  ngOnInit(): void {
    this.Counttotalcount();
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null && id != "") {
      this.request_no = id; // Assign TRN_No to textbox
      this.isPromptRequestVisible = false;
      this.onLoadReqMain();
      this.fnSetMode("new");
      this.isDasabled_request_no = true;
    }
    this.lblMode = "File Transfer";
    setInterval(() => { this.today = new Date(); }, 1000);
    this.onLoadVehicleType()
    this.reciveddate = new Date().toISOString().split('T')[0];
    this.onLoadLocation();
    //this.onLoad();
    this.searchSubject.pipe(
      debounceTime(500),                     // Wait 500ms after the user stops typing
      distinctUntilChanged(),                // Only trigger if search query has changed

    ).subscribe(data => {
      // Once the observable emits the data, update your filtered list
      this.filteredContractList = this.prepareTrnNoList(data);
      // this.customer_name=this.filteredContractList[0].Customer_Name
    });
    this.securityService.GetIsUserActive().subscribe(data => {
      this.Username = data.username;
    })
  }
   PrintReport() {
      const transferNo = this.transfer_no;
      const userId = 'docman';

      //const url = `http://localhost:44368/api/SecurityModuleAPI/getTransferNotereport?transferNo=${encodeURIComponent(transferNo)}`;
      const url = `http://192.168.100.51:81/DocmanLogin/api/SecurityModuleAPI/getTransferNotereport?transferNo=${encodeURIComponent(transferNo)}`;
      window.open(url, '_blank');
    }
  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
    //this.dataSourceTRNNo.paginator = this.paginator;
    this.dataSourceTRNNo.paginator = this.paginator1;
  }

  async newClick() {
    const hasPermission = await this.PermissionCheck("NEW");
    this.PermissionCheck("NEW")
    if (hasPermission) {
      this.fnSetMode("new");
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
  editClick() {
    this.lblMode = "FILE TRANSFER - EDIT";
    this.strMode = "Edit"
    this.fnSetMode(this.strMode)
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
  clickCancelTransfer() {
    this.strMode = "Cancel"
    var traFileData = { "SZ_TRN_NO": this.transfer_no, "DT_TRN_DATE": this.reciveddate, "SZ_TRN_TYPE": this.strTrnType, "SZ_FROM_LOC": this.fromLocation, "SZ_TO_LOC": this.toLocation, "SZ_FROM_USER": this.from_name, "SZ_TO_USER": this.to_user, "SZ_REQ_NO": this.request_no, "BOOL_CONFIRM": this.isConfirm, "SZ_REMARK": this.remark, "BOOL_CFBATCH": true, "BOOL_ACK": this.isAckknowledge };

    this.securityService.AddtraFile(traFileData, this.RequestListTable.data, this.strMode, this.Username)
      .subscribe({
        next: (response) => {
          this.snackBar.open(response, 'Close', {
            duration: 4000,
            panelClass: ['snackbar-success'],
            verticalPosition: 'top'
          });

          this.isDasabled_btnNew = true;
          this.isDasabled_btnEdit = true;
          this.Clear();
        },
        error: (error) => {
          const errorMsg = error.error || 'An unexpected error occurred';

          this.snackBar.open(error.error.ExceptionMessage, 'Close', {
            duration: 4000,
            panelClass: ['snackbar-warning'],
            verticalPosition: 'top'
          });

          console.error('Error from C# backend:', error);
        }
      });
  }
  clickReTransfer() {
    this.fromLocation=this.toLocation
    this.toLocation=""
    this.request_no="NA"
    this.to_user = "";
    this.from_name = ""
    this.lblMode = "FILE TRANSFER - RE-TRANSFER";
    this.isDasabled_from_name = false
    this.isDasabled_to_user = false
    this.isDasabled_to_loc = false
    this.isDasabled_request_no = true
    this.isDasabled_btnSave = true
    this.isDasabled_btnReTransfer = false
    this.isConfirm=false
    this.isConfirmchk=false
    this.isAckknowledge=false
    this.transfer_no = "xx";
    this.isDasabled_transferNo = true;
    this.RequestListTable.data.forEach(item => {
      item.BOOL_RECEIVED = false;
    });

  }
  deleteRow(element: any) {
    const data = this.RequestListTable.data;
    const index = data.indexOf(element);
    if (index > -1) {
      data.splice(index, 1);  // Remove the row from data array
      this.RequestListTable.data = data;  // Update the datasource
    }
  }

  async clickSavebutton() {
    const hasPermission = await this.PermissionCheck("NEW");
    this.PermissionCheck("SAVE")
    if (hasPermission) {
      if (this.fnValidate() == true) {
        this.Save()
      };
    }
  }
  Save() {
    if (this.strTrnType != "RE-TRN") {
      this.strTrnType = "TRN";
    }
    this.strMode = "Save"
    var traFileData = { "SZ_TRN_NO": this.transfer_no, "DT_TRN_DATE": this.reciveddate, "SZ_TRN_TYPE": this.strTrnType, "SZ_FROM_LOC": this.fromLocation, "SZ_TO_LOC": this.toLocation, "SZ_FROM_USER": this.from_name, "SZ_TO_USER": this.to_user, "SZ_REQ_NO": this.request_no, "BOOL_CONFIRM": this.isConfirm, "SZ_REMARK": this.remark, "BOOL_CFBATCH": true, "BOOL_ACK": this.isAckknowledge };
    // this.securityService.AddtraFile(traFileData,this.RequestListTable.data,this.strMode,this.Username).subscribe(response => {

    //       this.snackBar.open(response, 'Close', {
    //         duration: 3000,
    //         panelClass: ['snackbar-success'],
    //         verticalPosition: 'top' 
    //       });

    //         this.isDasabled_btnNew=true
    //         this.isDasabled_btnEdit=true
    //         this.Clear();
    //       }
    //   );
    this.securityService.AddtraFile(traFileData, this.RequestListTable.data, this.strMode, this.Username)
      .subscribe({
        next: (response) => {
          this.snackBar.open(response, 'Close', {
            duration: 24000,
            panelClass: ['snackbar-success'],
            verticalPosition: 'top'
          });

         //this.isDasabled_btnNew = true;
          //this.isDasabled_btnEdit = true;
          //this.transfer_no=traFileData.SZ_TRN_NO
         // this.Clear();          // ✅ clear only on success         
         this.transfer_no=response.split(' - ')[1];
         this.onLoadMain();
        },
        error: (error) => {
          const errorMsg = error.error || 'An unexpected error occurred';

          this.snackBar.open(error.error.ExceptionMessage, 'Close', {
            duration: 4000,
            panelClass: ['snackbar-warning'],
            verticalPosition: 'top'
          });

          console.error('Error from C# backend:', error);
        }
      });
      // this.onLoadMain()

  }
  fnValidate() {
    if (this.transfer_no == "") {
      this.snackBar.open('Invalid transfer no', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
      return false
    }
    else if (this.from_name == "" || this.from_name == null) {
      this.snackBar.open('Invalid From Name', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
      return false
    }
    else if (this.fromLocation == "") {
      this.snackBar.open('Invalid From Location', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
      return false
    }
    else if (this.to_user == "" || this.to_user == null) {
      this.snackBar.open('Invalid to User', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
      return false
    }
    else if (this.toLocation == "") {
      this.snackBar.open('Invalid to Location', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
      return false
    }
    else if (this.request_no == "") {
      this.snackBar.open('Invalid Request No', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
      return false
    }
    else if (this.reciveddate == "") {
      this.snackBar.open('Invalid Recieved date', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
      return false
    }
    else if (this.toLocation == this.fromLocation) {
      this.snackBar.open('Cannot transfer to same location', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
      return false
    }
    else if (this.RequestListTable.data.length == 0) {
      this.snackBar.open('Enter file detail', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
      return false
    }
    else {
      if (this.isAckknowledge == true) {
        let count = 0;

        for (let i = 0; i < this.RequestListTable.data.length; i++) {
          if (this.RequestListTable.data[i].BOOL_RECEIVED === true) {
            count++;
          }
        }

        if (count === 0) {
          alert("You need to receive at least one file to acknowledge");
        }
      }

    }
    return true
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
  submitPrompt() {
    if (this.additionalInput) {
      alert(`You entered: ${this.additionalInput}`);
      this.closePrompt(); // Close the prompt after submission
    } else {
      alert('Please provide more details!');
    }
  }
  submitPromptRequest() {
    if (this.additionalInput) {
      this.closePromptRequest(); // Close the prompt after submission
    } else {
      //alert('Please provide more details!');
    }
  }
  onDoubleClick() {
    this.loadItems();
    this.isPromptVisible = true;
  }
  closePrompt() {
    this.isPromptVisible = false; // Hide the custom prompt
    this.userInput = ''; // Clear the input field
  }
  onDoubleClickRequest() {
    this.loadRequestItems();
    this.isPromptRequestVisible = true;
  }
  closePromptRequest() {
    this.isPromptRequestVisible = false; // Hide the custom prompt
    this.userInput = ''; // Clear the input field
  }
  onLoadLocation() {
    this.securityService.GetLocation().subscribe(data => {
      this.Location = this.prepareLocationList(data);
    }, error => {
      console.error('Error fetching doc types:', error);
    });
  }
  onPasteMultipleContracts(event: ClipboardEvent) {
  event.preventDefault();

  // Get pasted text
  const pastedText = event.clipboardData?.getData('text');
  if (!pastedText) return;

  // Split by newline or comma
  const contracts = pastedText
    .split(/\r?\n|,/)              // Split by line breaks or commas
    .map(c => c.trim())
    .filter(c => c.length > 0);    // Remove empty lines

  // Convert to row objects (based on your table structure)
  for(let i=0;i<contracts.length;i++){
     this.securityService.GetDataContractinRequestFile(contracts[i], true).subscribe(
      (data: any) => {
        // If data is a single object, wrap in array
        const receivedData = Array.isArray(data) ? data : [data];

        // Display message if strContractNo is empty/null
        if (!receivedData[0]?.strContractNo) {
          const msg = receivedData[0]?.strmsg || 'No contract found.';
          this.snackBar.open(msg, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning'],
            verticalPosition: 'top'
          });

        }
        else {
          // Append to existing data
          // const currentData = this.RequestListTable.data || [];
          // this.RequestListTable.data = [...currentData, ...receivedData];

          const currentData = this.RequestListTable.data || [];

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
            this.RequestListTable.data = [...currentData, ...receivedData];
          }
        }


        // Clear form fields after success
        this.vehicleNo = "";
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
  // const newRows = contracts.map(c => ({
  //   strContractNo: c.toUpperCase(),
  //   strVehicleNo: '',
  //   strCustName: '',
  //   BOOL_RECEIVED: false,
  //   REMARK: ''
  // }));

  // // Append to the existing table data
  // this.RequestListTable.data = [...this.RequestListTable.data, ...newRows];
}

  //Insert Doc header Functions
  SaveDocDetails() {
    //  if(this.contractNo!="" && this.contractNo!=null  ){
    //    var DocData = {"strDmcode":this.dmcode,"strContractNo":this.contractNo,"strCustName":this.customer_name,"strHirer":this.hirername,"strVehicleNo":this.vehicleNo,"strActDate":this.activated_date,"strFileActRemark":this.product_redirectpath,"strFileIssRemark":this.remark,"strReceivedDate":this.reciveddate,"strDumFCreationDate":(this.dummyfile_creationdate),"strCrdOfficer":this.credit_officer,"strVehicleType":this.vehicle_type,"boolChkActive":this.checkactive,"boolchkScanned":this.checkscaned};
    //    this.securityService.AddDocHeader(DocData,this.DocList).subscribe(c=>{
    //      alert(c);

    //        this.Clear();
    //     });
    //  }else{
    //    alert("Check Inputs");
    //  }
  }

  prepareLocationList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        strLocCode: rows[i].strLocationCode,
        strLocName: rows[i].strLocation
        //ProductRedirectPath:rows[i].strProductRedirectPath
      });
    }
    return res;
  }
  Clear() {
    this.fnClear();
  }
   Counttotalcount() {
    this.securityService.GetTotalCount().subscribe({
      next: (data: any) => {
        this.totalCount = data;
      },
      error: (err: any) => {
        console.error('Error fetching total count:', err);
      }
    });
  }

  // loadItems() {
  //   this.securityService.GetTrnNo().then(data => {
  //     this.TRNNoList = this.prepareTrnNoList(data);
  //     this.dataSourceTRNNo.data = this.TRNNoList;
  //   });
  // }
pageNumber:number = 1;
// onPageChange(event: PageEvent) {
//   this.pageNumber = event.pageIndex + 1;
//   this.pageSize = event.pageSize;
//   this.loadItems(this.pageNumber);
// }
// loadItems(page: number = this.pageNumber, size: number = this.pageSize) {
//   this.securityService.GetTrnNo(page, size).subscribe({
//     next: (data: any) => {
//       this.TRNNoList = this.prepareTrnNoList(data.items); // replace, not append
//       this.dataSourceTRNNo.data = this.TRNNoList;
//       this.totalCount = data.totalCount; // <-- must come from backend
//     },
//     error: err => {
//       console.error('Error loading TRN numbers:', err);
//     }
//   });
// }
onPageChange(event: PageEvent) {
  this.pageNumber = event.pageIndex + 1;
  this.pageSize = event.pageSize;
  this.loadItems(this.pageNumber, this.pageSize);
}

loadItems(page: number = this.pageNumber, size: number = this.pageSize) {
   this.securityService
    .GetTrnNo(
      page,
      size,
      this.sortColumn,
      this.sortDirection
    )
    .subscribe({
      next: (data) => {
        this.TRNNoList = this.prepareTrnNoList(data);
        this.dataSourceTRNNo.data = this.TRNNoList;
      },
      error: (err) => console.error(err)
    });
}

  loadRequestItems() {
    this.securityService.GetReqNo("TRA").then(data => {
      this.RequestList = this.prepareReqNoList(data);
      this.dataSourceRequestNo.data = this.RequestList;
    });
  }
  prepareReqNoList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        strReqNo: rows[i].strReqNo,
        strReqDate: rows[i].strReqDate.split('T')[0],
        strReqUser: rows[i].strReqUser
      });

    }
    res.push({
      strReqNo: 'NA',
      strReqDate: this.today.toISOString().split('T')[0],
      strReqUser: 'NA'
    });
    return res;
  }


  // Triggered on user input
  onSearch(): void {
    // this.searchSubject.next(this.searchText); // Push search query into the stream
    // this.contractNo = this.searchText;
    // this.onLoadData(this.contractNo);
    this.transfer_no; // Assign TRN_No to textbox
    this.isPromptVisible = false;
    this.onLoadMain();
  }
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
  submitValue() {
    this.securityService.GetDataContractinRequestFileinTransfer(this.searchText, true).subscribe(
      (data: any) => {
        // If data is a single object, wrap in array
        const receivedData = Array.isArray(data) ? data : [data];

        // Display message if strContractNo is empty/null
        if (!receivedData[0]?.strContractNo) {
          const msg = receivedData[0]?.strmsg || 'No contract found.';
          this.snackBar.open(msg, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning'],
            verticalPosition: 'top'
          });

        }
        else {
          // Append to existing data
          // const currentData = this.RequestListTable.data || [];
          // this.RequestListTable.data = [...currentData, ...receivedData];

          const currentData = this.RequestListTable.data || [];

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
            this.RequestListTable.data = [...currentData, ...receivedData];
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
  convertDate(strActDate: string) {
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
  convertdummyfile_creationdate(strDumFCreationDate: string) {
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
  //   convertReceivedDate(strReceivedDate: string): void {

  //   if (strReceivedDate) {
  //     const formattedDate = new Date(strReceivedDate);

  //     if (!isNaN(formattedDate.getTime())) {
  //       // Extract date in YYYY-MM-DD format
  //       this.reciveddate = formattedDate.toISOString().split('T')[0];
  //       alert(this.reciveddate)
  //       console.log('Formatted received_date:', this.reciveddate);
  //       alert("Received Date: " + this.reciveddate);
  //     } else {
  //       console.error('Invalid date format:', strReceivedDate);
  //       this.reciveddate = '';
  //       alert("Received Date: " + this.reciveddate);
  //     }
  //   } else {
  //     console.error('strReceivedDate is null or undefined');
  //     this.reciveddate = '';
  //     alert("Received Date: " + this.reciveddate);
  //   }
  // }
  convertReceivedDate(strReceivedDate: string): void {
    if (strReceivedDate) {
      const date = new Date(strReceivedDate);

      if (!isNaN(date.getTime())) {
        // Use local components instead of UTC (ISO) format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
        const day = String(date.getDate()).padStart(2, '0');

        this.reciveddate = `${year}-${month}-${day}`;
        this.canceleddate = `${year}-${month}-${day}`;
        this.actDate = `${year}-${month}-${day}`;
        console.log('Corrected local date:', this.reciveddate);
      } else {
        console.error('Invalid date format:', strReceivedDate);
        this.reciveddate = '';
        this.canceleddate = '';
        this.actDate = '';
      }
    } else {
      console.error('strReceivedDate is null or undefined');
      this.reciveddate = '';
      this.canceleddate = '';
      this.actDate = '';
    }
  }


  onLoadVehicleType() {
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


  prepareTrnNoList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        TrnNo: rows[i].strTrnNo,
        Date: rows[i].strDate,
        EnterUser: rows[i].strEnterUser,
        Confirm: rows[i].boolConfirmed,
        Acknowleded: rows[i].boolAcknowleged
      });
    }
    return res;
  }

  prepareVehicleTypeList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        ISeq: rows[i].iseq,
        Vehicle_type: rows[i].strVehicleType
      });
    }
    return res;
  }
  prepareDataList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        VehicleNo: rows[i].strVehicleNo,
        // CustomerName:rows[i].strCustName
      });
    }
    return res;
  }
  prepareLoadTable(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        DocCode: rows[i].strDocCode,
        DocName: rows[i].strDocName,
        Status: rows[i].strStatus,
        RemarkofFile: rows[i].strRemarkofFile,
        CmtDate: rows[i].strCmtDate,
        Errors: rows[i].strErrors,
        DOCIsuuedDate: rows[i].strDOCIssuedDate,
        IssuedToName: rows[i].strIssuedToName,
        IssuedRemark: rows[i].strIssuedRemark,
        DOCReturnDate: rows[i].strDOCReturnDate
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
  newVehicleenter() {
    if (this.vehicleNo === "custom") {
      this.selectedValuedrp = "custom"
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
  strProductRedirectPath: String;
}
export interface DatabyContractNo {
  strVehicleNo: string;
  strCustName: string;
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
export interface DocData {
  strContractNo: string;
  strVehicleNo: string;
  strHirer: string;
  strActDate: string;
  strFileActRemark: string;
  strFileIssRemark: string;
  strReceivedDate: string;
  strDumFCreationDate: string
  strCrdOfficer: string
  strVehicleType: string;
  boolChkActive: boolean
  boolchkScanned: boolean
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
  cmtDate: string;
}
export interface DocTRNData {
  TRN_No: string;
  Date: string;
  Enter_User: string;
  Confirmed: string;
  Acknowledged: string; // Or Date type, depending on your needs
}
export interface Location {
  strLocCode: string;
  strLocName: string;
}
export interface transferFileData {
  SZ_TRN_NO: string
  DT_TRN_DATE: string;
  SZ_FROM_LOC: string;
  SZ_TO_LOC: string;
  SZ_FROM_USER: string;
  SZ_TO_USER: string;
  BOOL_CONFIRM: boolean;
  SZ_REQ_NO: String
  SZ_TRN_TYPE: string
  SZ_REMARK: string;
  BOOL_CFBATCH: boolean
  BOOL_ACK: boolean
}