import Plalib from '../../src/plalib';

describe('Plalib.solveLowerTriangularMatrixEquation', function() {
  var plalib;

  beforeEach(function() {
    plalib = new Plalib();
  });

  afterEach(function() {
    plalib.terminate();
  });

  it('should be a function', function() {
    expect(plalib.solveLowerTriangularMatrixEquation).toEqual(jasmine.any(Function));
  });

  describe('for ux=b where a is a matrix nxn', function() {
    var n, u, b, result;

    beforeEach(function() {
      n = 9;
      u = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n * n));
      u.set([
        2, 0, 0, 0, 0, 0, 0, 0, 0,
        7, 6, 0, 0, 0, 0, 0, 0, 0,
        2, 5, 7, 0, 0, 0, 0, 0, 0,
        3, 6, 3, 2, 0, 0, 0, 0, 0,
        1, 1, 9, 3, 5, 0, 0, 0, 0,
        5, 8, 4, 2, 2, 4, 0, 0, 0,
        7, 7, 2, 7, 3, 6, 5, 0, 0,
        2, 1, 1, 5, 1, 2, 7, 9, 0,
        3, 2, 6, 9, 9, 8, 6, 7, 8
      ]);

      b = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n));
      b.set([
        8,
        46,
        30,
        3,
        11,
        6,
        3,
        9,
        14
      ]);

      result = plalib.solveLowerTriangularMatrixEquation(n, u, b);
    });

    it('should return a promise', function() {
      expect(result).toEqual(jasmine.any(Promise));
    });

    describe('when resolved', function() {
      var x;
      beforeEach(function(done) {
        result.then(function(_x_) {
          x = _x_;
          done();
        });
      });

      it('x be solution of matrix equation', function() {
        var expectedX = [
           4,
           3,
           1,
         -15,
           8,
          -7,
          15,
          -3,
           5
        ];

        for (let i = 0; i < expectedX.length; i += 1) {
          expect(x[i]).toBeCloseTo(expectedX[i], 15);
        }
      });
    });
  });
});
