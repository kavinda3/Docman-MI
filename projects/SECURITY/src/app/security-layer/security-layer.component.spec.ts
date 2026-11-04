import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityLayerComponent } from './security-layer.component';

describe('SecurityLayerComponent', () => {
  let component: SecurityLayerComponent;
  let fixture: ComponentFixture<SecurityLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
