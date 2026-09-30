/**
 * Fixtures for the toggle tip specs: a closed root around a part, an open note around a part, a
 * whole toggle tip, one whose trigger calls a caller's handler, the note inside a render, the wait
 * for an animation frame, and the document's polite live region.
 */

import { type ReactElement, type ReactNode } from "react";

import { act } from "@testing-library/react";

import {
  Arrow,
  ArrowTip,
  Content,
  Positioner,
  Root,
  type RootProps,
  Trigger,
} from "#toggle-tip/index.ts";

/**
 * Renders a part beside the note inside a closed root, for a part on the trigger's side.
 *
 * @param children - The part under test.
 * @returns The root with the part inside it.
 */
export function rooted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Renders a part inside the note of an open root.
 *
 * @remarks
 *   The open machine tracks presses outside the note one frame after it opens, so the fixture
 *   renders the positioner and the content around the part.
 * @param children - The part under test.
 * @returns The root with the part inside its note.
 */
export function opened(children: ReactNode): ReactElement {
  return (
    <Root defaultOpen>
      <Positioner>
        <Content>{children}</Content>
      </Positioner>
    </Root>
  );
}

/**
 * Renders a trigger named by `aria-label` and a note with an arrow and a line of text, with the
 * props the case sets on the root.
 *
 * @param props - The props the case sets on the root.
 * @returns The toggle tip.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger aria-label="About the settlement date">i</Trigger>
      <Positioner>
        <Content>
          <Arrow>
            <ArrowTip />
          </Arrow>
          The day the payout clears.
        </Content>
      </Positioner>
    </Root>
  );
}

/**
 * Renders a toggle tip whose trigger calls a caller's click handler.
 *
 * @param onClick - Called on each press of the trigger.
 * @returns The toggle tip.
 */
export function handled(onClick: () => void): ReactElement {
  return (
    <Root>
      <Trigger aria-label="About the settlement date" onClick={onClick}>
        i
      </Trigger>
      <Positioner>
        <Content>The day the payout clears.</Content>
      </Positioner>
    </Root>
  );
}

/**
 * Returns the note inside a render, or null while the note is out of the document.
 *
 * @param container - The element the case rendered into.
 */
export function note(container: HTMLElement): HTMLElement | null {
  return container.querySelector(".toggle-tip__content");
}

/**
 * Waits for the next animation frame inside `act`, in which the presence reads the closed note's
 * animation and the live region takes its text.
 */
export async function framed(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
    await Promise.resolve();
  });
}

/**
 * Returns the document's polite live region, or null before anything announced.
 */
export function region(): HTMLElement | null {
  return document.querySelector('[role="status"][aria-live="polite"]');
}
