import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SecurityService } from '../../shared/security-service.service';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

  today =new Date();

  dataSource: MatTableDataSource<Element>;
  selection = new SelectionModel<Element>(true, []);
  expandedElement: any;

  displayedColumns = ['action', 'menuItemName','menuAlias','url','product','menugroup','menuparent','endpoint', 'visible','menuOrder','edit'];
  ProductList :any=[];
  MenuGroupList:any=[];
  ParentMenuList:any=[];
  MenuItemList:any=[];
  btnName : string = "Save";

  menuItem_id : number = 0;
  menuItem_name : string = "";
  url : string = "";
  product_id : number = 0;
  menuItem_alias : string = "";
  menugroup_id : number = 0;
  parentmenu_id : number = 0;
  is_end_point : boolean = true;
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
    
    this.securityService.GetProduct().then(data=>{
      this.ProductList = this.prepareProductList(data);
    });
    this.securityService.GetMenuGroup().then(data=>{
      this.MenuGroupList = this.prepareMenuGroupList(data);
    });
    this.securityService.GetParentMenu().then(data=>{
      this.ParentMenuList = this.prepareParentMenuList(data);
    });
    this.onLoad();
  }

  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
   this.dataSource.paginator = this.paginator;
  }

  //Edit MenuItem Functions
  EditMenuItem(menuItemID:string){
    this.btnName = "Edit";
    this.menuItem_id = parseInt(menuItemID);
    for(var i=0;i<this.MenuItemList.length;i++){
      if(this.MenuItemList[i].MenuItemID==menuItemID){
        this.menuItem_name = this.MenuItemList[i].MenuItemName;
        this.menuItem_alias = this.MenuItemList[i].MenuAlias;
        this.url = this.MenuItemList[i].Url;
        this.product_id = this.MenuItemList[i].ProductID;
        this.menugroup_id = this.MenuItemList[i].MenuGroupID;
        this.is_visible = this.MenuItemList[i].Visible;
        this.is_end_point = this.MenuItemList[i].Endpoint;
        this.menuItem_order = this.MenuItemList[i].MenuOrder;
      }
    }
  }

//Save MenuItem Functions
SaveMenuItem(){
  if(this.menuItem_name!="" && this.menuItem_name!=null && this.url!="" && this.url!=null && this.product_id > 0 && this.menuItem_alias!="" && this.menuItem_alias!=null && this.menugroup_id>0 && this.menugroup_id!=null){

    var menuItemData = {"iMenuID":this.menuItem_id,"strMenuName":this.menuItem_name,"strUrl":this.url,"iProductID":this.product_id,
    "strAlias":this.menuItem_alias, "iMenuGroupID":this.menugroup_id, "iParentID":this.parentmenu_id};

    this.securityService.AddMenuItem(menuItemData).subscribe(c=>{
      alert(c);
      this.onLoad();
      this.Clear();
    });
  }else{
    alert("Check Inputs");
  }
}


Clear(){
  this.menuItem_id = 0;
  this.product_id = 0;
  this.menugroup_id = 0;
  this.btnName="Save";
  this.menuItem_name = "";
  this.menuItem_alias = "";
  this.url = "";
  this.parentmenu_id = 0;
  this.is_visible = true;
  this.is_disable = false;
  this.is_end_point = true;
}

onLoad(){
  this.securityService.GetMenuItem().then(data=>{
    this.MenuItemList = this.prepareMenuItemList(data);
    this.dataSource.data = this.MenuItemList;
  });
}

prepareProductList(rows:any) {
  const res=[];
  for(let i=0;i<rows.length;i++) {
    res.push({
      ProductID:rows[i].iProductID,
      ProductName:rows[i].strProductName
    });
  }
  return res;
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

prepareParentMenuList(rows:any) {
  const res=[];
  for(let i=0;i<rows.length;i++) {
    res.push({
      ParentMenuID:rows[i].iMenuID,
      ParentMenuName:rows[i].strMenuName
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
      MenuAlias:rows[i].strAlias,
      Url:rows[i].strUrl,
      ProductID:rows[i].iProductID,
      ProductName:rows[i].strProductName,
      MenuGroupID:rows[i].iMenuGroupID,
      MenuGroupName:rows[i].strMenuGroupName,
      MenuParentName:rows[i].strParentMenuName,
      Endpoint:rows[i].boolEndPoint,
      Visible:rows[i].boolVisible,
      MenuOrder:rows[i].strMenuOrder,
    });
  }
  return res;
}

}

export interface MenuItem {
  iMenuID: number;
  strMenuName : string;
  strUrl:string;
  iProductID: number;
  strAlias : string;
  iMenuGroupID: number;
  iParentID:number;
}