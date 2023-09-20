import { TestBed } from '@angular/core/testing';

import { CommandFactoryService } from './command-factory.service';

describe('CommandFactoryService', () => {
  let service: CommandFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
