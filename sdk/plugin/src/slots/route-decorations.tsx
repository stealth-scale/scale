/**
 * Renders a plugin's page with the extensions placed around its route, and records them in the
 * host's `mounted` store under `route:<id>`.
 */

import { type ReactNode, useLayoutEffect } from "react";

import { type ResolvedProduct } from "@stealthscale/sdk-core";

import { useMatched } from "#conditions/matched.ts";
import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";
import { attachedTo } from "#slots/contents.ts";
import { Hosted } from "#slots/hosted.tsx";
import { judgeOf, outcomeOf, type Plan, type PlanStores, signatureOf } from "#slots/plan.ts";
import { positionsOf } from "#slots/positions.ts";

/**
 * Describes the props of `RouteDecorations`.
 */
export interface RouteDecorationsProps {
  /**
   * The page.
   */
  readonly children?: ReactNode;

  /**
   * Qualified id of the page's route.
   */
  readonly routeId: string;
}

/**
 * Returns a page's decorations in a slot plan's form: the extensions placed around the route as
 * the rendered and dropped ones, and the wrappers of every route as the halos.
 */
function decorationsOf(
  routeId: string,
  product: ResolvedProduct,
  stores: PlanStores,
  matched: ReadonlySet<string>,
): Plan {
  const judge = judgeOf(stores, matched);
  const own = attachedTo(`route:${routeId}`, product.extensions, judge);
  const every = attachedTo("every:route", product.extensions, judge);

  return {
    attachedDropped: every.dropped,
    decorators: [],
    dropped: own.dropped,
    halos: every.rendered,
    outlines: [],
    rendered: own.rendered,
  };
}

/**
 * Renders a page with the extensions placed around its route by position, inside the wrappers of
 * every route.
 *
 * @remarks
 *   `before` extensions render in order, then the last `replace` one or the page, then `after`
 *   extensions, inside the route's `wrap` extensions and then the wrappers of every route, the
 *   first of each outermost. Every extension renders with `routeId` and `targetId`, both the
 *   route's id, and without decorators of its own. The page records what it renders and drops in
 *   the host's `mounted` store under `route:<id>` while it is mounted, so the extension statuses
 *   read a page's decorations as they read a slot's extensions.
 */
export function RouteDecorations({ children, routeId }: RouteDecorationsProps): ReactNode {
  const { product, stores } = useHost("RouteDecorations");
  const matched = useMatched();
  const signature = useSelector(
    [stores.availability, stores.flags, stores.quarantine, stores.session],
    () => signatureOf(decorationsOf(routeId, product, stores, matched)),
  );
  const plan = decorationsOf(routeId, product, stores, matched);
  const props = { routeId, targetId: routeId };
  const { after, before, replacing, wraps } = positionsOf(plan.rendered);

  useLayoutEffect(
    () => stores.mounted.mount(`route:${routeId}`, outcomeOf(signature)),
    [routeId, signature, stores.mounted],
  );

  let whole: ReactNode = (
    <>
      {before.map((one) => (
        <Hosted extension={one} key={one.id} props={props} />
      ))}
      {replacing === undefined ? children : <Hosted extension={replacing} props={props} />}
      {after.map((one) => (
        <Hosted extension={one} key={one.id} props={props} />
      ))}
    </>
  );

  for (const wrapping of [...wraps, ...plan.halos.toReversed()]) {
    whole = (
      <Hosted extension={wrapping} key={wrapping.id} props={props}>
        {whole}
      </Hosted>
    );
  }

  return whole;
}
