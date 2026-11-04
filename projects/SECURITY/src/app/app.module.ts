import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormControl, FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepicker } from '@angular/material/datepicker';
//import { MatTreeModule } from '__node_modules/@angular/material/tree';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

import { MatChipsModule } from '@angular/material/chips';
import { MiNavComponent } from './mi-nav/mi-nav.component';

import { DragulaModule } from 'ng2-dragula';
import { MisHomeComponent } from './mis-home/mis-home.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { MatTreeModule } from '@angular/material/tree';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatSelectModule} from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import {A11yModule} from '@angular/cdk/a11y';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {OverlayModule} from '@angular/cdk/overlay';
import { ReportDetailsComponent } from './report-details/report-details.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MenuListItemComponent } from './menu-list-item/menu-list-item.component';
import { ProductComponent } from './product/product.component';
import { GroupComponent } from './group/group.component';
import { SecurityLayerComponent } from './security-layer/security-layer.component';
import { MenuGroupComponent } from './menu-group/menu-group.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuButtonComponent } from './menu-button/menu-button.component';
import { MenuItemAssignSecLayerComponent } from './menu-item-assign-sec-layer/menu-item-assign-sec-layer.component';
import { MenuButtonAssignSecLayerComponent } from './menu-button-assign-sec-layer/menu-button-assign-sec-layer.component';
import { MisConfigurationComponent } from './mis-configuration/mis-configuration.component';
import { FilerackComponent } from './filerack/filerack.component';
import { FileLocationComponent } from './file-location/file-location.component';
import { TestComponent } from './test/test.component';
import { Test1Component } from './test1/test1.component';
import { Test3Component } from './test3/test3.component';
import { SearchtableComponent } from './searchtable/searchtable.component';
import { DocmasterComponent } from './docmaster/docmaster.component';
import { DocHandlingComponent } from './doc-handling/doc-handling.component';
import { MatCard } from '@angular/material/card';
import { DropdownComponent } from './dropdown/dropdown.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TransferFileComponent } from './transfer-file/transfer-file.component';
import { RequestFileComponent } from './request-file/request-file.component';
import { PendingrequestComponent } from './pendingrequest/pendingrequest.component';
import { LoginComponent } from './login/login.component';
import { DummyfilecreateComponent } from './dummyfilecreate/dummyfilecreate.component';
import { DocdisplayorderComponent } from './docdisplayorder/docdisplayorder.component';
import { FormauthorizerComponent } from './formauthorizer/formauthorizer.component';
import { FileclosebatchComponent } from './fileclosebatch/fileclosebatch.component';
import { FileclosebundleComponent } from './fileclosebundle/fileclosebundle.component';
import { DocmanreportsComponent } from './docmanreports/docmanreports.component';
import { CrpendingComponent } from './crpending/crpending.component';
const appRoutes: Routes = [
    //{ path: '', component: MisHomeComponent, data: { title: '' } },
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  //{ path: 'login', component: LoginComponent },
  // other routes go here, like dashboard, profile, etc.
 // { path: '**', redirectTo: 'login' }, // fallback for unmatched routes
   { path: 'docmanreport', component: DocmanreportsComponent, data: { title: 'docmanreport'}},
   { path: 'fileclosebatch', component: FileclosebatchComponent, data: { title: 'fileclosebatch'}},
   { path: 'fileclosebundle', component: FileclosebundleComponent, data: { title: 'fileclosebundle'}},
   { path: 'authorizer', component: FormauthorizerComponent, data: { title: 'authorizer'}},
   { path: 'documentdisplayorder', component: DocdisplayorderComponent, data: { title: 'documentdisplayorder'}},
   { path: 'dummyfilecreate', component: DummyfilecreateComponent, data: { title: 'dummyfilecreate'}},
    { path: 'filerack', component: FilerackComponent, data: { title: 'filerack'}},
    { path: 'dropdown', component: DropdownComponent, data: { title: 'dropdown'}},
    { path: 'filelocation', component: FileLocationComponent, data: { title: 'filelocation'}},
    { path: 'docmaster', component: DocmasterComponent, data: { title: 'docmaster'}},
   // { path: 'filerack', component: FilerackComponent, data: { title: 'filerack'}},
    { path: 'dochandling', component: DocHandlingComponent, data: { title: 'dochandling'}},
    { path: 'configuration', component: MisConfigurationComponent, data: { title: 'configuration'}},
    { path: 'product', component: ProductComponent, data: { title: 'product'}}, 
    { path: 'group', component: GroupComponent, data: { title: 'group'}},
    { path: 'securitylayer', component: SecurityLayerComponent, data: { title: 'securitylayer'}},
    { path: 'menuitem', component: MenuItemComponent, data: { title: 'menuitem'}},
    { path: 'menugroup', component: MenuGroupComponent, data: { title: 'menugroup'}},
    { path: 'menubutton', component: MenuButtonComponent, data: { title: 'menubutton'}},
    { path: 'menuitemassign', component: MenuItemAssignSecLayerComponent, data: { title: 'menuitemassign'}},
    { path: 'menubuttonsassignseclayer', component: MenuButtonAssignSecLayerComponent, data: { title: 'menubuttonsassignseclayer'}},
    { path: 'seclayerassigngroup', component: MenuButtonComponent, data: { title: 'seclayerassigngroup'}},
    { path: 'userassigngroup', component: MenuButtonComponent, data: { title: 'userassigngroup'}},
    { path: 'userassignseclayer', component: MenuButtonComponent, data: { title: 'userassignseclayer'}},
    { path: 'test', component: TestComponent, data: { title: 'test'}},
    { path: 'test1', component: TestComponent, data: { title: 'test1'}},
    { path: 'test3', component: TestComponent, data: { title: 'test3'}},
    { path: 'test4', component: SearchtableComponent, data: { title: 'test4'}},
    { path: 'reports', component: ReportDetailsComponent, data: { title: 'reports'}},
    { path: 'transferfile', component: TransferFileComponent, data: { title: 'transferfile'}},
    { path: 'requestfile', component: RequestFileComponent, data: { title: 'request_file'}},
    { path: 'requestfile/:id', component: RequestFileComponent },
    { path: 'pendingrequest', component: PendingrequestComponent, data: { title: 'pendingrequest'}},
    { path: 'transferfile/:id', component: TransferFileComponent }
];

