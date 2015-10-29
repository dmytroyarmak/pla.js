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

  gaussianEliminationPar(m, n, a, b) {
    return this._invokeOnWebWorkers('gaussianElimination', m, n, a, b);
  }

  gaussJordanEliminationPar(m, n, a, b) {
    return this._invokeOnWebWorkers('gaussJordanElimination', m, n, a, b);
  }

  _invokeOnWebWorkers(methodName, m, n, a, b) {
    var barrier = initBarrier(this.workersAmount);

    return Promise.all(this._workers.map((worker, i) => {
        return new Promise((resolve, reject) => {
          var taskId = Date.now();
          worker.postMessage(
            [methodName, taskId, m, n, a, b, i, this.workersAmount, barrier],
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
