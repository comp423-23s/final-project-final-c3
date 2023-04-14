import { TestBed } from '@angular/core/testing';

import { AdminPendingRequestsService } from './admin-pending-requests.service';

describe('AdminPendingRequestsService', () => {
  let service: AdminPendingRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPendingRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
