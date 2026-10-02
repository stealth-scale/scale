/**
 * Declares the stores a host keeps while the page runs, one per concern, and the actions that
 * change them.
 *
 * @remarks
 *   A store per concern lets a hook subscribe to the one value it renders, so a change renders
 *   again only the components that read the value that changed.
 */

import { type ReactNode } from "react";

import {
  type AccessCheck,
  type KnownDecision,
  type PluginOffReason,
  type ResourceRef,
  type Session,
  type SlotPlacement,
} from "@stealthscale/sdk-core";

import { type HostReport, type RenderTarget } from "#host/report.ts";
import { type UnplacedReason } from "#slots/dropped.ts";

/**
 * Keeps one value the host changes while the page runs.
 */
export interface Store<T> {
  /**
   * Returns the value now. Returns the same object until the value changes.
   */
  readonly get: () => T;

  /**
   * Calls the listener after the value changes. Returns a function that stops the calls.
   */
  readonly subscribe: (listener: () => void) => () => void;
}

/**
 * Describes the session as the host keeps it, with its grants as sets.
 */
export interface SessionState {
  /**
   * Qualified ids of the entitlements the tenant is licensed for.
   */
  readonly entitlements: ReadonlySet<string>;

  /**
   * Qualified ids of the permissions the person has, for the tenant or on at least one resource.
   */
  readonly permissions: ReadonlySet<string>;

  /**
   * The session the source reported.
   */
  readonly session: Session;
}

/**
 * Lists the sources a flag's value comes from: an override, the flag source, the product or the
 * contract.
 */
export type FlagOrigin = "contract" | "override" | "product" | "source";

/**
 * Describes a flag's value for the session and the source it came from.
 */
export interface FlagReading {
  /**
   * The source that stated the value.
   */
  readonly origin: FlagOrigin;

  /**
   * The value: a boolean, or one of an experiment's variants.
   */
  readonly value: boolean | string;
}

/**
 * Describes the flags the page has read and the overrides of this tab.
 */
export interface FlagsState {
  /**
   * Every override of this tab, by the flag's qualified id.
   */
  readonly overrides: Readonly<Record<string, boolean | string>>;

  /**
   * Every flag the page has read, by qualified id.
   */
  readonly readings: ReadonlyMap<string, FlagReading>;
}

/**
 * Keeps the flags the page reads, evaluated once per session.
 */
export interface FlagStore extends Store<FlagsState> {
  /**
   * Overrides a flag's value in this tab, or removes the override where no value is given.
   */
  readonly override: (id: string, value?: boolean | string) => void;

  /**
   * Returns a flag's value for the session, and evaluates the flag on its first read. Returns
   * undefined for a flag no installed plugin declares.
   */
  readonly read: (id: string) => boolean | string | undefined;
}

/**
 * Describes whether a plugin is on, and the reason it is not.
 */
export interface PluginAvailability {
  /**
   * True where the plugin is on.
   */
  readonly on: boolean;

  /**
   * The reason the plugin is not on. Absent while it is on.
   */
  readonly reason?: PluginOffReason | undefined;
}

/**
 * Describes the decisions on single resources the host knows for the session's subject.
 */
export interface AccessState {
  /**
   * Each known decision, by the key `decisionKey` returns: true where the person may act.
   */
  readonly decisions: ReadonlyMap<string, boolean>;

  /**
   * True where the product gave the host an access source.
   */
  readonly source: boolean;
}

/**
 * Keeps the decisions on single resources, and asks the access source for the rest.
 */
export interface AccessStore extends Store<AccessState> {
  /**
   * Drops the decisions on a resource, or every decision where it names none.
   */
  readonly forget: (resource?: ResourceRef) => void;

  /**
   * Records decisions a service returned with its data, so no check is sent for them.
   */
  readonly prime: (decisions: readonly KnownDecision[]) => void;

  /**
   * Queues a check the store knows no decision for. The host sends the checks queued in one task to
   * the access source in one call.
   */
  readonly request: (check: AccessCheck) => void;
}

