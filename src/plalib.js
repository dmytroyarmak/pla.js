/* jshint esnext: true */

(function(root) {
  'use strict';

  var WORKERS_AMOUNT = 4;
  var workers;

  // For non-parallel version only m, n, a, b are required parameters
  function gaussianElimination (m, n, a, b, numberOfWorker, barrier) {
    var kMax, k, i, j, coef;

    for (k = 0, kMax =  Math.min(m, n); k < kMax; k += 1) {
      for (i = k + 1; i < m; i += 1) {
        // Worker with number N should calculate each N-th row (ignored for not parallel case)
        if (!barrier || i % WORKERS_AMOUNT === numberOfWorker) {
          coef = a[i * n + k] / a[k * n + k];

          a[i * n + k] = 0;

          for (j = k + 1; j < n; j += 1) {
            a[i * n + j] = a[i * n + j] - a[k * n + j] * coef;
          }

          b[i] = b[i] - b[k] * coef;
        }
      }

      // Used for parallel implementation to sync web workers
      _enterBarrier(barrier);
    }
  }

  // For non-parallel version only m, n, a, b are required parameters
  function gaussJordanElimination (m, n, a, b, numberOfWorker, barrier) {
    gaussianElimination(m, n, a, b, numberOfWorker, barrier);

    var k, i, coef;

    for (k = Math.min(m, n) -1; k >= 0; k -= 1) {
      for (i = 0; i < k; i += 1) {
        // Worker with number N should calculate each N-th row (ignored for not parallel case)
        if (!barrier || i % WORKERS_AMOUNT === numberOfWorker) {
          coef = a[i * n + k] / a[k * n + k];
          a[i * n + k] = 0;
          b[i] = b[i] - b[k] * coef;
        }
      }

      // Used for parallel implementation to sync web workers
      _enterBarrier(barrier);

      if (!numberOfWorker) {
        b[k] = b[k] / a[k * n + k];
        a[k * n + k] = 1;
      }

      _enterBarrier(barrier);
    }
  }

  function gaussianEliminationPar (m, n, a, b) {
    var barrier = _initBarrier(WORKERS_AMOUNT);

    return Promise.all(createWorkers(WORKERS_AMOUNT).map(function(worker, i) {
        return new Promise(function(resolve, reject) {
          var taskId = Date.now();
          worker.postMessage(
            ['gaussianElimination', taskId, m, n, a, b, i, barrier],
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

  function gaussJordanEliminationPar (m, n, a, b) {
    var barrier = _initBarrier(WORKERS_AMOUNT);

    return Promise.all(createWorkers(WORKERS_AMOUNT).map(function(worker, i) {
        return new Promise(function(resolve, reject) {
          var taskId = Date.now();
          worker.postMessage(
            ['gaussJordanElimination', taskId, m, n, a, b, i, barrier],
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

  function createWorkers (n) {
    var i;

    if (!workers) {
      workers = [];
      for (i = 0; i < n; i += 1) {
        workers.push(new Worker('/src/plalib-worker.js'));
      }
    }

    return workers;
  }

  var BARRIER_COUNTE_INDEX = 0;
  var BARRIER_SEQ_INDEX = 1;
  var BARRIER_NUM_AGENTS_INDEX = 2;

  function _initBarrier (numAgents) {
    var barrier = new SharedInt32Array(3);
    Atomics.store(barrier, BARRIER_COUNTE_INDEX, numAgents);
    Atomics.store(barrier, BARRIER_SEQ_INDEX, 0);
    Atomics.store(barrier, BARRIER_NUM_AGENTS_INDEX, numAgents);
    return barrier;
  }

  // Used for parallel implementation to sync web workers
  function _enterBarrier (barrier) {
    if (!barrier) { return; }

    var numAgents;
    var seq = Atomics.load(barrier, BARRIER_SEQ_INDEX);

    if (Atomics.sub(barrier, BARRIER_COUNTE_INDEX, 1) === 1) {
        numAgents = barrier[BARRIER_NUM_AGENTS_INDEX];
        barrier[BARRIER_COUNTE_INDEX] = numAgents;
        Atomics.add(barrier, BARRIER_SEQ_INDEX, 1);
        Atomics.futexWake(barrier, BARRIER_SEQ_INDEX, numAgents - 1);
        Atomics.add(barrier, BARRIER_SEQ_INDEX, 1);
    } else {
        Atomics.futexWait(barrier, BARRIER_SEQ_INDEX, seq, Number.POSITIVE_INFINITY);
        while (Atomics.load(barrier, BARRIER_SEQ_INDEX) & 1);
    }
  }

  root.plalib = {
    gaussianElimination: gaussianElimination,
    gaussJordanElimination: gaussJordanElimination,
    gaussianEliminationPar: gaussianEliminationPar,
    gaussJordanEliminationPar: gaussJordanEliminationPar
  };
}(this));
