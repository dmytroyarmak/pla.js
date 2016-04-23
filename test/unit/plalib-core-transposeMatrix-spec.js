import {transposeMatrix} from '../../src/plalib-core';

describe('transposeMatrix', function() {
  it('should be a function', function() {
    expect(transposeMatrix).toEqual(jasmine.any(Function));
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

      transposeMatrix(n, a);
    });

    it('should transpose matrix A', function() {
      var expectedA = [
        1, 4, 7,
        2, 5, 8,
        3, 6, 9
      ];

      for (let i = 0; i < expectedA.length; i += 1) {
        expect(a[i]).toBeCloseTo(expectedA[i], 15);
      }
    });
  });
});
