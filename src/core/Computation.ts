import state from "./state";
import * as controls from "./controls";

/**
 * A Computation object represents code that is repeatedly rerun in response to
 * reactive data changes. Computations don't have return values; they just
 * perform actions, such as rerendering a template on the screen. Computations
 * are created using Tracker.autorun. Use stop to prevent further rerunning of
 * a computation.
 */
export default class Computation {
  /**
   * True if this computation has been stopped.
   */
  stopped: boolean;

  /**
   * True if this computation has been invalidated (and not yet rerun), or if
   * it has been stopped.
   */
  invalidated: boolean;

  _onInvalidateCallbacks: Array<() => void>;
  _func: () => void;
  _recomputing: boolean;

  constructor(func: () => void) {
    this.stopped = false;
    this.invalidated = false;

    this._onInvalidateCallbacks = [];
    this._func = func;
    this._recomputing = false;

    let finished = false;
    try {
      this._compute();
      finished = true;
    } finally {
      if (!finished) this.stop();
    }
  }

  /**
   * Registers `callback` to run when this computation is next invalidated, or
   * runs it immediately if the computation is already invalidated. The
   * callback is run exactly once and not upon future invalidations unless
   * `onInvalidate` is called again after the computation becomes valid again.
   *
   * @param func Function to be called on invalidation.
   */
  onInvalidate(func: () => void) {
    if (this.invalidated) {
      controls.withoutTracking(func);
    } else {
      this._onInvalidateCallbacks.push(() => {
        controls.withoutTracking(func);
      });
    }
  }

  /**
   * Invalidates this computation so that its func will be rerun.
   */
  invalidate() {
    if (!this.invalidated) {
      // if we're currently in _recompute(), don't enqueue
      // ourselves, since we'll rerun immediately anyway.
      if (!this._recomputing && !this.stopped) {
        controls.scheduleFlush();
        state.pendingComputations.push(this);
      }

      this.invalidated = true;

      for (const func of this._onInvalidateCallbacks) {
        func();
      }
      this._onInvalidateCallbacks = [];
    }
  }

  /**
   * Prevents this computation from rerunning.
   */
  stop() {
    if (!this.stopped) {
      this.stopped = true;
      this.invalidate();
    }
  }

  _compute() {
    this.invalidated = false;

    let previousComputation = state.currentComputation;

    state.currentComputation = this;
    try {
      this._func();
    } finally {
      state.currentComputation = previousComputation;
    }
  }

  _recompute() {
    this._recomputing = true;
    try {
      while (this.invalidated && !this.stopped) {
        this._compute();
        // If _compute() invalidated us, we run again immediately.
        // A computation that invalidates itself indefinitely is an
        // infinite loop, of course.
      }
    } finally {
      this._recomputing = false;
    }
  }
}
