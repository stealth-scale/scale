import { describe, expect, it } from "vitest";

import { DISC, DISC_HUB, DISC_LABEL, DISC_NODE } from "#graph/disc.ts";

describe("disc", () => {
  it("stacks the disc above its name", () => {
    expect(DISC_NODE).toMatchObject({ alignItems: "center", flexDirection: "column" });
  });

  it("sizes the disc by --graph-disc", () => {
    expect(DISC).toMatchObject({ borderRadius: "full", boxSize: "var(--graph-disc)" });
  });

  it("edges a selected disc in the focus ink", () => {
    expect(DISC).toMatchObject({
      ".react-flow__node.selected &": { borderColor: "border.focus" },
    });
  });

  it("edges a selected disc in Highlight under forced colors", () => {
    expect(DISC).toMatchObject({
      ".react-flow__node.selected &": { _highContrast: { borderColor: "Highlight" } },
    });
  });

  it("dashes the edge of a dimmed disc", () => {
    expect(DISC).toMatchObject({ "[data-dimmed] > &": { borderStyle: "dashed" } });
  });

  it("sizes the icon in the disc by the small icon size", () => {
    expect(DISC).toMatchObject({ "& > svg": { boxSize: "icon.sm" } });
  });

  it("puts the hub half a handle below the disc's middle", () => {
    expect(DISC_HUB).toMatchObject({
      blockSize: "0",
      insetBlockStart: "calc(50% + {sizes.2.5} / 2)",
      position: "absolute",
    });
  });

  it("hides the hub and its handles", () => {
    expect(DISC_HUB).toMatchObject({ visibility: "hidden" });
  });

  it("writes the name on one line on a pill in the panel's color", () => {
    expect(DISC_LABEL).toMatchObject({ background: "bg.panel", whiteSpace: "nowrap" });
  });

  it("mutes the name of a dimmed node", () => {
    expect(DISC_LABEL).toMatchObject({
      "[data-dimmed] > &": { color: "fg.muted", fontWeight: "normal" },
    });
  });
});
