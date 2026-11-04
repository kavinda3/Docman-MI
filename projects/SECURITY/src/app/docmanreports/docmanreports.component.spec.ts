import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocmanreportsComponent } from './docmanreports.component';

describe('DocmanreportsComponent', () => {
  let component: DocmanreportsComponent;
  let fixture: ComponentFixture<DocmanreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocmanreportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocmanreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
