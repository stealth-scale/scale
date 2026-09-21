import { describe, expect, it } from "vitest";

import { written } from "#scenes/written.ts";

describe("written", () => {
  it("writes every prop the cell is drawn with", () => {
    expect(written({ name: "Button" }, { status: "info", variant: "solid" })).toBe(
      '<Button status="info" variant="solid" />',
    );
  });

  it("closes a component that takes no children on its own tag", () => {
    expect(written({ name: "Divider" }, { orientation: "vertical" })).toBe(
      '<Divider orientation="vertical" />',
    );
  });

  it("writes the children on their own lines one step in", () => {
    const snippet = { children: "<Card.Title>Invoice</Card.Title>", name: "Card.Root" };

    expect(written(snippet, { variant: "elevated" })).toBe(
      '<Card.Root variant="elevated">\n  <Card.Title>Invoice</Card.Title>\n</Card.Root>',
    );
  });

  it("keeps the shape of children already written across several lines", () => {
    const children = "<Card.Header>\n  <Card.Title>Invoice</Card.Title>\n</Card.Header>";

    expect(written({ children, name: "Card.Root" }, { variant: "elevated" })).toContain(
      "  <Card.Header>\n    <Card.Title>Invoice</Card.Title>\n  </Card.Header>",
    );
  });

  it("puts the import the page states above the block", () => {
    const snippet = {
      imports: 'import { Button } from "@stealthscale/component-actions";',
      name: "Button",
    };

    expect(written(snippet, { variant: "solid" })).toBe(
      'import { Button } from "@stealthscale/component-actions";\n\n<Button variant="solid" />',
    );
  });

  it("leaves a blank line inside the children blank rather than indenting nothing", () => {
    const children = "<Card.Header />\n\n<Card.Footer />";

    expect(written({ children, name: "Card.Root" }, { variant: "solid" })).toContain(
      "  <Card.Header />\n\n  <Card.Footer />",
    );
  });

  it("writes a switch that is on as the bare prop a reader writes", () => {
    expect(written({ name: "Card.Root" }, { divided: true })).toBe("<Card.Root divided />");
  });

  it("writes a switch that is off in braces rather than leaving it off the line", () => {
    expect(written({ name: "Card.Root" }, { divided: false })).toBe(
      "<Card.Root divided={false} />",
    );
  });

  it("leaves out a prop the cell was handed nothing for", () => {
    expect(written({ name: "Button" }, { size: undefined, variant: "solid" })).toBe(
      '<Button variant="solid" />',
    );
  });

  it("writes nothing where the page states no snippet", () => {
    expect(written(undefined, { variant: "solid" })).toBeUndefined();
  });

  it("writes nothing for a cell drawn with no props at all", () => {
    expect(written({ name: "Button" }, {})).toBeUndefined();
  });
});
