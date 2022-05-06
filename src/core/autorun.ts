import state from "./state";
import Computation from "./Computation";

/**
 * Run a function now and rerun it later whenever its dependencies change.
 *
 * @param func The function to run.
 */
export function autorun(func: () => void) {
  const computation = new Computation(func);

  if (state.currentComputation != null) {
    // Link the computation to the current computation so that it is stopped if
    // the current computation is invalidated.
    state.currentComputation.onInvalidate(() => computation.stop());
  }
}