/**
 * Keeps the person's placements, by slot.
 */
export interface PlacementStore extends Store<Readonly<Record<string, SlotPlacement>>> {
  /**
   * Removes every placement the person made.
   */
  readonly reset: () => void;

  /**
   * Replaces the person's placements of the slots the change names, and writes the result.
   */
  readonly update: (change: Readonly<Record<string, SlotPlacement>>) => void;
}

/**
 * Describes a target the host quarantined, with the last error it threw.
 */
export interface Quarantined {
  /**
   * The error of the last render that threw.
   */
  readonly error: unknown;

  /**
   * The target.
   */
  readonly target: RenderTarget;
}

/**
 * Keeps the targets that failed too many renders in a row.
 */
export interface QuarantineStore extends Store<ReadonlyMap<RenderTarget, Quarantined>> {
  /**
   * Counts a render of the target that threw, and quarantines the target at the host's limit.
   */
  readonly failed: (target: RenderTarget, error: unknown) => void;

  /**
   * Returns a target's count to zero after a render of it committed.
   */
  readonly rendered: (target: RenderTarget) => void;

  /**
   * Lifts a target's quarantine and forgets its failures.
   */
  readonly retry: (target: RenderTarget) => void;
}

/**
 * Describes one mounted instance of a slot or of a page, and what it renders.
 */
export interface MountedSlot {
  /**
   * Why the instance does not render each extension placed in it or attached to what it renders,
   * by qualified id.
   */
  readonly dropped: Readonly<Record<string, UnplacedReason>>;

  /**
   * The value a keyed slot renders with. Absent on a slot that is not keyed.
   */
  readonly match?: string | undefined;

  /**
   * Qualified ids of the extensions the instance renders, decorators and wrappers included.
   */
  readonly rendered: readonly string[];
}

/**
 * Keeps the slots and the plugin pages on screen, with every mounted instance of each.
 *
 * @remarks
 *   A slot's instances are kept under the slot's qualified id, and a page's under `route:<id>`, the
 *   key `RouteDecorations` records the extensions around the page under.
 */
export interface MountedStore extends Store<ReadonlyMap<string, readonly MountedSlot[]>> {
  /**
   * Records a mounted instance under its key until the returned function is called.
   */
  readonly mount: (key: string, slot: MountedSlot) => () => void;
}

/**
 * Describes what a page contributes to a slot with `Into`.
 */
export interface PageContribution {
  /**
   * Content the slot renders for the contribution.
   */
  readonly content: ReactNode;

  /**
   * Key of the contribution, unique on the page.
   */
  readonly key: string;

  /**
   * Rank among the slot's page contributions, ascending.
   */
  readonly order: number;
}

/**
 * Keeps what the pages on screen contribute to slots, by slot.
 */
export interface PageStore extends Store<ReadonlyMap<string, readonly PageContribution[]>> {
  /**
   * Replaces a contribution's content in the place it took.
   */
  readonly fill: (key: string, content: ReactNode) => void;

  /**
   * Takes a place in a slot until the returned function is called.
   */
  readonly place: (slotId: string, key: string, order: number) => () => void;
}

/**
 * Lists the stores the hooks of this package read.
 */
export interface HostStores {
  /**
   * Decisions on single resources.
   */
  readonly access: AccessStore;

  /**
   * Every installed plugin's availability, by plugin id.
   */
  readonly availability: Store<Readonly<Record<string, PluginAvailability>>>;

  /**
   * The flags the page reads.
   */
  readonly flags: FlagStore;

  /**
   * The slots and the plugin pages on screen.
   */
  readonly mounted: MountedStore;

  /**
   * The contributions of the pages on screen, by slot.
   */
  readonly pages: PageStore;

  /**
   * The person's placements.
   */
  readonly placements: PlacementStore;

  /**
   * The quarantined targets.
   */
  readonly quarantine: QuarantineStore;

  /**
   * The last runtime entries the host reported.
   */
  readonly reports: Store<readonly HostReport[]>;

  /**
   * The session.
   */
  readonly session: Store<SessionState>;
}
