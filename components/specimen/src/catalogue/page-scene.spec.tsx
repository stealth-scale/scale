import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { Page } from "@stealthscale/component-screen";
import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { SceneSection } from "#catalogue/page-scene.tsx";
import { type Scene } from "#page.ts";

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

  it("resolves the scene's words through the namespace named", async () => {
    const keyed = { about: "rail.ungrouped", draw: marked, title: "rail.label" };
    const { getByRole, getByText } = await drawn(sectioned(keyed, "specimen"));

    expect(getByRole("heading", { level: 2 }).textContent).toBe("Components");
    expect(getByText("Other")).toBeDefined();
  });
});
