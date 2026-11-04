import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

// Move the interface definition here (outside the decorator block)
export interface TransactionElement {
  TrnNo: string;
  Date: string;
  EnterUser: string;
  Confirm: string;
  Acknowleded: string; 
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, AfterViewInit {

  ELEMENT_DATA: TransactionElement[] = [
    { TrnNo: 'TRN-001', Date: '2026-01-10', EnterUser: 'Alice', Confirm: 'Yes', Acknowleded: 'No' },
    { TrnNo: 'TRN-002', Date: '2026-01-12', EnterUser: 'Bob', Confirm: 'No', Acknowleded: 'Yes' }, // Note: check data consistency here if 'Bob' was meant to be EnterUser: 'Bob'
    { TrnNo: 'TRN-003', Date: '2026-01-15', EnterUser: 'Charlie', Confirm: 'Yes', Acknowleded: 'Yes' },
    { TrnNo: 'TRN-004', Date: '2026-01-16', EnterUser: 'Alice', Confirm: 'No', Acknowleded: 'No' },
    { TrnNo: 'TRN-005', Date: '2026-01-18', EnterUser: 'Dave', Confirm: 'Yes', Acknowleded: 'No' },
    { TrnNo: 'TRN-006', Date: '2026-01-20', EnterUser: 'Bob', Confirm: 'Yes', Acknowleded: 'Yes' },
  ];

  displayedColumnsnew = ['TRN_No', 'Date', 'Enter_User', 'Confirmed', 'Acknowledged'];
  
  dataSourceTRNNo = new MatTableDataSource<TransactionElement>(this.ELEMENT_DATA);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator1!: MatPaginator;

  expandedElement: any;
  selectedTrnNo: string = '';

  ngOnInit() {
    this.dataSourceTRNNo.sortingDataAccessor = (item: TransactionElement, property: string) => {
      switch (property) {
        case 'TRN_No': return item.TrnNo;
        case 'Enter_User': return item.EnterUser;
        case 'Confirmed': return item.Confirm;
        case 'Acknowledged': return item.Acknowleded;
        default: return (item as any)[property];
      }
    };
  }

  ngAfterViewInit(): void {
    this.dataSourceTRNNo.paginator = this.paginator1;
    this.dataSourceTRNNo.sort = this.sort;
  }

  onRowClicked(row: TransactionElement) {
    this.selectedTrnNo = row.TrnNo;
  }

  submitPrompt() { console.log('Submitted'); }
  closePrompt() { console.log('Cancelled'); }
}