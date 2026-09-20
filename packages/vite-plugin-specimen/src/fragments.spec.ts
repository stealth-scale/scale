import { describe, expect, it } from "vitest";

import { sliced } from "#fragments.ts";

function cut(text: string): Record<string, string> {
  return sliced({ path: "/src/badge/badge.specimen.tsx", text }).fragments;
}

function named(text: string): string[] {
  return sliced({ path: "/src/badge/badge.specimen.tsx", text }).imported;
}

const IMPORTS = [
  'import { type ReactElement } from "react";',
  'import { Matrix, specimen } from "@stealthscale/specimen";',
  'import { Icon } from "@stealthscale/component-typography";',
  'import * as Tooltip from "#tooltip/index.ts";',
  'import { Badge, type BadgeProps } from "#badge/index.ts";',
  'import { Badge as Tag } from "#badge/badge.ts";',
  'import { recipe } from "#badge/recipe.ts";',
  'import type { Named } from "#badge/named.ts";',
  "",
  'export default specimen({ id: "data/badge", scenes: [] });',
  "",
].join("\n");

const SCENE = [
  'import { Matrix, specimen } from "@stealthscale/specimen";',
  'import { Badge } from "#badge/index.ts";',
  'import { Unused } from "#badge/unused.ts";',
  "",
  'const SIZES = ["sm", "md"];',
  "",
  "const SPARE = 1;",
  "",
  "export const sizes = {",
  "  draw: () => <Matrix of={SIZES}>{(size) => <Badge size={size} />}</Matrix>,",
  '  title: "Sizes",',
  "};",
  "",
  'export default specimen({ id: "data/badge", scenes: [sizes] });',
  "",
].join("\n");

