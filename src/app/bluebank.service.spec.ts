/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BluebankService } from './bluebank.service';

describe('BluebankService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BluebankService]
    });
  });

  it('should ...', inject([BluebankService], (service: BluebankService) => {
    expect(service).toBeTruthy();
  }));
});
