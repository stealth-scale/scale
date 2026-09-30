import { act, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { named, pictured } from "#avatar/avatar.fixtures.tsx";
import { Fallback } from "#avatar/fallback.tsx";
import { Root } from "#avatar/root.tsx";

/**
 * Fires an event on the picture and settles the machine.
 */
async function fired(container: HTMLElement, event: "error" | "load"): Promise<void> {
  const image = slotElement(container, "avatar", "image");

  await act(async () => {
    if (event === "load") fireEvent.load(image);
    else fireEvent.error(image);

    await Promise.resolve();
  });
}

describe("Fallback", () => {
  it("renders a SPAN for the fallback slot", async () => {
    const { container } = await drawn(named(<Fallback />));

    expect(slotElement(container, "avatar", "fallback").tagName).toBe("SPAN");
  });

  it("shows the initials of the root's name", async () => {
    const { container } = await drawn(named(<Fallback />));

    expect(slotElement(container, "avatar", "fallback").textContent).toBe("AO");
  });

  it("shows its children over the initials", async () => {
    const { container } = await drawn(named(<Fallback>+3</Fallback>));

    expect(slotElement(container, "avatar", "fallback").textContent).toBe("+3");
  });

  it("shows nothing inside a root without a name", async () => {
    const { container } = await drawn(
      <Root>
        <Fallback />
      </Root>,
    );

    expect(slotElement(container, "avatar", "fallback").textContent).toBe("");
  });

  it("hides once the picture loads", async () => {
    const { container } = await drawn(pictured());

    await fired(container, "load");

    expect(slotElement(container, "avatar", "fallback").hidden).toBe(true);
  });

  it("shows again when the loaded picture fails", async () => {
    const { container } = await drawn(pictured());

    await fired(container, "load");
    await fired(container, "error");

    expect(slotElement(container, "avatar", "fallback").hidden).toBe(false);
  });
});
