import {BARRIER_COUNTE_INDEX, BARRIER_SEQ_INDEX, BARRIER_NUM_AGENTS_INDEX, MUTEX_INDEX} from './plalib-sync-constants';

export function enterBarrier (sync) {
  if (!sync) { return; }

  var numAgents;
  var seq = Atomics.load(sync, BARRIER_SEQ_INDEX);

  if (Atomics.sub(sync, BARRIER_COUNTE_INDEX, 1) === 1) {
      numAgents = sync[BARRIER_NUM_AGENTS_INDEX];
      sync[BARRIER_COUNTE_INDEX] = numAgents;
      Atomics.add(sync, BARRIER_SEQ_INDEX, 1);
      Atomics.futexWake(sync, BARRIER_SEQ_INDEX, numAgents - 1);
      Atomics.add(sync, BARRIER_SEQ_INDEX, 1);
  } else {
      Atomics.futexWait(sync, BARRIER_SEQ_INDEX, seq, Number.POSITIVE_INFINITY);
      while (Atomics.load(sync, BARRIER_SEQ_INDEX) & 1);
  }
}

export function enterMutex (sync) {
  if (!sync) { return; }

  while (Atomics.compareExchange(sync, MUTEX_INDEX, 0, -1) !== 0);
}

export function leaveMutex (sync) {
  if (!sync) { return; }

  Atomics.store(sync, MUTEX_INDEX, 0);
}
