import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-docmaster',
  templateUrl: './docmaster.component.html',
  styleUrls: ['./docmaster.component.scss']
})
export class DocmasterComponent implements OnInit {

today =new Date();

  dataSource: MatTableDataSource<Element>;
  dataSourceTable: MatTableDataSource<Element>;
  expandedElement: any;
  
  displayedColumns = ['Doc_Code', 'Doc_Name','Doc_Type','edit'  ];
  DocList :any=[];
  DocTypes :any=[];
  DocTypesTable :any=[];
  docCode : string = "";
  docName : string = "";
  docType : string = "";
  product_redirectpath : string = ""
  isVisibleSavebtn=false
  isVisibleEditbtn=false
  isVisibleNewbtn=true  
  isVisibleDeletebtn=false    

  btnName:string = "Save";

  constructor(private snackBar: MatSnackBar,private dragulaService: DragulaService,public securityService:SecurityService) {
    this.dataSource = new MatTableDataSource();
    this.dataSourceTable = new MatTableDataSource();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    this.isVisibleNewbtn=true
    this.isVisibleEditbtn=true
    this.isVisibleSavebtn=false
    this.isVisibleDeletebtn=true
  }
  UpdateDocumentMaster(){
    if(this.docType!="" && this.docType!=null && this.docCode !=null && this.docCode!=null && this.docName !=null && this.docName!=null){
        var DocType = {"strDocType":this.docType.toString(),"strDocCode":this.docCode,"strDocName":this.docName}; 
        this.securityService.UpdateDocumentMaster(DocType).subscribe(response => {
        this.snackBar.open(response, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top' 
        });

       // this.onLoad();
        this.Clear();
      });
    } else {
      this.snackBar.open('Please enter both File Location Name and Location No', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
    }
  }
  SaveDocumentMaster(){
  if(this.docType!="" && this.docType!=null && this.docCode !=null && this.docCode!=null && this.docName !=null && this.docName!=null){
          var DocType = {"strDocType":this.docType.toString(),"strDocCode":this.docCode,"strDocName":this.docName}; 
          this.securityService.SaveDocumentMaster(DocType).subscribe(response => {
          this.snackBar.open(response, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            verticalPosition: 'top' 
          });

        // this.onLoad();
          this.Clear();
        });
      } else {
        this.snackBar.open('Please enter both File Location Name and Location No', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-warning']
        });
      }
  }
  DeleteDocumentMaster(){
  if(this.docType!="" && this.docType!=null && this.docCode !=null && this.docCode!=null && this.docName !=null && this.docName!=null){
        var DocType = {"strDocType":this.docType.toString(),"strDocCode":this.docCode,"strDocName":this.docName}; 
        this.securityService.DeleteDocumentMaster(DocType).subscribe(response => {
        this.snackBar.open(response, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top' 
        });

       // this.onLoad();
        this.Clear();
      });
    } else {
      this.snackBar.open('Please enter Valid Details', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
    }
  }
  NewLocation(){
    this.isVisibleSavebtn=true
    this.isVisibleNewbtn=false
    this.isVisibleEditbtn=false
    this.isVisibleDeletebtn=false    
    this.Clear();
    this.getMaxDocCode()
  } 
  getMaxDocCode(){
      this.securityService.GetMaxDocCode().then(data=>{
        this.docCode = String(data).padStart(6, '0');
      });
    }
  Clear(){
    this.docCode="";
    this.docName="";
    this.docType = "";
    this.btnName="Save";
    this.isVisibleEditbtn=false
    this.isVisibleDeletebtn=false
  }

  onLoad(){
    this.securityService.GetDoctypes(this.docType,1).subscribe(data => {
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
        //ProductRedirectPath:rows[i].strProductRedirectPath
      });
    }
    return res;
  }
  onLoadTable():void{
    this.securityService.GetDoctypes(this.docType,1).subscribe(data => {
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

