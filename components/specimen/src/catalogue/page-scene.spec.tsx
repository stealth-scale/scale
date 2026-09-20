import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { Page } from "@stealthscale/component-screen";
import { ViewportProvider } from "@stealthscale/provider-viewport";
import { drawn } from "@stealthscale/testing-react";
import { slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { SceneSection } from "#catalogue/page-scene.tsx";
import { PHONE } from "#device/devices.ts";
import { useScene } from "#device/scene.ts";
import { type Scene } from "#page.ts";

function marked(): ReactElement {
  return <span>drawn</span>;
}

/**
 * Draws the scene's address as the scene reads it.
 */
function Addressed(): ReactElement {
  return <output>{JSON.stringify(useScene())}</output>;
}

const SIZES: Scene = { about: "Every `size`.", draw: marked, title: "Sizes" };

const ADDRESSED: Scene = { draw: Addressed, title: "Sizes" };

function sectioned(scene: Scene = SIZES, namespace = "", framed?: string): ReactElement {
  return (
    <Page.Root>
      <Page.Body>
        <SceneSection
          framed={framed}
          id="sizes"
          namespace={namespace}
          page="actions/button"
          position={2}
          scene={scene}
        />
      </Page.Body>
    </Page.Root>
  );
}

describe("SceneSection", () => {
  it("draws the scene as a section named by its title", async () => {
    const { getByRole } = await drawn(sectioned());

    expect(getByRole("region", { name: "Sizes" })).toBeDefined();
  });

  it("anchors the section by the id it is given", async () => {
    const { container } = await drawn(sectioned());

    expect(slotElement(container, "section", "root").id).toBe("sizes");
  });

  it("opens with the sentence the scene declares and draws its code spans as code", async () => {
    const { container } = await drawn(sectioned());

    expect(container.querySelector("code")?.textContent).toBe("size");
  });

  it("writes no opening for a scene that declares none", async () => {
    const { container } = await drawn(sectioned({ draw: marked, title: "Sizes" }));

    expect(container.querySelector(".section__description")).toBeNull();
  });

  it("stands the scene's component on a card", async () => {
    const { container, getByText } = await drawn(sectioned());

    expect(slotElement(container, "card", "root").contains(getByText("drawn"))).toBe(true);
  });

  it("leaves the card's own room round a scene that asks for none of it", async () => {
    const { container, getByText } = await drawn(sectioned());

    expect(slotElement(container, "card", "content").contains(getByText("drawn"))).toBe(true);
    expect(container.querySelector(".card__media")).toBeNull();
  });

  it("takes the card's room back for a scene that bleeds", async () => {
    const bled: Scene = { draw: marked, frame: "bleed", title: "Sizes" };
    const { container, getByText } = await drawn(sectioned(bled));

    expect(slotElement(container, "card", "media").contains(getByText("drawn"))).toBe(true);
    expect(container.querySelector(".card__content")).toBeNull();
  });

  it("drops the card's surface for a bared scene", async () => {
    const bare: Scene = { draw: marked, frame: "bare", title: "Sizes" };
    const { container } = await drawn(sectioned(bare));

    expect(slotClasses(container, "card", "root")).toContain(
      slotVariantClass("card", "root", "variant", "plain"),
    );
  });

  it("resolves the scene's words through the namespace named", async () => {
    const keyed = { about: "rail.ungrouped", draw: marked, title: "rail.label" };
    const { getByRole, getByText } = await drawn(sectioned(keyed, "specimen"));

    expect(getByRole("heading", { level: 2 }).textContent).toBe("Components");
    expect(getByText("Other")).toBeDefined();
  });

  it("puts the scene's address in scope for a device to frame", async () => {
    const { container } = await drawn(sectioned(ADDRESSED, "", "framed"));

    expect(container.textContent).toContain(
      '{"page":"actions/button","path":"framed","scene":2,"title":"Sizes"}',
    );
  });

  it("leaves the frame's path out of the address where the application serves none", async () => {
    const { container } = await drawn(sectioned(ADDRESSED));

    expect(container.textContent).toContain('{"page":"actions/button","scene":2,"title":"Sizes"');
  });

  it("draws a device in the card's content instead of a bled scene while a reader shows the scene in one", async () => {
    const bled: Scene = { draw: marked, frame: "bleed", title: "Sizes" };
    const { container, queryByText } = await drawn(
      <ViewportProvider width={PHONE.min}>{sectioned(bled, "", "framed")}</ViewportProvider>,
    );

    expect(slotElement(container, "card", "content").querySelector("iframe")?.title).toBe("Sizes");
    expect(queryByText("drawn")).toBeNull();
    expect(container.querySelector(".card__media")).toBeNull();
  });

  it("keeps a bled scene in the card's media where no framed page is served", async () => {
    const bled: Scene = { draw: marked, frame: "bleed", title: "Sizes" };
    const { container, getByText } = await drawn(
      <ViewportProvider width={PHONE.min}>{sectioned(bled)}</ViewportProvider>,
    );

    expect(slotElement(container, "card", "media").contains(getByText("drawn"))).toBe(true);
  });
});
