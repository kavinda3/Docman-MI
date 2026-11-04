import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisHomeComponent } from './mis-home.component';

describe('MisHomeComponent', () => {
  let component: MisHomeComponent;
  let fixture: ComponentFixture<MisHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
