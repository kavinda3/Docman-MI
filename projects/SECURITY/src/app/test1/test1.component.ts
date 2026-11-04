import { Component, OnInit } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { HttpClient, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.scss']
})
export class Test1Component implements OnInit {
  displayedColumns = ['Contract_No'];
  dataSource = new MatTableDataSource<any>();
  totalRecords = 1000000;
  ContractList:any=[];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(`http://localhost:44368/api/SecurityModuleAPI/GetAllContracts`)
    .subscribe((data: any) => {
      //this.dataSource.data = data.records;
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
}
