import {initBarrier} from './plalib-barrier-master';
const WORKERS_AMOUNT = 4;
var workers;

function gaussianEliminationPar (m, n, a, b) {
  return _invokeOnWebWorkers('gaussianElimination', m, n, a, b);
}

function gaussJordanEliminationPar (m, n, a, b) {
  return _invokeOnWebWorkers('gaussJordanElimination', m, n, a, b);
}

function _invokeOnWebWorkers (methodName, m, n, a, b) {
  var barrier = initBarrier(WORKERS_AMOUNT);

  return Promise.all(_createWorkers(WORKERS_AMOUNT).map(function(worker, i) {
      return new Promise(function(resolve, reject) {
        var taskId = Date.now();
        worker.postMessage(
          [methodName, taskId, m, n, a, b, i, WORKERS_AMOUNT, barrier],
          [barrier.buffer, a.buffer, b.buffer]
        );

        worker.onmessage = function(e) {
          if (e.data === taskId) {
            resolve();
          }
        };
        worker.onerror = reject;
      });
  }));
}

function _createWorkers (n) {
  var i;

  if (!workers) {
    workers = [];
    for (i = 0; i < n; i += 1) {
      workers.push(new Worker('/dist/plalib-worker.js'));
    }
  }

  return workers;
}

window.plalib = {
  gaussianEliminationPar: gaussianEliminationPar,
  gaussJordanEliminationPar: gaussJordanEliminationPar
};
