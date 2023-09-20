import { TestBed } from '@angular/core/testing';

import { AvatarClientService } from './avatar-client.service';

describe('AvatarClientService', () => {
  let service: AvatarClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
