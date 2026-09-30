/**
 * Fixtures for the hover card specs: a closed root around a part, an open panel around a part, a
 * whole card, a card two triggers share, and the waits for the machine's delays and the exit.
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
} from "#hover-card/index.ts";

/**
 * Renders a part beside the panel inside a closed root, for a part on the trigger's side.
 *
 * @param children - The part under test.
 * @returns The root with the part inside it.
 */
export function rooted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

/**
 * Renders a part inside the panel of an open root.
 *
 * @remarks
 *   The open machine tracks presses outside the content one frame after it opens, so the fixture
 *   renders the positioner and the content around the part.
 * @param children - The part under test.
 * @returns The root with the part inside its panel.
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
 * Renders a link and its panel with an arrow and a line of text, with the props the case sets on
 * the root.
 *
 * @param props - The props the case sets on the root.
 * @returns The hover card.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger href="#ada">Ada Lovelace</Trigger>
      <Positioner>
        <Content>
          <Arrow>
            <ArrowTip />
          </Arrow>
          Wrote the first published program.
        </Content>
      </Positioner>
    </Root>
  );
}

/**
 * Renders two links with values that share one panel, with the props the case sets on the root.
 *
 * @param props - The props the case sets on the root.
 * @returns The hover card.
 */
export function shared(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Trigger href="#ada" value="ada">
        Ada Lovelace
      </Trigger>
      <Trigger href="#grace" value="grace">
        Grace Hopper
      </Trigger>
      <Positioner>
        <Content>Profile</Content>
      </Positioner>
    </Root>
  );
}

/**
 * Waits inside `act` for a delay the machine started before it to run out.
 *
 * @remarks
 *   The machine sends each event in a microtask and starts a delay's timer in the transition, after
 *   a timer of the same length that the case started. The wait runs 20ms by default, past a delay
 *   of zero.
 * @param ms - The time to wait, longer than the machine's delay.
 */
export async function elapsed(ms = 20): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

/**
 * Waits for the next animation frame inside `act`, in which the presence reads the closed panel's
 * animation and the dismissable layer registers the open panel.
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
