import state from "./state";
import Computation from "./Computation";

/**
 * A Dependency represents an atomic unit of reactive data that a computation
 * might depend on. When the data changes, the computations are invalidated.
 */
export default class Dependency {
  private _dependents = new Set<Computation>();

  /**
   * Declares that the current computation depends on this Dependency. The
   * computation will be invalidated the next time this dependency changes.
   *
   * If there is no current computation, it does nothing.
   */
  depend() {
    if (state.currentComputation == null) return;
    if (state.skipTracking) return;

    const computation = state.currentComputation;

    if (!this._dependents.has(computation)) {
      this._dependents.add(computation);
      computation.onInvalidate(() => {
        this._dependents.delete(computation);
      });
    }
  }

  /**
   * Invalidate all dependent computations immediately and remove them as dependents.
   */
  changed() {
    for (const computation of this._dependents) {
      computation.invalidate();
    }
  }
}
