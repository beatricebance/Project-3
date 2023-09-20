import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMainPageComponent } from './team-main-page.component';

describe('TeamMainPageComponent', () => {
  let component: TeamMainPageComponent;
  let fixture: ComponentFixture<TeamMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
