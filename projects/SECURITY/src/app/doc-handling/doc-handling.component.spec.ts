import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocHandlingComponent } from './doc-handling.component';

describe('DocHandlingComponent', () => {
  let component: DocHandlingComponent;
  let fixture: ComponentFixture<DocHandlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocHandlingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
