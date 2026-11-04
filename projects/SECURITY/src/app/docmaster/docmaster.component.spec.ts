import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocmasterComponent } from './docmaster.component';

describe('DocmasterComponent', () => {
  let component: DocmasterComponent;
  let fixture: ComponentFixture<DocmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
