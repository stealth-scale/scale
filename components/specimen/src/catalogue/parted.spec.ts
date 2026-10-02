import { describe, expect, it } from "vitest";

import { componentOf, namespaceOf, parted, shortOf } from "#catalogue/parted.ts";
import { type Anatomy, type Prop } from "#catalogue/types.ts";

function prop(name: string, kind: Prop["kind"], refers: string[] = []): Prop {
  return {
    accepts: "string",
    fallback: "",
    kind,
    name,
    refers,
    required: false,
    says: "",
  };
}

const SCALE = [{ accepts: "", name: '"sm"', says: "" }];

const ANATOMY: Anatomy = {
  dropped: { ButtonProps: { conditions: 284, foreign: 1051 } },
  parts: {
    ButtonProps: [prop("size", "variant", ["kit.Scale"]), prop("aria-label", "option")],
  },
  shapes: { "kit.Scale": SCALE },
};

describe("componentOf", () => {
  it("writes a namespaced part as the namespace and the part", () => {
    expect(componentOf("Menu", "ItemGroupLabelProps")).toBe("Menu.ItemGroupLabel");
  });

  it("writes a part named after the namespace as the namespace", () => {
    expect(componentOf("Button", "ButtonProps")).toBe("Button");
  });

  it("writes a part named Props as the namespace", () => {
    expect(componentOf("Button", "Props")).toBe("Button");
  });

  it("keeps a part name without the Props suffix", () => {
    expect(componentOf("Menu", "Anatomy")).toBe("Menu.Anatomy");
  });

  it("writes a part that contains the namespace as a standalone component", () => {
    expect(componentOf("ColorSwatch", "ColorSwatchMixProps")).toBe("ColorSwatchMix");
  });

  it("writes a part that ends with the namespace as a standalone component", () => {
    expect(componentOf("Button", "IconButtonProps")).toBe("IconButton");
  });
});

describe("namespaceOf", () => {
  it("converts the last segment of a page ID to Pascal case", () => {
    expect(namespaceOf("components/data/color-swatch")).toBe("ColorSwatch");
  });

  it("capitalises a single-word ID", () => {
    expect(namespaceOf("tag")).toBe("Tag");
  });
});

describe("parted", () => {
  it("returns the component name of each part", () => {
    expect(parted(ANATOMY, "Button").map((one) => one.component)).toStrictEqual(["Button"]);
  });

  it("returns one entry per part", () => {
    expect(parted(ANATOMY, "Button").map((one) => one.name)).toStrictEqual(["ButtonProps"]);
  });

  it("sorts the parts by name", () => {
    const two: Anatomy = { ...ANATOMY, parts: { ButtonProps: [], Zebra: [] } };

    expect(parted(two, "Button").map((one) => one.name)).toStrictEqual(["ButtonProps", "Zebra"]);
  });

  it("groups a variant prop under variants", () => {
    expect(parted(ANATOMY, "Button")[0]?.variants.map((row) => row.prop.name)).toStrictEqual([
      "size",
    ]);
  });

  it("groups an option prop under options", () => {
    expect(parted(ANATOMY, "Button")[0]?.options.map((row) => row.prop.name)).toStrictEqual([
      "aria-label",
    ]);
  });

  it("returns the members of each type a prop refers to", () => {
    expect(parted(ANATOMY, "Button")[0]?.variants[0]?.shows).toStrictEqual([
      { members: SCALE, name: "kit.Scale" },
    ]);
  });

  it("returns no shown types for a prop without named types", () => {
    expect(parted(ANATOMY, "Button")[0]?.options[0]?.shows).toStrictEqual([]);
  });

  it("returns no members for a type the reader did not list", () => {
    const named: Anatomy = { ...ANATOMY, shapes: {} };

    expect(parted(named, "Button")[0]?.variants[0]?.shows).toStrictEqual([
      { members: [], name: "kit.Scale" },
    ]);
  });

  it("returns the drop counts of each part", () => {
    expect(parted(ANATOMY, "Button")[0]?.dropped).toStrictEqual({ conditions: 284, foreign: 1051 });
  });

  it("returns zero drop counts for a part without recorded drops", () => {
    const quiet: Anatomy = { ...ANATOMY, dropped: {} };

    expect(parted(quiet, "Button")[0]?.dropped).toStrictEqual({ conditions: 0, foreign: 0 });
  });

  it("keeps a part without props", () => {
    const empty: Anatomy = { dropped: {}, parts: { GhostProps: [] }, shapes: {} };

    expect(parted(empty, "Button")).toHaveLength(1);
  });

  it("returns an empty array for a page without parts", () => {
    expect(parted({ dropped: {}, parts: {}, shapes: {} }, "Button")).toStrictEqual([]);
  });
});

describe("shortOf", () => {
  it("returns the name from a package-qualified key", () => {
    expect(shortOf("kit.Scale")).toBe("Scale");
  });

  it("returns a key without a package unchanged", () => {
    expect(shortOf("Scale")).toBe("Scale");
  });
});
