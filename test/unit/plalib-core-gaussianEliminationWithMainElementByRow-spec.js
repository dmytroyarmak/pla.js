describe('plalib.core.gaussianEliminationWithMainElementByRow', function() {
  it('should be a function', function() {
    expect(plalib.core.gaussianEliminationWithMainElementByRow).toEqual(jasmine.any(Function));
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

      plalib.core.gaussianEliminationWithMainElementByRow(m, n, a, b);
    });

    it('should transform a to triangular form', function() {
      var i;

      var expectedA = [
        -3,  -1,   2,
        0,  5/3, 2/3,
        0,    0, 1/5
      ];
      for (i = 0; i < expectedA.length; i += 1) {
        expect(a[i]).toBeCloseTo(expectedA[i], 15);
      }

      var expectedB = [
         -11,
        13/3,
        -1/5
      ];
      for (i = 0; i < expectedB.length; i += 1) {
        expect(b[i]).toBeCloseTo(expectedB[i], 15);
      }
    });

  });
});
