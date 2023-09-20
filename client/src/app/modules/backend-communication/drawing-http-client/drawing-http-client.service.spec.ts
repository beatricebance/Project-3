import { TestBed } from '@angular/core/testing';

import { DrawingHttpClientService } from './drawing-http-client.service';

describe('DrawingHttpClientService', () => {
  let service: DrawingHttpClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawingHttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
