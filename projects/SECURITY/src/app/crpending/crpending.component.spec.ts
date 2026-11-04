import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrpendingComponent } from './crpending.component';

describe('CrpendingComponent', () => {
  let component: CrpendingComponent;
  let fixture: ComponentFixture<CrpendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrpendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
