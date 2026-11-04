import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';
import { Observable, Subject } from 'rxjs';
@Component({
  selector: 'app-dummyfilecreate',
  templateUrl: './dummyfilecreate.component.html',
  styleUrls: ['./dummyfilecreate.component.scss']
})
export class DummyfilecreateComponent implements OnInit {
  today =new Date();
 dataSource: MatTableDataSource<Element>;
 expandedElement: any;
  private searchSubject: Subject<string> = new Subject<string>();
  searchText: string = '';   
  contractNo:string=''    
  DataTable:any=[];
  displayedColumns = ['ContractNo', 'VehicleNo','HirerName' ];
  constructor(private dragulaService: DragulaService,public securityService:SecurityService) {
  this.dataSource = new MatTableDataSource();
}
ngOnInit(): void {
  setInterval(() => { this.today = new Date();}, 1000);
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onSearch(): void {
    this.searchSubject.next(this.searchText); // Push search query into the stream
    this.contractNo=this.searchText;
    this.onLoadData(this.contractNo);
  }
  onLoadData(selectedValue: string):void{
    this.securityService.GetDataContract(selectedValue).subscribe(data => {        
      this.DataTable = this.prepareDataList(data);   

    }, error => {
      console.error('Error fetching doc types:', error);
    });
  }
  prepareDataList(rows:any) {
    const res=[];
    for(let i=0;i<rows.length;i++) {
      res.push({
        VehicleNo:rows[i].strVehicleNo,
        Hirename:rows[i].strCustName,
        ContractNumber:rows[i].strContractNo
       // CustomerName:rows[i].strCustName
      });
    }
    return res;
  }
}
