import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisConfigurationComponent } from './mis-configuration.component';

describe('MisConfigurationComponent', () => {
  let component: MisConfigurationComponent;
  let fixture: ComponentFixture<MisConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
