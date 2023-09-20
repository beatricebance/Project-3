import { TestBed } from '@angular/core/testing';

import { LineWidthCommand } from './line-width-command.service';

describe('LineWidthCommandService', () => {
  let service: LineWidthCommand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineWidthCommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
