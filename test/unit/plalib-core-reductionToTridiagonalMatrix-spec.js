import {reductionToTridiagonalMatrix} from '../../src/plalib-core';

describe('reductionToTridiagonalMatrix', function() {
  it('should be a function', function() {
    expect(reductionToTridiagonalMatrix).toEqual(jasmine.any(Function));
  });

  describe('for matrix a nxn', function() {
    var n, a;

    beforeEach(function() {
      n = 4;
      a = [
        1, 2, 3, 4,
        2, 5, 6, 7,
        3, 6, 8, 9,
        4, 7, 9, 1
      ];

      reductionToTridiagonalMatrix(n, a);
    });

    it('should transform a to tridiagonal matrix', function() {
      expect(a).toEqual([
        0.9455021624501647, 122.26748269728438, 0, 0,
        122.26748269728438, -15300.655000920573, 3073.3389827590363, 0,
        0, 3073.3389827590363, 1993.8462422593357, -146,
        0, 0, -146, 1
      ]);
    });
  });
});
