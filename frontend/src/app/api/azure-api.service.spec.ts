import { TestBed } from '@angular/core/testing';

import { AzureApiService } from './azure-api.service';

describe('AzureApiService', () => {
  let service: AzureApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
