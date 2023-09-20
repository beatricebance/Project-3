import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmJoinDialogComponent } from './confirm-join-dialog.component';

describe('ConfirmJoinDialogComponent', () => {
  let component: ConfirmJoinDialogComponent;
  let fixture: ComponentFixture<ConfirmJoinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmJoinDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmJoinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
