import { type ReactElement } from "react";

import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Label } from "#progress/label.tsx";
import { LABEL, labelled } from "#progress/progress.fixtures.tsx";
import { Range } from "#progress/range.tsx";
import { Root } from "#progress/root.tsx";
import { Track } from "#progress/track.tsx";

/**
 * Renders a bar whose label renders only while `shown` is true.
 */
function Toggled({ shown }: { readonly shown: boolean }): ReactElement {
  return (
    <Root value={62}>
      {shown ? <Label>{LABEL}</Label> : null}
      <Track aria-label="Payouts">
        <Range />
      </Track>
    </Root>
  );
}

describe("Label", () => {
  it("renders a SPAN for the label slot", async () => {
    const { container } = await drawn(labelled());

    expect(slotElement(container, "progress", "label").tagName).toBe("SPAN");
  });

  it("names the progress bar", async () => {
    await drawn(labelled());

    expect(screen.getByRole("progressbar", { name: LABEL })).toBeDefined();
  });

  it("stops naming the progress bar once it unmounts", async () => {
    const { rerender } = await drawn(<Toggled shown />);

    await act(async () => {
      rerender(<Toggled shown={false} />);
      await Promise.resolve();
    });

    expect(screen.getByRole("progressbar").getAttribute("aria-labelledby")).toBeNull();
  });
});
