import Plalib from '../../src/plalib';

describe('Plalib.transposeMatrix', function() {
  var plalib;

  beforeEach(function() {
    plalib = new Plalib();
  });

  afterEach(function() {
    plalib.terminate();
  });

  it('should be a function', function() {
    expect(plalib.transposeMatrix).toEqual(jasmine.any(Function));
  });

  describe('for matrix A', function() {
    var n, a, result;

    beforeEach(function() {
      n = 3;
      a = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n * n));
      a.set([
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
      ]);

      result = plalib.transposeMatrix(n, a);
    });

    it('should return a promise', function() {
      expect(result).toEqual(jasmine.any(Promise));
    });

    describe('when resolved, result', function() {
      var at;
      beforeEach(function(done) {
        result.then(function(_at_) {
          at = _at_;
          done();
        });
      });

      it('should be a transposed matrix A', function() {
        var expectedAt = [
          1, 4, 7,
          2, 5, 8,
          3, 6, 9
        ];

        for (let i = 0; i < expectedAt.length; i += 1) {
          expect(at[i]).toBeCloseTo(expectedAt[i], 15);
        }
      });
    });
  });
});
