import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { Page } from "@stealthscale/component-screen";
import { drawn } from "@stealthscale/testing-react";

import { BANDS } from "#catalogue/bands.ts";
import { type Listed } from "#catalogue/page-body.tsx";
import { Sections, type SectionsProps } from "#catalogue/page-sections.tsx";
import { type Part } from "#catalogue/parted.ts";
import { type Scene } from "#page.ts";

/**
 * A scene the rail can list.
 */
const SIZES: Scene = { draw: () => null, title: "Sizes" };

/**
 * The scenes every case lists in the examples band.
 */
const SCENES: readonly Listed[] = [{ id: "sizes", scene: SIZES, title: "Sizes" }];

/**
 * Writes one part under the name a case asks for.
 */
function part(name: string): Part {
  return {
    component: `Kit.${name}`,
    dropped: { conditions: 0, foreign: 0 },
    name,
    options: [],
    variants: [],
  };
}

/**
 * Draws the rail in the page it belongs to.
 */
function railed(over: Partial<SectionsProps> = {}): ReactElement {
  return (
    <Page.Root>
      <Sections band={BANDS.examples} parts={undefined} scenes={SCENES} {...over} />
    </Page.Root>
  );
}

describe("Sections", () => {
  it("lists the scenes while the examples are open", async () => {
    const { getByRole } = await drawn(railed());

    expect(getByRole("link", { name: "Sizes" })).toBeDefined();
  });

  it("lists the parts while the props are open", async () => {
    const { getByRole } = await drawn(railed({ band: BANDS.props, parts: [part("ButtonProps")] }));

    expect(getByRole("link", { name: "Kit.ButtonProps" })).toBeDefined();
  });

  it("draws nothing while the props are still being read", async () => {
    const { queryByRole } = await drawn(railed({ band: BANDS.props }));

    expect(queryByRole("navigation")).toBeNull();
  });

  it("draws nothing for a band with no sections at all", async () => {
    const { queryByRole } = await drawn(railed({ scenes: [] }));

    expect(queryByRole("navigation")).toBeNull();
  });
});
