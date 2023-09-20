import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationNavbarComponent } from './authentication-navbar.component';

describe('AuthenticationNavbarComponent', () => {
  let component: AuthenticationNavbarComponent;
  let fixture: ComponentFixture<AuthenticationNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticationNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
