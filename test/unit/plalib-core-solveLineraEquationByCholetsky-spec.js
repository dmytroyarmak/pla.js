import {solveLineraEquationByCholetsky} from '../../src/plalib-core';

describe('solveLineraEquationByCholetsky', function() {
  it('should be a function', function() {
    expect(solveLineraEquationByCholetsky).toEqual(jasmine.any(Function));
  });

  describe('for ax=b where a is a matrix nxn', function() {
    var n, a, b;

    beforeEach(function() {
      n = 3;
      a = [
        5, 2, 3,
        2, 6, 1,
        3, 1, 7
      ];

      b = [
          8,
        -11,
         -3
      ];

      solveLineraEquationByCholetsky(n, a, b);
    });

    it('should transform a to triangular form', function() {
      expect(a).toEqual([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ]);

      expect(b).toEqual([
        3.6814814814814807,
        -2.7925925925925923,
        -1.6074074074074072
      ]);
    });

  });
});
