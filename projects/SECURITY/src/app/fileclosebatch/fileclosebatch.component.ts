import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { merge } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FooterComponent } from './../footer/footer.component';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { SecurityService } from '../../shared/security-service.service';
import { ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-fileclosebatch',
  templateUrl: './fileclosebatch.component.html',
  styleUrls: ['./fileclosebatch.component.scss']
})
export class FileclosebatchComponent implements OnInit {
  //columnNames: string[] = [];
  today = new Date();
  expandedElement: any;
  dragStart$ = this.dragulaService.drag("MIDRAG").pipe(mapTo(true));
  dragEnd$ = this.dragulaService.dragend("MIDRAG").pipe(mapTo(false));
  isDragging$ = merge(this.dragStart$, this.dragEnd$).pipe(startWith(false));
  selection = new SelectionModel<Element>(true, []);
  displayedColumns = ['BundleNo', 'SeqNo', 'ContractNo', 'HirerName', 'VehicleNo', 'ChangeStatus', 'RemovedafterTRN'];

  columnNames1: string[] = [];
  //columnNames1 = this.displayedColumns.map(col => col.name);
  ProductList: any = [];
  cboBundleList: any = [];
  MenuGroupList: any = [];
  ParentMenuList: any = [];
  ContractList: any = [];
  page = 0;
  pageSize = 10;
  btnName: string = "Save";
  searchQuery = '';
  totalRecords = 1000000;
  lblStatus = "";
  lblFileStatus = ""
  contractNo = "";
  contract_no: string = "";
  hirer: string = "";
  vehicle_no: string = "";
  rack_no: string = "";
  isDisableCompleteBatch = false;
  isCompleteBatch = true;
  isDasabled_btnSave = false;
  isDasabled_btnPrint = false;
  isDasabled_btnNew = true;
  isDasabled_btnClear = true;
  isLoading = false;
  isDasabled_btnEdit = true;
  bundleNo: string = "";
  lblBundleInfo: string = "";
  DataTable: any = [];
  selectedBatchNo: string = '';
  isPromptVisible = false;
  dataSourceBatchNo: MatTableDataSource<Element>;
  displayedColumnsnew = ['Batch_No', 'Date', 'EnterUser', 'Complete'];
  isVisiblepnlSearch = true;
  BatchNoList: any = [];
  strMode: string = ""
  lblMode: string = "CLOSE FILE BATCH";
  isDasabled_BatchNo = true;
  chkComplete: boolean = false;
  isDasabled_Remarks = true;
  batchNo: string = '';
  remark: string = '';
  Username: string = '';
  D: any = [];
  DOC: any = [];
  BTList: any = [];
  Bundle: any = [];
  closedate: string = '';
  DList: any = [];
  BundleDetails: any = [];
  boolBatchComple: Boolean = false;
  boolBatchReopen: Boolean = false;
  boolTrnAdded: Boolean = false;
  isDasabled_btnTransfer = false;
  pnlContractDetail = false;
  dtpBatchDate = true
  boolCompleteBundle: boolean = false;
  boolReopenBundle: boolean = false;
  lblbtnApproveReopen: string = "Approve Reopen Bundle"
  cboBundleNo = false
  nxtBundleNo: number = 0;
  strEnterUser: string = '';
  strStartDate: string = '';
  gvCloseFile = false;
  btnApproveReopen = false
  @ViewChild(MatTable) table!: MatTable<any>;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  SaveDocDetails() {
    if (this.strMode === 'new') {
      const message = `Do You Need to Create New Close File Batch?`;
      const snackBarRef = this.snackBar.open(message, 'Yes',
        {
          duration: 5000, // Auto-dismiss after 5 seconds
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['custom-snackbar']
        });

      snackBarRef.onAction().subscribe(() => {
        // User clicked "Yes"
        this.SaveCloseBatch();
      });
    }
    if (this.strMode === 'edit') {
      if (this.Valdidate() == true) {
        const message = `Do You Need to Save Changes Close File Batch?`;
        const snackBarRef = this.snackBar.open(message, 'Yes', {
          duration: 5000, // Auto-dismiss after 5 seconds
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['custom-snackbar']
        });

        snackBarRef.onAction().subscribe(() => {
          // User clicked "Yes"
          this.SaveCloseBatch();
        });
      }
    }

  }

