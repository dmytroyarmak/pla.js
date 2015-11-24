import {gaussianElimination} from '../../src/plalib-core';

describe('gaussianElimination', function() {
  it('should be a function', function() {
    expect(gaussianElimination).toEqual(jasmine.any(Function));
  });

  describe('for ax=b where a is a matrix nxn', function() {
    var n, a, b;

    beforeEach(function() {
      n = 3;
      a = [
          2,  1, -1,
         -3, -1,  2,
         -2,  1,  2
      ];

      b = [
          8,
        -11,
         -3
      ];

      gaussianElimination(n, a, b);
    });

    it('should transform a to triangular form', function() {
      expect(a).toEqual([
        2,    1,  -1,
        0,  0.5, 0.5,
        0,    0,  -1
      ]);

      expect(b).toEqual([
        8,
        1,
        1
      ]);
    });

  });
});
