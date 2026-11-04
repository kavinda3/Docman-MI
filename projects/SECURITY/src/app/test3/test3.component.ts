import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-test3',
  templateUrl: './test3.component.html',
  styleUrls: ['./test3.component.scss']
})
export class Test3Component implements OnInit {

  displayedColumns: string[] = ['id'];
  data: any[] = [];
  page = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMoreData();
  }
  loadMoreData() {
    this.http.get(`http://localhost:44368/api/SecurityModuleAPI/GetAllContracts?page=${this.page}`).subscribe((res: any) => {
      this.data = [...this.data, ...res.records];
      this.page++;
    });
  }


  onScroll(event: any) {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      this.loadMoreData();
    }
  }
}
