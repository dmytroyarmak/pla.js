import {BARRIER_COUNTE_INDEX, BARRIER_SEQ_INDEX,BARRIER_NUM_AGENTS_INDEX} from './plalib-barrier-constants';

export function enterBarrier (barrier) {
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
