import { describe, expect, it } from "vitest";

import { propped, sampled, written } from "#scenes/written.ts";

const EXAMPLE = [
  "export function Removable(props: Tag.RootProps): ReactElement {",
  "  return (",
  "    <Tag.Root {...props}>",
  '      <Tag.Label>{t("words.payouts")}</Tag.Label>',
  "    </Tag.Root>",
  "  );",
  "}",
].join("\n");

describe("written", () => {
  it("writes every prop of the first cell as an attribute", () => {
    expect(written({ name: "Button" }, { status: "info", variant: "solid" })).toBe(
      '<Button status="info" variant="solid" />',
    );
  });

  it("writes a self-closing tag when the snippet has no children", () => {
    expect(written({ name: "Divider" }, { orientation: "vertical" })).toBe(
      '<Divider orientation="vertical" />',
    );
  });

  it("indents the children one level inside the tag", () => {
    const snippet = { children: "<Card.Title>Invoice</Card.Title>", name: "Card.Root" };

    expect(written(snippet, { variant: "elevated" })).toBe(
      '<Card.Root variant="elevated">\n  <Card.Title>Invoice</Card.Title>\n</Card.Root>',
    );
  });

  it("keeps the relative indentation of multi-line children", () => {
    const children = "<Card.Header>\n  <Card.Title>Invoice</Card.Title>\n</Card.Header>";

    expect(written({ children, name: "Card.Root" }, { variant: "elevated" })).toContain(
      "  <Card.Header>\n    <Card.Title>Invoice</Card.Title>\n  </Card.Header>",
    );
  });

  it("writes the imports above the tag with a blank line between", () => {
    const snippet = {
      imports: 'import { Button } from "@stealthscale/component-actions";',
      name: "Button",
    };

    expect(written(snippet, { variant: "solid" })).toBe(
      'import { Button } from "@stealthscale/component-actions";\n\n<Button variant="solid" />',
    );
  });

  it("does not indent a blank line inside the children", () => {
    const children = "<Card.Header />\n\n<Card.Footer />";

    expect(written({ children, name: "Card.Root" }, { variant: "solid" })).toContain(
      "  <Card.Header />\n\n  <Card.Footer />",
    );
  });

  it("writes a true prop as a bare attribute", () => {
    expect(written({ name: "Card.Root" }, { divided: true })).toBe("<Card.Root divided />");
  });

  it("writes a false prop in braces", () => {
    expect(written({ name: "Card.Root" }, { divided: false })).toBe(
      "<Card.Root divided={false} />",
    );
  });

  it("omits an undefined prop", () => {
    expect(written({ name: "Button" }, { size: undefined, variant: "solid" })).toBe(
      '<Button variant="solid" />',
    );
  });

  it("returns undefined when there is no snippet", () => {
    expect(written(undefined, { variant: "solid" })).toBeUndefined();
  });

  it("returns undefined when no prop is set", () => {
    expect(written({ name: "Button" }, {})).toBeUndefined();
  });
});

describe("propped", () => {
  it("replaces the props spread with the attributes of the first cell", () => {
    expect(propped(EXAMPLE, { palette: "primary", variant: "solid" })).toContain(
      '<Tag.Root palette="primary" variant="solid">',
    );
  });

  it("removes the props parameter from the component signature", () => {
    expect(propped(EXAMPLE, { palette: "primary" })).toContain(
      "export function Removable(): ReactElement {",
    );
  });

  it("replaces every props spread in the example", () => {
    const twice = "function A(props: P) {\n  return [<B {...props} />, <C {...props} />];\n}";

    expect(propped(twice, { size: "sm" })).toBe(
      'function A() {\n  return [<B size="sm" />, <C size="sm" />];\n}',
    );
  });

  it("removes a props parameter that the formatter wrapped onto several lines", () => {
    const wrapped = 'function A(\n  props: Omit<P, "x">,\n): R {\n  return <B {...props} />;\n}';

    expect(propped(wrapped, { size: "sm" })).toBe(
      'function A(): R {\n  return <B size="sm" />;\n}',
    );
  });

  it("removes the spread when no prop is set", () => {
    expect(propped(EXAMPLE, {})).toContain("<Tag.Root>");
  });

  it("writes the props of a spread on its own line at the indent of the spread", () => {
    const own =
      "function A(props: P) {\n  return (\n    <B\n      value={1}\n      {...props}\n    />\n  );\n}";

    expect(propped(own, { size: "sm" })).toContain('      value={1}\n      size="sm"\n    />');
  });

  it("removes the line of a spread on its own line when no prop is set", () => {
    const own =
      "function A(props: P) {\n  return (\n    <B\n      value={1}\n      {...props}\n    />\n  );\n}";

    expect(propped(own, {})).toContain("      value={1}\n    />");
  });

  it("returns the example unchanged when it has no props spread", () => {
    const plain = "export function Marks(): ReactElement {\n  return <Tag.Root />;\n}";

    expect(propped(plain, { size: "sm" })).toBe(plain);
  });
});

describe("sampled", () => {
  it("writes the source from the source export of the example module", () => {
    expect(sampled({ source: EXAMPLE }, { size: "sm" })).toContain('<Tag.Root size="sm">');
  });

  it("returns undefined when the example module has no string source export", () => {
    expect(sampled({ Removable: EXAMPLE }, { size: "sm" })).toBeUndefined();
  });

  it("returns undefined when there is no example module", () => {
    expect(sampled(undefined, { size: "sm" })).toBeUndefined();
  });
});
