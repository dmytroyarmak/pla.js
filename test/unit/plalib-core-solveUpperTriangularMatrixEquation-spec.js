import {solveUpperTriangularMatrixEquation} from '../../src/plalib-core';

describe('solveUpperTriangularMatrixEquation', function() {
  it('should be a function', function() {
    expect(solveUpperTriangularMatrixEquation).toEqual(jasmine.any(Function));
  });

  describe('for ux=b where a is a matrix nxn', function() {
    var n, u, b;

    beforeEach(function() {
      n = 9;
      u = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n * n));
      u.set([
        8, 7, 6, 8, 9, 9, 6, 2, 3,
        0, 9, 7, 2, 1, 5, 1, 1, 2,
        0, 0, 5, 6, 3, 7, 2, 7, 7,
        0, 0, 0, 4, 2, 2, 4, 8, 5,
        0, 0, 0, 0, 5, 3, 9, 1, 1,
        0, 0, 0, 0, 0, 2, 3, 6, 3,
        0, 0, 0, 0, 0, 0, 7, 5, 2,
        0, 0, 0, 0, 0, 0, 0, 6, 7,
        0, 0, 0, 0, 0, 0, 0, 0, 2
      ]);

      b = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n));
      b.set([
        14,
        9,
        3,
        6,
        11,
        3,
        30,
        46,
        8
      ]);

      solveUpperTriangularMatrixEquation(n, u, b);
    });

    it('should make b a solution of matrix equation', function() {
      var expectedB = [
          5,
         -3,
         15,
         -7,
          8,
        -15,
          1,
          3,
          4
      ];

      for (let i = 0; i < expectedB.length; i += 1) {
        expect(b[i]).toBeCloseTo(expectedB[i], 15);
      }
    });
  });
});
