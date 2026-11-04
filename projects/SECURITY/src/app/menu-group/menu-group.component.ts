import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';

@Component({
  selector: 'app-menugroup',
  templateUrl: './menu-group.component.html',
  styleUrls: ['./menu-group.component.scss']
})
export class MenuGroupComponent implements OnInit {

  today =new Date();

  dataSource: MatTableDataSource<Element>;
  expandedElement: any;
  
  displayedColumns = ['action', 'menugroup_name','edit'  ];
  MenuGroupList :any=[];
  menugroup_id : number = 0;
  menugroup_name : string = "";

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
 
   //Edit MenuGroup Functions
   EditMenuGroup(menugroupID:string){
    this.btnName = "Edit";
    this.menugroup_id = parseInt(menugroupID);
    for(var i=0;i<this.MenuGroupList.length;i++){
      if(this.MenuGroupList[i].MenuGroupID==menugroupID){
        this.menugroup_name = this.MenuGroupList[i].MenuGroupName;
      }
    }
  }
  
  //Save MenuGroup Functions
  SaveMenuGroup(){
    if(this.menugroup_name!="" && this.menugroup_name!=null ){
      var menugroupData = {"iMenuGroupID":this.menugroup_id,"strMenuGroupName":this.menugroup_name};
      this.securityService.AddMenuGroup(menugroupData).subscribe(c=>{
        alert(c);
          this.onLoad();
          this.Clear();
       });
    }else{
      alert("Check Inputs");
    }
  }

  Clear(){
    this.menugroup_id=0;
    this.menugroup_name="";
    this.btnName="Save";
  }

  onLoad(){
    this.securityService.GetMenuGroup().then(data=>{
      this.MenuGroupList = this.prepareMenuGroupList(data);
      this.dataSource.data = this.MenuGroupList;
    });
  }

  prepareMenuGroupList(rows:any) {
    const res=[];
    for(let i=0;i<rows.length;i++) {
      res.push({
        MenuGroupID:rows[i].iMenuGroupID,
        MenuGroupName:rows[i].strMenuGroupName
      });
    }
    return res;
  }

}
export interface MenuGroup {
  iMenuGroupID: number;
  strMenuGroupName: string;
}