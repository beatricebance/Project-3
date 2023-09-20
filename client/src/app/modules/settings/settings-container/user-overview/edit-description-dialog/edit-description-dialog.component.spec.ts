import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDescriptionDialogComponent } from './edit-description-dialog.component';

describe('EditDescriptionDialogComponent', () => {
  let component: EditDescriptionDialogComponent;
  let fixture: ComponentFixture<EditDescriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDescriptionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
