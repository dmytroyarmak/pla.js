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
        5, 2, 3,
        2, 6, 1,
        3, 1, 7
      ];

      b = [
        10,
        20,
        30
      ];

      choleskyDecomposition(n, a, b);
    });

    it('should transform a to triangular form', function() {
      expect(a).toEqual([
        2.23606797749979, 0, 0,
        0.8944271909999159, 2.280350850198276, 0,
        1.3416407864998738, -0.08770580193070289, 2.27866357593825
      ]);
    });
  });
});
