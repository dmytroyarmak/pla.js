import {Plalib} from '../../src/plalib';

describe('plalib.gaussianEliminationPar', function() {
  var plalib;

  beforeEach(function() {
    plalib = new Plalib();
  });

  it('should be a function', function() {
    expect(plalib.gaussianEliminationPar).toEqual(jasmine.any(Function));
  });

  describe('for ax=b where a is a matrix mxn', function() {
    var m, n, a, b, result;

    beforeEach(function() {
      m = 9;
      n = 9;
      a = new SharedFloat64Array(m * n);
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

      b = new SharedFloat64Array(m);
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

      result = plalib.gaussianEliminationPar(m, n, a, b);
    });

    it('should return a promise', function() {
      expect(result).toEqual(jasmine.any(Promise));
    });

    describe('when resolved', function() {
      beforeEach(function(done) {
        result.then(done);
      });

      it('should transform a to triangular form', function() {
        var expectedA = new SharedFloat64Array(81);
        expectedA.set([
          8, 7, 6, 8, 9, 9, 6, 2, 3,
          0, 2.875, 1.75, -5, -6.875, -2.875, -4.25, -0.75, -0.625,
          0, 0, -1.347826086956522, 11.565217391304348, 11.652173913043478, 8, 7.130434782608695, 7.434782608695652, 9.695652173913043,
          0, 0, 0, 14.580645161290317, 11.645161290322575, 4.935483870967738, 15.290322580645158, 18.51612903225806, 18.19354838709677,
          0, 0, 0, 0, 5.311946902654867, 11.453539823008851, -16.43805309734514, -32.42920353982301, -24.230088495575217,
          0, 0, 0, 0, 0, 9.269471053727624, -33.11245314452314, -64.99708454810497, -54.619325281132866,
          0, 0, 0, 0, 0, 0, -5.404250539180445, -12.6835909417685, -12.138344716031622,
          0, 0, 0, 0, 0, 0, 0, -2.312994171786805, -6.576959851010599,
          0, 0, 0, 0, 0, 0, 0, 0, -19.95672897196239
        ]);

        expect(a).toEqual(expectedA);

        var expectedB = new SharedFloat64Array(9);
        expectedB.set([
          9,
          1.125,
          -4.6521739130434785,
          -13.451612903225804,
          28.80309734513275,
          54.4406497292795,
          11.832854061826021,
          -3.204935274408218,
          -39.91401869158842
        ]);
        expect(b).toEqual(expectedB);
      });
    });
  });
});
