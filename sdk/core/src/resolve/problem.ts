/**
 * Collects the faults a product's resolution finds: problems that fail the build, and warnings
 * that do not.
 *
 * @remarks
 *   A fault names the dotted path of its value, from the plugin id or from `product`, and the
 *   reason. The build prints each as `<path>: <reason>`.
 */

/**
 * Describes one fault by the dotted path of its value and the reason.
 */
export interface Problem {
  /**
   * Dotted path of the value at fault: `time-off.routes.request.sample`.
   */
  readonly path: string;

  /**
   * Reason the value is at fault: `is required on a path with parameters`.
   */
  readonly reason: string;
}

/**
 * Collects the problems and the warnings of one resolution, in the order the checks find them.
 */
export interface Report {
  /**
   * Records a fault that fails the build.
   */
  readonly problem: (path: string, reason: string) => void;

  /**
   * The faults that fail the build.
   */
  readonly problems: readonly Problem[];

  /**
   * Records a fault that does not fail the build.
   */
  readonly warning: (path: string, reason: string) => void;

  /**
   * The faults that do not fail the build.
   */
  readonly warnings: readonly Problem[];
}

/**
 * Returns an empty report.
 */
export function report(): Report {
  const problems: Problem[] = [];
  const warnings: Problem[] = [];

  return {
    problem: (path, reason) => {
      problems.push({ path, reason });
    },
    problems,
    warning: (path, reason) => {
      warnings.push({ path, reason });
    },
    warnings,
  };
}

/**
 * Writes a fault the way the build prints it: `<path>: <reason>`.
 *
 * @param fault - A problem or a warning, with its path and its reason.
 */
export function lineOf(fault: Problem): string {
  return `${fault.path}: ${fault.reason}`;
}
