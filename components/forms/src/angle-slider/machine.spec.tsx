import { type ReactElement } from "react";

import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { focused } from "#angle-slider/angle-slider.fixtures.tsx";
import {
  type AngleSliderOptions,
  ApiProvider,
  splitAngleSliderProps,
  useAngleSlider,
  useAngleSliderMachine,
} from "#angle-slider/machine.ts";

/**
 * Renders the thumb through the hook a part reads.
 *
 * @returns The thumb.
 */
function Knob(): ReactElement {
  const api = useAngleSlider();

  return (
    <div {...api.getRootProps()}>
      <div {...api.getControlProps()}>
        <div {...api.getThumbProps()} aria-label="Rotation" />
      </div>
    </div>
  );
}

/**
 * Runs the machine with the options the case sets, renders the thumb bare and a button that sends
 * the machine a step up.
 *
 * @param props - The machine options.
 * @returns The thumb, the IDs as text and the button.
 */
function Running(props: AngleSliderOptions): ReactElement {
  const { api, labelId, send, thumbId } = useAngleSliderMachine(props);

  return (
    <ApiProvider value={api}>
      <span data-testid="ids">{`${labelId} ${thumbId}`}</span>
      <Knob />
      <button
        onClick={() => {
          send({ step: 5, type: "THUMB.ARROW_INC" });
        }}
        type="button"
      >
        Step
      </button>
    </ApiProvider>
  );
}

describe("machine", () => {
  it("returns the machine's options first from splitAngleSliderProps", () => {
    const [options] = splitAngleSliderProps({ className: "mine", defaultValue: 45 });

    expect(options).toStrictEqual({ defaultValue: 45 });
  });

  it("returns the element's props second from splitAngleSliderProps", () => {
    const [, rest] = splitAngleSliderProps({ className: "mine", defaultValue: 45 });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("leaves the names out of both halves", () => {
    const split = splitAngleSliderProps({
      "aria-label": "Rotation",
      "aria-labelledby": "rotation-label",
      defaultValue: 45,
    });

    expect(split).toStrictEqual([{ defaultValue: 45 }, {}]);
  });

  it("derives the label's and the thumb's IDs from the id passed", async () => {
    await drawn(<Running id="rotation" />);

    expect(screen.getByTestId("ids").textContent).toBe(
      "angle-slider:rotation:label angle-slider:rotation:thumb",
    );
  });

  it("keeps the label and thumb IDs the caller passes in ids", async () => {
    await drawn(<Running ids={{ label: "own-label", thumb: "own-thumb" }} />);

    expect(screen.getByTestId("ids").textContent).toBe("own-label own-thumb");
  });

  it("gives the thumb the ID the machine reports", async () => {
    await drawn(<Running id="rotation" />);

    expect(screen.getByRole("slider").id).toBe("angle-slider:rotation:thumb");
  });

  it("steps the value by the event send passes while the thumb has focus", async () => {
    await drawn(<Running defaultValue={45} />);
    await focused(screen.getByRole("slider"));
    fireEvent.click(screen.getByRole("button"));
    await settled();

    expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("50");
  });
});
