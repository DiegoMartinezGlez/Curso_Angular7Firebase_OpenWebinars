import { TestBed } from '@angular/core/testing';

import { FireDbService } from './fire-db.service';

describe('FireDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FireDbService = TestBed.get(FireDbService);
    expect(service).toBeTruthy();
  });
});
