import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDrawingParametersDialogComponent } from './edit-drawing-parameters-dialog.component';

describe('EditDrawingParametersDialogComponent', () => {
  let component: EditDrawingParametersDialogComponent;
  let fixture: ComponentFixture<EditDrawingParametersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDrawingParametersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDrawingParametersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
