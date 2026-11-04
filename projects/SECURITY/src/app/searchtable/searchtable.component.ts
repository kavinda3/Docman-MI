import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SecurityService } from '../../shared/security-service.service';

@Component({
  selector: 'app-searchtable',
  templateUrl: './searchtable.component.html',
  styleUrls: ['./searchtable.component.scss']
})
export class SearchtableComponent implements OnInit {

  displayedColumns = ['Contract_No', 'Hirer','Vehicle_No','Rack_No','edit'];
  dataSource = new MatTableDataSource<any>();
  searchQuery = '';
  page = 0;
  pageSize = 10;
  ContractList:any=[];
  expandedElement: any;
  constructor(public securityService:SecurityService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.securityService.getItems(this.searchQuery, this.page, this.pageSize).subscribe(data => {
      this.ContractList = this.prepareContractList(data);
      this.dataSource.data = this.ContractList;
    });
  }
  prepareContractList(rows:any) {
    const res=[];
    for(let i=0;i<rows.length;i++) {
      res.push({
        ContractNo:rows[i].strContractNo,
        Hirer:rows[i].strHirer,
        VehicleNo:rows[i].strVehicleNo,
        RackNo:rows[i].strRackNo
      });
    }
    return res;
  }
  onSearch(): void {
    this.page = 0;  // Reset page when search changes
    this.loadItems();
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadItems();
  }

}
