import { describe, expect, it } from "vitest";

import { plain, timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { contextOf } from "#resolve/context.ts";
import { future, hosting, misnamed } from "#resolve/identity.fixtures.ts";
import { checkIdentity } from "#resolve/identity.ts";
import { identityContract } from "#resolve/requirements.fixtures.ts";
import { contextFor, faultsOf, productOf } from "#resolve/resolve.fixtures.ts";

describe("checkIdentity", () => {
  it("passes a product of installed plugins with their packages", () => {
    const context = contextFor(productOf([installed(timeOff), installed(plain)]));

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual([]);
  });

  it("refuses a plugin installed twice", () => {
    const context = contextFor(productOf([installed(plain), installed(plain)]));

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual(["plain: is installed twice"]);
  });

  it("refuses the host's plugin id", () => {
    const context = contextFor(productOf([installed(hosting)]));

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual([
      "host: is the host's reserved plugin id",
    ]);
  });

  it("refuses a plugin id that breaks its grammar", () => {
    const context = contextFor(productOf([installed(misnamed)]));

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual([
      "Plain: breaks the grammar of a plugin id",
    ]);
  });

  it("refuses a plugin whose web package the build did not find", () => {
    const context = contextOf(productOf([installed(plain)]), {}, {});

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual([
      "plain: has no web package among the product's dependencies",
    ]);
  });

  it("refuses a plugin id another package publishes a namespace under", () => {
    const namespaces = { plain: ["@acme/components"] };
    const context = contextFor(productOf([installed(plain)]), { namespaces });

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual([
      "plain: is a catalogue namespace that @acme/components publishes",
    ]);
  });

  it("names every package that publishes a namespace under a plugin id", () => {
    const namespaces = { plain: ["@acme/components", "@acme/widgets"] };
    const context = contextFor(productOf([installed(plain)]), { namespaces });

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual([
      "plain: is a catalogue namespace that @acme/components and @acme/widgets publish",
    ]);
  });

  it("passes a plugin id whose namespace no other package publishes", () => {
    const context = contextFor(productOf([installed(plain)]), { namespaces: { plain: [] } });

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual([]);
  });

  it("refuses a manifest whose API range does not admit the installed sdk-core", () => {
    const context = contextFor(productOf([installed(future)]));

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual([
      "plain.apiVersion: does not admit sdk-core 0.1.0",
    ]);
  });

  it("refuses a product id that breaks the grammar of an id", () => {
    const context = contextFor(productOf([], { productId: "People" }));

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual([
      "product.productId: breaks the grammar of an id",
    ]);
  });

  it("refuses an empty product version", () => {
    const context = contextFor(productOf([], { version: "" }));

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual(["product.version: is empty"]);
  });

  it("refuses a sign-in route whose plugin is not installed", () => {
    const signIn = identityContract.routes.signIn;
    const context = contextFor(productOf([installed(plain)], { signIn }));

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual([
      "product.signIn: names the route identity/signIn, whose plugin is not installed",
    ]);
  });

  it("takes a sign-in route of an installed plugin", () => {
    const signIn = timeOff.contract.routes.overview;
    const context = contextFor(productOf([installed(timeOff)], { signIn }));

    expect(faultsOf(checkIdentity, context).problems).toStrictEqual([]);
  });
});
