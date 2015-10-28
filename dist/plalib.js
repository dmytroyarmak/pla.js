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

	var _plalibBarrierMaster = __webpack_require__(1);

	var WORKERS_AMOUNT = 4;
	var workers;

	function gaussianEliminationPar(m, n, a, b) {
	  return _invokeOnWebWorkers('gaussianElimination', m, n, a, b);
	}

	function gaussJordanEliminationPar(m, n, a, b) {
	  return _invokeOnWebWorkers('gaussJordanElimination', m, n, a, b);
	}

	function _invokeOnWebWorkers(methodName, m, n, a, b) {
	  var barrier = (0, _plalibBarrierMaster.initBarrier)(WORKERS_AMOUNT);

	  return Promise.all(_createWorkers(WORKERS_AMOUNT).map(function (worker, i) {
	    return new Promise(function (resolve, reject) {
	      var taskId = Date.now();
	      worker.postMessage([methodName, taskId, m, n, a, b, i, WORKERS_AMOUNT, barrier], [barrier.buffer, a.buffer, b.buffer]);

	      worker.onmessage = function (e) {
	        if (e.data === taskId) {
	          resolve();
	        }
	      };
	      worker.onerror = reject;
	    });
	  }));
	}

	function _createWorkers(n) {
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.initBarrier = initBarrier;

	var _plalibBarrierConstants = __webpack_require__(2);

	function initBarrier(numAgents) {
	  var barrier = new SharedInt32Array(3);
	  Atomics.store(barrier, _plalibBarrierConstants.BARRIER_COUNTE_INDEX, numAgents);
	  Atomics.store(barrier, _plalibBarrierConstants.BARRIER_SEQ_INDEX, 0);
	  Atomics.store(barrier, _plalibBarrierConstants.BARRIER_NUM_AGENTS_INDEX, numAgents);
	  return barrier;
	}

/***/ },
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

/***/ }
/******/ ]);