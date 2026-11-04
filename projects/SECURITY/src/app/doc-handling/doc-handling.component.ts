import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, distinctUntilChanged, catchError } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { ViewChildren, QueryList, ElementRef } from '@angular/core';
import { MatSelect } from '@angular/material/select';
@Component({
  selector: 'app-doc-handling',
  templateUrl: './doc-handling.component.html',
  styleUrls: ['./doc-handling.component.scss']
})
export class DocHandlingComponent implements OnInit {

  today = new Date();

  dataSourceTable: MatTableDataSource<Element>;
  dataSourcebyContractNo: MatTableDataSource<Element>;
  expandedElement: any;

  // displayedColumns = ['doccode', 'docname', 'status', 'statusremark', 'cmtdate','Errors/CMT52','DOCIsuuedDate','DOCIsuuedtoName','IssuedRemark','DOCReturnDate'];
  displayedColumns = ['doccode', 'docname', 'status', 'statusremark', 'cmtdate', 'Errors/CMT52', 'DOCIsuuedDate', 'DOCIsuuedtoName', 'IssuedRemark', 'DOCReturnDate'];
  dataSourceTablenew: DocTableData[] = [];
  DocList: any = [];
  ContractList: any = [];
  AllDataList: any = [];
  //VehicleTypeList: any = []
  VehicleTypeList: VehicleType[] = [];
  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedValuedrp: string = '';
  hirername: string = "";
  newVehicleNo: string = ""
  vehicle_type: string = "";
  activated_date: string = "";
  lastrtn_date: string = "";
  selectedDocStatus: string = "IN"
  lastIssued_date: string = "";
  issued_to: string = "";
  dummyfile_creationdate: string = "";
  credit_officer: string = "";
  remark: string = "";
  rackno: string = "";
  last_user: string = "";
  strFileActRemark: string = "";
  file_location: string = ""
  strFileActstatus: string = "";
  lblstatus: string = ""
  checkscaned: boolean = false;
  checkactive: boolean = false;
  loccode: string = "";
  isDisabled_crrecdate=true
  reciveddate: string = ""
  crReceivedDate:string=""
  loc: boolean = false;
  dmcode: string = ""
  customValue = ""
  contractNo: string = "";
  vehicleNo: string = "";
  txtFileActRemark: string = ""
  customer_name: string = "";
  isDasabled_fileactRemark: boolean = false
  hirer_name: string = "";
  product_code: string = "";
  caseSwitch: string = ""
  product_redirectpath: string = ""
  searchQuery = '';
  page = 0;
  fileStatus:string='FILE'
  boolFileCrStatus:boolean=this.fileStatus=='FILE'?false:true
  Username: string = ""
  pageSize = 10;
  btnName: string = "Save";
  countryCtrl: FormControl;
  filteredCountry: Observable<any[]>;
  selectedValue: string | undefined;
  searchText: string = '';             // Holds the full contract list (paginated)
  filteredContractList: any[] = [];
  DataTable: any = [];
  isCardVisible = false
  isViewTable = false
  totalRecords = 1000000;
  fileLocation: string = "BSD"
  Location: any = [];
  isDasabled_fileloc: boolean = true
  isDasabled_btnNew: boolean = true
  isvisibleSavebtn = false
  strBtnFunction: string = ""
  isDasabled_btnEdit = true
  bStatus: boolean = false
  isDasabled_btnDelete = false
  strFormName: string = "frmDocManage"
  btnType: string = ""
  isreadonlyContract = true
  isvisibleSelectVehNoCmb = true
  issueRemark: string = ""
  isvisibleSelectVehNoText = false
  constructor(private snackBar: MatSnackBar, private dragulaService: DragulaService, public securityService: SecurityService, private http: HttpClient) {
    //this.dataSource = new MatTableDataSource();
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

  NewClick() {
    this.PermissionCheck("NEW").subscribe((hasPermission) => {
      if (hasPermission) {
        // ✅ Your allowed actions
        this.Clear();
        this.isDasabled_btnNew = false;
        this.isDasabled_btnEdit = false;
        this.isvisibleSavebtn = true;
        this.strFileActstatus = "Active";
        this.isCardVisible = true;
        this.checkactive = true;
        this.isDisabled_crrecdate=false
        this.isreadonlyContract = false;
        this.btnType = "New";
        this.isvisibleSelectVehNoCmb = false;
        this.isvisibleSelectVehNoText = true;
        this.selectedDocStatus = "IN"
        this.last_user = "New";
        this.lblstatus = "- NEW";
        this.crReceivedDate=""
      } else {
        // ❌ Permission denied
        this.snackBar.open('Permission Denied!!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
      }
    });
  }
onToggle(isChecked: boolean) {
  this.isDasabled_fileactRemark = !isChecked;
}
 @ViewChildren('inputRef') allInputs!: QueryList<ElementRef>;


 onTabPress(event: Event, rowIndex: number, column: string) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault(); // Stop default Tab

    const inputsArray = this.allInputs.toArray();

    // Filter inputs for the correct column order
    const sortedInputs = this.displayedColumns
      .map(col => inputsArray.filter(input => input.nativeElement.getAttribute('data-column') === col))
      .reduce((acc, val) => acc.concat(val), []);

    // Find current input
    const currentInput = (event.target as HTMLElement);
    const currentIndex = sortedInputs.findIndex(input => input.nativeElement === currentInput);

    // Move to next input
    let nextIndex = currentIndex + 1;
    if (nextIndex >= sortedInputs.length) {
      nextIndex = 0; // wrap to first input
    }

    sortedInputs[nextIndex].nativeElement.focus();
  }
@ViewChildren('dateInput') dateInputs!: QueryList<ElementRef<HTMLInputElement>>;
// You can remove or leave @ViewChildren('dateInput') — we won't need it for this calculation.

onTabDate(event: Event, currentInput: HTMLInputElement) {
  event.preventDefault();

  const inputs = this.dateInputs.toArray();
  const currentIndex = inputs.findIndex(
    x => x.nativeElement === currentInput
  );

  const nextIndex =
    currentIndex + 1 >= inputs.length ? 0 : currentIndex + 1;

  setTimeout(() => {
    inputs[nextIndex].nativeElement.focus();
  });
}
@ViewChildren('statusSelect') statusSelects!: QueryList<MatSelect>;

  onTab(event: KeyboardEvent, currentSelect: MatSelect) {
    // Prevent the default browser tab behavior completely
    event.preventDefault();
    event.stopPropagation();

    this.moveToNext(currentSelect);
  }

  moveToNext(currentSelect: MatSelect) {
    const selectsArray = this.statusSelects.toArray();
    
    // Find the exact index of the currently focused mat-select in the QueryList
    const currentIndex = selectsArray.indexOf(currentSelect);

    console.log('Current Row Index:', currentIndex);
    console.log('Total Rows:', selectsArray.length);

    // Check if there is a next row available
    if (currentIndex > -1 && currentIndex < selectsArray.length - 1) {
      const nextSelect = selectsArray[currentIndex + 1];

      // Close the current dropdown panel before moving
      currentSelect.close();

      // Macrotask delay ensures DOM handles the close before opening the next one
      setTimeout(() => {
        nextSelect.focus();
        nextSelect.open();
      }, 50); 
    }
  }
  EditClick() {
    this.PermissionCheck("SAVE").subscribe((hasPermission) => {
      if (hasPermission) {
        //this.Clear();
        this.isDasabled_btnNew = false
        this.isvisibleSavebtn = true
        this.isDasabled_btnEdit = false
        this.isDisabled_crrecdate=false
        //this.strFileActstatus="Active"
        //this.isCardVisible=true
        //this.checkactive=true
        this.isreadonlyContract = false
        this.isvisibleSelectVehNoCmb = true
        this.isvisibleSelectVehNoText = false
        this.btnType = "Edit"
        this.lblstatus = "- EDIT"
      } else {
        // ❌ Permission denied
        this.snackBar.open('Permission Denied!!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
      }
    });
  }
  
onFileStatusChange(status: string): void {
  if (status === 'CR') {
    const today = new Date();

    this.crReceivedDate =
      today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');
  } else {
    //this.crReceivedDate = "";
  }
}
  DeleteClick() {
    this.PermissionCheck("DEL").subscribe((hasPermission) => {
      if (hasPermission) {

      } else {
        // ❌ Permission denied
        this.snackBar.open('Permission Denied!!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-warning']
        });
      }
    });
  }
  PrintClick() {
    this.PermissionCheck("PRINT").subscribe((hasPermission) => {
      if (hasPermission) {

      } else {
        // ❌ Permission denied
        this.snackBar.open('Permission Denied!!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-warning']
        });
      }
    });
  }
  @ViewChild(MatPaginator, { static: false })
  set paginator(v: MatPaginator) {
    this.dataSourceTable.paginator = v;
  }
  private searchSubject: Subject<string> = new Subject<string>();
  ngOnInit(): void {
    setInterval(() => { this.today = new Date(); }, 1000);
    this.onLoadVehicleType()
    this.onLoadLocation()
    //this.onLoad();
    this.searchSubject.pipe(
      debounceTime(500),                     // Wait 500ms after the user stops typing
      distinctUntilChanged(),                // Only trigger if search query has changed
      switchMap(searchText => this.loadItems(searchText)) // Fetch new data based on search
    ).subscribe(data => {
      // Once the observable emits the data, update your filtered list
      this.filteredContractList = this.prepareContractList(data);
      this.customer_name = this.filteredContractList[0].Customer_Name
    });
    this.securityService.GetIsUserActive().subscribe(data => {
      this.Username = data.username;
    });
  }

  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
    this.DocList.paginator = this.paginator;
    console.log(this.dateInputs.length);
  }
  onLoadLocation() {
    this.securityService.GetLocation().subscribe(data => {
      this.Location = this.prepareLocationList(data);
    }, error => {
      console.error('Error fetching doc types:', error);
    });
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

  //Insert Doc header Functions
  SaveDocDetails() {
    this.DocList = this.DocList.map((item: { CmtDate: string | Date; DOCIsuuedDate: string | Date; DOCReturnDate: string | Date; }) => ({
      ...item,
      CmtDate: this.formatDateOnly(item.CmtDate),
      DOCIsuuedDate: this.formatDateOnly(item.DOCIsuuedDate),
      DOCReturnDate: this.formatDateOnly(item.DOCReturnDate),
    }));
    this.PermissionCheck("SAVE").subscribe((hasPermission) => {
      if (hasPermission) {
        if (this.contractNo != "" && this.contractNo != null) {
          this.selectedDocStatus = this.selectedDocStatus == "IN" ? "1" : "0"
          this.boolFileCrStatus=this.fileStatus=="FILE"?false:true
          var DocData = { "strDmcode": this.dmcode, "strContractNo": this.contractNo, "strCustName": this.customer_name, "strHirer": this.hirername, "strVehicleNo": this.vehicleNo.toUpperCase(), "strActDate": this.activated_date, "strFileActRemark": this.strFileActRemark, "strRemark": this.remark, "strReceivedDate": this.reciveddate,"strcrReceivedDate": this.crReceivedDate,  "strDumFCreationDate": (this.dummyfile_creationdate), "strCrdOfficer": this.credit_officer, "strVehicleType": this.vehicle_type, "boolChkActive": this.checkactive, "boolchkScanned": this.checkscaned, "strLastUser": this.last_user, "strLocCode": this.loccode, "strFileissuedto": this.issued_to, "strLastIssuedDate": this.lastIssued_date, "strLastReturnDate": this.lastrtn_date, "strDocStatus": this.selectedDocStatus, "strIssueRemark": this.issueRemark,"BOOLCRFIRST":this.boolFileCrStatus};

          this.securityService.AddDocHeader(DocData, this.DocList, this.Username).subscribe({
            next: (response) => {
              this.snackBar.open(response, 'Close', {
                duration: 3000,
                panelClass: ['snackbar-success'],
                verticalPosition: 'top'
              });
              this.dataSourceTable.data = [];
              this.onLoad();
              this.Clear();
            },

            error: (error) => {
              this.snackBar.open(error.error.ExceptionMessage || 'An error occurred', 'Close', {
                duration: 5000,
                panelClass: ['snackbar-warning'],
                verticalPosition: 'top'
              });
            }
          });
        } else {
          this.snackBar.open('Check Inputs', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning'],
            verticalPosition: 'top'
          });
        }
      } else {
        // ❌ Permission denied
        this.snackBar.open('Permission Denied!!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
      }
    });
    this.isDasabled_btnNew = true
    this.isDasabled_btnEdit = false
    this.isDasabled_btnDelete = false
  }
  formatDateOnly(date: Date | string): string | null {
    if (!date) return null;

    const d = new Date(date); // Safe for Date or ISO string
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  Clear() {
    this.btnType = ""
    this.DataTable = [];
    this.DocList = [];
    this.searchText = "";
    this.customer_name = "";
    this.isvisibleSelectVehNoCmb=true
    this.product_code = "";
    this.product_redirectpath = ""
    this.isDasabled_fileactRemark=false
    this.isvisibleSelectVehNoText = false
    this.isDasabled_btnNew = false
    this.isvisibleSavebtn = false
    this.strFileActstatus = ""
    this.isCardVisible = false
    this.checkactive = false
    this.last_user = ""
    this.activated_date = ""
    this.reciveddate = ""
    this.dummyfile_creationdate = ""
    this.credit_officer = ""
    this.remark = ""
    this.hirername = ""
    this.isDasabled_btnNew = true
    //this.isDasabled_btnEdit=false
    this.isreadonlyContract = true
    this.isDasabled_btnEdit = true
    this.rackno = ""
    this.DataTable = []
    this.strFileActRemark = ""
    this.vehicleNo = ""
    this.dataSourceTable.data = [];
    this.lblstatus = ""
    this.checkscaned = false
    this.issued_to = ""
    this.lastIssued_date = ""
    this.lastrtn_date = ""
    this.selectedDocStatus = "IN"
    this.issueRemark = ""
    this.crReceivedDate=""
    //this.dataSourceTable=this.DocList
  }

  onLoad() {
    this.securityService.GetContract().then(data => {
      this.ContractList = this.prepareContractList(data);
      this.dataSourceTable.data = this.ContractList;
    });
  }

  // Triggered on user input
  onSearch(): void {
    this.searchSubject.next(this.searchText); // Push search query into the stream
    this.contractNo = this.searchText;
    this.onLoadData(this.contractNo);
  }

  // Load items from the backend (with search query)
  loadItems(searchQuery: string): Observable<any> {
    // Returning the observable from the service directly
    return this.securityService.getContractsforDrpDwn(searchQuery, this.page, this.pageSize);
  }
  onLoadData(selectedValue: string): void {

    this.securityService.GetDataContract(selectedValue).subscribe(
      (data: any) => {

        // this.securityService.GetDataContract(selectedValue).subscribe(data => {        
        this.DataTable = this.prepareDataList(data);
        this.dataSourcebyContractNo.data = this.DataTable;
        this.customer_name = data[0].strCustName;

        this.isCardVisible = true
        this.isViewTable = true
        if (data[0].strmsg != null) {
          this.snackBar.open(data[0].strmsg, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning'],
            verticalPosition: 'top'
          });
        }
      }, (error) => {
        console.error('Error fetching doc types:', error);
        this.snackBar.open('Failed to fetch contract data.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          verticalPosition: 'top'
        });
      });
  }
  vehicleTypeExists(): boolean {
  return this.VehicleTypeList.some(
    (x: VehicleType) => x.Vehicle_type === this.vehicle_type
  );
}
  onGetAllData(status:string): void {

    this.securityService.GetAllDataList(this.vehicleNo, this.contractNo, this.btnType).subscribe(
      (data: any) => {

        // this.securityService.GetAllDataList(this.vehicleNo,this.contractNo,this.btnType).subscribe(data => {
        this.AllDataList = data;
        if (this.AllDataList[0].strReturnmsg == "Exists") {
          this.snackBar.open('Already Exist the Vehicle No', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning'],  // optional custom styling
            verticalPosition: 'top'
          });
          return;
        }

        this.hirername = this.AllDataList[0].strHirer
        //this.vehicle_type=status=='edit'?this.AllDataList[0].strVehicleType:this.vehicle_type
        if (!this.VehicleTypeList.some(x => x.Vehicle_type === this.vehicle_type)) {
          this.VehicleTypeList.unshift({
            Vehicle_type: this.vehicle_type
          });
        }


        // this.activated_date= this.AllDataList[0].strActDate 

        //this.dummyfile_creationdate=this.AllDataList[0].strDumFCreationDate==""?"":new Date(this.AllDataList[0].strDumFCreationDate).toISOString().split('T')[0];
        // this.dummyfile_creationdate=this.AllDataList[0].strDumFCreationDate==""?"":new Date(this.AllDataList[0].strDumFCreationDate).toISOString().split('T')[0];
        this.convertdummyfile_creationdate(this.AllDataList[0]?.strDumFCreationDate)
        this.credit_officer = this.AllDataList[0].strCrdOfficer
        this.remark = this.AllDataList[0].strRemark
        this.rackno = this.AllDataList[0].strRackNo
        this.last_user = this.AllDataList[0].strLastUser
        this.strFileActRemark = this.AllDataList[0].strFileActRemark
        this.checkscaned = this.AllDataList[0].boolchkScanned
        if(this.checkactive==false){
          this.isDasabled_fileactRemark=true
        }
        else{
          this.isDasabled_fileactRemark=false
        }

        this.loccode = this.AllDataList[0].strLocCode
        this.fileLocation = this.AllDataList[0].strLocName
        if(this.lblstatus==="- EDIT"){
          this.vehicle_type = this.AllDataList[0].strVehicleType
        }
        else if(this.lblstatus==="- NEW"){
          this.vehicle_type =this.vehicle_type
          //this.vehicle_type = this.AllDataList[0].strVehicleType
        }
        else{
          this.vehicle_type = this.AllDataList[0].strVehicleType
        }
        

        //this.reciveddate=new Date(this.AllDataList[0].strReceivedDate).toISOString().split('T')[0];
        this.convertreciveddate(this.AllDataList[0]?.strReceivedDate)
        this.convertcrreciveddate(this.AllDataList[0]?.strcrReceivedDate)
        this.convertDate(this.AllDataList[0]?.strActDate)

        this.loc = this.AllDataList[0].boolLoc
        this.issued_to = this.AllDataList[0].strFileissuedto
        this.convertreturnddate(this.AllDataList[0]?.strLastReturnDate)
        this.convertIssuedddate(this.AllDataList[0]?.strLastIssuedDate)
        // this.lastIssued_date=this.AllDataList[0].strLastIssuedDate==""?"":new Date(this.AllDataList[0].strLastIssuedDate).toISOString().split('T')[0];

        // this.lastrtn_date=this.AllDataList[0].strLastReturnDate==""?"":new Date(this.AllDataList[0].strLastReturnDate).toISOString().split('T')[0];

        this.issueRemark = this.AllDataList[0].strIssueRemark
        this.fileStatus=this.AllDataList[0].BOOLCRFIRST==1?"CR":"FILE"
        this.selectedDocStatus = this.AllDataList[0].strDocStatus
        this.dmcode = this.AllDataList[0].strDmcode
        if (this.btnType == "New") {
          this.onLoadNewTable({
            pageIndex: 0, pageSize: 10,
            length: 0
          });
          //this.loccode = '001'
       
          this.loccode =  this.AllDataList[0].strLocCode;
          this.fileLocation = 'BSD'
          this.strFileActstatus = "Active"
          this.checkactive = true
          this.isDasabled_fileloc=false
          this.reciveddate = this.today.toISOString().split('T')[0];
          this.crReceivedDate =this.fileStatus=="CR"?this.today.toISOString().split('T')[0]:"";
          this.selectedDocStatus = "IN"
        }
        else {

          this.onLoadTable({

            pageIndex: 0, pageSize: 10,
            length: 0
          });
          this.loccode = this.AllDataList[0].strLocCode
          this.fileLocation = this.AllDataList[0].strLocName
          this.strFileActstatus = this.AllDataList[0].strFileActStatus
          this.checkactive = this.AllDataList[0].boolchkActive
        }


      }, (error) => {
        console.error('Error fetching doc types:', error);
        this.snackBar.open('Failed to fetch contract data.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          verticalPosition: 'top'
        });
      });

  }
  onNewTable(): void {
    this.onLoadNewTable({
      pageIndex: 0, pageSize: 10,
      length: 0
    });
  }
  convertDate(strActDate: string) {
    if (strActDate) {
      // Split the date and time (DD/MM/YYYY and AM/PM part)
      const [dateStr, timeStr] = strActDate.split(' ');

      // Split date into components (DD/MM/YYYY)
      const [month, day, year] = dateStr.split('/');

      // Create a new Date object using the components
      const formattedDate = new Date(Date.UTC(
        parseInt(year),  // year
        parseInt(month) - 1,  // month (JavaScript uses 0-based months)
        parseInt(day)  // day
      ));

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
      const [month, day, year] = dateStr.split('/');

      // Create a new Date object using the components
      const formattedDate = new Date(Date.UTC(
        parseInt(year),  // year
        parseInt(month) - 1,  // month (JavaScript uses 0-based months)
        parseInt(day)  // day
      ));

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
  convertreciveddate(strReceivedDate: string) {
    if (strReceivedDate) {
      // Split the date and time (DD/MM/YYYY and AM/PM part)
      const [dateStr, timeStr] = strReceivedDate.split(' ');

      // Split date into components (DD/MM/YYYY)
      const [month, day, year] = dateStr.split('/');

      // Create a new Date object using the components
      const formattedDate = new Date(Date.UTC(
        parseInt(year),  // year
        parseInt(month) - 1,  // month (JavaScript uses 0-based months)
        parseInt(day)  // day
      ));

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
  convertcrreciveddate(strcrReceivedDate: string) {
    if (strcrReceivedDate) {
      // Split the date and time (DD/MM/YYYY and AM/PM part)
      const [dateStr, timeStr] = strcrReceivedDate.split(' ');

      // Split date into components (DD/MM/YYYY)
      const [month, day, year] = dateStr.split('/');

      // Create a new Date object using the components
      const formattedDate = new Date(Date.UTC(
        parseInt(year),  // year
        parseInt(month) - 1,  // month (JavaScript uses 0-based months)
        parseInt(day)  // day
      ));

      // Check if the date is valid
      if (!isNaN(formattedDate.getTime())) {
        // Convert the date to YYYY-MM-DD format
        this.crReceivedDate = formattedDate.toISOString().split('T')[0];
        console.log('Formatted activated_date:', this.activated_date);
      } else {
        console.error('Invalid date format:', strcrReceivedDate);
        this.crReceivedDate = '';  // Set default or handle error
      }
    } else {
      console.error('strActDate is null or undefined');
      this.crReceivedDate = '';  // Set default value or handle missing date
    }
  }
  convertIssuedddate(strIssueddate: string) {
    if (strIssueddate) {
      // Split the date and time (DD/MM/YYYY and AM/PM part)
      const [dateStr, timeStr] = strIssueddate.split(' ');

      // Split date into components (DD/MM/YYYY)
      const [month, day, year]= dateStr.split('/');

      // Create a new Date object using the components
      const formattedDate = new Date(Date.UTC(
        parseInt(year),  // year
        parseInt(month) - 1,  // month (JavaScript uses 0-based months)
        parseInt(day)  // day
      ));

      // Check if the date is valid
      if (!isNaN(formattedDate.getTime())) {
        // Convert the date to YYYY-MM-DD format
        this.lastIssued_date = formattedDate.toISOString().split('T')[0];
        console.log('Formatted activated_date:', this.activated_date);
      } else {
        console.error('Invalid date format:', strIssueddate);
        this.lastIssued_date = '';  // Set default or handle error
      }
    } else {
      console.error('strActDate is null or undefined');
      this.lastIssued_date = '';  // Set default value or handle missing date
    }
  }
  convertreturnddate(strReturndate: string) {
    if (strReturndate) {
      // Split the date and time (DD/MM/YYYY and AM/PM part)
      const [dateStr, timeStr] = strReturndate.split(' ');

      // Split date into components (DD/MM/YYYY)
      const [month, day, year] = dateStr.split('/');

      // Create a new Date object using the components
      const formattedDate = new Date(Date.UTC(
        parseInt(year),  // year
        parseInt(month) - 1,  // month (JavaScript uses 0-based months)
        parseInt(day)  // day
      ));

      // Check if the date is valid
      if (!isNaN(formattedDate.getTime())) {
        // Convert the date to YYYY-MM-DD format
        this.lastrtn_date = formattedDate.toISOString().split('T')[0];
        console.log('Formatted activated_date:', this.activated_date);
      } else {
        console.error('Invalid date format:', strReturndate);
        this.lastrtn_date = '';  // Set default or handle error
      }
    } else {
      console.error('strActDate is null or undefined');
      this.lastrtn_date = '';  // Set default value or handle missing date
    }
  }
  PermissionCheck(strActionName: string): Observable<boolean> {
    return this.securityService.GetPermissionChk(this.Username, this.strFormName, strActionName).pipe(
      map((dataList: any) => {
        switch (strActionName) {
          case "NEW": return dataList[0].SZNEWSTATUS === "true";
          case "DEL": return dataList[0].SZDELSTATUS === "true";
          case "PRINT": return dataList[0].SZPRINTSTATUS === "true";
          case "SAVE": return dataList[0].SZSAVESTATUS === "true";
          case "VIEW": return dataList[0].SZVIEWSTATUS === "true";
          default: return false;
        }
      }),
      catchError((error) => {
        const errorMsg = error?.error?.ExceptionMessage || error?.ExceptionMessage || error?.statusText || 'An unexpected error occurred';
        this.snackBar.open(errorMsg, 'Close', {
          duration: 4000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
        return of(false);
      })
    );
  }
onStatusKeyDown(event: KeyboardEvent, rowIndex: number) {

  if (event.key !== 'Tab') {
    return;
  }

  event.preventDefault();

  const selects = this.statusSelects.toArray();

  const nextSelect = selects[rowIndex + 1];

  if (nextSelect) {

    nextSelect.focus();

    setTimeout(() => {
      nextSelect.open();
    }, 50);

  }
}

  onLoadVehicleType() {
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
  onLoadNewTable(event: PageEvent): void {
    this.securityService.GetNewDocTable(this.contractNo).subscribe(
      (data: any) => {
        this.DocList = this.prepareLoadTable(data);
        this.dataSourceTable.data = this.DocList;
      }, (error) => {
        this.snackBar.open(error.error.ExceptionMessage, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
      });
  }
  prepareContractList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        ContractNo: rows[i].strContractNo,
        Customer_Name: rows[i].strCustomerName
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
        CmtDate: rows[i].strCmtDate ? this.parseDateOnly(rows[i].strCmtDate) : null,
        Errors: rows[i].strErrors,
        DOCIsuuedDate: rows[i].strDOCIssuedDate ? this.parseDateOnly(rows[i].strDOCIssuedDate) : null,
        IssuedToName: rows[i].strIssuedToName,
        IssuedRemark: rows[i].strIssuedRemark,
        DOCReturnDate: rows[i].strDOCReturnDate ? this.parseDateOnly(rows[i].strDOCReturnDate) : null
      });
    }
    return res;
  }
  parseDateOnly(str: String) {
    if (!str) return null;
    const [month, day, year] = str.split(' ')[0].split('/');
    return new Date(Number(year), Number(month) - 1, Number(day)); // JS months are 0-based
  }
  // parseDateOnly(str: string): string | null {
  //   if (!str) return null;
  //   const [day, month, year] = str.split(' ')[0].split('/');
  //   return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  // }
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
  //    navigator.clipboard.writeText(this.vehicleNo).then(() => {
  //   console.log('Copied:', this.vehicleNo);
  // });
  // const textArea = document.createElement('textarea');
  // textArea.value = this.vehicleNo;

  // // Hide the textarea
  // textArea.style.position = 'fixed';
  // textArea.style.left = '-999999px';

  // document.body.appendChild(textArea);
  // textArea.focus();
  // textArea.select();

  // try {
  //   const successful = document.execCommand('copy');
  //   console.log(successful ? 'Copied!' : 'Copy failed');
  // } catch (err) {
  //   console.error('Copy failed', err);
  // }

  // document.body.removeChild(textArea);
  //   if (this.vehicleNo === "custom") {
  //     this.selectedValuedrp = "custom"
  //   }
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
  strDmcode: string
  strContractNo: string;
  strVehicleNo: string;
  strHirer: string;
  strActDate: string;
  strFileActRemark: string;
  strRemark: string;
  strReceivedDate: string;
  strcrReceivedDate: string;
  strDumFCreationDate: string
  strCrdOfficer: string
  strVehicleType: string;
  boolChkActive: boolean
  boolchkScanned: boolean
  strCustName: string
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
  CmtDate: Date
}

interface VehicleType {
  Vehicle_type: string;
}













