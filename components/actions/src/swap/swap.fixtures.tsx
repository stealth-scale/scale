/**
 * Fixtures for the swap specs: a swap with both marks, a button that turns it over, and readers for
 * each mark.
 */

import { type ReactElement, useState } from "react";

import { act, screen } from "@testing-library/react";

import { Indicator, Root, type RootProps } from "#swap/index.ts";

/**
 * Renders a swap whose `on` mark reads "Moon" and whose `off` mark reads "Sun".
 *
 * @param props - The props the case sets on the root.
 * @returns The swap.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Indicator type="on">Moon</Indicator>
      <Indicator type="off">Sun</Indicator>
    </Root>
  );
}

/**
 * Renders a button named "Dark" that turns the swap over on each press.
 *
 * @param props - The props the case sets on the root, but `swap`, which the button sets.
 * @returns The button around the swap.
 */
export function toggled(props: Omit<RootProps, "swap"> = {}): ReactElement {
  return <Toggle {...props} />;
}

/**
 * Renders the button and the swap for `toggled`.
 *
 * @param props - The props the case sets on the root.
 * @returns The button.
 */
// eslint-disable-next-line react/only-export-components -- a fixture renders the component through `toggled`
function Toggle(props: Omit<RootProps, "swap">): ReactElement {
  const [swap, setSwap] = useState(false);

  return (
    <button
      aria-label="Dark"
      aria-pressed={swap}
      onClick={() => {
        setSwap((was) => !was);
      }}
      type="button"
    >
      {composed({ ...props, swap })}
    </button>
  );
}

/**
 * Returns the mark with the text, hidden or not.
 *
 * @param text - "Moon" for the `on` mark, "Sun" for the `off` mark.
 */
export function mark(text: "Moon" | "Sun"): HTMLElement {
  return screen.getByText(text);
}

/**
 * Waits inside `act` for the next animation frame, in which a leaving mark's presence reads its
 * exit animation.
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
