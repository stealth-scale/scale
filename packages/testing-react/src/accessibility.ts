/**
 * Audits a rendered React component with axe and reports each rule it breaks.
 *
 * @remarks
 *   The audit renders the component under the same options the conformance check takes, so a part
 *   is audited inside the root it needs and a component that needs props gets them. A rule axe
 *   cannot decide, which it reports as incomplete, is left out. A layered background is what stops
 *   it deciding a contrast, and a page is where that is measured. Axe reads the render after a
 *   state machine commits its first state, so a component built on one is audited in that state
 *   rather than the one it mounts in. With `frame`, axe reads the render one animation frame
 *   later: a dialog machine sets its context again in the frame after it opens. An element with the
 *   `hidden` attribute is left out with everything inside it. A browser does not render it, and the
 *   DOM the specifications run in has no style rule for the attribute and lays it out as visible.
 *   Axe audits the frame element and not the document inside it, because that DOM gives a frame no
 *   window axe can message, and axe throws when it tries. A browser audit reads framed documents.
 */

import { createElement, type ElementType } from "react";

import { act } from "@testing-library/react";
import axe from "axe-core";

import { type ConformanceOptions } from "#conformance.ts";
import { drawn } from "#machine.ts";

/**
 * Selects the elements the audit leaves out: those a browser does not render.
 */
const HIDDEN = "[hidden]:not([hidden=until-found])";

/**
 * Waits for the next animation frame inside `act`, so a state set in that frame commits before
 * axe reads the render.
 */
async function framed(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

/**
 * Lists every accessibility rule a rendered component breaks, as the rule's id and its help.
 *
 * @returns Each broken rule as `id: help`, or an empty array for a component that passes every
 *   rule axe can decide.
 */
export async function accessibilityViolations(
  Component: ElementType,
  options: ConformanceOptions = {},
): Promise<readonly string[]> {
  const element = createElement(Component, options.props ?? {});
  const { container, unmount } = await drawn(
    options.wrapper === undefined ? element : options.wrapper(element),
  );

  if (options.frame === true) await framed();

  try {
    const result = await axe.run(
      { exclude: HIDDEN, include: container },
      { iframes: false, resultTypes: ["violations"] },
    );

    return result.violations.map((each) => `${each.id}: ${each.help}`);
  } finally {
    act(() => {
      unmount();
    });
  }
}
