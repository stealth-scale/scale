import { describe, expect, expectTypeOf, it } from "vitest";

import { type ResourceReference } from "#access.ts";
import { type RouteReference } from "#route.ts";
import {
  extension,
  type ExtensionMarker,
  isEvery,
  props,
  slot,
  type SlotMarker,
  type SlotReference,
  targetKeyOf,
} from "#slot.ts";

interface SidebarProps {
  readonly requestId: string;
}

const REQUEST: ResourceReference = { id: "time-off/request", kind: "resource" };

const SIDEBAR: SlotReference<"time-off/request-sidebar", SidebarProps> = {
  id: "time-off/request-sidebar",
  kind: "slot",
};

const OVERVIEW: RouteReference = { id: "time-off/overview", kind: "route" };

describe("slot", () => {
  it("marks a slot that renders without props", () => {
    expect(slot()).toStrictEqual({ kind: "slot" });
  });

  it("marks a slot with its props and its sample", () => {
    const sidebar = slot({ ...props<SidebarProps>(), sample: { requestId: "7" } });

    expect(sidebar).toStrictEqual({ kind: "slot", sample: { requestId: "7" } });

    expectTypeOf(sidebar).toEqualTypeOf<SlotMarker<SidebarProps, false>>();
  });

  it("requires a sample where the props have a required member", () => {
    // @ts-expect-error -- an extension in the slot renders with the sample in its tests.
    const sidebar = slot({ ...props<SidebarProps>() });

    expect(sidebar.sample).toBeUndefined();
  });

  it("marks a keyed slot of one record kind", () => {
    const feed = slot({ arity: "one", keyed: true, record: REQUEST });

    expect(feed).toStrictEqual({ arity: "one", keyed: true, kind: "slot", record: REQUEST });

    expectTypeOf(feed).toEqualTypeOf<SlotMarker<object, true>>();
  });

  it("marks an extension with its target and its position", () => {
    const balance = extension({ order: 10, position: "after", target: SIDEBAR });

    expect(balance).toStrictEqual({
      kind: "extension",
      order: 10,
      position: "after",
      target: SIDEBAR,
    });

    expectTypeOf(balance.target).toEqualTypeOf<typeof SIDEBAR>();
    expectTypeOf(balance.position).toEqualTypeOf<"after">();
  });

  it("marks an extension with the props a decorator renders with", () => {
    const notes = extension({
      ...props<SidebarProps>(),
      position: "before",
      sample: { requestId: "7" },
      target: OVERVIEW,
    });

    expect(notes.sample).toStrictEqual({ requestId: "7" });

    expectTypeOf(notes).toExtend<ExtensionMarker<SidebarProps>>();
  });

  it("wraps every member of a kind", () => {
    expect(extension({ position: "wrap", target: { every: "route" } })).toStrictEqual({
      kind: "extension",
      position: "wrap",
      target: { every: "route" },
    });
  });

  it("refuses a position other than wrap on every member of a kind", () => {
    // @ts-expect-error -- an extension of every member of a kind wraps each member.
    const frame = extension({ position: "after", target: { every: "slot" } });

    expect(frame.position).toBe("after");
  });

  it("returns true for a target that is every member of a kind", () => {
    expect(isEvery({ every: "extension" })).toBe(true);
  });

  it("returns false for a target that is a reference", () => {
    expect(isEvery(SIDEBAR)).toBe(false);
  });

  it("keys a reference by its kind and its id", () => {
    expect(targetKeyOf(SIDEBAR)).toBe("slot:time-off/request-sidebar");
  });

  it("keys every member of a kind by the kind", () => {
    expect(targetKeyOf({ every: "extension" })).toBe("every:extension");
  });

  it("declares the props in the type alone", () => {
    expect(props<SidebarProps>()).toStrictEqual({});
  });
});