describe("fragments", () => {
  it("keys a snippet by the scene's title", () => {
    expect(Object.keys(cut(SCENE))).toStrictEqual(["Sizes"]);
  });

  it("includes the scene's own declaration", () => {
    expect(cut(SCENE)["Sizes"]).toMatch(/export const sizes = \{/u);
  });

  it("includes a declaration the scene references", () => {
    expect(cut(SCENE)["Sizes"]).toMatch(/const SIZES/u);
  });

  it("omits a declaration the scene does not reference", () => {
    expect(cut(SCENE)["Sizes"]).not.toMatch(/SPARE/u);
  });

  it("includes only the specifiers the scene uses", () => {
    expect(cut(SCENE)["Sizes"]).toMatch(/import \{ Matrix \} from "@stealthscale\/specimen";/u);
  });

  it("omits an import the scene uses nothing from", () => {
    expect(cut(SCENE)["Sizes"]).not.toMatch(/Unused/u);
  });

  it("writes the imports before the declarations", () => {
    const snippet = cut(SCENE)["Sizes"] ?? "";

    expect(snippet.indexOf("import")).toBeLessThan(snippet.indexOf("const SIZES"));
  });

  it("includes a scene written inline in the scenes array", () => {
    const held = cut(
      'export default specimen({ id: "a", scenes: [{ draw: () => null, title: "Inline" }] });\n',
    );

    expect(held["Inline"]).toMatch(/draw: \(\) => null/u);
  });

  it("skips a scene whose title is not a string literal", () => {
    const held = cut(
      'const name = "A";\nexport default specimen({ id: "a", scenes: [{ draw: () => null, title: name }] });\n',
    );

    expect(held).toStrictEqual({});
  });

  it("skips an element that names nothing the file declares", () => {
    expect(cut('export default specimen({ id: "a", scenes: [absent] });\n')).toStrictEqual({});
  });

  it("skips an element that is neither a name nor an object", () => {
    expect(cut('export default specimen({ id: "a", scenes: ["Sizes"] });\n')).toStrictEqual({});
  });

  it("returns an empty record when the scenes property is not an array", () => {
    expect(cut('export default specimen({ id: "a", scenes: listed });\n')).toStrictEqual({});
  });

  it("returns an empty record when the page declares no scenes", () => {
    expect(cut('export default specimen({ id: "a" });\n')).toStrictEqual({});
  });

  it("returns an empty record when the file declares no page", () => {
    expect(cut("export const a = 1;\n")).toStrictEqual({});
  });

  it("returns an empty record when the file does not parse", () => {
    expect(cut("export default specimen(")).toStrictEqual({});
  });

  it("follows a declaration the scene reaches through another", () => {
    const held = cut(
      [
        "const DEEP = 1;",
        "const NEAR = DEEP;",
        'export const one = { draw: () => NEAR, title: "One" };',
        'export default specimen({ id: "a", scenes: [one] });',
        "",
      ].join("\n"),
    );

    expect(held["One"]).toMatch(/const DEEP/u);
  });

  it("leaves out a scene a parameter of another scene happens to be named after", () => {
    const held = cut(
      [
        "function Toolbar({ wrap = false, ...rest }) {",
        "  return <Set wrap={wrap} {...rest} />;",
        "}",
        'export const one = { draw: () => <Toolbar />, title: "One" };',
        'export const wrap = { draw: () => <Toolbar wrap />, title: "Two" };',
        'export default specimen({ id: "a", scenes: [one, wrap] });',
        "",
      ].join("\n"),
    );

    expect(held["One"]).toMatch(/export const one/u);
    expect(held["One"]).not.toMatch(/export const wrap/u);
  });

  it("leaves out a scene a rest parameter of another scene is named after", () => {
    const held = cut(
      [
        "function Toolbar(...wrap) {",
        "  return <Set of={wrap} />;",
        "}",
        'export const one = { draw: () => <Toolbar />, title: "One" };',
        'export const wrap = { draw: () => <Set />, title: "Two" };',
        'export default specimen({ id: "a", scenes: [one, wrap] });',
        "",
      ].join("\n"),
    );

    expect(held["One"]).not.toMatch(/export const wrap/u);
  });

  it("leaves out a scene a local variable of another scene is named after", () => {
    const held = cut(
      [
        "function Toolbar() {",
        "  const wrap = true;",
        "  return <Set wrap={wrap} />;",
        "}",
        'export const one = { draw: () => <Toolbar />, title: "One" };',
        'export const wrap = { draw: () => <Set />, title: "Two" };',
        'export default specimen({ id: "a", scenes: [one, wrap] });',
        "",
      ].join("\n"),
    );

    expect(held["One"]).not.toMatch(/export const wrap/u);
  });

  it("leaves out a scene a destructured array entry is named after", () => {
    const held = cut(
      [
        "function Toolbar() {",
        "  const [wrap, , setWrap] = useToggle(false);",
        "  return <Set onSet={setWrap} wrap={wrap} />;",
        "}",
        'export const one = { draw: () => <Toolbar />, title: "One" };',
        'export const wrap = { draw: () => <Set />, title: "Two" };',
        'export default specimen({ id: "a", scenes: [one, wrap] });',
        "",
      ].join("\n"),
    );

    expect(held["One"]).not.toMatch(/export const wrap/u);
  });

  it("keeps a declaration a scene reaches through a name it also binds elsewhere", () => {
    const held = cut(
      [
        'const wrap = "held";',
        "function Toolbar({ wrap = false }) {",
        "  return <Set wrap={wrap} />;",
        "}",
        'export const one = { draw: () => <Toolbar>{wrap}</Toolbar>, title: "One" };',
        'export default specimen({ id: "a", scenes: [one] });',
        "",
      ].join("\n"),
    );

    expect(held["One"]).toMatch(/const wrap = "held"/u);
  });
});

describe("components", () => {
  it("lists a namespace and a component bound from the package's own imports map", () => {
    expect(named(IMPORTS)).toContain("Tooltip");
    expect(named(IMPORTS)).toContain("Badge");
  });

  it("lists a component under the name the file binds it to", () => {
    expect(named(IMPORTS)).toContain("Tag");
  });

  it("omits a binding from another package", () => {
    expect(named(IMPORTS)).not.toContain("Icon");
    expect(named(IMPORTS)).not.toContain("Matrix");
  });

  it("omits a binding that starts with a lowercase letter", () => {
    expect(named(IMPORTS)).not.toContain("recipe");
  });

  it("omits a type specifier", () => {
    expect(named(IMPORTS)).not.toContain("BadgeProps");
  });

  it("omits a type-only declaration", () => {
    expect(named(IMPORTS)).not.toContain("Named");
  });

  it("sorts the names", () => {
    expect(named(`${IMPORTS}\nimport { Badge as Again } from "#badge/badge.ts";\n`)).toStrictEqual([
      "Again",
      "Badge",
      "Tag",
      "Tooltip",
    ]);
  });

  it("returns an empty array when the file does not parse", () => {
    expect(named("import {")).toStrictEqual([]);
  });
});
