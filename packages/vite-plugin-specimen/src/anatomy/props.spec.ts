import { describe, expect, it } from "vitest";

import { withScratchWorkspaceAsync } from "@stealthscale/testing";

import { compiler } from "#anatomy/compiler.ts";
import { kit } from "#anatomy/kit.fixtures.ts";
import { settled } from "#anatomy/reading.ts";
import { type Anatomy, type Prop } from "#contract.ts";

function read(specimen = "src/badge/badge.specimen.tsx"): Promise<Anatomy> {
  return withScratchWorkspaceAsync(kit(), async (scratch) => {
    const held = await compiler(scratch.root);

    try {
      return held.anatomyOf(scratch.path(specimen), settled({}));
    } finally {
      held.close();
    }
  });
}

function propOf(anatomy: Anatomy, name: string): Prop {
  const found = anatomy.parts["BadgeProps"]?.find((one) => one.name === name);

  if (found === undefined) throw new Error(`the badge has no prop ${name}`);

  return found;
}

describe("props", () => {
  it("reads the parts a specimen imports from its own package", async () => {
    const held = await read();

    expect(Object.keys(held.parts).toSorted()).toStrictEqual(["BadgeProps", "OtherProps"]);
  });

  it("lists the parts beside the specimen before the ones it borrows", async () => {
    const held = await read();

    expect(Object.keys(held.parts)).toStrictEqual(["BadgeProps", "OtherProps"]);
  });

  it("leaves out a props type no part is named after", async () => {
    const held = await read();

    expect(held.parts).not.toHaveProperty("GhostProps");
  });

  it("leaves out a props type another package declares", async () => {
    const held = await read();

    expect(held.parts).not.toHaveProperty("StyleProps");
  });

  it("reads the props a factory passes as a part named after the factory", async () => {
    const held = await read("src/overlay/overlay.specimen.tsx");

    expect(Object.keys(held.parts)).toStrictEqual(["CreateOverlayProps"]);
  });

  it("reads a part through a module that re-exports it", async () => {
    const held = await read("src/parts.specimen.tsx");

    expect(Object.keys(held.parts)).toStrictEqual(["BadgeProps"]);
  });

  it("calls a property a recipe declares a variant", async () => {
    expect(propOf(await read(), "tone").kind).toBe("variant");
  });

  it("calls a property the component declares an option", async () => {
    expect(propOf(await read(), "label").kind).toBe("option");
  });

  it("calls a property a dependency declares an option", async () => {
    expect(propOf(await read(), "open").kind).toBe("option");
    expect(propOf(await read(), "onOpenChange").says).toBe("Called when it opens or closes.");
  });

  it("calls a property declared by a dependency of a dependency an option", async () => {
    expect(propOf(await read(), "onEscapeKeyDown").kind).toBe("option");
  });

  it("drops a property a peer declares", async () => {
    const held = await read();

    expect(held.parts["BadgeProps"]?.some((one) => one.name === "margin")).toBe(false);
  });

  it("drops a property the compiler's own library declares", async () => {
    const held = await read();

    expect(held.parts["BadgeProps"]?.some((one) => one.name === "stack")).toBe(false);
  });

  it("keeps a variant a style prop shares a name with", async () => {
    expect(propOf(await read(), "gap").kind).toBe("variant");
  });

  it("takes the variant's own type where a style prop shares its name", async () => {
    expect(propOf(await read(), "gap").accepts).toBe('"lg" | "sm"');
  });

  it("counts the properties declared outside the package and its dependencies", async () => {
    expect((await read()).dropped["BadgeProps"]?.foreign).toBe(2);
  });

  it("counts the properties with no declaration at all", async () => {
    expect((await read()).dropped["BadgeProps"]?.conditions).toBe(2);
  });

  it("counts nothing for a part that resolves to its own props alone", async () => {
    expect((await read()).dropped["OtherProps"]).toStrictEqual({ conditions: 0, foreign: 0 });
  });

  it("reads the default a declaration states", async () => {
    expect(propOf(await read(), "label").fallback).toBe('""');
  });

  it("reads no default where the declaration states none", async () => {
    expect(propOf(await read(), "tone").fallback).toBe("");
  });

  it("marks a property a caller has to pass as required", async () => {
    expect(propOf(await read(), "named").required).toBe(true);
  });

  it("marks a property a caller may leave out as optional", async () => {
    expect(propOf(await read(), "label").required).toBe(false);
  });

  it("reads the opening sentence of a declaration's doc comment", async () => {
    expect(propOf(await read(), "label").says).toBe("The words it shows.");
  });

  it("sorts the props of a part by name", async () => {
    const names = (await read()).parts["BadgeProps"]?.map((one) => one.name) ?? [];

    expect(names).toStrictEqual([...names].toSorted());
  });
});
