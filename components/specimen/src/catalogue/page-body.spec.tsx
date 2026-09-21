import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { Page } from "@stealthscale/component-screen";
import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Body, type Listed } from "#catalogue/page-body.tsx";
import { type Indexed } from "#catalogue/types.ts";

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

const STATEMENT = 'import { Badge } from "@stealthscale/component-data";';

const SCENES: readonly Listed[] = [
  {
    id: "sizes",
    scene: { draw: marked, source: '<Badge size="sm" />', title: "Sizes" },
    title: "Sizes",
  },
  { id: "looks", scene: { draw: marked, title: "Looks" }, title: "Looks" },
];

function bodied(imports?: string): ReactElement {
  return (
    <Page.Root>
      <Body entry={ENTRY} imports={imports} scenes={SCENES} />
    </Page.Root>
  );
}

describe("Body", () => {
  it("opens with the statement the page declares", async () => {
    const { container } = await drawn(bodied(STATEMENT));

    expect(slotElement(container, "code-block", "code").textContent).toBe(STATEMENT);
  });

  it("draws each scene as a section", async () => {
    const { getByRole } = await drawn(bodied(STATEMENT));

    expect(getByRole("region", { name: "Sizes" })).toBeDefined();
    expect(getByRole("region", { name: "Looks" })).toBeDefined();
  });

  it("folds the source a scene carries under its stage", async () => {
    const { getAllByRole } = await drawn(bodied(STATEMENT));

    expect(getAllByRole("button", { name: "Source" })).toHaveLength(1);
  });

  it("says a scene carrying no source has none", async () => {
    const { getAllByText } = await drawn(bodied(STATEMENT));

    expect(getAllByText("No source for this scene")).toHaveLength(1);
  });

  it("draws no import line for a page that declares no statement", async () => {
    const { container } = await drawn(bodied());

    expect(container.querySelector(".code-block__root")).toBeNull();
  });
});
