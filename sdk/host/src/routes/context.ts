/**
 * Declares what the router's context contains in a product, the condition a plugin route compiles
 * with, and the data of a page the host makes not found.
 */

import { type DataContext } from "@stealthscale/provider-data/router";
import { type RouteMap, type RoutesContext } from "@stealthscale/provider-router";
import { type When } from "@stealthscale/sdk-core";
import { type RenderTarget } from "@stealthscale/sdk-plugin";

import { type Host } from "#host/options.ts";

/**
 * Lists what the router's context contains in a product.
 */
export interface HostRouterContext extends DataContext, RoutesContext {
  /**
   * The host whose state every route condition reads.
   */
  readonly host: Host;

  /**
   * Every declared id, against the route compiled for it. The sign-in redirect resolves the sign-in
   * route's path through it.
   */
  readonly routes: RouteMap;
}

/**
 * Lists what a compiled plugin route's condition contains.
 */
export interface HostCondition {
  /**
   * Id of the plugin that declared the route.
   */
  readonly pluginId: string;

  /**
   * Qualified id of the route.
   */
  readonly routeId: string;

  /**
   * The route's condition joined with the product's `when`. Absent where neither states one.
   */
  readonly when?: undefined | When;
}

/**
 * Describes a page whose plugin is not on: the plugin whose state stops it, the page's own or one
 * it requires, and that plugin's reason.
 */
export interface PluginUnavailable {
  /**
   * Id of the plugin whose state stops the page.
   */
  readonly plugin: string;

  /**
   * `off` where a switch turned the plugin off, `unavailable` where its kill switch stopped it.
   */
  readonly reason: "off" | "unavailable";
}

/**
 * Describes a page the host quarantined after it failed its renders.
 */
export interface PageQuarantined {
  /**
   * The reason the page is not found.
   */
  readonly reason: "quarantined";

  /**
   * The quarantined target: `route:<id>`.
   */
  readonly target: RenderTarget;
}

/**
 * Lists the data of a not-found error the route evaluator throws, which the not-found page reads.
 */
export type NotFoundData = PageQuarantined | PluginUnavailable;
