import { HttpClient,HttpParams , HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../app/product/product.component';
import { Location } from '../app/file-location/file-location.component';
import { Group } from '../app/group/group.component';
import { SecurityLayer } from '../app/security-layer/security-layer.component';
import { MenuGroup } from '../app/menu-group/menu-group.component';
import { MenuItem } from '../app/menu-item/menu-item.component';
import { MenuButton } from '../app/menu-button/menu-button.component';
import { MenuItemSeclayer } from '../app/menu-item-assign-sec-layer/menu-item-assign-sec-layer.component';
import { promise } from 'protractor';
import { DatabyContractNo, DocData, DocTableData, VehicleList } from '../app/doc-handling/doc-handling.component';
import { DocType } from '../app/docmaster/docmaster.component';
import { DataList } from '../app/doc-handling/doc-handling.component';
import { rackData } from '../app/filerack/filerack.component';
import { AuthUser } from '../app/formauthorizer/formauthorizer.component';
import { requestFileData } from '../app/request-file/request-file.component';
import { transferFileData } from '../app/transfer-file/transfer-file.component';
import { CloseFileData } from '../app/fileclosebatch/fileclosebatch.component';
import { CloseData } from '../app/fileclosebundle/fileclosebundle.component';
import { Reports } from '../app/report-details/report-details.component';

@Injectable({
  providedIn: 'root'
})

export class SecurityService {

  constructor(private http:HttpClient,private router : Router) { }
 
  //readonly baseurl = "http://localhost:44368";
  //live
   //readonly baseurl = "http://192.168.100.51:81/DocmanLogin";
   //uat
   readonly baseurl = "http://192.168.100.85:81/DocmanLogin"
  // readonly baseurl = "http://localhost:44368/";

  public productList : any;
// GetIsUserActive(): Observable<string> {
//   return this.http.get<string>(
//     this.baseurl + "/api/SecurityModuleAPI/GetUsername",
//     { withCredentials: true }
//   );
// }
GetIsUserActive(): Observable<{ username: string }> {
  return this.http.get<{ username: string }>(
    this.baseurl + "/api/SecurityModuleAPI/GetUsername",
    { withCredentials: true }
  );
} 
  // GetIsUserActive():Observable<string>{
  //   return this.http.get<any>(this.baseurl +"/api/SecurityModuleAPI/GetUsername");  
  // }

  GetCurrentUser():Observable<string>{
    return this.http.get<any>(this.baseurl +"/api/SecurityModuleAPI/GetCurrentUser");
  }

  Logout():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetRemoveUser").toPromise(); 
  }

  //------------------

  AddProduct(product: Product){
    return this.http.post<Product>(this.baseurl +"/api/SecurityModuleAPI/CreateProduct", product);
  }
  AddAuthUser(AuthUser: AuthUser): Observable<any>{
    return this.http.post<AuthUser>(this.baseurl +"/api/SecurityModuleAPI/AddAuthUser", AuthUser);
  }
  AddLocation(location: Location): Observable<any>{
   return this.http.post<Location>(this.baseurl +"/api/SecurityModuleAPI/AddFileLocation", location);
  }
  UpdateLocation(location: Location): Observable<any>{
    return this.http.post<Location>(this.baseurl +"/api/SecurityModuleAPI/EditFileLocation", location);
  }
  UpdateDocumentMaster(DocType: DocType): Observable<any>{
    return this.http.post<DocType>(this.baseurl +"/api/SecurityModuleAPI/EditDocumentMaster", DocType);
  }
  SaveDocumentMaster(DocType: DocType): Observable<any>{
    return this.http.post<DocType>(this.baseurl +"/api/SecurityModuleAPI/AddDocumentMaster", DocType);
  }
  DeleteDocumentMaster(DocType: DocType): Observable<any> {
    return this.http.delete<any>(this.baseurl + "/api/SecurityModuleAPI/DeleteDocumentMaster", {
      body: DocType
    });
  }
  AddDocHeader(doc: DocData,DocList: DocTableData[],strusername:string){
    const requestPayload = {
      doc: doc,
      docList: DocList,
      strusername: strusername
    };
    return this.http.post<any>(this.baseurl +"/api/SecurityModuleAPI/CreateDocHeader", requestPayload);
  }
   AddCloseBundle(doc: CloseData,DocList: DocTableData[],strusername:string){
    
      const body = {
        requestPayload: {
          FileCloseHeader: doc,
          FileCloseDetails: DocList,   
        },
        strUsername: strusername
      };
        return this.http.post<any>(this.baseurl +"/api/SecurityModuleAPI/SaveCloseBundle", body);
  }
  
  AddreqFile(doc: requestFileData,DocList: DocTableData[],strMode:string,struserName:string){
       const body = {
        requestPayload: {
          FileRequestHeader: doc,
          FileRequestDetails: DocList
        },
        strMode: strMode,
        strUsername: struserName
      };
          return this.http.post<any>(this.baseurl +"/api/SecurityModuleAPI/SaveReqFile", body);
    
    }
  AddCloseFile(doc: CloseFileData, struserName: string) {
    const body = {
      CloseFileData: doc,
      strUsername: struserName
    };
    return this.http.post<any>(this.baseurl + "/api/SecurityModuleAPI/SaveCloseFile", body);

  }
  TransferCloseFileBatch(batchNo:string, struserName: string) {
    const body = {
      StrBatchNo: batchNo,
      strUsername: struserName
    };
    return this.http.post<any>(this.baseurl + "/api/SecurityModuleAPI/SaveTransferCloseFileBatch", body);

  }
   fnsetReopenStatus(batchNo:string,bundleNo:string, struserName: string) {
    const body = {
      StrBatchNo: batchNo,
      StrBundleNo: bundleNo,
      strUsername: struserName
    };
    return this.http.post<any>(this.baseurl + "/api/SecurityModuleAPI/fnSetReopenStatus", body);

  }
    AddtraFile(doc: transferFileData,DocList: DocTableData[],strMode:string,struserName:string){
       const body = {
        TransferPayload: {
          FileTransferHeader: doc,
          FileTransferDetails: DocList
        },
        strMode: strMode,
        strUsername: struserName
      };
          return this.http.post<any>(this.baseurl +"/api/SecurityModuleAPI/SaveTransferFile", body);
    
    } 
 getNavItems(username: string): Observable<NavItem[]> {
  const params = new HttpParams().set('username', username);

  return this.http.get<NavItem[]>(this.baseurl + "/api/SecurityModuleAPI/GetNavItems", { params });
}
  GetProduct():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllProducts").toPromise();
  }
  // GetDoctypes(docType:string):Promise<any>{
  //   return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllDoctypes",docType).toPromise();
  // }
  GetDoctypes(docType: string,pageIndex:number) {
    // Create an instance of HttpParams and append the docType parameter
    //const params = new HttpParams().set('docType', docType);
    const params = new HttpParams()
    .set('docType', docType)
    .set('pageIndex', pageIndex);
    return this.http.get<DocType[]>(this.baseurl + "/api/SecurityModuleAPI/GetAllDoctypes", { params });
  }
  // GetReport(reporttype: string,fromdate:string,todate:string) {
  //   const params = new HttpParams()
  //   .set('reportName', reporttype)
  //   .set('fromDate', fromdate)
  //   .set('toDate', todate);
  //   return this.http.get<DocType[]>(this.baseurl + "/api/SecurityModuleAPI/GetReport", { params });
  // }

  //correct code
  // GetDocmanReport(reportType: string, fromDate: string, toDate: string,contractNo:string,crStatus:string): Observable<Blob> {
  //   const params = new HttpParams()
  //     .set('reportName', reportType)
  //     .set('fromDate', fromDate)
  //     .set('toDate', toDate)
  //     .set('contractNo', contractNo)
  //     .set('crStatus', crStatus);
  //   return this.http.get(this.baseurl + "/api/SecurityModuleAPI/GetDocmanReport", {
  //     params,
  //     responseType: 'blob'
  //   });
  // }
  //tempory code
  //  GetDocmanReport(reportType: string): Observable<Blob> {
  //   const params = new HttpParams()
  //     .set('reportName', reportType)
  //   return this.http.get(this.baseurl + "/api/SecurityModuleAPI/GetDocmanReport", {
  //     params,
  //     responseType: 'blob'
  //   });
  // }
    GetDocmanReport() {
    // Create an instance of HttpParams and append the docType parameter
    return this.http.get<Location[]>(this.baseurl + "/api/SecurityModuleAPI/getreport");
  }
     

    GetReport(reportType: string,batchNo:string, fromDate: string, toDate: string,contractNo:string): Observable<Blob> {
    const params = new HttpParams()
      .set('reportName', reportType)
      .set('batchNo', batchNo)
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('contractNo', contractNo);
    return this.http.get(this.baseurl + "/api/SecurityModuleAPI/GetReport", {
      params,
      responseType: 'blob'
    });
  }
  GetLocation() {
    // Create an instance of HttpParams and append the docType parameter
    return this.http.get<Location[]>(this.baseurl + "/api/SecurityModuleAPI/GetLocation");
  }
   GetReports(reporttype:string) {
    const params = new HttpParams().set('strRpttype', reporttype);
    return this.http.get<Reports[]>(this.baseurl + "/api/SecurityModuleAPI/GetReports",{ params });
  }
  GetAuthUser() {
    return this.http.get<any[]>(this.baseurl + "/api/SecurityModuleAPI/GetAuthUser");
  }
  GetUserEmail(Username:string):Promise<any>{ 
    const params = new HttpParams().set('Username', Username);
    return this.http.get(this.baseurl + "/api/SecurityModuleAPI/GetUserEmail", { params }).toPromise();
  }
 
  GetAuthorisers(locCode: string) {
    const params = new HttpParams().set('locCode', locCode);
    return this.http.get<DocType[]>(this.baseurl + "/api/SecurityModuleAPI/GetAuthorisers", { params });
  }
  GetLoc():Promise<any>{
    return this.http.get(this.baseurl + "/api/SecurityModuleAPI/GetLocation").toPromise();
  }
  saveDocData(DocList: DocTableData[]): Observable<any> {
    return this.http.post<any>(this.baseurl +"/api/SecurityModuleAPI/SaveTable", DocList);
  }
  // GetAllDataList(VehicleNo: string,ContractNo:string) {
  //   // Create an instance of HttpParams and append the docType parameter
  //   const params = new HttpParams().set('vehicleNo', VehicleNo).set('contractNo', ContractNo);
  //   return this.http.get<DocData[]>(this.baseurl + "/api/SecurityModuleAPI/GetAllDataList", { params });
  // }
   GetAllDataList(VehicleNo: string,ContractNo:string,btnType:string) {
    // Create an instance of HttpParams and append the docType parameter
    const params = new HttpParams().set('vehicleNo', VehicleNo).set('contractNo', ContractNo).set('btnType',btnType);
    return this.http.get<DocData[]>(this.baseurl + "/api/SecurityModuleAPI/GetAllDataList", { params });
  }
  GetDocTable(DmCode:string) {
    // Create an instance of HttpParams and append the docType parameter
    const params = new HttpParams().set('dmcode', DmCode);
    return this.http.get<DataList[]>(this.baseurl + "/api/SecurityModuleAPI/GetDocTable", { params });
  }
  GetNewDocTable(contractNo:string) {
    // Create an instance of HttpParams and append the docType parameter
    const params = new HttpParams().set('strcontractno', contractNo);
    return this.http.get<DataList[]>(this.baseurl + "/api/SecurityModuleAPI/GetNewDocTable", { params });
  }
  // GetRequestFileMain(transferNo:string) {
  //   // Create an instance of HttpParams and append the docType parameter
  //   const params = new HttpParams().set('transferNo', transferNo);
  //   return this.http.get<DataList[]>(this.baseurl + "/api/SecurityModuleAPI/GetRequestFileMain", { params });
  // }
  GetRequestFileMain(transferNo: string,formName:string): Observable<any> {
    const params = new HttpParams().set('transferNo', transferNo).set('formName', formName);
    return this.http.get<any>(this.baseurl + "/api/SecurityModuleAPI/GetRequestFileMain", { params });
  }
   GetTransferFileMain(transferNo: string): Observable<any> {
    const params = new HttpParams().set('transferNo', transferNo);
    return this.http.get<any>(this.baseurl + "/api/SecurityModuleAPI/GetTransferFileMain", { params });
  }
  GetVehicleTypes() {
    return this.http.get<VehicleList[]>(this.baseurl + "/api/SecurityModuleAPI/GetVehicleTypeList");
  }
  GetDataContract(contract_no: string) {
    // Create an instance of HttpParams and append the docType parameter
    const params = new HttpParams().set('contractNo', contract_no)
    return this.http.get<DatabyContractNo[]>(this.baseurl + "/api/SecurityModuleAPI/GetContractNo", { params });
  }
  GetDataContractinRequestFile(contract_no: string,isEnter:boolean) {
    // Create an instance of HttpParams and append the docType parameter
    const params = new HttpParams().set('contractNo', contract_no).set('isEnter', isEnter);
    return this.http.get<DatabyContractNo[]>(this.baseurl + "/api/SecurityModuleAPI/GetDataContractinRequestFile", { params });
  }
   GetDataContractinRequestFileinTransfer(contract_no: string,isEnter:boolean) {
    // Create an instance of HttpParams and append the docType parameter
    const params = new HttpParams().set('contractNo', contract_no).set('isEnter', isEnter);
    return this.http.get<DatabyContractNo[]>(this.baseurl + "/api/SecurityModuleAPI/GetDataContractinRequestFileinTransfer", { params });
  }
  GetUserRightsFor(formName: string,actionName:string,userName:string) {
    // Create an instance of HttpParams and append the docType parameter
    const params = new HttpParams().set('formName', formName).set('actionName', actionName).set('userName', userName);
    return this.http.get<DatabyContractNo[]>(this.baseurl + "/api/SecurityModuleAPI/GetUserRightsFor", { params });
  }
  GetPermissionChk(userName:string,strFormName:string,actionName:string) {
    // Create an instance of HttpParams and append the docType parameter
    const params = new HttpParams().set('userName', userName).set('formName', strFormName).set('actionName', actionName);
    return this.http.get<DatabyContractNo[]>(this.baseurl + "/api/SecurityModuleAPI/GetPermissionChk", { params });
  }
  GetAllFileLocation():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllFileLocation").toPromise();
  }
  GetAuthorizer(strOption:string,strLocation:string){
    const params = new HttpParams()
    .set('strLocation', strLocation)
    .set('strOption', strOption);
      return this.http.get<any[]>(this.baseurl + "/api/SecurityModuleAPI/GetAuthorizer", { params });
  }
  GetMaxFileLocationCode():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetMaxFileLocationCode").toPromise();
  }
  GetMaxDocCode():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetMaxDocCode").toPromise();
  }
  GetLoadPendingList(approve: number): Observable<any> {
    const params = new HttpParams().set('approve', approve);
    return this.http.get<any>(this.baseurl + "/api/SecurityModuleAPI/GetLoadPendingList", { params });
  }
  GetContract():Promise<any>{
    return this.http.get(this.baseurl+"/api/SecurityModuleAPI/GetAllContracts").toPromise();
  }
  GetMenu():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetNavItems").toPromise();
  }
  AddGroup(group: Group){
    return this.http.post<Group>(this.baseurl +"/api/SecurityModuleAPI/CreateGroup", group);
  }

  GetGroup():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllGroups").toPromise();
  }
  
   AddSecurityLayer(securityLayer: SecurityLayer){
    return this.http.post<Group>(this.baseurl +"/api/SecurityModuleAPI/CreateLayer", securityLayer);
  }

  GetSecurityLayer():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllSecurityLayers").toPromise();
  } 

  AddMenuGroup(menugroup: MenuGroup){
    return this.http.post<MenuGroup>(this.baseurl +"/api/SecurityModuleAPI/CreateMenuGroup", menugroup);
  }

  GetMenuGroup():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllMenuGroups").toPromise();
  }

  AddMenuItem(menuItem: MenuItem){
    return this.http.post<MenuItem>(this.baseurl +"/api/SecurityModuleAPI/CreateMenuItems", menuItem);
  }
  EditFileRack(rackdata: rackData): Observable<any> {
    return this.http.post<rackData>(this.baseurl +"/api/SecurityModuleAPI/EditFileRack", rackdata);
  }

  GetMenuItem():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllMenuItems").toPromise();
  } 

  GetParentMenu():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllParentMenuItems").toPromise();
  }

  AddMenuButton(menuButton: MenuButton){
    return this.http.post<MenuButton>(this.baseurl +"/api/SecurityModuleAPI/CreateMenuButtons", menuButton);
  }
  
  GetMenuButton():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllMenuButtons").toPromise();
  }

  AddMenuItemAssign(menuButton: MenuItemSeclayer){
    return this.http.post<MenuItemSeclayer>(this.baseurl +"/api/SecurityModuleAPI/MenuItemsAssignSecurityLayer", menuButton);
  }
  
  GetMenuItemAssign():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllMenuItemsSecLayer").toPromise();
  }

  GetMenuButtonsByMenuID(menuID : string):Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllMenuButtonsByMenuId?MenuId="+menuID).toPromise();
  }

  GetMenuItemsBySecLayerID(secLayerID : string):Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllMenuItemsBySecLayerId?SecLayerId="+secLayerID).toPromise();
  }

  GetMenuButtonAssignSecLayer():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/MenuButtonsAssignSecLayers").toPromise();
  }
  getItems(search: string, pageIndex: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('search', search)
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<any>(this.baseurl +"/api/SecurityModuleAPI/GetAllContracts", { params });
  }
   fnGetNextBundle(batchNo: string): Observable<any> {
    const params = new HttpParams()
      .set('batchNo', batchNo)
    
    return this.http.get<any>(this.baseurl +"/api/SecurityModuleAPI/GetNextBundleNo", { params });
  }

  fnGetNextBatchNo(): Observable<any> {
    return this.http.get<any>(this.baseurl +"/api/SecurityModuleAPI/GetNextBatchNo");
  }
   fnGetCloseFileBatch(batchNo: string, username: string): Observable<any> {
    const params = new HttpParams()
      .set('batchNo', batchNo)
      .set('username', username)
    
    return this.http.get<any>(this.baseurl +"/api/SecurityModuleAPI/GetCloseFileBatch", { params });
  }
   fnGetContractNodet(contractNo: string, username: string): Observable<any> {
    const params = new HttpParams()
      .set('contractNo', contractNo)
      .set('username', username)
    
    return this.http.get<any>(this.baseurl +"/api/SecurityModuleAPI/GetContractNodet", { params });
  }
  fnGetBundle(batchNo: string, bundleNo: string): Observable<any> {
    const params = new HttpParams()
      .set('batchNo', batchNo)
      .set('bundleNo', bundleNo)
    
    return this.http.get<any>(this.baseurl +"/api/SecurityModuleAPI/GetBundleNo", { params });
  }
   fnGetDMContractDetail(contractNo: string,batchNo: string): Observable<any> {
    const params = new HttpParams()
      .set('contractNo', contractNo)
      .set('batchNo', batchNo)
    return this.http.get<any>(this.baseurl +"/api/SecurityModuleAPI/GetDMContractDetail", { params });
  }
  // GetTrnNo(search: string,pageIndex: number, pageSize: number): Observable<any> {
  //   const params = new HttpParams()      
  //   .set('search', search)
  //     .set('pageIndex', pageIndex.toString())
  //     .set('pageSize', pageSize.toString());
    
  //   return this.http.get<any>("http://localhost:44368/api/SecurityModuleAPI/GetTrnNo", { params });
  // }
  // GetTrnNo():Promise<any>{
  //   return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetTrnNo").toPromise();
  // }

