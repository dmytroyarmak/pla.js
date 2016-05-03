import Plalib from '../../src/plalib';

describe('Plalib.powerMethodPar', function() {
  var plalib;

  beforeEach(function() {
    plalib = new Plalib({workersAmount: 3});
  });

  afterEach(function() {
    plalib.terminate();
  });

  it('should be a function', function() {
    expect(plalib.powerMethodPar).toEqual(jasmine.any(Function));
  });

  describe('for a matrix nxn and vestor x', function() {
    var n, a, x, xTmp, result;

    beforeEach(function() {
      n = 6;
      a = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n * n));
      a.set([
         87,  270, -12, -49, -276,  40,
        -14,  -45,   6,  10,   46,  -4,
        -50, -156,   4,  25,  162, -25,
         94,  294,  -5, -47, -306,  49,
          1,    1,   3,   1,    0,   2,
         16,   48,   1,  -6,  -48,   8
      ]);

      x = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n));
      x.set([
        1,
        1,
        1,
        1,
        1,
        1
      ]);

      xTmp = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n));

      result = plalib.powerMethodPar(n, a, x, xTmp);
    });

    it('should return a promise', function() {
      expect(result).toEqual(jasmine.any(Promise));
    });

    describe('when resolved', function() {
      beforeEach(function(done) {
        result.then(done);
      });

      it('should find the largest eigenvalue and transform x to eigenvector', function() {
        expect(xTmp[0]).toBeCloseTo(4);

        var i;

        var expectedX = [
          0.25812978821307364,
          0.00027633381026848547,
          -0.51632864448886,
          0.774596581139248,
          0.00027633996620907896,
          0.25840612817928077
        ];

        for (i = 0; i < expectedX.length; i += 1) {
          expect(x[i]).toBeCloseTo(expectedX[i], 10);
        }
      });
    });
  });
});
