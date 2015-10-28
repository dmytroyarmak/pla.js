import {BARRIER_COUNTE_INDEX, BARRIER_SEQ_INDEX,BARRIER_NUM_AGENTS_INDEX} from './plalib-barrier-constants';

export function initBarrier (numAgents) {
  var barrier = new SharedInt32Array(3);
  Atomics.store(barrier, BARRIER_COUNTE_INDEX, numAgents);
  Atomics.store(barrier, BARRIER_SEQ_INDEX, 0);
  Atomics.store(barrier, BARRIER_NUM_AGENTS_INDEX, numAgents);
  return barrier;
}
