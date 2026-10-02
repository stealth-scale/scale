import { describe, expect, it } from "vitest";

import { hostContract } from "@stealthscale/sdk-core";

import { caseNamed } from "#checks.fixtures.ts";
import { renderCases, targetPropsOf } from "#renders.tsx";
import { EMPTY, SHOP } from "#shop-manifest.fixtures.ts";
import { shopContract } from "#shop.fixtures.ts";

const CASES = renderCases(SHOP);

describe("renderCases", () => {
  it("lists the route cases before the extension cases", () => {
    expect(CASES.map(({ name }) => name)).toStrictEqual([
      "route shop/blind renders at its sample",
      "route shop/cart renders at its sample",
      "route shop/cart's fallback renders at its sample",
      "route shop/crash renders at its sample",
      "route shop/hidden renders at its sample",
      "route shop/stock renders at its sample",
      "extension shop/badge renders with its target's props",
      "extension shop/banner renders with its target's props",
      "extension shop/banner's fallback renders with its target's props",
      "extension shop/broken renders with its target's props",
      "extension shop/linked renders with its target's props",
      "extension shop/wrapper renders with its target's props",
      "command shop/checkout runs with its sample",
      "command shop/decline runs with its sample",
      "command shop/refund runs with its sample",
    ]);
  });

  it("passes a route that renders at its sample", async () => {
    await expect(
      caseNamed(CASES, "route shop/cart renders at its sample").run(),
    ).resolves.toBeUndefined();
  });

  it("passes a route's fallback that renders at its sample", async () => {
    const found = caseNamed(CASES, "route shop/cart's fallback renders at its sample");

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("passes a route whose condition is true only for a signed-out person", async () => {
    const found = caseNamed(CASES, "route shop/hidden renders at its sample");

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails a route whose page throws", async () => {
    await expect(caseNamed(CASES, "route shop/crash renders at its sample").run()).rejects.toThrow(
      "route:shop/crash failed to render: crashed",
    );
  });

  it("passes an extension that renders with its slot's sample props", async () => {
    const found = caseNamed(CASES, "extension shop/banner renders with its target's props");

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("passes an extension's fallback that renders with its slot's sample props", async () => {
    const found = caseNamed(
      CASES,
      "extension shop/banner's fallback renders with its target's props",
    );

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails an extension whose component throws", async () => {
    const found = caseNamed(CASES, "extension shop/broken renders with its target's props");

    await expect(found.run()).rejects.toThrow("extension shop/broken failed to render: broken");
  });

  it("passes an extension that wraps another with content", async () => {
    const found = caseNamed(CASES, "extension shop/wrapper renders with its target's props");

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails an extension the manifest maps no code to", async () => {
    const found = caseNamed(
      renderCases({ ...SHOP, manifest: EMPTY }),
      "extension shop/banner renders with its target's props",
    );

    await expect(found.run()).rejects.toThrow("extension shop/banner has no component to render.");
  });

  it("passes a command that resolves with its sample", async () => {
    const found = caseNamed(CASES, "command shop/refund runs with its sample");

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("passes a command whose condition is true only for a signed-out person", async () => {
    const found = caseNamed(CASES, "command shop/checkout runs with its sample");

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails a command whose run rejects", async () => {
    const found = caseNamed(CASES, "command shop/decline runs with its sample");

    await expect(found.run()).rejects.toThrow("declined");
  });

  it("gives an extension of a slot the slot's sample with its id", () => {
    expect(targetPropsOf(shopContract.slots.aisle, "after")).toStrictEqual({
      aisle: "fruit",
      targetId: "shop/aisle",
    });
  });

  it("gives an extension of a slot without a sample the slot's id alone", () => {
    expect(targetPropsOf(shopContract.slots.unused, "before")).toStrictEqual({
      targetId: "shop/unused",
    });
  });

  it("gives an extension of a route the route's id", () => {
    expect(targetPropsOf(shopContract.routes.cart, "before")).toStrictEqual({
      routeId: "shop/cart",
      targetId: "shop/cart",
    });
  });

  it("gives a wrapping extension of every route content to wrap", () => {
    expect(targetPropsOf({ every: "route" }, "wrap")).toStrictEqual({
      children: "Wrapped content",
      targetId: "every:route",
    });
  });

  it("gives an extension of a host region the region's id", () => {
    expect(targetPropsOf(hostContract.slots.status, "after")).toStrictEqual({
      targetId: "host/status",
    });
  });
});
