import {BARRIER_COUNTE_INDEX, BARRIER_SEQ_INDEX,BARRIER_NUM_AGENTS_INDEX, MUTEX_INDEX} from './plalib-sync-constants';

export function initSync (numAgents) {
  var sync = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 4));
  Atomics.store(sync, BARRIER_COUNTE_INDEX, numAgents);
  Atomics.store(sync, BARRIER_SEQ_INDEX, 0);
  Atomics.store(sync, BARRIER_NUM_AGENTS_INDEX, numAgents);
  Atomics.store(sync, MUTEX_INDEX, 0);
  return sync;
}
