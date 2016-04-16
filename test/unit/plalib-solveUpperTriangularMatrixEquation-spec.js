import {Plalib} from '../../src/plalib';

describe('Plalib.solveUpperTriangularMatrixEquation', function() {
  var plalib;

  beforeEach(function() {
    plalib = new Plalib();
  });

  afterEach(function() {
    plalib.terminate();
  });

  it('should be a function', function() {
    expect(plalib.solveUpperTriangularMatrixEquation).toEqual(jasmine.any(Function));
  });

  describe('for ux=b where a is a matrix nxn', function() {
    var n, u, b, result;

    beforeEach(function() {
      n = 9;
      u = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n * n));
      u.set([
        8, 7, 6, 8, 9, 9, 6, 2, 3,
        0, 9, 7, 2, 1, 5, 1, 1, 2,
        0, 0, 5, 6, 3, 7, 2, 7, 7,
        0, 0, 0, 4, 2, 2, 4, 8, 5,
        0, 0, 0, 0, 5, 3, 9, 1, 1,
        0, 0, 0, 0, 0, 2, 3, 6, 3,
        0, 0, 0, 0, 0, 0, 7, 5, 2,
        0, 0, 0, 0, 0, 0, 0, 6, 7,
        0, 0, 0, 0, 0, 0, 0, 0, 2
      ]);

      b = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n));
      b.set([
        14,
        9,
        3,
        6,
        11,
        3,
        30,
        46,
        8
      ]);

      result = plalib.solveUpperTriangularMatrixEquation(n, u, b);
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
            5,
           -3,
           15,
           -7,
            8,
          -15,
            1,
            3,
            4
        ];

        for (let i = 0; i < expectedX.length; i += 1) {
          expect(x[i]).toBeCloseTo(expectedX[i], 15);
        }
      });
    });
  });
});
