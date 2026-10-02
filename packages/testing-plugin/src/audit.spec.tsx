import { describe, expect, it, vi } from "vitest";

import { audited, messageOf } from "#audit.tsx";
import { NOTES } from "#manifest.fixtures.ts";
import { FlagProbe } from "#probes.fixtures.tsx";
import { SHOP } from "#shop-manifest.fixtures.ts";
import { shopContract, STOCK } from "#shop.fixtures.ts";

describe("audited", () => {
  it("lists no fault for a page that renders without a broken rule", async () => {
    await expect(
      audited({ options: SHOP, route: { to: shopContract.routes.cart } }),
    ).resolves.toStrictEqual([]);
  });

  it("lists a page whose render threw", async () => {
    await expect(
      audited({ options: SHOP, route: { to: shopContract.routes.crash } }),
    ).resolves.toContain("route:shop/crash failed to render: crashed");
  });

  it("lists each rule axe found broken", async () => {
    const faults = await audited({ options: SHOP, route: { to: shopContract.routes.blind } });

    expect(faults.some((fault) => fault.startsWith("image-alt: "))).toBe(true);
  });

  it("lists a route whose data failed to load", async () => {
    const options = {
      ...SHOP,
      samples: {
        [STOCK.id]: {
          respond: (): never => {
            throw new Error("out of stock");
          },
        },
      },
    };
    const faults = await audited({ options, route: { to: shopContract.routes.stock } });

    expect(faults.some((fault) => fault.endsWith(" failed to load: out of stock"))).toBe(true);
  });

  it("lists a route whose condition stopped its load", async () => {
    const faults = await audited({ options: SHOP, route: { to: shopContract.routes.hidden } });

    expect(faults).toContain("/hidden ended its load pending");
  });

  it("lists no fault for a report other than a failed render", async () => {
    const warn = vi.spyOn(console, "warn");

    await expect(audited({ options: NOTES, ui: <FlagProbe /> })).resolves.toStrictEqual([]);
    expect(warn.mock.calls.map(([line]) => String(line))).toContain("[host] flag-exposed");
  });

  it("renders the element after the frame where the options state no route", async () => {
    await expect(audited({ options: SHOP, ui: <p>element</p> })).resolves.toStrictEqual([]);
  });

  it("returns the message of an error", () => {
    expect(messageOf(new Error("failed"))).toBe("failed");
  });

  it("returns a thrown value that is not an error as text", () => {
    expect(messageOf(404)).toBe("404");
  });
});
