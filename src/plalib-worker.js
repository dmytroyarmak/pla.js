importScripts('./plalib.js');

onmessage = function(e) {
  var m = e.data.m;
  var n = e.data.n;
  var a = e.data.a;
  var b = e.data.b;
  var barrier = e.data.barrier;
  var numberOfWorker = e.data.numberOfWorker;
  var amountOfWorkers = e.data.amountOfWorkers;
  var isLastWorker = (numberOfWorker === (amountOfWorkers - 1));
  var rowsPerWorker = Math.floor(m / amountOfWorkers);
  var iMin =  rowsPerWorker * numberOfWorker;
  var iMax =  isLastWorker ? m : iMin + rowsPerWorker;

  plalib.gaussianElimination(m, n, a, b, iMin, iMax, barrier);

  postMessage('DONE');
};



