import { TestBed } from '@angular/core/testing';

import { RegisterLeaderService } from './register-leader.service';

describe('RegisterLeaderService', () => {
  let service: RegisterLeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterLeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
