import { TestBed } from '@angular/core/testing';

import { LeaderClubsService } from './leader-clubs.service';

describe('LeaderClubsService', () => {
  let service: LeaderClubsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaderClubsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
