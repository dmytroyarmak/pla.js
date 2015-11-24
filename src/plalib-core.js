import {enterBarrier} from './plalib-barrier-worker';

// For non-parallel version only n, a, b are required parameters
export function gaussianElimination (n, a, b, numberOfWorker, workersAmount, barrier) {
  for (let k = 0; k < n; k += 1) {
    for (let i = k + 1; i < n; i += 1) {
      // Worker with number N should calculate each N-th row (ignored for not parallel case)
      if (!barrier || i % workersAmount === numberOfWorker) {
        let coef = a[i * n + k] / a[k * n + k];

        a[i * n + k] = 0;

        for (let j = k + 1; j < n; j += 1) {
          a[i * n + j] = a[i * n + j] - a[k * n + j] * coef;
        }

        b[i] = b[i] - b[k] * coef;
      }
    }

    // Used for parallel implementation to sync web workers
    enterBarrier(barrier);
  }
}

// For non-parallel version only n, a, b are required parameters
export function gaussJordanElimination (n, a, b, numberOfWorker, workersAmount, barrier) {
  gaussianElimination(n, a, b, numberOfWorker, barrier);

  for (let k = n - 1; k >= 0; k -= 1) {
    for (let i = 0; i < k; i += 1) {
      // Worker with number N should calculate each N-th row (ignored for not parallel case)
      if (!barrier || i % workersAmount === numberOfWorker) {
        let coef = a[i * n + k] / a[k * n + k];
        a[i * n + k] = 0;
        b[i] = b[i] - b[k] * coef;
      }
    }

    // Used for parallel implementation to sync web workers
    enterBarrier(barrier);

    if (!numberOfWorker) {
      b[k] = b[k] / a[k * n + k];
      a[k * n + k] = 1;
    }

    enterBarrier(barrier);
  }
}

// For non-parallel version only n, a, b are required parameters
export function gaussianEliminationWithMainElementByRow (n, a, b, numberOfWorker, workersAmount, barrier) {
  for (let k = 0; k < n; k += 1) {

    // Find main row
    if (!numberOfWorker) {
      let mainRow = k;
      let mainElement = Math.abs(a[k * n + k]);

      for (let i = k + 1; i < n; i += 1) {
        let currentElement = Math.abs(a[i * n + k]);
        if (currentElement > mainElement) {
          mainElement = currentElement;
          mainRow = i;
        }
      }

      if (mainRow !== k) {
        // Swap rows
        for (let j = k; j < n; j += 1) {
          let tempA = a[k * n + j];
          a[k * n + j] = a[mainRow * n + j];
          a[mainRow * n + j] = tempA;
        }

        let tempB = b[k];
        b[k] = b[mainRow];
        b[mainRow] = tempB;
      }
    }

    enterBarrier(barrier);

    for (let i = k + 1; i < n; i += 1) {
      // Worker with number N should calculate each N-th row (ignored for not parallel case)
      if (!barrier || i % workersAmount === numberOfWorker) {
        let coef = a[i * n + k] / a[k * n + k];

        a[i * n + k] = 0;

        for (let j = k + 1; j < n; j += 1) {
          a[i * n + j] = a[i * n + j] - a[k * n + j] * coef;
        }

        b[i] = b[i] - b[k] * coef;
      }
    }

    // Used for parallel implementation to sync web workers
    enterBarrier(barrier);
  }
}

export function choleskyDecomposition () {
}
