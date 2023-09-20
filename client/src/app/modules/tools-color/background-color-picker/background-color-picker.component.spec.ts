import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundColorPickerComponent } from './background-color-picker.component';

describe('BackgroundColorPickerComponent', () => {
  let component: BackgroundColorPickerComponent;
  let fixture: ComponentFixture<BackgroundColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundColorPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
