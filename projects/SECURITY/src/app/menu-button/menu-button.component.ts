import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SecurityService } from '../../shared/security-service.service';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent implements OnInit {

  today =new Date();

  dataSource: MatTableDataSource<Element>;
  selection = new SelectionModel<Element>(true, []);
  expandedElement: any;

  displayedColumns = ['action', 'menuButtonName','menuAlias','menuItem','visible','disable'];
  MenuButtonList:any=[];
  MenuItemList:any=[];
  btnName : string = "Save";

  menuItem_id : number = 0;
  menuButton_id : number = 0;
  menuButton_name : string = "";
  menuButton_alias : string = "";
  is_visible : boolean = true; 
  is_disable : boolean = false; 

  menuItem_order : string = "0";
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  @ViewChild(MatPaginator, { static: false })
  set paginator(v: MatPaginator) {
    this.dataSource.paginator = v;
  }

  constructor(private dragulaService: DragulaService,public securityService:SecurityService) {
    this.dataSource = new MatTableDataSource();
  }


  ngOnInit(): void {
    setInterval(() => { this.today = new Date();}, 1000);
    
    this. onLoad();
    this.securityService.GetMenuItem().then(data=>{
      this.MenuItemList = this.prepareMenuItemList(data);
      this.dataSource.data = this.MenuItemList;
    });
    this.onLoad();
  }

  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
   this.dataSource.paginator = this.paginator;
  }

//MenuButton Functions
SaveMenuButton(){
  if(this.menuItem_id>0){

    var menuButtonData = {"iBtnID":this.menuButton_id,"strBtnName":this.menuButton_name,"strAlias":this.menuButton_alias, 
    "iMenuID":this.menuItem_id, "boolVisible":this.is_visible, "boolDisable":this.is_disable};

    this.securityService.AddMenuButton(menuButtonData).subscribe(c=>{
      alert(c);
      this.onLoad();
      this.Clear();
    });
  }else{
    alert("Check Inputs");
  }
}


Clear(){
  this.btnName="Save";
  this.menuButton_id = 0;
  this.menuButton_name = "";
  this.menuButton_alias = "";
  this.menuItem_id = 0;
  this.is_visible = false;
  this.is_disable = false;
}

onLoad(){
  this.securityService.GetMenuButton().then(data=>{
    this.MenuButtonList = this.prepareMenuButtonList(data);
    this.dataSource.data = this.MenuButtonList;
  });
}

prepareMenuButtonList(rows:any) {
  const res=[];
  for(let i=0;i<rows.length;i++) {
    res.push({
      MenuButtonID:rows[i].iBtnID,
      MenuButtonName:rows[i].strBtnName,
      MenuButtonAlias:rows[i].strAlias,
      MenuItemID:rows[i].iMenuID,
      MenuItemName:rows[i].strMenuName,
      Visible:rows[i].boolVisible,
      Disable:rows[i].boolDisable,
    });
  }
  return res;
}

prepareMenuItemList(rows:any) {
  const res=[];
  for(let i=0;i<rows.length;i++) {
    res.push({
      MenuItemID:rows[i].iMenuID,
      MenuItemName:rows[i].strMenuName,

    });
  }
  return res;
}

}

export interface MenuButton {
  iBtnID: number;
  strBtnName : string;
  strAlias : string;
  iMenuID: number;
  boolVisible:boolean;
  boolDisable:boolean;
}
