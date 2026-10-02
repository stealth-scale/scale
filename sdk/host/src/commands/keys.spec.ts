import { describe, expect, it, vi } from "vitest";

import {
  chordOf,
  pressedKeys,
  refusing,
  REQUEST_KEYS,
  requesting,
  type Run,
  spelledOf,
  worded,
} from "#commands/commands.fixtures.ts";
import { KeysRoot } from "#commands/roots.fixtures.tsx";
import { internalsOf } from "#host/internals.ts";
import { routed } from "#routes/routed.fixtures.tsx";

describe("CommandKeys", () => {
  it("runs the command its keys bind", async () => {
    worded();

    const requested = vi.fn<Run>();

    await routed({ at: "/invoices", host: { product: requesting(requested) }, root: KeysRoot });
    await pressedKeys(REQUEST_KEYS);

    expect(requested).toHaveBeenCalledTimes(1);
  });

  it("runs the first enabled command of a chord two commands bind", async () => {
    worded();

    const { exported, product, requested } = chordOf();

    await routed({ at: "/invoices", host: { product }, root: KeysRoot });
    await pressedKeys(REQUEST_KEYS);

    expect([exported.mock.calls.length, requested.mock.calls.length]).toStrictEqual([0, 1]);
  });

  it("runs one command of a chord two enabled commands spell differently", async () => {
    worded();

    const { exported, product, requested } = spelledOf();

    await routed({ at: "/invoices", host: { product }, root: KeysRoot });
    await pressedKeys(REQUEST_KEYS);

    expect([exported.mock.calls.length, requested.mock.calls.length]).toStrictEqual([1, 0]);
  });

  it("runs no command where no command of the chord is enabled", async () => {
    worded();

    const { exported, product, requested } = chordOf(false);

    await routed({ at: "/invoices", host: { product }, root: KeysRoot });
    await pressedKeys(REQUEST_KEYS);

    expect([exported.mock.calls.length, requested.mock.calls.length]).toStrictEqual([0, 0]);
  });

  it("raises an error toast for a command that rejects", async () => {
    worded();

    const { host } = await routed({
      at: "/invoices",
      host: { product: requesting(refusing()) },
      root: KeysRoot,
    });
    const create = vi.spyOn(internalsOf(host).runtime.toaster, "create");

    await pressedKeys(REQUEST_KEYS);

    expect(create).toHaveBeenCalledExactlyOnceWith({
      title: 'Could not run "Request time off".',
      type: "error",
    });
  });
});
