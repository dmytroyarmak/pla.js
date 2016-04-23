import {fillIdentityMatrix} from '../../src/plalib-core';

describe('fillIdentityMatrix', function() {
  it('should be a function', function() {
    expect(fillIdentityMatrix).toEqual(jasmine.any(Function));
  });

  describe('for matrix A', function() {
    var n, a;

    beforeEach(function() {
      n = 3;
      a = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n * n));
      a.set([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ]);

      fillIdentityMatrix(n, a);
    });

    it('should make matrix A an identity matrix', function() {
      var expectedA = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ];

      for (let i = 0; i < expectedA.length; i += 1) {
        expect(a[i]).toBeCloseTo(expectedA[i], 15);
      }
    });
  });
});
