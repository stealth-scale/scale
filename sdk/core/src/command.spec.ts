import { describe, expect, expectTypeOf, it } from "vitest";

import {
  args,
  command,
  type CommandArgs,
  type CommandArguments,
  type CommandMarker,
  type CommandReference,
  type CommandResult,
  event,
  type EventPayload,
  type EventReference,
  returns,
} from "#command.ts";

interface Approval {
  readonly requestId: string;
}

interface Person {
  readonly id: string;
}

const APPROVAL: Approval = { requestId: "7" };

describe("command", () => {
  it("marks a command that keys run", () => {
    const request = command({ keys: "Mod+Shift+R", label: "commands.request" });

    expect(request).toStrictEqual({
      keys: "Mod+Shift+R",
      kind: "command",
      label: "commands.request",
    });

    expectTypeOf(request).toEqualTypeOf<CommandMarker>();
  });

  it("marks a command with its arguments and its sample", () => {
    const approve = command({ ...args<Approval>(), label: "commands.approve", sample: APPROVAL });

    expect(approve).toStrictEqual({
      arguments: true,
      kind: "command",
      label: "commands.approve",
      sample: APPROVAL,
    });

    expectTypeOf(approve).toEqualTypeOf<CommandMarker<Approval>>();
  });

  it("marks a command that resolves with a result", () => {
    const pick = command({ ...returns<readonly Person[]>(), label: "commands.pick" });

    expect(pick).toStrictEqual({ kind: "command", label: "commands.pick", result: true });

    expectTypeOf(pick).toEqualTypeOf<CommandMarker<void, readonly Person[]>>();
  });

  it("marks a command with arguments that resolves with a result", () => {
    const find = command({
      ...args<Approval>(),
      ...returns<Person>(),
      label: "commands.find",
      sample: APPROVAL,
    });

    expect(find).toStrictEqual({
      arguments: true,
      kind: "command",
      label: "commands.find",
      result: true,
      sample: APPROVAL,
    });

    expectTypeOf(find).toEqualTypeOf<CommandMarker<Approval, Person>>();
  });

  it("refuses keys on a command with arguments", () => {
    // @ts-expect-error -- a key press has no arguments to give.
    const approve = command({ ...args<Approval>(), keys: "A", label: "a", sample: APPROVAL });

    expect(approve.keys).toBe("A");
  });

  it("refuses keys on a command with a result", () => {
    // @ts-expect-error -- a key press has no caller to hand a result to.
    const pick = command({ ...returns<Person>(), keys: "P", label: "p" });

    expect(pick.keys).toBe("P");
  });

  it("requires a sample on a command with arguments", () => {
    // @ts-expect-error -- the command's tests run it with a sample.
    const approve = command({ ...args<Approval>(), label: "a" });

    expect(approve.arguments).toBe(true);
  });

  it("types the arguments a call of a command takes", () => {
    const approve: CommandReference<"time-off/approve", Approval> = {
      id: "time-off/approve",
      kind: "command",
    };

    expect(approve.kind).toBe("command");

    expectTypeOf<CommandArgs<typeof approve>>().toEqualTypeOf<Approval>();
    expectTypeOf<CommandArguments<typeof approve>>().toEqualTypeOf<[args: Approval]>();
  });

  it("takes no arguments for a call of a command without arguments", () => {
    const request: CommandReference<"time-off/request", void> = {
      id: "time-off/request",
      kind: "command",
    };

    expect(request.kind).toBe("command");

    expectTypeOf<CommandArguments<typeof request>>().toEqualTypeOf<[]>();
  });

  it("types the result of a command reference", () => {
    const pick: CommandReference<"identity/pick", void, readonly Person[]> = {
      id: "identity/pick",
      kind: "command",
    };

    expect(pick.kind).toBe("command");

    expectTypeOf<CommandResult<typeof pick>>().toEqualTypeOf<readonly Person[]>();
  });

  it("declares arguments as a flag the build reads", () => {
    expect(args<Approval>()).toStrictEqual({ arguments: true });
  });

  it("declares a result as a flag the build reads", () => {
    expect(returns<Person>()).toStrictEqual({ result: true });
  });

  it("marks an event the owner emits", () => {
    expect(event<Approval>()).toStrictEqual({ kind: "event" });
  });

  it("marks a sticky event anyone emits", () => {
    expect(event({ emit: "anyone", sticky: true })).toStrictEqual({
      emit: "anyone",
      kind: "event",
      sticky: true,
    });
  });

  it("types the payload of an event reference", () => {
    const approved: EventReference<"time-off/approved", Approval> = {
      id: "time-off/approved",
      kind: "event",
    };

    expect(approved.kind).toBe("event");

    expectTypeOf<EventPayload<typeof approved>>().toEqualTypeOf<Approval>();
  });
});
