import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';

@Component({
  selector: 'app-security-layer',
  templateUrl: './security-layer.component.html',
  styleUrls: ['./security-layer.component.scss']
})
export class SecurityLayerComponent implements OnInit {

  today =new Date();

  dataSource: MatTableDataSource<Element>;
  expandedElement: any;
  
  displayedColumns = ['action', 'layer_name','edit'  ];
  SecurityLayerList :any=[];
  securityLayer_id : number = 0;
  securityLayer_name : string = "";

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

 
   //SecurityLayer Functions
   EditSecurityLayer(securityLayerID:string){
    this.btnName = "Edit";
    this.securityLayer_id = parseInt(securityLayerID);
    for(var i=0;i<this.SecurityLayerList.length;i++){
      if(this.SecurityLayerList[i].SecurityLayerID==securityLayerID){
        this.securityLayer_name = this.SecurityLayerList[i].SecurityLayerName;
      }
    }
  }
  
  //SecurityLayer Functions
  SaveSecurityLayer(){
    if(this.securityLayer_name!="" && this.securityLayer_name!=null ){
      var securityLayerData = {"iSecLayerID":this.securityLayer_id,"strSecLayerName":this.securityLayer_name};
      this.securityService.AddSecurityLayer(securityLayerData).subscribe(c=>{
        alert(c);
          this.onLoad();
          this.Clear();
       });
    }else{
      alert("Check Inputs");
    }
  }

  Clear(){
    this.securityLayer_id=0;
    this.securityLayer_name="";
    this.btnName="Save";
  }

  onLoad(){
    this.securityService.GetSecurityLayer().then(data=>{
      this.SecurityLayerList = this.prepareSecurityLayerList(data);
      this.dataSource.data = this.SecurityLayerList;
    });
  }

  prepareSecurityLayerList(rows:any) {
    const res=[];
    for(let i=0;i<rows.length;i++) {
      res.push({
        SecurityLayerID:rows[i].iSecLayerID,
        SecurityLayerName:rows[i].strSecLayerName
      });
    }
    return res;
  }

}
export interface SecurityLayer {
  iSecLayerID: number;
  strSecLayerName: string;
}