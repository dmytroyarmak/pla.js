(function() {
  'use strict';

  var timing = [];
  var k;
  var current;
  for (k = 0; k < 52; k += 1) {
    current = function(previous) {
      var size = 500;
      var a = new Float64Array(size * size);
      for (var i = 0; i < size * size; i += 1) {
        a[i] = Math.floor(Math.random() * 10);
      }

      var b = new Float64Array(size);
      for (var j = 0; j < size; j += 1) {
        b[j] = Math.floor(Math.random() * 10);
      }

      var startTime = performance.now();
      plalib.gaussianElimination(size, size, a, b);
      var endTime = performance.now();
      return endTime - startTime;
    }(current);

    timing.push(current);
  }
  alert('mean ' + timing.slice(2).reduce(function(mem, cur) {
    return mem + cur;
  }, 0)/ timing.length);
}());
