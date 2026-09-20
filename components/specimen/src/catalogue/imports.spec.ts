import { describe, expect, it } from "vitest";

import { importOf } from "#catalogue/imports.ts";

describe("importOf", () => {
  it("writes one statement importing the names from the package", () => {
    expect(importOf(["Button", "IconButton"], "@stealthscale/component-actions")).toBe(
      'import { Button, IconButton } from "@stealthscale/component-actions";',
    );
  });

  it("keeps the names in the order given", () => {
    expect(importOf(["Root", "Item"], "@acme/kit")).toBe('import { Root, Item } from "@acme/kit";');
  });
});
