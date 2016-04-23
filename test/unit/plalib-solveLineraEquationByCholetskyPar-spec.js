// import Plalib from '../../src/plalib';

// describe('Plalib.solveLineraEquationByCholetskyPar', function() {
//   var plalib;

//   beforeEach(function() {
//     plalib = new Plalib();
//   });

//   afterEach(function() {
//     plalib.terminate();
//   });

//   it('should be a function', function() {
//     expect(plalib.solveLineraEquationByCholetskyPar).toEqual(jasmine.any(Function));
//   });

//   describe('for ax=b where a is a matrix nxn', function() {
//     var n, a, b, result;

//     beforeEach(function() {
//       n = 9;
//       a = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n * n));
//       a.set([
//         8, 7, 6, 8, 9, 9, 6, 2, 3,
//         7, 9, 7, 2, 1, 5, 1, 1, 2,
//         6, 7, 5, 6, 3, 7, 2, 7, 10,
//         8, 2, 6, 4, 2, 2, 10, 8, 5,
//         9, 1, 3, 2, 5, 3, 9, 1, 1,
//         9, 5, 7, 2, 3, 2, 3, 6, 3,
//         6, 1, 2, 10, 9, 3, 7, 5, 2,
//         2, 1, 7, 8, 1, 6, 5, 6, 7,
//         3, 2, 10, 5, 1, 3, 2, 7, 5
//       ]);

//       b = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * n));
//       b.set([
//         9,
//         9,
//         2,
//         6,
//         6,
//         3,
//         3,
//         1,
//         1
//       ]);

//       result = plalib.solveLineraEquationByCholetskyPar(n, a, b);
//     });

//     it('should return a promise', function() {
//       expect(result).toEqual(jasmine.any(Promise));
//     });

//     describe('when resolved', function() {
//       var x;

//       beforeEach(function(done) {
//         result.then(function(_x_) {
//           x = _x_;
//           done();
//         });
//       });

//       it('should return solution', function() {
//         var i;

//         var expectedX = [
//           -0.7707800833838565,
//           1.595971296766333,
//           0.5060379914988332,
//           -0.020892626875643874,
//           0.29884100103120137,
//           -0.9236990503009049,
//           1.3108570640166672,
//           -0.8522368074263239,
//           0.19613610996621686
//         ];

//         for (i = 0; i < expectedX.length; i += 1) {
//           expect(x[i]).toBeCloseTo(expectedX[i], 15);
//         }
//       });
//     });
//   });
// });
