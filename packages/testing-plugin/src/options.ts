/**
 * Declares what a render of a plugin's component starts from, and what it returns.
 */

import { type ComponentType } from "react";

import { type RenderResult } from "@testing-library/react";

import { type Sample } from "@stealthscale/provider-data/testing";
import { type AnyRouter } from "@stealthscale/provider-router";
import {
  type PathParams,
  type RouteReference,
  type Session,
  type SlotPlacement,
} from "@stealthscale/sdk-core";
import { type Host } from "@stealthscale/sdk-host";
import {
  type Decider,
  type StandaloneAccess,
  type StandaloneOptions,
  type StandaloneSession,
} from "@stealthscale/sdk-host/standalone";
import { type SettingStore } from "@stealthscale/settings";

import { type Seeds } from "#product.ts";

/**
 * Describes the route a render opens the memory router at.
 */
export interface PluginRoute {
  /**
   * The route's parameters. The route's sample where left out.
   */
  readonly params?: PathParams | undefined;

  /**
   * The route's search. None where left out.
   */
  readonly search?: Readonly<Record<string, unknown>> | undefined;

  /**
   * The route.
   */
  readonly to: RouteReference;
}

/**
 * Lists what a render of a plugin's component starts from.
 */
export interface PluginRenderOptions extends Seeds, StandaloneOptions {
  /**
   * Decides each check on one resource. Every check allowed where left out.
   */
  readonly access?: Decider | undefined;

  /**
   * Values the flag source serves, by flag id. Every boolean flag on and every experiment at its
   * default where left out.
   */
  readonly flags?: Readonly<Record<string, boolean | string>> | undefined;

  /**
   * The frame the pages render in. A frame of every region where left out.
   */
  readonly frame?: ComponentType | undefined;

  /**
   * The person's placements, by slot id. None where left out.
   */
  readonly placements?: Readonly<Record<string, SlotPlacement>> | undefined;

  /**
   * The route the memory router opens at. The router opens at `/` where left out.
   */
  readonly route?: PluginRoute | undefined;

  /**
   * Samples by operation id, over the contracts' samples. A refusal rejects the operation's runs.
   */
  readonly samples?: Readonly<Record<string, Sample>> | undefined;

  /**
   * The session. Signed in with every permission and entitlement the product declares where left
   * out.
   */
  readonly session?: Session | undefined;
}

/**
 * Describes a render of a plugin's component: Testing Library's result, and the host's state a
 * specification changes after the render.
 */
export interface PluginRendered extends Omit<RenderResult, "rerender"> {
  /**
   * Switches the decisions on single resources.
   */
  readonly access: StandaloneAccess;

  /**
   * The host the render runs under.
   */
  readonly host: Host;

  /**
   * The memory router the render runs under.
   */
  readonly router: AnyRouter;

  /**
   * Replaces the session.
   */
  readonly session: StandaloneSession;

  /**
   * The setting store of the person's switches, settings and placements.
   */
  readonly store: SettingStore;
}

/**
 * Describes the value a hook returned at its last render.
 */
export interface HookResult<T> {
  /**
   * The value the hook returned at its last render.
   */
  readonly current: T;
}

/**
 * Describes a render of a plugin's hook.
 */
export interface PluginHookRendered<T> extends PluginRendered {
  /**
   * The value the hook returned at its last render.
   */
  readonly result: HookResult<T>;
}
