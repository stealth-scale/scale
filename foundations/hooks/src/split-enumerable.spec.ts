import { describe, expect, it, vi } from "vitest";

import { splitEnumerable } from "#split-enumerable.ts";

/**
 * Splits the way a machine's splitter does: every own key, enumerable or not.
 */
function byOwnKeys(props: object): [Record<string, unknown>, Record<string, unknown>] {
  const picked: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const key of Reflect.ownKeys(props)) {
    if (typeof key !== "string") continue;

    (key === "open" ? picked : rest)[key] = Reflect.get(props, key);
  }

  return [picked, rest];
}

describe("splitEnumerable", () => {
  it("splits the enumerable properties the way the wrapped splitter does", () => {
    const split = splitEnumerable(byOwnKeys);

    expect(split({ id: "x", open: true })).toStrictEqual([{ open: true }, { id: "x" }]);
  });

  it("keeps a non-enumerable property from the splitter and from the rest", () => {
    const read = vi.fn(() => "warned");
    const props: { id: string; open: boolean } = { id: "x", open: true };

    Object.defineProperty(props, "key", { configurable: true, get: read });

    const [, rest] = splitEnumerable(byOwnKeys)(props);

    expect(read).not.toHaveBeenCalled();
    expect(rest).toStrictEqual({ id: "x" });
  });
});
