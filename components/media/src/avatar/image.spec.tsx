import { act, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { named, PICTURE, pictured } from "#avatar/avatar.fixtures.tsx";
import { Image } from "#avatar/image.tsx";

/**
 * Fires the picture's load event and settles the machine.
 */
async function loaded(container: HTMLElement): Promise<void> {
  await act(async () => {
    fireEvent.load(slotElement(container, "avatar", "image"));
    await Promise.resolve();
  });
}

describe("Image", () => {
  it("renders an IMG for the image slot", async () => {
    const { container } = await drawn(pictured());

    expect(slotElement(container, "avatar", "image").tagName).toBe("IMG");
  });

  it("hides the picture until it loads", async () => {
    const { container } = await drawn(pictured());

    expect(slotElement(container, "avatar", "image").hidden).toBe(true);
  });

  it("shows the picture once it loads", async () => {
    const { container } = await drawn(pictured());

    await loaded(container);

    expect(slotElement(container, "avatar", "image").hidden).toBe(false);
  });

  it("sets an empty alt by default", async () => {
    const { container } = await drawn(pictured());

    expect(slotElement(container, "avatar", "image").getAttribute("alt")).toBe("");
  });

  it("keeps the alt the caller passes", async () => {
    const { container } = await drawn(named(<Image alt="Ada at the offsite" src={PICTURE} />));

    expect(slotElement(container, "avatar", "image").getAttribute("alt")).toBe(
      "Ada at the offsite",
    );
  });

  it("calls the caller's onLoad", async () => {
    const onLoad = vi.fn<() => void>();
    const { container } = await drawn(named(<Image onLoad={onLoad} src={PICTURE} />));

    await loaded(container);

    expect(onLoad).toHaveBeenCalledOnce();
  });
});
