
import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { merge } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FooterComponent } from './../footer/footer.component';
import { MatTableDataSource } from '@angular/material/table';
import { SecurityService } from '../../shared/security-service.service';

@Component({
  selector: 'app-mis-home',
  templateUrl: './mis-home.component.html',
  styleUrls: ['./mis-home.component.scss']
})
export class MisHomeComponent implements OnInit {
  today =new Date();

  dragStart$ = this.dragulaService.drag("MIDRAG").pipe(mapTo(true));
  dragEnd$ = this.dragulaService.dragend("MIDRAG").pipe(mapTo(false));
  isDragging$ = merge(this.dragStart$, this.dragEnd$).pipe(startWith(false));
  
  dataSource: MatTableDataSource<Element>;
  ProductList :any=[];
  product_id : number = 0;
  product_name : string = "";
  product_code : string = "";
  product_redirectpath : string = ""
  constructor(private dragulaService: DragulaService,public securityService:SecurityService) {
    this.dataSource = new MatTableDataSource();
  }

    ngOnInit(): void {
      setInterval(() => { this.today = new Date();}, 1000);
      this.onLoad();
    } 
    onLoad(){
      this.securityService.GetProduct().then(data=>{
        this.ProductList = this.prepareProductList(data);
        this.dataSource.data = this.ProductList;
      });
    }
    prepareProductList(rows:any) {
      const res=[];
      for(let i=0;i<rows.length;i++) {
        res.push({
          ProductID:rows[i].iProductID,
          ProductName:rows[i].strProductName,
          ProductCode:rows[i].strProductCode,
          ProductRedirectPath:rows[i].strProductRedirectPath
        });
      }
      return res;
    }
 
}
