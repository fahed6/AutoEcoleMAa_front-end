import { TestBed } from '@angular/core/testing';

import { StudentResolveService } from './student-resolve.service';

describe('StudentResolveService', () => {
  let service: StudentResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
