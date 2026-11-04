import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { SecurityService } from '../../shared/security-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-docmanreports',
  templateUrl: './docmanreports.component.html',
  styleUrls: ['./docmanreports.component.scss']
})
export class DocmanreportsComponent implements OnInit {

  today =new Date();
  constructor(private dragulaService: DragulaService,public securityService:SecurityService,private http: HttpClient) { }
  reportType:string=""
  todate:string=new Date().toISOString().split('T')[0];
  fromdate:string=new Date().toISOString().split('T')[0];
  crstatus:string=""
  contractNo:string=""
  reprtType:string="DOCS"
  RptType:any=[];
  ngOnInit(): void {
    setInterval(() => { this.today = new Date();}, 1000);
     this.onLoadReports();
  }
 
  isLoading = false;
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
        IRPTID: rows[i].iRptId
      });
    }
    return res;
  }
  @ViewChild('crStatus') crStatus!: ElementRef;

onCrStatusKeydown(event: KeyboardEvent) {
  if (event.key === 'Tab') {
    event.preventDefault();

    const next = document.querySelector<HTMLInputElement>('#nextFieldId');
    next?.focus();
  }
}
  PrintReport() {
      const reportName = this.reportType;
      const userId = 'docman';

    // const url = `http://localhost:44368/api/SecurityModuleAPI/getreport?rptname=${encodeURIComponent(reportName)}`;
      const url = `http://192.168.100.51:81/DocmanLogin/api/SecurityModuleAPI/getreport?rptname=${encodeURIComponent(reportName)}`;
      window.open(url, '_blank');
    }
  }
// PrintReport() {
//   //this.isLoading = true; // Show loading

//   // this.securityService.GetDocmanReport(this.reportType, this.fromdate, this.todate, this.contractNo, this.crstatus)
//   //   .subscribe(blob => {
//   //     const file = new Blob([blob], { type: 'application/pdf' });

//   //     const fileURL = URL.createObjectURL(file);
//   //     window.open(fileURL); // Open PDF

//   //     this.isLoading = false; // Hide loading
//   //   }, error => {
//   //     console.error('Error fetching report:', error);
//   //     this.isLoading = false; // Hide loading on error
//   //   });
// //window.open('http://localhost:44368/api/SecurityModuleAPI/getreport', '_blank');
// //  this.http.get<any>('http://localhost:44368/api/SecurityModuleAPI/getreport').subscribe(res => {
// //       const { reportUrl, sessionId } = res;

// //       // Create a hidden form to pass JSESSIONID as a cookie
// //       document.cookie = `JSESSIONID=${sessionId}; path=/;`;

// //       // Open the Jasper report in a new tab
// //       window.open(reportUrl, '_blank');
// //     });

// const reportName = this.reportType;
// const userId = 'docman';

// //const url = `http://localhost:44368/api/SecurityModuleAPI/getreport?rptname=${encodeURIComponent(reportName)}`;

//   const url = `http://192.168.100.51:81/DocmanLogin/api/SecurityModuleAPI/getreport?rptname=${encodeURIComponent(reportName)}`;

// window.open(url, '_blank');
// }
// }
  
