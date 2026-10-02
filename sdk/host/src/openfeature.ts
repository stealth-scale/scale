/**
 * Adapts an OpenFeature client to the host's flag source, for a product whose flags run through
 * OpenFeature in the browser.
 */

import {
  type EvaluationContext,
  type EvaluationDetails,
  NOOP_PROVIDER,
  OpenFeature,
  ProviderEvents,
  StandardResolutionReasons,
} from "@openfeature/web-sdk";

import { type FlagSource, type Session } from "@stealthscale/sdk-core";

/**
 * Lists the options of the OpenFeature adapter.
 */
export interface OpenFeatureFlagsOptions {
  /**
   * Domain the host's client is bound to. `stealth.host` where left out.
   */
  readonly domain?: string | undefined;
}

/**
 * Domain the host's client is bound to where the product states none.
 */
const DOMAIN = "stealth.host";

/**
 * The provider events after which the provider's values may differ.
 */
const CHANGES = [
  ProviderEvents.Ready,
  ProviderEvents.ConfigurationChanged,
  ProviderEvents.ContextChanged,
] as const;

/**
 * Returns a session as an evaluation context: the person as the targeting key, beside whether
 * somebody is signed in, the tenant's entitlements, the person's roles and the tenant.
 */
function contextOf(session: Session): EvaluationContext {
  return {
    authenticated: session.authenticated,
    entitlements: [...session.entitlements],
    roles: [...session.roles],
    ...(session.tenantId === undefined ? {} : { tenantId: session.tenantId }),
    ...(session.userId === undefined ? {} : { targetingKey: session.userId }),
  };
}

/**
 * Returns the value an evaluation resolved, or undefined where the provider stated none.
 *
 * @remarks
 *   A provider states no value where the evaluation reports an error code, such as for a flag it
 *   does not know, and where it disabled the flag: both return the default the adapter passed,
 *   which is not the product's.
 */
function valueOf(details: EvaluationDetails<boolean | string>): boolean | string | undefined {
  return details.errorCode === undefined && details.reason !== StandardResolutionReasons.DISABLED
    ? details.value
    : undefined;
}

/**
 * Returns a flag source that evaluates the host's flags through the OpenFeature client of a domain.
 *
 * @remarks
 *   A product binds its provider to the domain with `OpenFeature.setProvider(domain, provider)`, so
 *   a product that runs OpenFeature elsewhere keeps its own default provider. `identify` sets the
 *   domain's evaluation context to the session and resolves once the provider reconciled it.
 *   `evaluate` returns no value where no provider is bound to the domain, so every flag takes the
 *   product's value. `subscribe` follows the provider's `Ready`, `ConfigurationChanged` and
 *   `ContextChanged` events, and OpenFeature calls a listener at once where the provider is
 *   ready. OpenFeature keeps one context per domain for the page, so a server passes a flag source
 *   per request instead.
 * @param options - The domain the host's client is bound to.
 */
export function openFeatureFlags({ domain = DOMAIN }: OpenFeatureFlagsOptions = {}): FlagSource {
  const client = OpenFeature.getClient(domain);

  return {
    evaluate: ({ id, type }) => {
      const details =
        type === "boolean" ? client.getBooleanDetails(id, false) : client.getStringDetails(id, "");

      return OpenFeature.getProvider(domain) === NOOP_PROVIDER ? undefined : valueOf(details);
    },
    identify: (session) => OpenFeature.setContext(domain, contextOf(session)),
    subscribe: (listener) => {
      /**
       * Calls the listener without the event's details.
       */
      const changed = (): void => {
        listener();
      };

      for (const event of CHANGES) client.addHandler(event, changed);

      return () => {
        for (const event of CHANGES) client.removeHandler(event, changed);
      };
    },
  };
}
