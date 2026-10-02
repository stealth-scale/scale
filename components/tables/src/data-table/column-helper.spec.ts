import { describe, expect, it } from "vitest";

import { createColumnHelper } from "#data-table/column-helper.ts";

describe("createColumnHelper", () => {
  it("returns an accessor column keyed by the field it reads", () => {
    const column = createColumnHelper<{ readonly amount: number }>();

    expect(column.accessor("amount", { header: "Amount" })).toMatchObject({
      accessorKey: "amount",
      header: "Amount",
    });
  });

  it("returns a display column with the id it is given", () => {
    const column = createColumnHelper<{ readonly amount: number }>();

    expect(column.display({ id: "actions" })).toStrictEqual({ id: "actions" });
  });
});
