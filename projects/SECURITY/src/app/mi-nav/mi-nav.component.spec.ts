import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiNavComponent } from './mi-nav.component';

describe('MiNavComponent', () => {
  let component: MiNavComponent;
  let fixture: ComponentFixture<MiNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
