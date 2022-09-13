import { TestBed } from '@angular/core/testing';

import { MoneyBrilliantService } from './money-brilliant.service';

describe('MoneyBrilliantService', () => {
  let service: MoneyBrilliantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoneyBrilliantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
