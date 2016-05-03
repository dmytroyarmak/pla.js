import {initSync} from './plalib-sync-master';

export default class Plalib {
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

  gaussianEliminationPar(n, a, b, useWorkers) {
    useWorkers = useWorkers || this.workersAmount;
    return this._invokeOnWebWorkers('gaussianElimination', useWorkers, n, a, b);
  }

  gaussJordanEliminationPar(n, a, b, useWorkers) {
    useWorkers = useWorkers || this.workersAmount;
    return this._invokeOnWebWorkers('gaussJordanElimination', useWorkers, n, a, b);
  }

  solveLineraEquationByCholetskyPar(n, a, b, useWorkers) {
    useWorkers = useWorkers || this.workersAmount;
    return this._invokeOnWebWorkers('solveLineraEquationByCholetsky', useWorkers, n, a, b);
  }

  solveFullEigenvalueDenseSymPar(n, a, b, useWorkers) {
    useWorkers = useWorkers || this.workersAmount;
    return this._invokeOnWebWorkers('solveFullEigenvalueDenseSym', useWorkers, n, a, b);
  }

  powerMethodPar(n, a, x, xTmp, useWorkers) {
    useWorkers = useWorkers || this.workersAmount;
    return this._invokeOnWebWorkers('powerMethod', useWorkers, n, a, x, xTmp);
  }

  _invokeOnWebWorkers(methodName, useWorkers, ...args) {
    if (useWorkers > this.workersAmount) {
      throw new Error('There is no enouth workers!');
    }

    let sync = initSync(useWorkers);

    return Promise.all(this._workers.slice(0, useWorkers).map((worker, i) => {
        return new Promise((resolve, reject) => {
          let taskId = Date.now();
          let argBuffers = args.filter(x => x.buffer && x.buffer instanceof SharedArrayBuffer).map(x => x.buffer);
          worker.postMessage(
            [methodName, taskId, ...args, i, useWorkers, sync],
            [sync.buffer, ...argBuffers]
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
