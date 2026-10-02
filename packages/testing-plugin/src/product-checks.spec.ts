import { describe, expect, it } from "vitest";

import { standaloneProduct } from "@stealthscale/sdk-host/standalone";

import { caseNamed } from "#checks.fixtures.ts";
import { OFFICE, STORE } from "#desk-manifest.fixtures.ts";
import { PluginFrame } from "#frame.tsx";
import { orphanContract } from "#notes.fixtures.ts";
import { productChecks } from "#product-checks.ts";

const FRAMED = { frame: PluginFrame };

describe("productChecks", () => {
  it("lists the cases of a product in the order the checks are listed", () => {
    expect(productChecks(OFFICE, FRAMED).map(({ name }) => name)).toStrictEqual([
      "the product resolves",
      "route desk/board renders in the frame at its sample",
      "required extension desk/note is placed",
      "required extension desk/pin is placed",
      "the frame mounts the content slot",
    ]);
  });

  it("passes a product that resolves", async () => {
    const found = caseNamed(productChecks(OFFICE, FRAMED), "the product resolves");

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails a product whose plugin needs a plugin that is not installed", async () => {
    const definition = standaloneProduct({ contract: orphanContract });
    const found = caseNamed(productChecks(definition, FRAMED), "the product resolves");

    await expect(found.run()).rejects.toThrow(
      "orphan.requires.0 needs tags, which is not installed",
    );
  });

  it("passes a route that renders in the frame", async () => {
    const found = caseNamed(
      productChecks(OFFICE, FRAMED),
      "route desk/board renders in the frame at its sample",
    );

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("passes a route whose condition is true only for a signed-out person", async () => {
    const found = caseNamed(
      productChecks(STORE, FRAMED),
      "route shop/hidden renders in the frame at its sample",
    );

    await expect(found.run()).resolves.toBeUndefined();
  });

  it("fails a route whose page throws", async () => {
    const found = caseNamed(
      productChecks(STORE, FRAMED),
      "route shop/crash renders in the frame at its sample",
    );

    await expect(found.run()).rejects.toThrow("route:shop/crash failed to render: crashed");
  });
});
