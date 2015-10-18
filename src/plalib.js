/* jshint esnext: true */

(function(root) {
  'use strict';

  function gaussianElimination (m, n, a, b) {
    var kMax, k, i, j, coef;

    for (k = 0, kMax =  Math.min(m, n); k < kMax; k += 1) {
      for (i = k + 1; i < m; i += 1) {
        coef = a[i * n + k] / a[k * n + k];

        a[i * n + k] = 0;

        for (j = k + 1; j < n; j += 1) {
          a[i * n + j] = a[i * n + j] - a[k * n + j] * coef;
        }

        b[i] = b[i] - b[k] * coef;
      }
    }
  }

  function gaussJordanElimination (m, n, a, b) {
    gaussianElimination(m, n, a, b);

    var k, i, coef;

    for (k = Math.min(m, n) -1; k >= 0; k -= 1) {
      for (i = 0; i < k; i += 1) {
        coef = a[i * n + k] / a[k * n + k];
        a[i * n + k] = 0;
        b[i] = b[i] - b[k] * coef;
      }

      b[k] = b[k] / a[k * n + k];
      a[k * n + k] = 1;
    }
  }

  root.plalib = {
    gaussianElimination: gaussianElimination,
    gaussJordanElimination: gaussJordanElimination
  };
}(this));
