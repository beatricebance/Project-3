import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TellMeAboutYourselfComponent } from './tell-me-about-yourself.component';

describe('TellMeAboutYourselfComponent', () => {
  let component: TellMeAboutYourselfComponent;
  let fixture: ComponentFixture<TellMeAboutYourselfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TellMeAboutYourselfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TellMeAboutYourselfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
