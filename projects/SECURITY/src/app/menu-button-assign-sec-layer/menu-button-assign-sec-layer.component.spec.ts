import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuButtonAssignSecLayerComponent } from './menu-button-assign-sec-layer.component';

describe('MenuItemAssignSecLayerComponent', () => {
  let component: MenuButtonAssignSecLayerComponent;
  let fixture: ComponentFixture<MenuButtonAssignSecLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuButtonAssignSecLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuButtonAssignSecLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
