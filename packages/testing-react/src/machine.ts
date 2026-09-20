/**
 * Draws a component built on a state machine, waits for the machine to settle, and reports a part
 * that draws without the root it needs.
 *
 * @remarks
 *   A component built on a state machine answers two things no plain component does. It schedules
 *   its own update rather than making one during the event, so a case that reads the result back
 *   straight after an interaction reads what was there before, and a case that merely draws it
 *   leaves an update outside the act scope React checks. And it hands its parts an api through a
 *   context, so a part drawn on its own has nothing to read and has to say so rather than draw
 *   wrongly in silence.
 */

import { type ComponentType, createElement, type ReactElement } from "react";

import { act, fireEvent, render, type RenderResult } from "@testing-library/react";

/**
 * Waits for whatever the last interaction started to finish.
 *
 * @remarks
 *   A machine updates on a microtask, so the assertion after `fireEvent` runs first and reads the
 *   state the interaction was meant to change. This flushes it inside `act`, which is also what
 *   keeps React from warning about an update it did not see.
 * @returns Nothing. The caller reads the screen.
 */
export async function settled(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
  });
}

/**
 * Renders a component built on a state machine and waits for the machine to commit.
 *
 * @remarks
 *   The machine commits its first state on a microtask after the component mounts. Rendering and
 *   flushing that microtask under two separate act scopes leaves the commit between them, which
 *   React reports as an update the test did not see, so both happen under one scope here. Measured
 *   on the tabs fixture: a bare render, a render followed by a synchronous act, and a render inside
 *   one each report two such updates, and this reports none.
 * @param ui - The tree to render, which a fixture usually builds.
 * @returns The container and the queries the render produced, once the machine has committed.
 */
export function drawn(ui: ReactElement): Promise<RenderResult> {
  return act(async () => {
    const rendered = render(ui);

    await Promise.resolve();

    return rendered;
  });
}

/**
 * Presses an element the way a pointer does, and waits for the machine to answer.
 *
 * @remarks
 *   A click on its own is not a press. A machine that tracks a pointer acts on the whole sequence,
 *   and a menu is the case: it moves its highlight onto a row as the pointer goes down and reports
 *   the highlighted row on the click, so a bare click reports nothing at all. This fires the three
 *   events a browser fires, in the order a browser fires them.
 *   The machine settles between the press and the click, because it commits on a microtask and a
 *   whole sequence fired in one turn reaches the click before the press has been acted on. Measured
 *   on the menu: a row pressed and clicked in one turn reports no selection, and the same row with
 *   a settle between them reports one.
 * @param element - The element to press.
 * @returns Nothing. The caller reads the screen.
 */
export async function pressed(element: Element): Promise<void> {
  fireEvent.pointerDown(element);

  await settled();

  fireEvent.pointerUp(element);
  fireEvent.click(element);

  await settled();
}

/**
 * Moves a pointer onto an element, and waits for whatever that started to finish.
 *
 * @remarks
 *   A pointer that arrives is dispatched as `pointerover` rather than as `pointerenter`. React
 *   listens for the bubbling event on the root it mounted and works out from it which elements the
 *   pointer entered, so a handler set with `onPointerEnter` never runs for a `pointerenter` event
 *   fired at the element itself.
 * @param element - The element the pointer arrives on.
 * @returns Nothing. The caller reads the screen.
 */
export async function hovered(element: Element): Promise<void> {
  fireEvent.pointerOver(element);

  await settled();
}

/**
 * Moves a pointer off an element, and waits for whatever that started to finish.
 *
 * @remarks
 *   A pointer that leaves is dispatched as `pointerout` with no element it moved to, which React
 *   reads as the pointer leaving the document. Every handler set with `onPointerLeave` above the
 *   element runs for it, the way `hovered` runs every `onPointerEnter`.
 * @param element - The element the pointer leaves.
 * @returns Nothing. The caller reads the screen.
 */
export async function unhovered(element: Element): Promise<void> {
  fireEvent.pointerOut(element);

  await settled();
}

/**
 * Tells whether a throw said what it was expected to.
 */
function matches(thrown: unknown, expected: RegExp | string): boolean {
  const said = thrown instanceof Error ? thrown.message : String(thrown);

  return typeof expected === "string" ? said.includes(expected) : expected.test(said);
}

/**
 * Draws one part on its own and reports what it did.
 */
function unrooted(
  name: string,
  Part: ComponentType<never>,
  expected: RegExp | string,
): readonly string[] {
  try {
    render(createElement(Part));
  } catch (error) {
    return matches(error, expected)
      ? []
      : [`${name} throws ${String(error)}, which is not what it says`];
  }

  return [`${name} draws outside the root it needs above it`];
}

/**
 * Reports every part that draws without the root that holds it together.
 *
 * @remarks
 *   A part reads its machine through a context the root provides, so one drawn on its own has no
 *   api. Answering nothing there draws a part with no behaviour and no complaint, and the fault
 *   surfaces somewhere else entirely, so each part is expected to throw where it was written.
 * @param parts - Each part, against the name a violation calls it.
 * @param expected - The words the throw is expected to carry, in full or as a pattern.
 * @returns One violation per part that drew, or threw something else, or an empty array.
 */
export function rootedViolations(
  parts: Readonly<Record<string, ComponentType<never>>>,
  expected: RegExp | string,
): readonly string[] {
  return Object.entries(parts).flatMap(([name, Part]) => unrooted(name, Part, expected));
}
