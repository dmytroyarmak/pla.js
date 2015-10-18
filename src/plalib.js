/* jshint esnext: true */

(function(root) {
  'use strict';

  function gaussianElimination (m, n, a, b) {
    var kMax, k, i, j, coef;

    kMax =  Math.min(m, n);

    for (k = 0; k < kMax; k += 1) {
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

  root.plalib = {
    gaussianElimination: gaussianElimination
  };
}(this));
