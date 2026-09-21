import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { Page } from "@stealthscale/component-screen";
import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Body, type Listed } from "#catalogue/page-body.tsx";
import { type Fragments, type Indexed } from "#catalogue/types.ts";

function marked(): ReactElement {
  return <span>drawn</span>;
}

const ENTRY: Indexed = {
  about: "",
  group: "Data",
  id: "data/badge",
  load: () => Promise.resolve({}),
  namespace: "",
  package: "@stealthscale/component-data",
  path: "src/badge.specimen.tsx",
  title: "Badge",
};

const SCENES: readonly Listed[] = [
  { id: "sizes", scene: { draw: marked, title: "Sizes" }, title: "Sizes" },
  { id: "looks", scene: { draw: marked, title: "Looks" }, title: "Looks" },
];

const CUT: Fragments = {
  fragments: { Sizes: "export const sizes = {};" },
  imported: ["Badge"],
};

const UNLOADED: Fragments | undefined = undefined;

const STATED: readonly Listed[] = [
  {
    id: "sizes",
    scene: { draw: marked, source: '<Badge size="sm" />', title: "Sizes" },
    title: "Sizes",
  },
];

function bodied(fragments: Fragments | undefined, scenes = SCENES): ReactElement {
  return (
    <Page.Root>
      <Body entry={ENTRY} fragments={fragments} scenes={scenes} />
    </Page.Root>
  );
}

describe("Body", () => {
  it("opens with the line that imports the page's components", async () => {
    const { container } = await drawn(bodied(CUT));

    expect(slotElement(container, "code-block", "code").textContent).toBe(
      'import { Badge } from "@stealthscale/component-data";',
    );
  });

  it("draws each scene as a section", async () => {
    const { getByRole } = await drawn(bodied(CUT));

    expect(getByRole("region", { name: "Sizes" })).toBeDefined();
    expect(getByRole("region", { name: "Looks" })).toBeDefined();
  });

  it("folds a scene's source under its stage", async () => {
    const { getAllByRole } = await drawn(bodied(CUT));

    expect(getAllByRole("button", { name: "Source" })).toHaveLength(1);
  });

  it("shows the source a scene carries rather than the one the index cut", async () => {
    const { getAllByRole } = await drawn(bodied(UNLOADED, STATED));

    expect(getAllByRole("button", { name: "Source" })).toHaveLength(1);
  });

  it("says the index cut no source for a scene it has none for", async () => {
    const { getAllByText } = await drawn(bodied(CUT));

    expect(getAllByText("No source for this scene")).toHaveLength(1);
  });

  it("draws neither the import line nor a source until the fragments have loaded", async () => {
    const { container, queryByRole, queryByText } = await drawn(bodied(UNLOADED));

    expect(container.querySelector(".code-block__root")).toBeNull();
    expect(queryByRole("button", { name: "Source" })).toBeNull();
    expect(queryByText("No source for this scene")).toBeNull();
  });
});
