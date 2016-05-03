import {powerMethod} from '../../src/plalib-core';

describe('powerMethod', function() {
  it('should be a function', function() {
    expect(powerMethod).toEqual(jasmine.any(Function));
  });

  describe('for a matrix nxn and vestor x', function() {
    var n, a, x, xTmp;

    beforeEach(function() {
      n = 6;
      a = [
         87,  270, -12, -49, -276,  40,
        -14,  -45,   6,  10,   46,  -4,
        -50, -156,   4,  25,  162, -25,
         94,  294,  -5, -47, -306,  49,
          1,    1,   3,   1,    0,   2,
         16,   48,   1,  -6,  -48,   8
      ];

      x = [
          1,
          1,
          1,
          1,
          1,
          1
      ];

      xTmp = [];

      powerMethod(n, a, x, xTmp);
    });

    it('should find the largest eigenvalue', function() {
      expect(xTmp[0]).toBeCloseTo(4);
    });

    it('should transfort x to ', function() {
      expect(x).toEqual([
        0.25812978821307364,
        0.00027633381026848547,
        -0.51632864448886,
        0.774596581139248,
        0.00027633996620907896,
        0.25840612817928077
      ]);
    });
  });
});
