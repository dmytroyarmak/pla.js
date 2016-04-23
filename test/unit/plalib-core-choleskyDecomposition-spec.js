import {choleskyDecomposition} from '../../src/plalib-core';

describe('choleskyDecomposition', function() {
  it('should be a function', function() {
    expect(choleskyDecomposition).toEqual(jasmine.any(Function));
  });

  describe('for ax=b where a is a matrix nxn', function() {
    var n, a, b;

    beforeEach(function() {
      n = 3;
      a = [
        25,  15,  -5,
        15,  18,   0,
        -5,   0,  11
      ];

      choleskyDecomposition(n, a);
    });

    it('should transform a to triangular form', function() {
      expect(a).toEqual([
        5, 0, 0,
        3, 3, 0,
        -1, 1, 3
      ]);
    });
  });
});
