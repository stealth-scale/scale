/**
 * Declares what a host is created from, and the host a product composes its application with.
 */

import { type FormGlyphs } from "@stealthscale/component-forms/form";
import { type DataClientOptions, type QueryClient } from "@stealthscale/provider-data";
import {
  type AccessSource,
  type FlagSource,
  type Product,
  type SessionSource,
} from "@stealthscale/sdk-core";
import { type HostReport, type HostStores, type RenderTarget } from "@stealthscale/sdk-plugin";
import { type SettingStore } from "@stealthscale/settings";

/**
 * Lists what a host is created from.
 */
export interface HostOptions {
  /**
   * Source of decisions on single resources. Every decision is the tenant-wide one without it.
   */
  readonly access?: AccessSource | undefined;

  /**
   * The transport and the changes stream the host's data client runs on. A sampled transport over
   * the contracts' samples where left out.
   */
  readonly data?: Pick<DataClientOptions, "changes" | "transport"> | undefined;

  /**
   * Source of flag values per session. Every flag has its product value or its default without
   * one.
   */
  readonly flags?: FlagSource | undefined;

  /**
   * Milliseconds `ready` waits for the flag source's first `identify`. 1,000 by default.
   */
  readonly flagsTimeout?: number | undefined;

  /**
   * Glyphs the settings sections' forms render: the mark in a checked box, a select's chevron and
   * the others the forms package names. A form renders no mark it has no glyph for.
   */
  readonly glyphs?: FormGlyphs | undefined;

  /**
   * Reads and writes flag overrides. On by default outside a production build.
   */
  readonly overrides?: boolean | undefined;

  /**
   * The resolved product with its plugins' manifests, from `virtual:product`.
   */
  readonly product: Product;

  /**
   * Failed renders in a row after which a route or an extension is quarantined. 3 by default.
   */
  readonly quarantineAfter?: number | undefined;

  /**
   * Receives every entry the host reports. Writes to the console by default.
   */
  readonly report?: ((entry: HostReport) => void) | undefined;

  /**
   * Source of the session.
   */
  readonly session: SessionSource;

  /**
   * Where the host keeps a person's switches, settings and placements.
   */
  readonly store: SettingStore;
}

/**
 * Describes a host: the state of one page, or of one request on a server.
 */
export interface Host {
  /**
   * The data client of the page or the request, which the router's context contains.
   */
  readonly data: QueryClient;

  /**
   * Stops listening to the session source, the flag source, the access source and the setting
   * store, and cancels the data client's fetches.
   */
  readonly dispose: () => void;

  /**
   * Resolves once the eager plugins' modules are imported and the flag source has identified the
   * session, or once the flag timeout passes.
   */
  readonly ready: () => Promise<void>;

  /**
   * Lifts a target's quarantine and forgets its failures.
   */
  readonly retry: (target: RenderTarget) => void;

  /**
   * The host's stores, which `HostProvider` provides and the hooks of `sdk-plugin` read.
   */
  readonly stores: HostStores;
}
