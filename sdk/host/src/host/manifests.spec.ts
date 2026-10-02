import { describe, expect, it } from "vitest";

import { withCode, withComponentSections, withoutManifest } from "#host/host.fixtures.ts";
import { validateManifests } from "#host/manifests.ts";
import { billing, lazy, page, PRODUCT, run, timeOff } from "#host/product.fixtures.ts";

describe("validateManifests", () => {
  it("accepts a product whose manifests map every declared name", () => {
    expect(() => {
      validateManifests(PRODUCT);
    }).not.toThrow();
  });

  it("leaves out the host's own routes", () => {
    const routes = [{ data: [], id: "host/settings", loads: [], path: "settings", plugin: "host" }];

    expect(() => {
      validateManifests({ ...PRODUCT, routes });
    }).not.toThrow();
  });

  it("throws naming a route whose code is missing", () => {
    const product = withCode(PRODUCT, "time-off", {
      ...timeOff.code,
      routes: { request: lazy({ page }) },
    });

    expect(() => {
      validateManifests(product);
    }).toThrow("No manifest maps the route time-off/overview to code.");
  });

  it("throws naming an extension whose code is missing", () => {
    const product = withCode(PRODUCT, "billing", { routes: billing.code.routes });

    expect(() => {
      validateManifests(product);
    }).toThrow("No manifest maps the extension billing/total to code.");
  });

  it("throws naming a command whose code is missing", () => {
    const product = withCode(PRODUCT, "time-off", {
      ...timeOff.code,
      commands: { approve: { run: lazy({ run }) }, pick: { run: lazy({ run }) } },
    });

    expect(() => {
      validateManifests(product);
    }).toThrow("No manifest maps the command time-off/request to code.");
  });

  it("throws naming a settings section whose component is missing", () => {
    expect(() => {
      validateManifests(withComponentSections(PRODUCT));
    }).toThrow("No manifest maps the settings section time-off/reminders to code.");
  });

  it("accepts a settings section whose component a manifest maps", () => {
    const product = withCode(withComponentSections(PRODUCT), "time-off", {
      ...timeOff.code,
      settings: { reminders: { component: lazy({ page }) } },
    });

    expect(() => {
      validateManifests(product);
    }).not.toThrow();
  });

  it("names every declaration of a plugin without a manifest in one message", () => {
    expect(() => {
      validateManifests(withoutManifest(PRODUCT, "billing"));
    }).toThrow(
      "No manifest maps the route billing/invoices to code. No manifest maps the extension billing/total to code.",
    );
  });
});
