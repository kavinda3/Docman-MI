import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileclosebundleComponent } from './fileclosebundle.component';

describe('FileclosebundleComponent', () => {
  let component: FileclosebundleComponent;
  let fixture: ComponentFixture<FileclosebundleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileclosebundleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileclosebundleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
