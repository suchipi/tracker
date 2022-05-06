import type Computation from "./Computation";

const state = {
  /**
   * The current computation, or `null` if there isn't one. The current
   * computation is the Computation object created by the innermost active call
   * to `autorun`, and it's the computation that gains dependencies when reactive
   * data sources are accessed.
   */
  currentComputation: null as Computation | null,

  // computations whose callbacks we should call at flush time
  pendingComputations: [] as Array<Computation>,

  // whether we should track dependencies or not
  skipTracking: false,
};

export default state;
