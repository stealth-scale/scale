import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { Page } from "@stealthscale/component-screen";
import { ViewportProvider } from "@stealthscale/provider-viewport";
import { drawn } from "@stealthscale/testing-react";
import {
  recipeClasses,
  slotClasses,
  slotElement,
  slotVariantClass,
  variantClass,
} from "@stealthscale/testing-theme";

import { SceneSection } from "#catalogue/page-scene.tsx";
import { type Scene } from "#page.ts";
import { PHONE } from "#stage/width.ts";

function marked(): ReactElement {
  return <span>drawn</span>;
}

const SIZES: Scene = { about: "Every `size`.", draw: marked, title: "Sizes" };

function sectioned(scene: Scene = SIZES, namespace = ""): ReactElement {
  return (
    <Page.Root>
      <Page.Body>
        <SceneSection id="sizes" namespace={namespace} scene={scene} />
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

  it("draws the scene on a stage the width of the card's content while the window decides", async () => {
    const { container, getByText } = await drawn(sectioned());
    const stage = container.querySelector("[data-recipe=stage]");

    expect(stage?.contains(getByText("drawn"))).toBe(true);
    expect(recipeClasses(container, "stage")).toStrictEqual(["stage"]);
  });

  it("holds the stage to the width the viewport states", async () => {
    const { container } = await drawn(
      <ViewportProvider width={PHONE.min}>{sectioned()}</ViewportProvider>,
    );

    expect(recipeClasses(container, "stage")).toContain(variantClass("stage", "width", "phone"));
  });

  it("draws a bled scene inset while the stage is held to a width the card is wider than", async () => {
    const bled: Scene = { draw: marked, frame: "bleed", title: "Sizes" };
    const { container, getByText } = await drawn(
      <ViewportProvider width={PHONE.min}>{sectioned(bled)}</ViewportProvider>,
    );

    expect(slotElement(container, "card", "content").contains(getByText("drawn"))).toBe(true);
    expect(container.querySelector(".card__media")).toBeNull();
  });
});
