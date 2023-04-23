import { TestBed } from '@angular/core/testing';

import { AdminClubsService } from './admin-clubs.service';

describe('AdminClubsService', () => {
  let service: AdminClubsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminClubsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
