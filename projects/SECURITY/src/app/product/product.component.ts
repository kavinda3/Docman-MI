import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  today =new Date();

  dataSource: MatTableDataSource<Element>;
  expandedElement: any;
  
  displayedColumns = ['action', 'product_name','product_code','product_redirectpath','edit'  ];
  ProductList :any=[];
  product_id : number = 0;
  product_name : string = "";
  product_code : string = "";
  product_redirectpath : string = ""

  btnName:string = "Save";

  constructor(private dragulaService: DragulaService,public securityService:SecurityService) {
    this.dataSource = new MatTableDataSource();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator, { static: false })
  set paginator(v: MatPaginator) {
    this.dataSource.paginator = v;
  }

  ngOnInit(): void {
    setInterval(() => { this.today = new Date();}, 1000);
    this.onLoad();
  }

  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
   this.dataSource.paginator = this.paginator;
 }

   //Product Functions
  EditProduct(productID:string){
    this.btnName = "Edit";
    this.product_id = parseInt(productID);
    for(var i=0;i<this.ProductList.length;i++){
      if(this.ProductList[i].ProductID==productID){
        this.product_name = this.ProductList[i].ProductName;
        this.product_code = this.ProductList[i].ProductCode;
        this.product_redirectpath = this.ProductList[i].ProductRedirectPath;
      }
    }
  }
  
  //Product Functions
  SaveProduct(){
        this.securityService.GetIsUserActive().subscribe(data => {
     // this.username = data;
     alert('Data saved!'+data);
  });
    // if(this.product_name!="" && this.product_name!=null && this.product_code !="" ){
    //   var productData = {"iProductID":this.product_id,"strProductName":this.product_name,"strProductCode":this.product_code,"strProductRedirectPath":this.product_redirectpath};
    //   this.securityService.AddProduct(productData).subscribe(c=>{
    //     alert(c);
    //       this.onLoad();
    //       this.Clear();
    //    });
    // }else{
    //   alert("Check Inputs");
    // }
  }

  Clear(){
    this.product_id=0;
    this.product_name="";
    this.product_code = "";
    this.product_redirectpath=""
    this.btnName="Save";
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
export interface Product {
  iProductID: number;
  strProductName: string;
  strProductCode: string;
  strProductRedirectPath:String;
}
