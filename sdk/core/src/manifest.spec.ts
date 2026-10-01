import { describe, expect, expectTypeOf, it } from "vitest";

import { timeOffContract } from "#define.fixtures.ts";
import {
  counted,
  DECLARATION,
  delegated,
  invoiced,
  lazy,
  overview,
  requested,
} from "#manifest.fixtures.ts";
import { API_RANGE, definePlugin, type PluginManifest } from "#manifest.ts";
import pkg from "#package.json" with { type: "json" };
import { compatible } from "#version.ts";

const WITHOUT_REQUEST = { ...DECLARATION, routes: { overview: DECLARATION.routes.overview } };

const WITH_EXTRA = {
  ...DECLARATION,
  routes: { ...DECLARATION.routes, extra: lazy({ overview }) },
};

const WRONG_PROPS = { ...DECLARATION, extensions: { balance: { component: lazy({ invoiced }) } } };

const PAGE_WITH_PROPS = {
  ...DECLARATION,
  routes: { ...DECLARATION.routes, overview: lazy({ requested }) },
};

const WRONG_ARGUMENTS = {
  ...DECLARATION,
  commands: { ...DECLARATION.commands, approve: { run: lazy({ counted }) } },
};

const WITHOUT_SETTINGS = {
  commands: DECLARATION.commands,
  extensions: DECLARATION.extensions,
  routes: DECLARATION.routes,
};

describe("definePlugin", () => {
  it("returns the contract it was given", () => {
    expect(definePlugin(timeOffContract, DECLARATION).contract).toBe(timeOffContract);
  });

  it("keeps the code by kind and name", () => {
    expect(definePlugin(timeOffContract, DECLARATION).code).toBe(DECLARATION);
  });

  it("states the API range this package implements", () => {
    const manifest = definePlugin(timeOffContract, DECLARATION);

    expect(manifest.apiVersion).toBe(API_RANGE);

    expectTypeOf(manifest).toEqualTypeOf<PluginManifest<typeof timeOffContract>>();
  });

  it("admits the package's own version in the API range", () => {
    expect(compatible(API_RANGE, pkg.version)).toBe(true);
  });

  it("fixes the major and the minor in the API range", () => {
    expect(API_RANGE).toMatch(/^\^\d+\.\d+\.0$/u);
  });

  it("types a command's needs as functions that run them", () => {
    const manifest = definePlugin(timeOffContract, {
      ...DECLARATION,
      commands: {
        ...DECLARATION.commands,
        approve: { needs: { request: timeOffContract.commands.request }, run: lazy({ delegated }) },
      },
    });

    expect(manifest.code.commands?.["approve"]?.needs).toStrictEqual({
      request: timeOffContract.commands.request,
    });
  });

  it("refuses a declaration without a declared route", () => {
    // @ts-expect-error -- the contract declares the route `request`, which has no entry.
    const manifest = definePlugin(timeOffContract, WITHOUT_REQUEST);

    expect(manifest.code.routes).toStrictEqual(WITHOUT_REQUEST.routes);
  });

  it("refuses an entry for a name the contract does not declare", () => {
    // @ts-expect-error -- the contract declares no route `extra`.
    const manifest = definePlugin(timeOffContract, WITH_EXTRA);

    expect(manifest.code.routes).toStrictEqual(WITH_EXTRA.routes);
  });

  it("refuses an extension component whose props its target does not render", () => {
    // @ts-expect-error -- the slot renders its extensions with a request id and a target id alone.
    const manifest = definePlugin(timeOffContract, WRONG_PROPS);

    expect(manifest.code.extensions).toStrictEqual(WRONG_PROPS.extensions);
  });

  it("refuses a page component that takes props", () => {
    // @ts-expect-error -- a routed component takes no props.
    const manifest = definePlugin(timeOffContract, PAGE_WITH_PROPS);

    expect(manifest.code.routes).toStrictEqual(PAGE_WITH_PROPS.routes);
  });

  it("refuses a command function whose arguments differ from its marker's", () => {
    // @ts-expect-error -- the command takes a request id, not a count.
    const manifest = definePlugin(timeOffContract, WRONG_ARGUMENTS);

    expect(manifest.code.commands).toStrictEqual(WRONG_ARGUMENTS.commands);
  });

  it("requires a component for a settings section without a schema", () => {
    // @ts-expect-error -- the section `reminders` states no schema, so it renders a component.
    const manifest = definePlugin(timeOffContract, WITHOUT_SETTINGS);

    expect(manifest.code.settings).toBeUndefined();
  });
});
