import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditParameterDialogComponent } from './edit-parameter-dialog.component';

describe('EditParameterDialogComponent', () => {
  let component: EditParameterDialogComponent;
  let fixture: ComponentFixture<EditParameterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditParameterDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditParameterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
