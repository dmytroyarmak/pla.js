xdescribe('plalib.core.gaussJordanElimination', function() {
  it('should be a function', function() {
    expect(plalib.core.gaussJordanElimination).toEqual(jasmine.any(Function));
  });

  describe('for ax=b where a is a matrix mxn', function() {
    var m, n, a, b;

    beforeEach(function() {
      m = 3;
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

      plalib.core.gaussJordanElimination(m, n, a, b);
    });

    it('should transform a to triangular form', function() {
      expect(a).toEqual([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ]);

      expect(b).toEqual([
         2,
         3,
        -1
      ]);
    });

  });
});
