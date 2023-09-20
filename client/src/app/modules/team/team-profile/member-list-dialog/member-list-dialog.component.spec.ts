import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberListDialogComponent } from './member-list-dialog.component';

describe('MemberListDialogComponent', () => {
  let component: MemberListDialogComponent;
  let fixture: ComponentFixture<MemberListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberListDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
