import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../shared/security-service.service'; // Adjust the import path
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit { 
  contractNo: string = '';                // Selected contract number
  searchText: string = '';                // Holds the search query
  ContractList: any[] = [];               // Holds the full contract list (paginated)
  filteredContractList: any[] = [];       // Holds filtered results to show in dropdown
  page: number = 1;                       // Current page
  pageSize: number = 10;                  // Page size (items per page)

  private searchSubject: Subject<string> = new Subject<string>();

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    // Set up the debounced search on input
    this.searchSubject.pipe(
      debounceTime(500),                     // Wait 500ms after the user stops typing
      distinctUntilChanged(),                // Only trigger if search query has changed
      switchMap(searchText => this.loadItems(searchText)) // Fetch new data based on search
    ).subscribe(data => {
      // Once the observable emits the data, update your filtered list
      this.filteredContractList = this.prepareContractList(data);
    });
  }

  // Triggered on user input
  onSearch(): void {
    this.searchSubject.next(this.searchText); // Push search query into the stream
    this.contractNo=this.searchText;
  }

  // Load items from the backend (with search query)
  loadItems(searchQuery: string): Observable<any> {
    // Returning the observable from the service directly
    return this.securityService.getItems(searchQuery, this.page, this.pageSize);
  }

  // Prepare the list of contracts for the dropdown
  prepareContractList(rows: any): any[] {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        ContractNo: rows[i].strContractNo  // Assuming the API response has 'strContractNo'
      });
    }
    return res;
  }
}