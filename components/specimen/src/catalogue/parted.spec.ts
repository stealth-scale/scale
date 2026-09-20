import { describe, expect, it } from "vitest";

import { componentOf, parted, shortOf } from "#catalogue/parted.ts";
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
  it("writes a part as the page and the part together", () => {
    expect(componentOf("Menu", "ItemGroupLabelProps")).toBe("Menu.ItemGroupLabel");
  });

  it("writes a part named after the page as the page alone", () => {
    expect(componentOf("Button", "ButtonProps")).toBe("Button");
  });

  it("writes a part named Props alone as the page alone", () => {
    expect(componentOf("Button", "Props")).toBe("Button");
  });

  it("leaves a part whose name is not an interface of props as it is", () => {
    expect(componentOf("Menu", "Anatomy")).toBe("Menu.Anatomy");
  });
});

describe("parted", () => {
  it("names the component each part's props belong to", () => {
    expect(parted(ANATOMY, "Button").map((one) => one.component)).toStrictEqual(["Button"]);
  });

  it("returns one entry per part the page holds", () => {
    expect(parted(ANATOMY, "Button").map((one) => one.name)).toStrictEqual(["ButtonProps"]);
  });

  it("sorts the parts by name", () => {
    const two: Anatomy = { ...ANATOMY, parts: { ButtonProps: [], Zebra: [] } };

    expect(parted(two, "Button").map((one) => one.name)).toStrictEqual(["ButtonProps", "Zebra"]);
  });

  it("groups a prop a recipe declares as a variant", () => {
    expect(parted(ANATOMY, "Button")[0]?.variants.map((row) => row.prop.name)).toStrictEqual([
      "size",
    ]);
  });

  it("groups a prop the component declares as an option", () => {
    expect(parted(ANATOMY, "Button")[0]?.options.map((row) => row.prop.name)).toStrictEqual([
      "aria-label",
    ]);
  });

  it("shows the members of a type a prop refers to", () => {
    expect(parted(ANATOMY, "Button")[0]?.variants[0]?.shows).toStrictEqual([
      { members: SCALE, name: "kit.Scale" },
    ]);
  });

  it("shows nothing for a prop that refers to no named type", () => {
    expect(parted(ANATOMY, "Button")[0]?.options[0]?.shows).toStrictEqual([]);
  });

  it("shows nothing for a type the reader named but declined to list", () => {
    const named: Anatomy = { ...ANATOMY, shapes: {} };

    expect(parted(named, "Button")[0]?.variants[0]?.shows).toStrictEqual([
      { members: [], name: "kit.Scale" },
    ]);
  });

  it("carries the counts of what no table draws", () => {
    expect(parted(ANATOMY, "Button")[0]?.dropped).toStrictEqual({ conditions: 284, foreign: 1051 });
  });

  it("reports no drops for a part the reader recorded none against", () => {
    const quiet: Anatomy = { ...ANATOMY, dropped: {} };

    expect(parted(quiet, "Button")[0]?.dropped).toStrictEqual({ conditions: 0, foreign: 0 });
  });

  it("keeps a part the reader found no prop for", () => {
    const empty: Anatomy = { dropped: {}, parts: { GhostProps: [] }, shapes: {} };

    expect(parted(empty, "Button")).toHaveLength(1);
  });

  it("returns nothing for a page with no part", () => {
    expect(parted({ dropped: {}, parts: {}, shapes: {} }, "Button")).toStrictEqual([]);
  });
});

describe("shortOf", () => {
  it("reads the name off a key the package qualifies", () => {
    expect(shortOf("kit.Scale")).toBe("Scale");
  });

  it("reads a key with no package as the whole of it", () => {
    expect(shortOf("Scale")).toBe("Scale");
  });
});
