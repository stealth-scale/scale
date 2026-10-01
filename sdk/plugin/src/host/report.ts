/**
 * Declares the entries a host reports while the page runs: failures, cut event chains, flag
 * exposures and ignored values, dropped settings, and extensions that found no place.
 */

/**
 * Lists what the host renders from a manifest: `extension:<id>` or `route:<id>`.
 */
export type RenderTarget = `extension:${string}` | `route:${string}`;

/**
 * Describes an emit the bus dropped, because 16 deliveries were already running inside one another.
 */
export interface ChainCut {
  /**
   * The kind of the entry.
   */
  readonly kind: "event-chain-cut";

  /**
   * Qualified id of the event whose emit was dropped.
   */
  readonly target: string;
}

/**
 * Describes the first read of an experiment in a session.
 */
export interface FlagExposed {
  /**
   * Qualified id of the experiment.
   */
  readonly flag: string;

  /**
   * The kind of the entry.
   */
  readonly kind: "flag-exposed";

  /**
   * The variant the session is served.
   */
  readonly variant: string;
}

/**
 * Describes a flag value of the wrong type, which the next source replaced.
 */
export interface FlagIgnored {
  /**
   * Qualified id of the flag.
   */
  readonly flag: string;

  /**
   * The kind of the entry.
   */
  readonly kind: "flag-ignored";

  /**
   * The source that stated the value.
   */
  readonly source: "override" | "product" | "source";

  /**
   * The value the source stated.
   */
  readonly value: unknown;
}

/**
 * Describes a render that threw: a target's, or the host's own outside every plugin.
 */
export interface RenderFailed {
  /**
   * The error the render threw.
   */
  readonly error: unknown;

  /**
   * The kind of the entry.
   */
  readonly kind: "render-failed";

  /**
   * The target, or `host` for the frame, a host part or a provider.
   */
  readonly target: "host" | RenderTarget;
}

/**
 * Describes a command or an event handler that threw.
 */
export interface RunFailed {
  /**
   * The error the command or the handler threw.
   */
  readonly error: unknown;

  /**
   * The kind of the entry.
   */
  readonly kind: "command-failed" | "event-handler-failed";

  /**
   * Qualified id of the command, or of the event whose handler threw.
   */
  readonly target: string;
}

/**
 * Describes a stored setting, switch or placement the host dropped.
 */
export interface SettingDropped {
  /**
   * Key of the stored value.
   */
  readonly key: string;

  /**
   * The kind of the entry.
   */
  readonly kind: "setting-dropped";

  /**
   * Reason the value was dropped.
   */
  readonly reason: string;
}

/**
 * Describes an extension that found no place: its slot took one contribution, or its slot was not
 * mounted.
 */
export interface SlotMissed {
  /**
   * The kind of the entry.
   */
  readonly kind: "slot-full" | "unplaced";

  /**
   * Qualified id of the slot.
   */
  readonly slot: string;

  /**
   * Qualified id of the extension.
   */
  readonly target: string;
}

/**
 * Describes a source of the host that failed: the access, flag or session source.
 */
export interface SourceFailed {
  /**
   * The error the source threw or rejected with.
   */
  readonly error: unknown;

  /**
   * The kind of the entry, which names the source.
   */
  readonly kind: "access-failed" | "flags-failed" | "session-failed";
}

/**
 * Describes a target the host quarantined after it failed too many renders in a row.
 */
export interface TargetQuarantined {
  /**
   * The error of the last render that threw.
   */
  readonly error: unknown;

  /**
   * The kind of the entry.
   */
  readonly kind: "quarantined";

  /**
   * The target.
   */
  readonly target: RenderTarget;
}

/**
 * Describes one entry the host reports.
 */
export type HostReport =
  | ChainCut
  | FlagExposed
  | FlagIgnored
  | RenderFailed
  | RunFailed
  | SettingDropped
  | SlotMissed
  | SourceFailed
  | TargetQuarantined;
