import { describe, expect, it } from "vitest";

import { RECENT, TRANSFERS, transfersOf } from "#data-table/examples/transfers.ts";

describe("transfers", () => {
  it("returns as many transfers as the count asks for", () => {
    expect(transfersOf(7, 100)).toHaveLength(7);
  });

  it("counts the references down from the newest", () => {
    expect(transfersOf(3, 100).map((transfer) => transfer.reference)).toStrictEqual([
      "TR-100",
      "TR-99",
      "TR-98",
    ]);
  });

  it("pays the accounts in turn", () => {
    expect(transfersOf(6, 100).map((transfer) => transfer.account)).toStrictEqual([
      "bridgewater",
      "halden",
      "perrin",
      "kestrel",
      "linnet",
      "bridgewater",
    ]);
  });

  it("lists 48 transfers with a reference each", () => {
    expect(new Set(TRANSFERS.map((transfer) => transfer.reference)).size).toBe(48);
  });

  it("lists the newest transfer first", () => {
    expect(TRANSFERS[0]?.reference).toBe("TR-1048");
  });

  it("takes every state", () => {
    expect(new Set(TRANSFERS.map((transfer) => transfer.state))).toStrictEqual(
      new Set(["failed", "pending", "settled"]),
    );
  });

  it("lists the twelve newest transfers as the recent ones", () => {
    expect(RECENT.map((transfer) => transfer.reference)).toStrictEqual(
      TRANSFERS.slice(0, 12).map((transfer) => transfer.reference),
    );
  });
});