//  GetTrnNo(page: number = 1, size: number = 50): Promise<any> {
//   const params = new HttpParams()
//       .set('page', page)
//       .set('size', size)
//   return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetTrnNo, { params }").toPromise();
// }
 GetTrnNo(page: number = 1, size: number = 50,sortColumn: string,  sortDirection: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
       .set('sortColumn', sortColumn)
    .set('sortDirection', sortDirection);
    
    return this.http.get<any>(this.baseurl +"/api/SecurityModuleAPI/GetTrnNo", { params });
  }
  GetTotalCount(): Observable<any> {
    return this.http.get<any>(this.baseurl +"/api/SecurityModuleAPI/GetTotalCount");
  }
  // GetReqNo():Promise<any>{
  //   return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetReqNo").toPromise();
  // }
  GetReqNo(reqType: string): Promise<any> {
  return this.http
    .get(`${this.baseurl}/api/SecurityModuleAPI/GetReqNo`, {
      params: { reqType: reqType }
    })
    .toPromise();
}
  GetBatchNo():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetBatchNo").toPromise();
  }
  getContractsforDrpDwn(search: string, pageIndex: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('search', search)
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<any>("http://localhost:44368/api/SecurityModuleAPI/GetAllContractsDrpdwn", { params });
  }


  GetClassification():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllClassification").toPromise();
  }

  GetType():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllType").toPromise();
  }

  GetCategory():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllCategory").toPromise();
  }

  GetCompany():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllCompany").toPromise();
  }

  GetSecurity():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllSecurity").toPromise();
  }

  GetBuy():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllBuy").toPromise();
  }

  GetSell():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllSell").toPromise();
  }
/*
  AddMovement(movement: Movement){
    return this.http.post<Movement>(this.baseurl +"/api/SecurityModuleAPI/AddMovement", movement);
  }
*/
  GetMovement():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllMovement").toPromise();
  }

  GetAvailableShares(CompanyID:string,SecurityID:string):Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAvailableShares/"+CompanyID+"/"+SecurityID).toPromise();
  }

  GetSummery():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetSummery").toPromise();
  }

  GetMarketPrice():Promise<any>{
    return this.http.get(this.baseurl +"/api/SecurityModuleAPI/GetAllMarketPrice").toPromise();
  }
  @Injectable({ providedIn: 'root' })
  private loginUrl = 'https://jsonplaceholder.typicode.com/users';
  login(username: string, password: string): Observable<any> {
    // Simulate a successful login (for demo purposes)
    return this.http.get<any[]>(this.loginUrl).pipe(
      map(users => {
        const user = users.find(u => u.username === username && u.email === password);
        if (user) {
          // Mock token for successful login
          return { token: 'mock-jwt-token' };
        } else {
          throw new Error('Invalid credentials');
        }
      })
    );
  }

}
export interface NavItem {
  displayName: string;
  iconName: string;
  route: string;
  children?: NavItem[];
}