@NgModule({
  exports: [
    MatSidenavModule,
    ChartsModule,
  ],

  declarations: [
    AppComponent,
    MiNavComponent,    
    MisHomeComponent,
    FooterComponent,
    ReportDetailsComponent,
    MenuListItemComponent,
    ProductComponent,
    GroupComponent,
    SecurityLayerComponent,
    MenuGroupComponent,
    MenuItemComponent,
    MenuButtonComponent,
    MenuItemAssignSecLayerComponent,
    MenuButtonAssignSecLayerComponent,
    MisConfigurationComponent,
    FilerackComponent,
    FileLocationComponent,
    TransferFileComponent,
    TestComponent,
    Test1Component,
    Test3Component,
    SearchtableComponent,
    DocmasterComponent,
    DocHandlingComponent,
    DropdownComponent,
    RequestFileComponent,
    PendingrequestComponent,
    LoginComponent,
    DummyfilecreateComponent,
    DocdisplayorderComponent,
    FormauthorizerComponent,
    FileclosebatchComponent,
    FileclosebundleComponent,
    DocmanreportsComponent,
    CrpendingComponent
  ],

  imports: [
    MatTabsModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    FormsModule,
    ScrollingModule,
    MatExpansionModule,
    MatCardModule,
    BrowserAnimationsModule,
    ChartsModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,    
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    A11yModule,
    MatToolbarModule,
    MatTableModule,
    MatTreeModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatBadgeModule,
    CdkTreeModule,
    MatChipsModule,
    DragulaModule.forRoot(),
    HttpClientModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatCheckboxModule,
    MatListModule,
    MatIconModule,
    MatRadioModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatBadgeModule,
    MatChipsModule,
    MatInputModule,
    MatTableExporterModule,
    // MatDatepicker,
    
    RouterModule.forRoot(
      appRoutes,{ useHash: false }
    )
  ],

  entryComponents: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
 ],
  //providers: [DashboardService],

  bootstrap: [AppComponent]
})

export class AppModule { }

export class DragulaDemoModule { }
