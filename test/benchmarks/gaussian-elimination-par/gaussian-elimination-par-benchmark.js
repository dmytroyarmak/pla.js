(function() {
  'use strict';

  function getSize () {
    var sizeMatching = document.location.search.match(/size=(\d+)/);
    if (sizeMatching) {
      return parseInt(sizeMatching[1], 10);
    } else {
      return 500;
    }
  }

  var timing = [];
  var k;
  var current = Promise.resolve();
  for (k = 0; k < 11; k += 1) {
    current = function(previous, k) {
      return previous.then(function() {
        var size = k ? getSize() : 1000;
        var a = new SharedFloat64Array(size * size);
        for (var i = 0; i < size * size; i += 1) {
          a[i] = Math.floor(Math.random() * 10);
        }

        var b = new SharedFloat64Array(size);
        for (var j = 0; j < size; j += 1) {
          b[j] = Math.floor(Math.random() * 10);
        }

        var startTime = performance.now();
        return plalib.gaussianEliminationPar(size, size, a, b).then(function() {
          var endTime = performance.now();
          return endTime - startTime;
        });
      });
    }(current, k);

    timing.push(current);
  }

  Promise.all(timing).then(function(result) {
    alert('mean ' + result.slice(1).reduce(function(mem, cur) {
      return mem + cur;
    }, 0) / 10);
  });
}());
