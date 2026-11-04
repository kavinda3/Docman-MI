import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormauthorizerComponent } from './formauthorizer.component';

describe('FormauthorizerComponent', () => {
  let component: FormauthorizerComponent;
  let fixture: ComponentFixture<FormauthorizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormauthorizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormauthorizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
