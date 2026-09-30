import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  type SliderOptions,
  splitSliderProps,
  useSlider,
  useSliderMachine,
} from "#slider/machine.ts";

/**
 * Renders one thumb through the hook a part reads.
 *
 * @returns The thumb.
 */
function Handle(): ReactElement {
  const api = useSlider();

  return (
    <div {...api.getRootProps()}>
      <div {...api.getControlProps()}>
        <div {...api.getThumbProps({ index: 0 })} aria-label="Volume" />
      </div>
    </div>
  );
}

/**
 * Runs the machine with the options the case sets and renders a thumb bare.
 *
 * @param props - The machine options.
 * @returns The thumb, with the label's ID and the first thumb's ID as text.
 */
function Running(props: SliderOptions): ReactElement {
  const { api, labelId, thumbId } = useSliderMachine(props);

  return (
    <ApiProvider value={api}>
      <span data-testid="ids">{`${labelId} ${thumbId(0)}`}</span>
      <Handle />
    </ApiProvider>
  );
}

describe("machine", () => {
  it("returns the machine's options first from splitSliderProps", () => {
    const [options] = splitSliderProps({ className: "mine", defaultValue: [40] });

    expect(options).toStrictEqual({ defaultValue: [40] });
  });

  it("returns the element's props second from splitSliderProps", () => {
    const [, rest] = splitSliderProps({ className: "mine", defaultValue: [40] });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("leaves the names and the thumb's alignment and size out of both halves", () => {
    const split = splitSliderProps({
      "aria-label": ["Volume"],
      "aria-labelledby": ["volume-label"],
      defaultValue: [40],
      thumbAlignment: "contain",
      thumbSize: { height: 20, width: 20 },
    });

    expect(split).toStrictEqual([{ defaultValue: [40] }, {}]);
  });

  it("derives the label's and the thumb's IDs from the id passed", async () => {
    await drawn(<Running id="volume" />);

    expect(screen.getByTestId("ids").textContent).toBe("slider:volume:label slider:volume:thumb:0");
  });

  it("keeps the label and thumb IDs the caller passes in ids", async () => {
    await drawn(<Running ids={{ label: "own-label", thumb: (index) => `own-${String(index)}` }} />);

    expect(screen.getByTestId("ids").textContent).toBe("own-label own-0");
  });

  it("gives the thumb the ID the machine reports", async () => {
    await drawn(<Running id="volume" />);

    expect(screen.getByRole("slider").id).toBe("slider:volume:thumb:0");
  });

  it("centres a thumb on its value without measuring it", async () => {
    await drawn(<Running defaultValue={[40]} />);

    expect(screen.getByRole("slider").style.visibility).toBe("visible");
  });
});
