(function(root) {
  'use strict';

  // For non-parallel version only m, n, a, b are required parameters
  function gaussianElimination (m, n, a, b, numberOfWorker, workersAmount, barrier) {
    var kMax, k, i, j, coef;

    for (k = 0, kMax =  Math.min(m, n); k < kMax; k += 1) {
      for (i = k + 1; i < m; i += 1) {
        // Worker with number N should calculate each N-th row (ignored for not parallel case)
        if (!barrier || i % workersAmount === numberOfWorker) {
          coef = a[i * n + k] / a[k * n + k];

          a[i * n + k] = 0;

          for (j = k + 1; j < n; j += 1) {
            a[i * n + j] = a[i * n + j] - a[k * n + j] * coef;
          }

          b[i] = b[i] - b[k] * coef;
        }
      }

      // Used for parallel implementation to sync web workers
      root.plalib.barrier.enter(barrier);
    }
  }

  // For non-parallel version only m, n, a, b are required parameters
  function gaussJordanElimination (m, n, a, b, numberOfWorker, workersAmount, barrier) {
    gaussianElimination(m, n, a, b, numberOfWorker, barrier);

    var k, i, coef;

    for (k = Math.min(m, n) -1; k >= 0; k -= 1) {
      for (i = 0; i < k; i += 1) {
        // Worker with number N should calculate each N-th row (ignored for not parallel case)
        if (!barrier || i % workersAmount === numberOfWorker) {
          coef = a[i * n + k] / a[k * n + k];
          a[i * n + k] = 0;
          b[i] = b[i] - b[k] * coef;
        }
      }

      // Used for parallel implementation to sync web workers
      root.plalib.barrier.enter(barrier);

      if (!numberOfWorker) {
        b[k] = b[k] / a[k * n + k];
        a[k * n + k] = 1;
      }

      root.plalib.barrier.enter(barrier);
    }
  }

  root.plalib = root.plalib || {};
  root.plalib.core = {
    gaussianElimination: gaussianElimination,
    gaussJordanElimination: gaussJordanElimination
  };
}(this));
