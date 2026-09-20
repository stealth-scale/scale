import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { entry } from "#catalogue/mounted.fixtures.tsx";
import { Bands } from "#catalogue/page-bands.tsx";
import { type Anatomy, type Indexed } from "#catalogue/types.ts";

/**
 * What one page's components accept, as the reader hands it over.
 */
const ANATOMY: Anatomy = {
  dropped: {},
  parts: { ButtonProps: [] },
  shapes: {},
};

/**
 * Returns an entry the index holds props for, or one it holds none for.
 */
function indexed(reads = true): Indexed {
  const held = entry("actions/button", "Actions", "Button");

  return reads ? { ...held, props: () => Promise.resolve(ANATOMY) } : held;
}

/**
 * Draws the bands in the page they belong to.
 */
function banded(reads = true): ReactElement {
  return (
    <Bands entry={indexed(reads)} fragments={undefined} scenes={[]}>
      <p>{"The head of the page"}</p>
    </Bands>
  );
}

describe("Bands", () => {
  it("draws the strip that switches between the bands", async () => {
    const { getAllByRole } = await drawn(banded());

    expect(getAllByRole("tab").map((one) => one.textContent)).toStrictEqual(["Examples0", "Props"]);
  });

  it("opens on the examples", async () => {
    const { getByRole } = await drawn(banded());

    expect(getByRole("tab", { name: "Examples 0" }).getAttribute("aria-selected")).toBe("true");
  });

  it("reads no props until their band is opened", async () => {
    const { queryByRole } = await drawn(banded());

    expect(queryByRole("heading", { name: "Button ButtonProps 0" })).toBeNull();
  });

  it("reads the props once their band is opened", async () => {
    const { findByRole, getByRole } = await drawn(banded());

    await pressed(getByRole("tab", { name: "Props" }));

    expect(await findByRole("heading", { name: "Button ButtonProps 0" })).toBeDefined();
  });

  it("goes back to the examples when their tab is pressed again", async () => {
    const { findByRole, getByRole } = await drawn(banded());

    await pressed(getByRole("tab", { name: "Props" }));
    await findByRole("heading", { name: "Button ButtonProps 0" });
    await pressed(getByRole("tab", { name: "Examples 0" }));

    expect(getByRole("tab", { name: "Examples 0" }).getAttribute("aria-selected")).toBe("true");
  });

  it("says so where the index holds no props for the page", async () => {
    const { findByText, getByRole } = await drawn(banded(false));

    await pressed(getByRole("tab", { name: "Props" }));

    expect(await findByText("Nothing was read for this page.")).toBeDefined();
  });
});
