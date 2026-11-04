import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemAssignSecLayerComponent } from './menu-item-assign-sec-layer.component';

describe('MenuItemAssignSecLayerComponent', () => {
  let component: MenuItemAssignSecLayerComponent;
  let fixture: ComponentFixture<MenuItemAssignSecLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuItemAssignSecLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemAssignSecLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
