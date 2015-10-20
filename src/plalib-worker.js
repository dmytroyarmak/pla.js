importScripts('./plalib.js');

onmessage = function(e) {
  var m = e.data.m;
  var n = e.data.n;
  var a = e.data.a;
  var b = e.data.b;
  var barrier = e.data.barrier;
  var numberOfWorker = e.data.numberOfWorker;

  plalib.gaussianElimination(m, n, a, b, numberOfWorker, barrier);

  postMessage('DONE');
};



