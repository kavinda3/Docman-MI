import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferFileComponent } from './transfer-file.component';

describe('TransferFileComponent', () => {
  let component: TransferFileComponent;
  let fixture: ComponentFixture<TransferFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
