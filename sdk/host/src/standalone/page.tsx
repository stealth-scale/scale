/**
 * Renders the page of a route whose plugin a standalone product installs from its contract alone.
 */

import { type FunctionComponent, type ReactElement } from "react";

import { EmptyState } from "@stealthscale/component-feedback";
import { Stack } from "@stealthscale/component-layout";
import { Heading } from "@stealthscale/component-typography";
import { useTranslation } from "@stealthscale/provider-i18n";
import { Outlet, useChildMatches } from "@stealthscale/provider-router";
import {
  type AnyContract,
  type ResolvedExtension,
  type SlotReference,
  targetKeyOf,
} from "@stealthscale/sdk-core";
import { Slot, useResolvedProduct } from "@stealthscale/sdk-plugin";

import { pluginWordsOf } from "#host/words.ts";

/**
 * Types a slot of a contract with the props its sample states.
 */
type Sampled = SlotReference<string, Readonly<Record<string, unknown>>>;

/**
 * The props a slot without a sample renders with.
 */
const NONE: Readonly<Record<string, unknown>> = {};

/**
 * Returns the values a slot renders with: each value the extensions placed in a keyed slot match,
 * and no value for a slot that is not keyed.
 */
function matchesOf(
  slot: Sampled,
  extensions: readonly ResolvedExtension[],
): ReadonlyArray<string | undefined> {
  if (slot.keyed !== true) return [undefined];

  const target = targetKeyOf(slot);

  return [...new Set(extensions.filter((one) => one.target === target).map(({ match }) => match))];
}

/**
 * Returns the component of the placeholder page of one route.
 *
 * @remarks
 *   The page names the route and states that its plugin is installed from its contract alone. Where
 *   the address matches a child route, the child's page renders in the route's outlet.
 *   Otherwise each slot of the contract renders under a heading that names the slot, with the
 *   slot's sample props, and a keyed slot renders once per value the extensions placed in it match.
 * @param routeId - Qualified id of the route.
 * @param contract - The contract of the route's plugin.
 */
export function placeholderPageOf(routeId: string, contract: AnyContract): FunctionComponent {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a contract's slot renders with the props its sample states, which the marker's types checked
  const slots = Object.values(contract.slots) as readonly Sampled[];

  /**
   * Renders the page in its plugin's scope.
   */
  return function PlaceholderPage(): ReactElement {
    const { i18n, t } = useTranslation("host");
    const { extensions } = useResolvedProduct();
    const nested = useChildMatches().length > 0;
    const plugin = pluginWordsOf(i18n).t(contract.pluginId, "plugin.name");

    return (
      <Stack>
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Title as="h1">{routeId}</EmptyState.Title>
            <EmptyState.Description>{t("standalone.page", { plugin })}</EmptyState.Description>
          </EmptyState.Content>
        </EmptyState.Root>
        {nested ? (
          <Outlet />
        ) : (
          slots.map((slot) => (
            <Stack as="section" key={slot.id}>
              <Heading as="h2">{slot.id}</Heading>
              {matchesOf(slot, extensions).map((match) => (
                <Slot key={match ?? ""} match={match} props={slot.sample ?? NONE} slot={slot} />
              ))}
            </Stack>
          ))
        )}
      </Stack>
    );
  };
}
