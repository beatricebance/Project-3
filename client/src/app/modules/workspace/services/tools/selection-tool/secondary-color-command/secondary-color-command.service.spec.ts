import { TestBed } from '@angular/core/testing';

import { SecondaryColorCommand } from './secondary-color-command.service';

describe('SecondaryColorCommandService', () => {
  let service: SecondaryColorCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecondaryColorCommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
