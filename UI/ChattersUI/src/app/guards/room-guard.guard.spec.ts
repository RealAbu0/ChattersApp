import { TestBed } from '@angular/core/testing';

import { RoomGuardGuard } from './room-guard.guard';

describe('RoomGuardGuard', () => {
  let guard: RoomGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoomGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
