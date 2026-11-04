import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';
import { HttpClient } from '@angular/common/http';

//import jsPDF from 'jspdf';
//import 'jspdf-autotable';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.scss']
})
export class ReportDetailsComponent implements OnInit {

  today =new Date();
    constructor(private dragulaService: DragulaService,public securityService:SecurityService,private http: HttpClient) { }
    reportType:string=""
    todate:string=new Date().toISOString().split('T')[0];
    fromdate: string = new Date().toISOString().split('T')[0];
    crstatus1: string[] = [];
    batchNo:string=""
    RptType:any=[];
    contractNo:string=""
    fromLocation:string=""
    reprtType:string="TRANS"
    toLocation:string=""
    Location :any=[];
    ngOnInit(): void {
      setInterval(() => { this.today = new Date();}, 1000);
       this.onLoadLocation();
      this.onLoadReports();
    }
    // PrintReport(){
    //   this.securityService.GetReport(this.reportType,this.fromdate,this.todate).subscribe(data => {
    //   }, error => {
    //     console.error('Error fetching doc types:', error);
    //   });
    // }
    
    PrintReport() {
      const reportName = this.reportType;
      const userId = 'docman';

      //const url = `http://localhost:44368/api/SecurityModuleAPI/getreport?rptname=${encodeURIComponent(reportName)}`;
      const url = `http://192.168.100.51:81/DocmanLogin/api/SecurityModuleAPI/getreport?rptname=${encodeURIComponent(reportName)}`;
      window.open(url, '_blank');
    }
     onLoadLocation(){
      this.securityService.GetLocation().subscribe(data => {
        this.Location = this.prepareLocationList(data);
      }, error => {
        console.error('Error fetching doc types:', error);
      });
    }
      prepareLocationList(rows:any) {
      const res=[];
      for(let i=0;i<rows.length;i++) {
        res.push({
          strLocCode:rows[i].strLocationCode,
          strLocName:rows[i].strLocation
          //ProductRedirectPath:rows[i].strProductRedirectPath
        });
      }
      return res;
    }
  onLoadReports() {
    this.securityService.GetReports(this.reprtType).subscribe(data => {
      this.RptType = this.prepareReporttypeList(data);
    }, error => {
      console.error('Error fetching doc types:', error);
    });
  }
   prepareReporttypeList(rows: any) {
    const res = [];
    for (let i = 0; i < rows.length; i++) {
      res.push({
        SZRPTNAME: rows[i].strRptname,
        IRPTID:  rows[i].iRptId
      });
    }
    return res;
  }

  }
  
  export interface Reports {
    SZRPTNAME: string;
    IRPTID: number;
  }