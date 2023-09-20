import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinDrawingDialogComponent } from './join-drawing-dialog.component';

describe('JoinDrawingDialogComponent', () => {
  let component: JoinDrawingDialogComponent;
  let fixture: ComponentFixture<JoinDrawingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinDrawingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinDrawingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