  Valdidate() {
    if (this.DList.length == 0) {
      this.snackBar.open('Bundle details are not entered', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      return false
    }
    return true
  }
  EditClick() {
    this.fnSetMode("EDIT");
  }
  NewClick() {
    this.fnSetMode("NEW");
  }
  ClearClick() {
    this.fnSetMode("CLEAR");
  }
  onDoubleClick() {
    this.loadBatchNo();
    this.isPromptVisible = true;
  }
  closePrompt() {
    this.isPromptVisible = false; // Hide the custom prompt
    //this.userInput = ''; // Clear the input field
  }
  onRowClicked(row: any) {
    this.batchNo = row.SZ_BATCH_NO; // Assign TRN_No to textbox
    this.isPromptVisible = false;
    this.fnLoadCloseFileBatch("");
    //this.onLoadMain();
    //this.locCode=this.location
    //this.LoadAuthorizer();
  }
  onSearchfunction() {
    this.fnSearchContractNo("");
  }
  msg: string = ""
  fnSearchContractNo(strLoadStatus: string) {

    this.securityService.fnGetContractNodet(this.contractNo, this.Username).subscribe(data => {
      //this.BTList = this.prepareContractList(data[0].BT);
      this.D = data[0].D;
      //this.dataSource.data = this.ContractList;
      if (this.D.length > 0) {
        this.msg = "This file is in the bundle " + this.D[0].IBUNDLE_NO + " of the close file batch " + this.D[0].SZ_BATCH_NO +
          "\nDo you want to show the batch details?";
        const snackBarRef = this.snackBar.open(this.msg, 'Yes', {
          duration: 15000, // Auto-dismiss after 5 seconds
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
        snackBarRef.onAction().subscribe(() => {
          this.fnSetMode("edit");
          this.batchNo = this.D[0].SZ_BATCH_NO;
          this.fnLoadCloseFileBatch("");
        });
      }
      else if (data[0].doc) {
        this.DOC = data[0].doc;

        this.msg =
          "This item is not in close file batch. Current Location: " +
          this.DOC.SZLOC_NAME ;
        this.snackBar.open(this.msg, 'Close', {
          duration: 10000,
          horizontalPosition: 'center',
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
      }

    });

  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  @ViewChild(MatPaginator, { static: false })
  set paginator(v: MatPaginator) {
    this.dataSource.paginator = v;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  dataSource: MatTableDataSource<Element>;
  constructor(private dragulaService: DragulaService, public securityService: SecurityService, private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource();
    this.dataSourceBatchNo = new MatTableDataSource();
  }

  ngOnInit(): void {
    setInterval(() => { this.today = new Date(); }, 1000);
    this.Bundle = [];
    this.onLoad();
    this.closedate = new Date().toISOString().split('T')[0];
    this.securityService.GetIsUserActive().subscribe(data => {
      this.Username = data.username;
    });
  }
  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  onLoadTable() {
    this.securityService.fnGetBundle(this.batchNo, this.bundleNo).subscribe(data => {
      if (this.bundleNo == "") {
        // Show all rows
        this.dataSource.data = this.DList;
      } else {
        // Filter rows where IBUNDLE_NO matches selected bundleNo
        this.dataSource.data = this.DList.filter((item: any) => {
          if (item.IBUNDLE_NO == null) return false;
          return item.IBUNDLE_NO.toString() === this.bundleNo.toString();
        });
      }
      this.btnApproveReopen = false
      this.BundleDetails = data[0].BD;
      this.lblBundleInfo = "Bundle No " + this.bundleNo
      if (this.BundleDetails) {
        this.boolReopenBundle = this.BundleDetails.BOOL_REOPEN
        //alert(this.boolReopenBundle +"2")
        this.boolCompleteBundle = this.BundleDetails.BOOL_COMPLETE
        this.strEnterUser = this.BundleDetails.SZ_ENTER_USER;
        this.strStartDate = this.BundleDetails.DT_BUNDLE_START;
        this.lblBundleInfo += "\nStarted by " + this.strEnterUser + " at " + this.strStartDate.slice(0, 10);

        if (this.boolCompleteBundle) {
          this.lblBundleInfo += "\nCompleted by " + this.BundleDetails.SZ_COMPLETE_USER + " at " + this.BundleDetails.DT_COMPLETE.slice(0, 10);
          this.boolBatchComple = true;
          //this.isDisableCompleteBatch=true
          //this.chkComplete=true
          this.btnApproveReopen = true;
          this.lblbtnApproveReopen = "Approve Re Open";

        }
        else {
          this.btnApproveReopen = true;
          this.isDisableCompleteBatch = false
          this.chkComplete = false
          if (this.boolReopenBundle) {
            this.btnApproveReopen = true;
            this.lblbtnApproveReopen = "Approve Re Complete";
            this.isDisableCompleteBatch = true
            //lblReopen.Text = "RE OPEN";  
            //this.btnApproveReopen.Text = "Approve Re Open Bundle";
            this.lblBundleInfo += "\nRE OPEN by " + this.BundleDetails.SZ_LAST_REOPEN_USER + " at " + this.BundleDetails.DT_LAST_REOPEN.slice(0, 10);

          }

        }
        if (this.BundleDetails.BOOL_COMPLETE == true) {
          // this.btnApproveReopen = false;
        }
      }

      this.lblBundleInfo += "\nFile Count = " + data[0].D.length;
    });

  }

  onBundleNoChanged() {
    if (this.bundleNo == "") {
      // Show all rows
      this.dataSource.data = this.DList;
    } else {
      // Filter rows where IBUNDLE_NO matches selected bundleNo
      this.dataSource.data = this.DList.filter((item: any) => {
        if (item.IBUNDLE_NO == null) return false;
        return item.IBUNDLE_NO.toString() === this.bundleNo.toString();
      });
    }
  }


  sortByBundleNo(bundleNo: any) {
    this.dataSource = this.ContractList.sort((a: any, b: any) => {
      return a.IBUNDLE_NO - b.IBUNDLE_NO;  // ascending sort by IBUNDLE_NO
    });
  }
  loadBatchNo() {
    this.securityService.GetBatchNo().then(data => {
      this.BatchNoList = this.prepareBatchNoList(data);
      this.dataSourceBatchNo.data = this.BatchNoList;
    });
  }
 
  @ViewChild('paginator1') set paginator1(v: MatPaginator) {
    this.dataSourceBatchNo.paginator = v;
  }
  prepareBatchNoList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        SZ_BATCH_NO: rows[i].SZ_BATCH_NO,
        SZ_ENTER_DATE: rows[i].SZ_ENTER_DATE,
        SZ_ENTER_USER: rows[i].SZ_ENTER_USER,
        iCOMPLETE: rows[i].iCOMPLETE,
      });
    }
    return res;
  }
  //Edit MenuItem Functions
  EditContract(ContractId: string) {
    this.btnName = "Edit";
    this.contract_no = (ContractId);
    for (var i = 0; i < this.ProductList.length; i++) {
      if (this.ProductList[i].ProductID == this.contract_no) {
        this.contract_no = this.ProductList[i].ProductName;
        this.rack_no = this.ProductList[i].ProductCode;
      }
    }
  }

  //Save MenuItem Functions
  SaveCloseBatch() {
    var CloseFileData = { "SZ_BATCH_NO": this.batchNo, "SZ_ENTER_DATE": this.closedate, "BOOL_COMPLETE": this.chkComplete, "SZ_REMARK": this.remark };

    this.securityService.AddCloseFile(CloseFileData, this.Username).subscribe({
      next: (response) => {
        this.snackBar.open(response, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.snackBar.open(error.error.ExceptionMessage || 'An error occurred', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top'
        });
      }
    });
  }
  // clickbtnApproveReopen() {

  //     this.securityService.fnsetReopenStatus(this.batchNo,this.bundleNo, this.Username).subscribe({
  //         next: (response) => {
  //           this.snackBar.open(response, 'Close', {
  //             duration: 4000,
  //             panelClass: ['snackbar-success'],
  //             verticalPosition: 'top'
  //           });
  //           this.isDasabled_btnNew = true;
  //           this.isDasabled_btnEdit = true;

  //           this.fnLoadCloseFileBatch("")
  //           this.Clear();
  //            this.dataSource.data = [];
  //         },
  //         error: (error) => {
  //           const errorMsg = error.error.ExceptionMessage || 'An unexpected error occurred';

  //           this.snackBar.open(errorMsg, 'Close', {
  //             duration: 4000,
  //             panelClass: ['snackbar-warning'],
  //             verticalPosition: 'top'
  //           });

  //         }
  //       });

  // }
  clickbtnApproveReopen() {
    this.securityService.fnsetReopenStatus(this.batchNo, this.bundleNo, this.Username).subscribe({
      next: (response) => {
        this.snackBar.open(response, 'Close', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top'
        });

        this.isDasabled_btnNew = true;
        this.isDasabled_btnEdit = true;

        // Clear first
        this.lblFileStatus = "";
        this.dataSource.data = [];
        this.table?.renderRows?.();

        // Then run your other functions
        this.Clear();
        // Optional: only reload if needed
        // this.fnLoadCloseFileBatch("");
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
  TransfercloseFile() {

    const message = `Do You Need to Transfer Close File Batch?`;
    const snackBarRef = this.snackBar.open(message, 'Yes', {
      duration: 5000, // Auto-dismiss after 5 seconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-primary']
    });
    snackBarRef.onAction().subscribe(() => {
      this.isLoading = true;
      this.securityService.TransferCloseFileBatch(this.batchNo, this.Username).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open(response, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.error.ExceptionMessage || 'An error occurred', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-warning'],
            verticalPosition: 'top'
          });
        }
      });
    });
  }

  Clear() {
    this.fnSetMode("CLEAR");
    this.closedate = new Date().toISOString().split('T')[0];

    //this.btnName = "Save";
  }

  onLoad() {
    this.securityService.GetContract().then(data => {
      // this.ContractList = this.prepareContractList(data);
      this.dataSource.data = this.ContractList;
    });
  }

  fnSetMode(pMode: string) {
    this.lblStatus = "";
    this.isVisiblepnlSearch = false;
    //  panel1.BorderStyle = System.Windows.Forms.BorderStyle.None;
    if (pMode == "NEW") {
      this.strMode = "new";
      this.lblMode = "CREATE NEW CLOSE FILE BATCH";
      //lblFileStatus.Text = "Files are not added yet \n\nNew batch starting..";
      // panel1.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
      this.pnlContractDetail = false;
      //fnActiveCtrl(true);
      this.fnSetNextBatchNo();
      this.isDasabled_BatchNo = true;
      this.isDasabled_btnNew = false;
      this.isDasabled_btnEdit = false;
      this.isDasabled_btnSave = true;
      this.isDasabled_btnPrint = false;
      this.isDisableCompleteBatch = true;
      this.chkComplete = false;
      //gvCloseFile.Visible = false;
      this.isDasabled_Remarks = true;
      this.isVisiblepnlSearch = false;
      this.fnInitCtrl();
    }
    else if (pMode == "EDIT") {
      //this.fnSetMode("CLEAR");
      this.fnInitCtrl();
      this.strMode = "edit";
      //lblFileStatus.Text = "No files to show. Select the batch number";
      this.lblMode = "EXISTING CLOSE FILE BATCH - EDIT MODE";
      this.isDasabled_BatchNo = false;
      this.isDasabled_btnNew = false;
      this.isDasabled_btnEdit = false;
      this.isDasabled_btnPrint = false;
      this.isDisableCompleteBatch = true;
      this.chkComplete = false;
      this.pnlContractDetail = false;
      this.isVisiblepnlSearch = false;
      this.isDasabled_btnSave = true;

    }
    else if (pMode == "CLEAR") {
      this.fnInitCtrl();
      this.strMode = "clear";
      //lblFileStatus.Text = "Do you want to Edit or Create a new batch? \n\n 1) Click New to create new batch \n\n 2) Click Edit to view existing batch \n\n 3) You can search files ";
      this.lblMode = "CLOSE FILE BATCH";
      this.isDasabled_btnNew = true;
      this.isDasabled_btnEdit = true;
      //pnlContractDetail.Enabled = true;
      //btnCancelBatch.Enabled = false;
      this.isDasabled_btnPrint = false;
      //gvCloseFile.Visible = false;
      this.isDasabled_Remarks = false;
      this.chkComplete = false;
      this.isDasabled_BatchNo = true;
      this.isDisableCompleteBatch = true;
      this.isDasabled_btnSave = false;
      this.pnlContractDetail = false;
      this.isVisiblepnlSearch = true;
      this.dataSource.data = [];
      this.batchNo = "";
      this.lblFileStatus = ""
      this.lblBundleInfo = ""
      this.lblStatus = ""

    }

  }
  fnInitCtrl() {
    this.remark = "";
    this.cboBundleList = [];
    this.chkComplete = false;

  }
  fnLoadCloseFileBatch(strLoadStatus: string) {
    if (this.batchNo == "") {
      this.fnSetMode("edit");
    }
    if (this.batchNo.indexOf("CBT") === -1) {
      this.batchNo = 'CBT' + this.batchNo.padStart(5, '0');
    }
    this.securityService.fnGetCloseFileBatch(this.batchNo, this.Username).subscribe(data => {
      //this.BTList = this.prepareContractList(data[0].BT);
      this.BTList = data[0].BT;
      //this.dataSource.data = this.ContractList;
      if (this.BTList) {
        this.isDasabled_BatchNo = true;
        this.boolBatchComple = this.BTList.BOOL_COMPLETE
        this.boolBatchReopen = this.BTList.BOOL_BTREOPEN;
        this.boolTrnAdded = this.BTList.BOOL_TRN_ADDED;
        this.remark = this.BTList.SZ_REMARK;
        this.isDasabled_btnSave = true
        this.isDasabled_btnTransfer = false
        this.lblStatus = "Started By " + this.BTList.SZ_ENTER_USER + " at " + this.BTList.DT_ENTER_DATE?.slice(0, 10);

        if (this.boolBatchComple) {
          // this.btnApproveReopen = false;
          this.isDasabled_btnTransfer = true;
          this.lblStatus += "\nBatch is completed by " + this.BTList.SZ_COMPLETE_USER + " at " + this.BTList.DT_COMPLETE_DATE?.slice(0, 10);
          this.fnActiveCtrl(false)
          this.chkComplete = true;
          this.isDisableCompleteBatch = false
          if (this.boolTrnAdded) {
            this.isDasabled_btnTransfer = false;
            this.lblStatus += "\nFile is transfered by " + this.BTList.SZ_COMPLETE_USER + " at " + this.BTList.DT_TRN_DATE?.slice(0, 10) + " (TRN NO : " + this.BTList.SZ_TRN_NO + ")";
            this.isDasabled_btnSave = false;
            this.isDisableCompleteBatch = true;
          }
        }
        else {
          this.fnActiveCtrl(true);
          this.chkComplete = false;
          this.isDisableCompleteBatch = false
          this.lblStatus += "\nNot Completed Yet";
          if (this.boolBatchReopen) {
            this.lblStatus += "\nREOPEN by " + this.BTList.SZ_BTLAST_REOPEN_USER + " " + this.BTList.DT_BTLAST_REOPEN?.slice(0, 10);
          }
        }
        this.cboBundleNo = true;
        this.fnSetTotalBundles()
        if (data[0].BD) {
          this.pnlContractDetail = true;
          this.lblFileStatus = "";
        }
        else {
          this.pnlContractDetail = false;
          this.lblFileStatus = "No Bundles Created";
        }


        if (data[0].D) {
          this.fnSetTotalBundlesAndUpdateStatus(data);
          //this.lblStatus += "\nTotals bundles " + this.nxtBundleNo + "  Total files " + data[0].D.length;
          this.gvCloseFile = true;

        }
        else {
          this.gvCloseFile = false;
        }
        this.DList = this.prepareDList(data[0].D);
        this.dataSource.data = this.DList
      }
      else {
        this.isDasabled_btnSave = false;
        this.fnSetMode("EDIT")
      }
    });

  }
  fnSetTotalBundlesAndUpdateStatus(data: any) {
    this.securityService.fnGetNextBundle(this.batchNo).subscribe(bundleNo => {
      this.nxtBundleNo = bundleNo;
      this.generateBundleNumbers(this.nxtBundleNo);

      if (data[0].D) {
        this.lblStatus += "\nTotals bundles " + (this.nxtBundleNo - 1) + "  Total files " + data[0].D.length;

        //this.lblStatus += "\nTotals bundles " + this.nxtBundleNo-1 + "  Total files " + data[0].D.length;
        this.gvCloseFile = true;
      }
    });
  }

  fnSetTotalBundles() {
    this.securityService.fnGetNextBundle(this.batchNo).subscribe(data => {
      this.nxtBundleNo = (data);
      this.generateBundleNumbers(this.nxtBundleNo);
    });
  }
  fnSetNextBatchNo() {
    this.securityService.fnGetNextBatchNo().subscribe(data => {
      this.batchNo = (data);
    });
  }
  generateBundleNumbers(iTotBundle: number): void {
    this.Bundle = [];
    for (let i = 0; i < iTotBundle - 1; i++) {
      this.Bundle.push(i + 1);
    }
  }
  fnActiveCtrl(val: boolean) {
    this.pnlContractDetail = val;
    this.dtpBatchDate != val;
    //gvCloseFile.ReadOnly = !val;
    this.isDasabled_Remarks = val;
    this.isDisableCompleteBatch = val;

  }
  prepareDList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        SZ_BATCH_NO: rows[i].SZ_BATCH_NO,
        IBUNDLE_NO: rows[i].IBUNDLE_NO,
        SZCONTRACTNO: rows[i].SZCONTRACTNO,
        SZHIRER: rows[i].SZHIRER,
        BOOL_REMOVED: rows[i].BOOL_REMOVED == false ? "0" : "1",
        SZVEHICLENO: rows[i].SZVEHICLENO,
        SZ_CHANGE_STATUS: rows[i].SZ_CHANGE_STATUS,
        SZREMARK: rows[i].SZREMARK,
        ISEQ: rows[i].ISEQ
      });
    }
    return res;
  }


  prepareMenuGroupList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        MenuGroupID: rows[i].iMenuGroupID,
        MenuGroupName: rows[i].strMenuGroupName
      });
    }
    return res;
  }

  prepareParentMenuList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        ParentMenuID: rows[i].iMenuID,
        ParentMenuName: rows[i].strMenuName
      });
    }
    return res;
  }
  onCheckboxChange(event: Event) {

  }

  onSearch(): void {
    this.fnLoadCloseFileBatch("");
  }
}
export interface CloseFileData {
  SZ_BATCH_NO: string
  SZ_ENTER_DATE: string;
  BOOL_COMPLETE: boolean;
  SZ_REMARK: string;
}