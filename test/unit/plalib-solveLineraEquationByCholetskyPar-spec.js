import Plalib from '../../src/plalib';

describe('Plalib.solveLineraEquationByCholetskyPar', function() {
  var plalib;

  beforeEach(function() {
    plalib = new Plalib();
  });

  afterEach(function() {
    plalib.terminate();
  });

  it('should be a function', function() {
    expect(plalib.solveLineraEquationByCholetskyPar).toEqual(jasmine.any(Function));
  });

  describe('for ax=b where a is a matrix nxn', function() {
    var n, a, b, result;

    beforeEach(function() {
      n = 3;
      a = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n * n));
      a.set([
        5, 2, 3,
        2, 6, 1,
        3, 1, 7
      ]);

      b = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n));
      b.set([
          8,
        -11,
         -3
      ]);

      result = plalib.solveLineraEquationByCholetskyPar(n, a, b);
    });

    it('should return a promise', function() {
      expect(result).toEqual(jasmine.any(Promise));
    });

    describe('when resolved', function() {
      beforeEach(function(done) {
        result.then(done);
      });

      it('should transform a to triangular form', function() {
        var i;

        var expectedA = [
          1, 0, 0,
          0, 1, 0,
          0, 0, 1
        ];


        for (i = 0; i < expectedA.length; i += 1) {
          expect(a[i]).toBeCloseTo(expectedA[i], 15);
        }

        var expectedB = [
          3.6814814814814807,
          -2.7925925925925923,
          -1.6074074074074072
        ];

        for (i = 0; i < expectedB.length; i += 1) {
          expect(b[i]).toBeCloseTo(expectedB[i], 15);
        }
      });
    });
  });
});
