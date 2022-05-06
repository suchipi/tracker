import state from "./state";

// `true` if a flush is scheduled
let willFlush = false;

export function scheduleFlush() {
  if (!willFlush) {
    willFlush = true;
    setTimeout(scheduledFlush, 0);
  }
}
function scheduledFlush() {
  try {
    flushNow();
  } finally {
    willFlush = false;
  }
}

// `true` if we are in flush now
let inFlush = false;

/**
 * Process all reactive updates immediately and ensure that all invalidated computations are rerun.
 */
export function flushNow() {
  if (inFlush) throw new Error("Can't call flush while flushing");

  inFlush = true;
  try {
    while (state.pendingComputations.length > 0) {
      let computation = state.pendingComputations.shift()!;
      computation._recompute();
    }
  } finally {
    inFlush = false;
  }
}

/**
 * Run a function without tracking dependencies.
 *
 * @param func A function to call immediately.
 */
export function withoutTracking(func: () => void) {
  state.skipTracking = true;
  try {
    func();
  } finally {
    state.skipTracking = false;
  }
}
