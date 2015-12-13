import {initBarrier} from './plalib-barrier-master';

export class Plalib {
  constructor({workersAmount = 4, workerUrl = '/src/plalib-worker.js'} = {}) {
    this.workersAmount = workersAmount;
    this.workerUrl = workerUrl;
    this._createWorkers();
  }

  terminate() {
    this._workers.forEach(function(worker) {
      worker.terminate();
    });
  }

  gaussianEliminationPar(n, a, b) {
    return this._invokeOnWebWorkers('gaussianElimination', n, a, b);
  }

  gaussJordanEliminationPar(n, a, b) {
    return this._invokeOnWebWorkers('gaussJordanElimination', n, a, b);
  }

  solveUpperTriangularMatrixEquation(n, u, b) {
    var x = new SharedFloat64Array(n);

    for (let k = n - 1; k >= 0; k -= 1) {
      x[k] = b[k];

      for (let i = k + 1; i < n; i += 1) {
        x[k] -= x[i] * u[k * n + i];
      }

      x[k] = x[k]/u[k * n + k];
    }

    return Promise.resolve(x);
  }

  _invokeOnWebWorkers(methodName, n, a, b) {
    var barrier = initBarrier(this.workersAmount);

    return Promise.all(this._workers.map((worker, i) => {
        return new Promise((resolve, reject) => {
          var taskId = Date.now();
          worker.postMessage(
            [methodName, taskId, n, a, b, i, this.workersAmount, barrier],
            [barrier.buffer, a.buffer, b.buffer]
          );

          worker.onmessage = (e) => {
            if (e.data === taskId) {
              resolve();
            }
          };
          worker.onerror = reject;
        });
    }));
  }

  _createWorkers () {
    this._workers = [];
    for (let i = 0; i < this.workersAmount; i += 1) {
      this._workers.push(new Worker(this.workerUrl));
    }
  }
}
