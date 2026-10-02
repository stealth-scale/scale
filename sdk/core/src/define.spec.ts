import { describe, expect, expectTypeOf, it } from "vitest";

import { type CommandArgs, type CommandResult, type EventPayload } from "#command.ts";
import { type AnyContract } from "#contract.ts";
import { type MutationVariables, type QueryData } from "#data.ts";
import {
  type Approval,
  type Request,
  type SidebarProps,
  timeOffContract,
} from "#define.fixtures.ts";
import { defineContract } from "#define.ts";
import { type FlagReference } from "#flag.ts";
import { HOST } from "#identifiers.ts";
import { type MenuReference, type RouteReference } from "#route.ts";
import { type SlotReference } from "#slot.ts";

describe("defineContract", () => {
  it("builds a reference per declared name", () => {
    expect(timeOffContract.routes.overview).toStrictEqual({
      id: "time-off/overview",
      kind: "route",
      navigation: { label: "navigation.overview", menu: { id: "time-off/reports", kind: "menu" } },
      path: "time-off",
      version: "0.4.0",
    });
  });

  it("keeps every member the marker states", () => {
    expect(timeOffContract.commands.approve).toStrictEqual({
      arguments: true,
      id: "time-off/approve",
      kind: "command",
      label: "commands.approve",
      sample: { requestId: "7" },
      version: "0.4.0",
      when: { permission: { id: "time-off/request.approve", kind: "permission" } },
    });
  });

  it("qualifies each menu the definition lists", () => {
    expect(timeOffContract.menus.reports).toStrictEqual({
      id: "time-off/reports",
      kind: "menu",
      version: "0.4.0",
    });
  });

  it("builds references to the settings sections", () => {
    expect(timeOffContract.settings.sections.reminders).toStrictEqual({
      id: "time-off/reminders",
      kind: "settingsSection",
      label: "settings.reminders",
      target: { id: "time-off/time-off", kind: "settingsPage" },
      version: "0.4.0",
    });
  });

  it("keeps the plugin id", () => {
    expect(timeOffContract.pluginId).toBe("time-off");
  });

  it("keeps the configuration schema", () => {
    expect(timeOffContract.config.properties.approvers.default).toBe(1);
  });

  it("lists no requirements where the definition states none", () => {
    expect(timeOffContract.requires).toStrictEqual([]);
  });

  it("types a route reference by the parameters its path names", () => {
    expect(timeOffContract.routes.request.path).toBe("$id");

    expectTypeOf(timeOffContract.routes.request).toExtend<
      RouteReference<"time-off/request", { readonly id: string }>
    >();
  });

  it("types a command reference by its arguments", () => {
    expect(timeOffContract.commands.approve.arguments).toBe(true);

    expectTypeOf<CommandArgs<typeof timeOffContract.commands.approve>>().toEqualTypeOf<Approval>();
  });

  it("types the result of a command that spreads no returns as void", () => {
    expect(timeOffContract.commands.request.keys).toBe("Mod+Shift+R");

    expectTypeOf<CommandResult<typeof timeOffContract.commands.approve>>().toEqualTypeOf<void>();
  });

  it("types the payload of an event without a type argument as void", () => {
    expect(timeOffContract.events.refreshed.kind).toBe("event");

    expectTypeOf<EventPayload<typeof timeOffContract.events.refreshed>>().toEqualTypeOf<void>();
  });

  it("types a query reference by its operation's data", () => {
    expect(timeOffContract.queries.request.kind).toBe("query");

    expectTypeOf<QueryData<typeof timeOffContract.queries.request>>().toEqualTypeOf<Request>();
  });

  it("types a mutation reference by its operation's variables", () => {
    expect(timeOffContract.mutations.approve.kind).toBe("mutation");

    expectTypeOf<
      MutationVariables<typeof timeOffContract.mutations.approve>
    >().toEqualTypeOf<Approval>();
  });

  it("types a flag reference by its value", () => {
    expect(timeOffContract.featureFlags.calendar.flagKind).toBe("release");

    expectTypeOf(timeOffContract.featureFlags.calendar).toExtend<
      FlagReference<boolean, "time-off/calendar">
    >();
  });

  it("types a slot reference by its props", () => {
    expect(timeOffContract.slots["request-sidebar"].sample).toStrictEqual({ requestId: "7" });

    expectTypeOf(timeOffContract.slots["request-sidebar"]).toExtend<
      SlotReference<"time-off/request-sidebar", SidebarProps>
    >();
  });

  it("types a menu reference by its qualified id", () => {
    expect(timeOffContract.menus.reports.kind).toBe("menu");

    expectTypeOf(timeOffContract.menus.reports).toEqualTypeOf<MenuReference<"time-off/reports">>();
  });

  it("returns a contract that a reader of any contract takes", () => {
    expect(timeOffContract.extensions.balance.target).toStrictEqual({
      id: "time-off/request-sidebar",
      kind: "slot",
    });

    expectTypeOf(timeOffContract).toExtend<AnyContract>();
  });

  it("throws for the host's plugin id", () => {
    expect(() => defineContract(HOST, {})).toThrow(
      'The plugin id "host" is reserved for the host\'s own contract.',
    );
  });
});
