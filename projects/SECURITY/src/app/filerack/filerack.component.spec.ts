import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilerackComponent } from './filerack.component';

describe('FilerackComponent', () => {
  let component: FilerackComponent;
  let fixture: ComponentFixture<FilerackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilerackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilerackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
