/**
 * Lists the readings and zones the gauge chart's page renders: a checkout API's latency against its
 * error budget, a service's throughput against its tested ceiling, and a host's use of its CPU,
 * memory and disk.
 */

/**
 * Describes one zone of a range: its key, where it ends and its palette.
 */
export interface Threshold {
  /**
   * Palette of the zone.
   */
  readonly color: "error" | "success" | "warning";

  /**
   * Key of the zone's name.
   */
  readonly key: string;

  /**
   * Value the zone ends at.
   */
  readonly upTo: number;
}

/**
 * Lists the zones of a p99 latency in milliseconds: healthy up to 600, watch up to the 900ms error
 * budget and critical up to 1,200.
 */
export const LATENCY: readonly Threshold[] = [
  { color: "success", key: "healthy", upTo: 600 },
  { color: "warning", key: "watch", upTo: 900 },
  { color: "error", key: "critical", upTo: 1200 },
];

/**
 * Milliseconds the latency dial ends at.
 */
export const BUDGET_MAX = 1200;

/**
 * Requests a second the service was tested to.
 */
export const THROUGHPUT_MAX = 5000;

/**
 * Lists the zones of a resource's use as a share: fine up to 70%, filling up to 90% and full up to
 * 100%.
 */
export const USE: readonly Threshold[] = [
  { color: "success", key: "fine", upTo: 0.7 },
  { color: "warning", key: "filling", upTo: 0.9 },
  { color: "error", key: "full", upTo: 1 },
];

/**
 * Describes one resource of a host: its key and the share in use.
 */
export interface Resource {
  /**
   * Key of the resource.
   */
  readonly key: "cpu" | "disk" | "memory";

  /**
   * Share of the resource in use, where 1 is all of it.
   */
  readonly used: number;
}

/**
 * Lists a host's use of its CPU, memory and disk. The disk is 93% full.
 */
export const HOST: readonly Resource[] = [
  { key: "cpu", used: 0.64 },
  { key: "memory", used: 0.81 },
  { key: "disk", used: 0.93 },
];
