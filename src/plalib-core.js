import {enterBarrier, enterMutex, leaveMutex} from './plalib-sync-worker';

// For non-parallel version only n, a, b are required parameters
export function gaussianElimination (n, a, b, numberOfWorker, workersAmount, sync) {
  for (let k = 0; k < n; k += 1) {
    for (let i = k + 1; i < n; i += 1) {
      // Worker with number N should calculate each N-th row (ignored for not parallel case)
      if (!sync || i % workersAmount === numberOfWorker) {
        let coef = a[i * n + k] / a[k * n + k];

        a[i * n + k] = 0;

        for (let j = k + 1; j < n; j += 1) {
          a[i * n + j] = a[i * n + j] - a[k * n + j] * coef;
        }

        b[i] = b[i] - b[k] * coef;
      }
    }

    // Used for parallel implementation to sync web workers
    enterBarrier(sync);
  }
}

// For non-parallel version only n, a, b are required parameters
export function gaussJordanElimination (n, a, b, numberOfWorker, workersAmount, sync) {
  gaussianElimination(n, a, b, numberOfWorker, workersAmount, sync);

  for (let k = n - 1; k >= 0; k -= 1) {
    for (let i = 0; i < k; i += 1) {
      // Worker with number N should calculate each N-th row (ignored for not parallel case)
      if (!sync || i % workersAmount === numberOfWorker) {
        let coef = a[i * n + k] / a[k * n + k];
        a[i * n + k] = 0;
        b[i] = b[i] - b[k] * coef;
      }
    }

    // Used for parallel implementation to sync web workers
    enterBarrier(sync);

    if (!numberOfWorker) {
      b[k] = b[k] / a[k * n + k];
      a[k * n + k] = 1;
    }

    enterBarrier(sync);
  }
}

// For non-parallel version only n, a, b are required parameters
export function gaussianEliminationWithMainElementByRow (n, a, b, numberOfWorker, workersAmount, sync) {
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

    enterBarrier(sync);

    for (let i = k + 1; i < n; i += 1) {
      // Worker with number N should calculate each N-th row (ignored for not parallel case)
      if (!sync || i % workersAmount === numberOfWorker) {
        let coef = a[i * n + k] / a[k * n + k];

        a[i * n + k] = 0;

        for (let j = k + 1; j < n; j += 1) {
          a[i * n + j] = a[i * n + j] - a[k * n + j] * coef;
        }

        b[i] = b[i] - b[k] * coef;
      }
    }

    // Used for parallel implementation to sync web workers
    enterBarrier(sync);
  }
}

export function solveLineraEquationByCholetsky(n, a, b, numberOfWorker, workersAmount, sync) {
  choleskyDecomposition(n, a, numberOfWorker, workersAmount, sync);
  solveLowerTriangularMatrixEquation(n, a, b, numberOfWorker, workersAmount, sync);
  transposeMatrix(n, a, numberOfWorker, workersAmount, sync);
  solveUpperTriangularMatrixEquation(n, a, b, numberOfWorker, workersAmount, sync);
  fillIdentityMatrix(n, a, numberOfWorker, workersAmount, sync);
}

// Cholesky–Crout algorithm
export function choleskyDecomposition (n, a, numberOfWorker, workersAmount, sync) {
  for (let i = 0; i < n; i += 1) {
    let sumOfSquares = 0;

    for (let k = 0; k < i; k += 1) {
      if (!sync || k % workersAmount === numberOfWorker) {
        sumOfSquares += Math.pow(a[i * n + k], 2);
      }
    }

    enterMutex(sync);
    a[i * n + i] -= sumOfSquares;
    leaveMutex(sync);

    enterBarrier(sync);

    if (!numberOfWorker) {

      a[i * n + i] = Math.sqrt(a[i * n + i]);

      for (let j = 0; j < i; j += 1) {
        a[j * n + i] = 0;
      }
    }

    enterBarrier(sync);

    for (let j = i + 1; j < n; j += 1) {
      if (!sync || j % workersAmount === numberOfWorker) {
        for (let k = 0; k < i; k += 1) {
          a[j * n + i] = a[j * n + i] - a[i * n + k] * a[j * n + k];
        }
        a[j * n + i] = a[j * n + i] / a[i * n + i];
      }
    }

    enterBarrier(sync);
  }
}

export function solveUpperTriangularMatrixEquation(n, u, b, numberOfWorker, workersAmount, sync) {
  for (let k = n - 1; k >= 0; k -= 1) {
    if (!numberOfWorker) {
      b[k] = b[k]/u[k * n + k];
    }

    enterBarrier(sync);

    for (let i = 0; i < k; i += 1) {
      if (!sync || i % workersAmount === numberOfWorker) {
        b[i] -= b[k] * u[i * n + k];
      }
    }

    enterBarrier(sync);
  }
}

export function solveLowerTriangularMatrixEquation(n, l, b, numberOfWorker, workersAmount, sync) {
  for (let k = 0; k < n; k += 1) {
    if (!numberOfWorker) {
      b[k] = b[k]/l[k * n + k];
    }

    enterBarrier(sync);

    for (let i = k + 1; i < n; i += 1) {
      if (!sync || i % workersAmount === numberOfWorker) {
        b[i] -= b[k] * l[i * n + k];
      }
    }

    enterBarrier(sync);
  }
}

export function transposeMatrix(n, a, numberOfWorker, workersAmount, sync) {
  // Worker 0 is doing everithing
  if (!numberOfWorker) {
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        let ji = j + i * n;
        let ij = i + j * n;
        let tmp = a[ji];
        a[ji] = a[ij];
        a[ij] = tmp;
      }
    }
  }
  enterBarrier(sync);
}

export function fillIdentityMatrix(n, a, numberOfWorker, workersAmount, sync) {
  // Worker 0 is doing everithing
  if (!numberOfWorker) {
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) {
        a[i + j * n] = Number(i === j);
      }
    }
  }
  enterBarrier(sync);
}

export function reductionToTridiagonalMatrix(n, a) {
  for (let i = n - 1; i >= 2 ; i--) {

    let o2 = 0;
    for (let j = 0; j <= i - 1; j += 1) {
      o2 += Math.pow(a[i * n + j], 2);
    }

    let ek = -Math.sign(a[i * n + (i - 1)]) * o2;

    let ui = [];
    for (let j = 0; j <= i; j += 1) {
      if (j < i) {
        ui[j] = a[i * n + j];

        if (j === i - 1) {
          ui[j] -= ek;
        }
      } else {
        ui[j] = 0;
      }

    }

    let si = 1 / (ek * a[i * n + (i - 1)] - o2);

    let wi = [];
    for (let j = 0; j <= i; j += 1) {
      wi[j] = 0;
      for (let l = 0; l <= i; l += 1) {
        wi[j] += a[j * n + l] * ui[l];
      }
      wi[j]  = wi[j] * si;
    }

    let ci = [];
    for (let j = 0; j <= i; j += 1) {
      ci[j] = 0.5 * si * wi[j] * ui[j];
    }

    let vi = [];
    for (let j = 0; j <= i; j += 1) {
        vi[j] = wi[j] + ci[j] * ui[j];
    }

    for (let j = 0; j <= i; j += 1) {
      for (let k = 0; k <= i; k += 1) {
        a[j * n + k] += ui[j] * vi[k] + ui[k] * vi[j];
      }
    }
  }
}
