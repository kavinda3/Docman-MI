import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  today =new Date();

  dataSource: MatTableDataSource<Element>;
  expandedElement: any;
  
  displayedColumns = ['action', 'group_name','edit'  ];
  GroupList :any=[];
  group_id : number = 0;
  group_name : string = "";

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

 
   //Group Functions
   EditGroup(groupID:string){
    this.btnName = "Edit";
    this.group_id = parseInt(groupID);
    for(var i=0;i<this.GroupList.length;i++){
      if(this.GroupList[i].GroupID==groupID){
        this.group_name = this.GroupList[i].GroupName;
      }
    }
  }
  
  //Group Functions
  SaveGroup(){
    if(this.group_name!="" && this.group_name!=null ){
      var groupData = {"iGroupID":this.group_id,"strGroupName":this.group_name};
      this.securityService.AddGroup(groupData).subscribe(c=>{
        alert(c);
          this.onLoad();
          this.Clear();
       });
    }else{
      alert("Check Inputs");
    }
  }

  Clear(){
    this.group_id=0;
    this.group_name="";
    this.btnName="Save";
  }

  onLoad(){
    this.securityService.GetGroup().then(data=>{
      this.GroupList = this.prepareGroupList(data);
      this.dataSource.data = this.GroupList;
    });
  }

  prepareGroupList(rows:any) {
    const res=[];
    for(let i=0;i<rows.length;i++) {
      res.push({
        GroupID:rows[i].iGroupID,
        GroupName:rows[i].strGroupName
      });
    }
    return res;
  }

}
export interface Group {
  iGroupID: number;
  strGroupName: string;
}