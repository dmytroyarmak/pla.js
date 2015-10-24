(function(root) {
  'use strict';

  var BARRIER_COUNTE_INDEX = 0;
  var BARRIER_SEQ_INDEX = 1;
  var BARRIER_NUM_AGENTS_INDEX = 2;

  function init (numAgents) {
    var barrier = new SharedInt32Array(3);
    Atomics.store(barrier, BARRIER_COUNTE_INDEX, numAgents);
    Atomics.store(barrier, BARRIER_SEQ_INDEX, 0);
    Atomics.store(barrier, BARRIER_NUM_AGENTS_INDEX, numAgents);
    return barrier;
  }

  function enter (barrier) {
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

  root.plalib = root.plalib || {};
  root.plalib.barrier = {
    init: init,
    enter: enter
  };
}(this));
