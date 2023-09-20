import { TestBed } from '@angular/core/testing';

import { TeamClientService } from './team-client.service';

describe('TeamClientService', () => {
  let service: TeamClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
