import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileclosebatchComponent } from './fileclosebatch.component';

describe('FileclosebatchComponent', () => {
  let component: FileclosebatchComponent;
  let fixture: ComponentFixture<FileclosebatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileclosebatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileclosebatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
