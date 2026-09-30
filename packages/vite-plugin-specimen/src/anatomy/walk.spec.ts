import { Checker } from "typescript/unstable/sync";
import { describe, expect, it, vi } from "vitest";

import { withScratchWorkspaceAsync } from "@stealthscale/testing";

import { compiler } from "#anatomy/compiler.ts";
import { compilingIn, kit } from "#anatomy/kit.fixtures.ts";
import { settled } from "#anatomy/reading.ts";
import { declaringPackage, opening, sure } from "#anatomy/walk.ts";
import { type Anatomy } from "#contract.ts";

function read(): Promise<Anatomy> {
  return withScratchWorkspaceAsync(kit(), async (scratch) => {
    const held = await compiler(
      scratch.root,
      compilingIn(kit(), (relative) => scratch.path(relative)),
    );

    try {
      return held.anatomyOf(scratch.path("src/badge/badge.specimen.tsx"), settled({}));
    } finally {
      held.close();
    }
  });
}

function refersOf(anatomy: Anatomy, name: string): readonly string[] {
  return anatomy.parts["BadgeProps"]?.find((one) => one.name === name)?.refers ?? [];
}

describe("walk", () => {
  it.each([
    { give: "/repo/node_modules/@types/react/index.d.ts", want: "react" },
    {
      give: "/repo/node_modules/.pnpm/@types+react@19/node_modules/@types/react/x.d.ts",
      want: "react",
    },
    { give: "/repo/node_modules/axe-core/axe.d.ts", want: "axe-core" },
    { give: "/repo/components/actions/src/button/recipe.ts", want: "kit" },
  ])("names $give as declared by $want", ({ give, want }) => {
    expect(declaringPackage(give)).toBe(want);
  });

  it("reads a doc comment of one paragraph whole", () => {
    expect(opening("The words it shows.")).toBe("The words it shows.");
  });

  it("reads the opening paragraph of a doc comment of several", () => {
    expect(opening("The words.\n\nA second paragraph.")).toBe("The words.");
  });

  it("joins a wrapped paragraph onto one line", () => {
    expect(opening("The words\nit shows.")).toBe("The words it shows.");
  });

  it("returns the value the compiler returned", () => {
    expect(sure("held", "a type")).toBe("held");
  });

  it("throws naming what was missing when the compiler gave nothing", () => {
    expect(() => {
      sure(undefined, "the type of label");
    }).toThrow(/the type of label/u);
  });

  it("records the named type a handler is called with", async () => {
    expect(refersOf(await read(), "onOpen")).toStrictEqual(["kit.Details"]);
  });

  it("asks for no call signature of a literal or an intrinsic type", async () => {
    const asked = vi.spyOn(Checker.prototype, "getSignaturesOfType");

    await read();

    const types = asked.mock.calls.map(([type]) => type);

    expect(types.length).toBeGreaterThan(0);
    expect(types.some((type) => type.isLiteralType() || type.isIntrinsicType())).toBe(false);
  });

  it("records the named type behind an array", async () => {
    expect(refersOf(await read(), "entries")).toStrictEqual(["kit.Entry"]);
  });

  it("records a union written under a name", async () => {
    expect(refersOf(await read(), "tone")).toStrictEqual(["kit.Tone"]);
  });

  it("records both named types an intersection is made of", async () => {
    expect(refersOf(await read(), "both")).toStrictEqual(["kit.Details", "kit.Entry"]);
  });

  it("records nothing for a type written inline", async () => {
    expect(refersOf(await read(), "inline")).toStrictEqual([]);
  });

  it("records nothing for a union of literals written at the prop", async () => {
    expect(refersOf(await read(), "gap")).toStrictEqual([]);
  });

  it("lists the members of a type a prop refers to", async () => {
    expect((await read()).shapes["kit.Details"]).toStrictEqual([
      { accepts: "boolean", name: "open", says: "Whether it is open now." },
    ]);
  });

  it("lists no private member of a class a prop refers to", async () => {
    expect((await read()).shapes["kit.Stamp"]).toStrictEqual([
      { accepts: "string", name: "at", says: "The time it was made at." },
    ]);
  });

  it("lists the options of a union written under a name", async () => {
    const options = (await read()).shapes["kit.Tone"]?.map((one) => one.name);

    expect(options).toStrictEqual(['"loud"', '"quiet"']);
  });

  it("gives an option of a union no type of its own", async () => {
    expect((await read()).shapes["kit.Tone"]?.every((one) => one.accepts === "")).toBe(true);
  });

  it("names a type with more members than the cap rather than listing it", async () => {
    const held = await read();

    expect(held.shapes).not.toHaveProperty("kit.Sprawling");
  });

  it("still records the name of a type it declined to list", async () => {
    expect(refersOf(await read(), "wide")).toStrictEqual(["kit.Sprawling"]);
  });

  it("lists a type that refers to itself once", async () => {
    expect((await read()).shapes["kit.Branching"]).toHaveLength(1);
  });

  it("follows a chain of types as deep as the reading states", async () => {
    const held = await read();

    expect(Object.keys(held.shapes)).toContain("kit.Deep2");
  });

  it("stops following a chain past the depth the reading states", async () => {
    const held = await read();

    expect(Object.keys(held.shapes)).not.toContain("kit.Deep4");
  });

  it("passes over a type the compiler declares itself", async () => {
    const held = await read();

    expect(Object.keys(held.shapes).some((name) => name.includes("ReadonlyArray"))).toBe(false);
  });
});
