/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

	var _plalibCore = __webpack_require__(3);

	var core = _interopRequireWildcard(_plalibCore);

	onmessage = function (e) {
	  var _e$data = _toArray(e.data);

	  var methodName = _e$data[0];
	  var taskId = _e$data[1];

	  var args = _e$data.slice(2);

	  core[methodName].apply(core, _toConsumableArray(args));
	  postMessage(taskId);
	};

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var BARRIER_COUNTE_INDEX = 0;
	exports.BARRIER_COUNTE_INDEX = BARRIER_COUNTE_INDEX;
	var BARRIER_SEQ_INDEX = 1;
	exports.BARRIER_SEQ_INDEX = BARRIER_SEQ_INDEX;
	var BARRIER_NUM_AGENTS_INDEX = 2;
	exports.BARRIER_NUM_AGENTS_INDEX = BARRIER_NUM_AGENTS_INDEX;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.gaussianElimination = gaussianElimination;
	exports.gaussJordanElimination = gaussJordanElimination;
	exports.gaussianEliminationWithMainElementByRow = gaussianEliminationWithMainElementByRow;

	var _plalibBarrierWorker = __webpack_require__(4);

	// For non-parallel version only m, n, a, b are required parameters

	function gaussianElimination(m, n, a, b, numberOfWorker, workersAmount, barrier) {
	  var kMax, k, i, j, coef;

	  for (k = 0, kMax = Math.min(m, n); k < kMax; k += 1) {
	    for (i = k + 1; i < m; i += 1) {
	      // Worker with number N should calculate each N-th row (ignored for not parallel case)
	      if (!barrier || i % workersAmount === numberOfWorker) {
	        coef = a[i * n + k] / a[k * n + k];

	        a[i * n + k] = 0;

	        for (j = k + 1; j < n; j += 1) {
	          a[i * n + j] = a[i * n + j] - a[k * n + j] * coef;
	        }

	        b[i] = b[i] - b[k] * coef;
	      }
	    }

	    // Used for parallel implementation to sync web workers
	    (0, _plalibBarrierWorker.enterBarrier)(barrier);
	  }
	}

	// For non-parallel version only m, n, a, b are required parameters

	function gaussJordanElimination(m, n, a, b, numberOfWorker, workersAmount, barrier) {
	  gaussianElimination(m, n, a, b, numberOfWorker, barrier);

	  var k, i, coef;

	  for (k = Math.min(m, n) - 1; k >= 0; k -= 1) {
	    for (i = 0; i < k; i += 1) {
	      // Worker with number N should calculate each N-th row (ignored for not parallel case)
	      if (!barrier || i % workersAmount === numberOfWorker) {
	        coef = a[i * n + k] / a[k * n + k];
	        a[i * n + k] = 0;
	        b[i] = b[i] - b[k] * coef;
	      }
	    }

	    // Used for parallel implementation to sync web workers
	    (0, _plalibBarrierWorker.enterBarrier)(barrier);

	    if (!numberOfWorker) {
	      b[k] = b[k] / a[k * n + k];
	      a[k * n + k] = 1;
	    }

	    (0, _plalibBarrierWorker.enterBarrier)(barrier);
	  }
	}

	// For non-parallel version only m, n, a, b are required parameters

	function gaussianEliminationWithMainElementByRow(m, n, a, b, numberOfWorker, workersAmount, barrier) {
	  var kMax, k, i, j, coef, mainRow, mainElement, currentElement, temp;

	  for (k = 0, kMax = Math.min(m, n); k < kMax; k += 1) {

	    // Find main row
	    if (!numberOfWorker) {
	      mainRow = k;
	      mainElement = Math.abs(a[k * n + k]);

	      for (i = k + 1; i < m; i += 1) {
	        currentElement = Math.abs(a[i * n + k]);
	        if (currentElement > mainElement) {
	          mainElement = currentElement;
	          mainRow = i;
	        }
	      }

	      if (mainRow !== k) {
	        // Swap rows
	        for (j = k; j < n; j += 1) {
	          temp = a[k * n + j];
	          a[k * n + j] = a[mainRow * n + j];
	          a[mainRow * n + j] = temp;
	        }

	        temp = b[k];
	        b[k] = b[mainRow];
	        b[mainRow] = temp;
	      }
	    }

	    (0, _plalibBarrierWorker.enterBarrier)(barrier);

	    for (i = k + 1; i < m; i += 1) {
	      // Worker with number N should calculate each N-th row (ignored for not parallel case)
	      if (!barrier || i % workersAmount === numberOfWorker) {
	        coef = a[i * n + k] / a[k * n + k];

	        a[i * n + k] = 0;

	        for (j = k + 1; j < n; j += 1) {
	          a[i * n + j] = a[i * n + j] - a[k * n + j] * coef;
	        }

	        b[i] = b[i] - b[k] * coef;
	      }
	    }

	    // Used for parallel implementation to sync web workers
	    (0, _plalibBarrierWorker.enterBarrier)(barrier);
	  }
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.enterBarrier = enterBarrier;

	var _plalibBarrierConstants = __webpack_require__(2);

	function enterBarrier(barrier) {
	    if (!barrier) {
	        return;
	    }

	    var numAgents;
	    var seq = Atomics.load(barrier, _plalibBarrierConstants.BARRIER_SEQ_INDEX);

	    if (Atomics.sub(barrier, _plalibBarrierConstants.BARRIER_COUNTE_INDEX, 1) === 1) {
	        numAgents = barrier[_plalibBarrierConstants.BARRIER_NUM_AGENTS_INDEX];
	        barrier[_plalibBarrierConstants.BARRIER_COUNTE_INDEX] = numAgents;
	        Atomics.add(barrier, _plalibBarrierConstants.BARRIER_SEQ_INDEX, 1);
	        Atomics.futexWake(barrier, _plalibBarrierConstants.BARRIER_SEQ_INDEX, numAgents - 1);
	        Atomics.add(barrier, _plalibBarrierConstants.BARRIER_SEQ_INDEX, 1);
	    } else {
	        Atomics.futexWait(barrier, _plalibBarrierConstants.BARRIER_SEQ_INDEX, seq, Number.POSITIVE_INFINITY);
	        while (Atomics.load(barrier, _plalibBarrierConstants.BARRIER_SEQ_INDEX) & 1);
	    }
	}

/***/ }
/******/ ]);