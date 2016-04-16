import {BARRIER_COUNTE_INDEX, BARRIER_SEQ_INDEX,BARRIER_NUM_AGENTS_INDEX} from './plalib-barrier-constants';

export function initBarrier (numAgents) {
  var barrier = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 3));
  Atomics.store(barrier, BARRIER_COUNTE_INDEX, numAgents);
  Atomics.store(barrier, BARRIER_SEQ_INDEX, 0);
  Atomics.store(barrier, BARRIER_NUM_AGENTS_INDEX, numAgents);
  return barrier;
}
