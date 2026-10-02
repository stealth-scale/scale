/**
 * Renders a slot: its own content with every contribution placed in it.
 */

import { Fragment, type ReactNode, useEffect, useLayoutEffect } from "react";

import { type SlotReference } from "@stealthscale/sdk-core";

import { useHost } from "#host/use-host.ts";
import { Decorated } from "#slots/decorated.tsx";
import { Hosted } from "#slots/hosted.tsx";
import { outcomeOf } from "#slots/plan.ts";
import { positionsOf } from "#slots/positions.ts";
import { type SlotProps } from "#slots/props.ts";
import { useContributions, usePlan } from "#slots/use-plan.ts";

/**
 * Renders a slot's own content with the extensions placed in it and the pages' contributions.
 *
 * @remarks
 *   `before` extensions render in order, then the last `replace` one or the slot's own content,
 *   then `after` extensions, then what the pages on screen contribute with `Into`, inside the
 *   `wrap` extensions, the first outermost. The wrappers of every slot wrap the whole slot,
 *   outermost. Every extension renders with the slot's props and the slot's id as `targetId`. The
 *   slot records itself and what it renders in the host's `mounted` store while it is mounted,
 *   and reports each extension a slot of arity one leaves out as `slot-full`.
 */
export function Slot<R extends SlotReference>(given: SlotProps<R>): ReactNode {
  const { children, match, slot } = given;
  const { report, stores } = useHost("Slot");
  const { plan, signature } = usePlan("Slot", slot.id, match, given.props);
  const contributions = useContributions("Slot", slot.id);
  const shared = { ...given.props, targetId: slot.id };
  const common = { decorators: plan.decorators, halos: plan.halos, props: shared };
  const { after, before, replacing, wraps } = positionsOf(plan.rendered);
  const full = plan.dropped
    .filter(({ reason }) => reason === "full")
    .map(({ extension }) => extension.id)
    .join(" ");

  useLayoutEffect(
    () => stores.mounted.mount(slot.id, outcomeOf(signature, match)),
    [match, signature, slot.id, stores.mounted],
  );

  useEffect(() => {
    for (const target of full === "" ? [] : full.split(" ")) {
      report({ kind: "slot-full", slot: slot.id, target });
    }
  }, [full, report, slot.id]);

  let whole: ReactNode = (
    <>
      {before.map((one) => (
        <Decorated {...common} extension={one} key={one.id} />
      ))}
      {replacing === undefined ? children : <Decorated {...common} extension={replacing} />}
      {after.map((one) => (
        <Decorated {...common} extension={one} key={one.id} />
      ))}
      {contributions.map(({ content, key }) => (
        <Fragment key={key}>{content}</Fragment>
      ))}
    </>
  );

  for (const wrapping of wraps) {
    whole = (
      <Decorated {...common} extension={wrapping} key={wrapping.id}>
        {whole}
      </Decorated>
    );
  }

  for (const outline of plan.outlines.toReversed()) {
    whole = (
      <Hosted extension={outline} key={outline.id} props={shared}>
        {whole}
      </Hosted>
    );
  }

  return whole;
}
