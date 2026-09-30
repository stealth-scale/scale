import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { measured, split } from "#splitter/splitter.fixtures.tsx";

describe("Panel", () => {
  it("renders a div with the id the machine derives from the panel's id", async () => {
    measured();
    await drawn(split({ options: { id: "editor" } }));

    expect(screen.getByText("Files").id).toBe("splitter:editor:panel:files");
  });

  it("grows by the panel's share of the root", async () => {
    measured();
    await drawn(split());

    expect(Number(screen.getByText("Files").style.flexGrow)).toBe(30);
  });

  it("takes the minimum size of its panel as its minimum width", async () => {
    measured();
    await drawn(split());

    expect(screen.getByText("Files").style.minWidth).toBe("20%");
  });
});
