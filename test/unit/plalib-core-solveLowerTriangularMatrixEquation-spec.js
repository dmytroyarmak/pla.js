import {solveLowerTriangularMatrixEquation} from '../../src/plalib-core';

describe('solveLowerTriangularMatrixEquation', function() {
  it('should be a function', function() {
    expect(solveLowerTriangularMatrixEquation).toEqual(jasmine.any(Function));
  });

  describe('for ux=b where a is a matrix nxn', function() {
    var n, u, b;

    beforeEach(function() {
      n = 9;
      u = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n * n));
      u.set([
        2, 0, 0, 0, 0, 0, 0, 0, 0,
        7, 6, 0, 0, 0, 0, 0, 0, 0,
        2, 5, 7, 0, 0, 0, 0, 0, 0,
        3, 6, 3, 2, 0, 0, 0, 0, 0,
        1, 1, 9, 3, 5, 0, 0, 0, 0,
        5, 8, 4, 2, 2, 4, 0, 0, 0,
        7, 7, 2, 7, 3, 6, 5, 0, 0,
        2, 1, 1, 5, 1, 2, 7, 9, 0,
        3, 2, 6, 9, 9, 8, 6, 7, 8
      ]);

      b = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n));
      b.set([
        8,
        46,
        30,
        3,
        11,
        6,
        3,
        9,
        14
      ]);

      solveLowerTriangularMatrixEquation(n, u, b);
    });

    it('should make b a solution of matrix equation', function() {
      var expectedB = [
         4,
         3,
         1,
       -15,
         8,
        -7,
        15,
        -3,
         5
      ];

      for (let i = 0; i < expectedB.length; i += 1) {
        expect(b[i]).toBeCloseTo(expectedB[i], 15);
      }
    });
  });
});
