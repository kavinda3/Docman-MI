import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { merge } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FooterComponent } from './../footer/footer.component';
import { MatTableDataSource } from '@angular/material/table';
import { SecurityService } from '../../shared/security-service.service';
import { ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-filerack',
  templateUrl: './filerack.component.html',
  styleUrls: ['./filerack.component.scss']
})
export class FilerackComponent implements OnInit {
  today = new Date();
  expandedElement: any;
  dragStart$ = this.dragulaService.drag("MIDRAG").pipe(mapTo(true));
  dragEnd$ = this.dragulaService.dragend("MIDRAG").pipe(mapTo(false));
  isDragging$ = merge(this.dragStart$, this.dragEnd$).pipe(startWith(false));
  selection = new SelectionModel<Element>(true, []);
  displayedColumns = ['Contract_No', 'Hirer', 'Vehicle_No', 'Rack_No', 'edit'];
  ProductList: any = [];
  MenuGroupList: any = [];
  ParentMenuList: any = [];
  ContractList: any = [];
  page = 0;
  pageSize = 10;
  btnName: string = "Save";
  searchQuery = '';
  totalRecords = 1000000;
  userName = ""
  contract_no: string = "";
  hirer: string = "";
  vehicle_no: string = "";
  rack_no: string = "";

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
  constructor(private snackBar: MatSnackBar, private dragulaService: DragulaService, public securityService: SecurityService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    setInterval(() => { this.today = new Date(); }, 1000);
    this.loadItems({
      pageIndex: 0, pageSize: 10,
      length: 0
    });
    this.onLoad();
    this.securityService.GetIsUserActive().subscribe(data => {
      this.userName = data.username;
    });
  }
  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  loadItems(event: PageEvent): void {
    this.securityService.getItems(this.searchQuery, this.page, this.pageSize).subscribe(data => {
      this.ContractList = this.prepareContractList(data);
      this.dataSource.data = this.ContractList;
    });
  }
  //Edit MenuItem Functions
  EditContract(ContractId: string, rackNo: string) {
    this.btnName = "Edit";
    this.contract_no = (ContractId);
    this.rack_no = rackNo == '-' ? "" : rackNo;
    // for(var i=0;i<this.ProductList.length;i++){
    //   if(this.ProductList[i].ProductID==this.contract_no){
    //     this.contract_no = this.ProductList[i].ProductName;
    //     this.rack_no = this.ProductList[i].ProductCode;
    //   }
    // }
  }

  //Save MenuItem Functions
  // SaveMenuItem(){
  //   if(this.contract_no!="" && this.contract_no!=null && this.rack_no!="" && this.rack_no!=null){

  //     var rackData = {"strContractNo":this.contract_no,"strRackNo":this.rack_no};

  //     this.securityService.EditFileRack(rackData).subscribe(c=>{
  //       alert(c);
  //       this.onLoad();
  //       this.Clear();
  //     });
  //   }else{
  //     alert("Check Inputs");
  //   }
  // }
  SaveMenuItem() {
    if (this.contract_no && this.rack_no) {
      const rackData = {
        strContractNo: this.contract_no,
        strRackNo: this.rack_no,
        strUserName: this.userName // You can replace this with the actual username if needed
      };
      this.securityService.EditFileRack(rackData).subscribe(
        response => {
          this.snackBar.open(response, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            verticalPosition: 'top'
          });

          this.onSearch();
          this.Clear();
        },
        error => {
          // Show error message in snack bar
          this.snackBar.open(error.error.ExceptionMessage, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-warning'],
            verticalPosition: 'top'
          });

          console.error('Error:', error);  // Log to console for debugging
        }
      );

    } else {
      this.snackBar.open('Please enter both Contract No and Rack No', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning'],
        verticalPosition: 'top'
      });
    }
  }


  Clear() {
    this.contract_no = "";
    this.hirer = "";
    this.vehicle_no = "";
    this.rack_no = "";
    this.btnName = "Save";
  }

  onLoad() {
    this.securityService.GetContract().then(data => {
      this.ContractList = this.prepareContractList(data);
      this.dataSource.data = this.ContractList;
    });
  }

  prepareContractList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        ContractNo: rows[i].strContractNo,
        Hirer: rows[i].strHirer,
        VehicleNo: rows[i].strVehicleNo,
        RackNo: rows[i].strRackNo
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

  prepareMenuItemList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        MenuItemID: rows[i].iMenuID,
        MenuItemName: rows[i].strMenuName,
        MenuAlias: rows[i].strAlias,
        Url: rows[i].strUrl,
        ProductID: rows[i].iProductID,
        ProductName: rows[i].strProductName,
        MenuGroupID: rows[i].iMenuGroupID,
        MenuGroupName: rows[i].strMenuGroupName,
        MenuParentName: rows[i].strParentMenuName,
        Endpoint: rows[i].boolEndPoint,
        Visible: rows[i].boolVisible,
        MenuOrder: rows[i].strMenuOrder,
      });
    }
    return res;
  }
  onSearch(): void {
    this.page = 0;  // Reset page when search changes
    this.loadItems({
      pageIndex: 0, pageSize: 10,
      length: 0
    });
  }

  // onPageChange(event: any): void {
  //   this.page = event.pageIndex;
  //   this.pageSize = event.pageSize;
  //   this.loadItems({pageIndex: 0, pageSize: 10,
  //     length: 0});
  // }
}
export interface rackData {
  strContractNo: string;
  strRackNo: string;
}