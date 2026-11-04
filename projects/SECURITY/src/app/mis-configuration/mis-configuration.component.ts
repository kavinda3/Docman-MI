
import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { merge } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FooterComponent } from './../footer/footer.component';
import { MatTableDataSource } from '@angular/material/table';
import { SecurityService } from '../../shared/security-service.service';

@Component({
  selector: 'app-mis-configuration',
  templateUrl: './mis-configuration.component.html',
  styleUrls: ['./mis-configuration.component.scss']
})
export class MisConfigurationComponent implements OnInit {

  today =new Date();

  dragStart$ = this.dragulaService.drag("MIDRAG").pipe(mapTo(true));
  dragEnd$ = this.dragulaService.dragend("MIDRAG").pipe(mapTo(false));
  isDragging$ = merge(this.dragStart$, this.dragEnd$).pipe(startWith(false));
  
    constructor(private dragulaService: DragulaService) {

    }

    ngOnInit(): void {
      setInterval(() => { this.today = new Date();}, 1000);
    } 
 
}
