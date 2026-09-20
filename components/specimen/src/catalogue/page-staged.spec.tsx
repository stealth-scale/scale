import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "@stealthscale/component-surfaces";
import { ViewportProvider } from "@stealthscale/provider-viewport";

import { Staged } from "#catalogue/page-staged.tsx";
import { PHONE } from "#device/devices.ts";
import { type SceneAddress, SceneProvider } from "#device/scene.ts";
import { type Frame } from "#page.ts";

const SCENE: SceneAddress = { page: "actions/button", path: "framed", scene: 0, title: "Sizes" };

/**
 * Draws a scene in a card at a frame, under a device where a width is picked.
 */
function staged(frame: Frame, width?: number): ReactElement {
  return (
    <ViewportProvider width={width}>
      <SceneProvider value={SCENE}>
        <Card.Root>
          <Staged frame={frame}>
            <span>drawn</span>
          </Staged>
        </Card.Root>
      </SceneProvider>
    </ViewportProvider>
  );
}

describe("Staged", () => {
  it("draws an inset scene in the card's content", () => {
    const { container } = render(staged("inset"));

    expect(container.querySelector(".card__content")?.textContent).toBe("drawn");
  });

  it("draws a bled or bared scene in the card's media", () => {
    expect(render(staged("bleed")).container.querySelector(".card__media")?.textContent).toBe(
      "drawn",
    );
    expect(render(staged("bare")).container.querySelector(".card__media")?.textContent).toBe(
      "drawn",
    );
  });

  it("draws a device in the card's content instead of the scene while a reader shows it in one", () => {
    const { container } = render(staged("bleed", PHONE.min));

    expect(container.querySelector(".card__media")).toBeNull();
    expect(container.textContent).not.toContain("drawn");
    expect(
      container.querySelector(".card__content iframe[src='/framed#actions/button/0']"),
    ).not.toBeNull();
  });
});
