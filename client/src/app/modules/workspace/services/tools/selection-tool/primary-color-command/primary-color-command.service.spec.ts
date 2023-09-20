import { TestBed } from '@angular/core/testing';
import { PrimaryColorCommand } from './primary-color-command.service';

describe('PrimaryColorCommandService', () => {
  let service: PrimaryColorCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrimaryColorCommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
