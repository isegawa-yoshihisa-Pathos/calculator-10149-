import { TestBed } from '@angular/core/testing';

import { NumericalService } from './numerical.service';

describe('NumericalService', () => {
  let service: NumericalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumericalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
