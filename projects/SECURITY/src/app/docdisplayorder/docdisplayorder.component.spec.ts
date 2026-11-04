import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocdisplayorderComponent } from './docdisplayorder.component';

describe('DocdisplayorderComponent', () => {
  let component: DocdisplayorderComponent;
  let fixture: ComponentFixture<DocdisplayorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocdisplayorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocdisplayorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
