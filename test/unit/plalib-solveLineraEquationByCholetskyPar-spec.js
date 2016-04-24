import Plalib from '../../src/plalib';

describe('Plalib.solveLineraEquationByCholetskyPar', function() {
  var plalib;

  beforeEach(function() {
    plalib = new Plalib({workersAmount: 3});
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
      n = 9;
      a = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n * n));
      a.set([
        1, 0.5, 0.3333333333333333, 0.25, 0.2, 0.16666666666666666, 0.14285714285714285, 0.125, 0.1111111111111111,
        0.5, 1, 0.6666666666666666, 0.5, 0.4, 0.3333333333333333, 0.2857142857142857, 0.25, 0.2222222222222222,
        0.3333333333333333, 0.6666666666666666, 1, 0.75, 0.6, 0.5, 0.42857142857142855, 0.375, 0.3333333333333333,
        0.25, 0.5, 0.75, 1, 0.8, 0.6666666666666666, 0.5714285714285714, 0.5, 0.4444444444444444,
        0.2, 0.4, 0.6, 0.8, 1, 0.8333333333333334, 0.7142857142857143, 0.625, 0.5555555555555556,
        0.16666666666666666, 0.3333333333333333, 0.5, 0.6666666666666666, 0.8333333333333334, 1, 0.8571428571428571, 0.75, 0.6666666666666666,
        0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714, 0.7142857142857143, 0.8571428571428571, 1, 0.875, 0.7777777777777778,
        0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1, 0.8888888888888888, 0.1111111111111111, 0.2222222222222222, 0.3333333333333333, 0.4444444444444444, 0.5555555555555556, 0.6666666666666666, 0.7777777777777778, 0.8888888888888888, 1
      ]);

      b = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n));
      b.set([
        4,
        2,
        5,
        6,
        6,
        7,
        1,
        6,
        5
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
          1, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 1, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 1, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 1, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 1, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 1, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 1, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 1, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 1
        ];

        for (i = 0; i < expectedA.length; i += 1) {
          expect(a[i]).toBeCloseTo(expectedA[i], 10);
        }

        var expectedB = [
          4.000000000000002,
          -4.4000000000000075,
          2.742857142857157,
          2.4761904761904585,
          -2.121212121212096,
          22.699300699300665,
          -37.97948717948714,
          23.278431372548987,
          -1.5882352941176374
        ];

        for (i = 0; i < expectedB.length; i += 1) {
          expect(b[i]).toBeCloseTo(expectedB[i], 10);
        }
      });
    });
  });
});
