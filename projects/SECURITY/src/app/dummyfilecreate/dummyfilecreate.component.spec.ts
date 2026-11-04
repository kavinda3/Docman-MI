import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyfilecreateComponent } from './dummyfilecreate.component';

describe('DummyfilecreateComponent', () => {
  let component: DummyfilecreateComponent;
  let fixture: ComponentFixture<DummyfilecreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DummyfilecreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyfilecreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
