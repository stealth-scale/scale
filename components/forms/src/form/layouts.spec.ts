import { describe, expect, it } from "vitest";

import { Cell } from "#form/cell.tsx";
import { Errors } from "#form/errors.tsx";
import { Group } from "#form/group.tsx";
import { Item } from "#form/item.tsx";
import { layouts } from "#form/layouts.ts";
import { Step } from "#form/step.tsx";

describe("layouts", () => {
  it("lists the five layouts a generated form renders with", () => {
    expect(layouts).toStrictEqual({ Cell, Errors, Group, Item, Step });
  });
});
