import {Plalib} from '../../src/plalib';

describe('Plalib.gaussJordanEliminationPar', function() {
  var plalib;

  beforeEach(function() {
    plalib = new Plalib();
  });

  afterEach(function() {
    plalib.terminate();
  });

  it('should be a function', function() {
    expect(plalib.gaussJordanEliminationPar).toEqual(jasmine.any(Function));
  });

  describe('for ax=b where a is a matrix nxn', function() {
    var n, a, b, result;

    beforeEach(function() {
      n = 9;
      a = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n * n));
      a.set([
        8, 7, 6, 8, 9, 9, 6, 2, 3,
        7, 9, 7, 2, 1, 5, 1, 1, 2,
        4, 9, 5, 6, 3, 7, 2, 7, 10,
        10, 9, 10, 4, 2, 2, 10, 8, 5,
        3, 3, 7, 9, 5, 3, 9, 1, 1,
        10, 9, 2, 9, 4, 2, 3, 6, 3,
        5, 4, 4, 4, 3, 0, 7, 5, 2,
        1, 9, 8, 2, 4, 10, 4, 6, 7,
        2, 7, 8, 2, 8, 1, 8, 7, 5
      ]);

      b = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n));
      b.set([
        9,
        9,
        2,
        6,
        6,
        3,
        3,
        1,
        1
      ]);

      result = plalib.gaussJordanEliminationPar(n, a, b);
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
          expect(a[i]).toBeCloseTo(expectedA[i], 15);
        }

        var expectedB = [
          0.15400285520687085,
          3.1777436517036715,
          -2.8100541754428643,
          -1.044055777038812,
          -0.4840861662958278,
          -0.30946141201974253,
          3.4135392137050076,
          -4.301424253263993,
          2.0000280981750276
        ];

        for (i = 0; i < expectedB.length; i += 1) {
          expect(b[i]).toBeCloseTo(expectedB[i], 15);
        }
      });
    });
  });
});
