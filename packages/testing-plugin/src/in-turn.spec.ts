import { describe, expect, it, vi } from "vitest";

import { inTurn } from "#in-turn.ts";

function stopped(): Promise<void> {
  return Promise.reject(new Error("stopped"));
}

describe("inTurn", () => {
  it("runs each step once the step before it settled", async () => {
    const order: string[] = [];

    await inTurn([
      async (): Promise<void> => {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 20);
        });
        order.push("first");
      },
      (): Promise<void> => {
        order.push("second");

        return Promise.resolve();
      },
    ]);

    expect(order).toStrictEqual(["first", "second"]);
  });

  it("runs no step after a step that rejects", async () => {
    const later = vi.fn<() => Promise<void>>(() => Promise.resolve());

    await expect(inTurn([stopped, later])).rejects.toThrow("stopped");
    expect(later).not.toHaveBeenCalled();
  });
});
