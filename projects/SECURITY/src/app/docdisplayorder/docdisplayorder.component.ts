import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';

@Component({
  selector: 'app-docdisplayorder',
  templateUrl: './docdisplayorder.component.html',
  styleUrls: ['./docdisplayorder.component.scss']
})
export class DocdisplayorderComponent implements OnInit {

today =new Date();

  dataSource: MatTableDataSource<Element>;
  dataSourceTable: MatTableDataSource<Element>;
  expandedElement: any;
  
  displayedColumns = ['Doc_Code', 'Doc_Name','Doc_Type','Doc_Seq','DTAdd'  ];
  DocList :any=[];
  DocTypes :any=[];
  DocTypesTable :any=[];
  docCode : string = "";
  docName : string = "";
  docType : string = "";
  product_redirectpath : string = ""

  btnName:string = "Save";

  constructor(private dragulaService: DragulaService,public securityService:SecurityService) {
    this.dataSource = new MatTableDataSource();
    this.dataSourceTable = new MatTableDataSource();
  }

  @ViewChild(MatPaginator, { static: false })
  set paginator(v: MatPaginator) {
    this.dataSourceTable.paginator = v;
  }

  ngOnInit(): void {
    setInterval(() => { this.today = new Date();}, 1000);
    this.onLoad();
  }

  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
   this.dataSource.paginator = this.paginator;
 }

   
  EditDocMaster(DocCode:string){
    this.btnName = "Edit";
    this.docCode = (DocCode);
    for(var i=0;i<this.DocTypesTable.length;i++){
      if(this.DocTypesTable[i].DocCode==this.docCode){
        this.docCode = this.DocTypesTable[i].DocCode;
        this.docName = this.DocTypesTable[i].DocName;
        this.docType = this.DocTypesTable[i].DocType;
      }
    }
  }
  
  //Product Functions
  SaveProduct(){
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
    this.docCode="";
    this.docName="";
    this.docType = "";
    this.btnName="Save";
  }

  onLoad(){
    this.securityService.GetDoctypes(this.docType,2).subscribe(data => {
      this.DocTypes = this.prepareDocTypeList(data);
      this.dataSource.data = this.DocTypes;
    }, error => {
      console.error('Error fetching doc types:', error);
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

  prepareDocTypeList(rows:any) {
    const res=[];
    for(let i=0;i<rows.length;i++) {
      res.push({
        DocCode:rows[i].strDoccode,
        DocName:rows[i].strDocName,
        DocType:rows[i].strDocType,
        DocSeq:rows[i].iDisplaySeq
        //ProductRedirectPath:rows[i].strProductRedirectPath
      });
    }
    return res;
  }
  onLoadTable():void{
    this.securityService.GetDoctypes(this.docType,2).subscribe(data => {
      this.DocTypesTable = this.prepareDocTypeList(data);
      this.dataSourceTable.data = this.DocTypesTable;
    }, error => {
      console.error('Error fetching doc types:', error);
    });
  }
}
export interface DocType {
  strDocCode: string;
  strDocType: string;
  strDocName: string;
}

