import { describe, expect, it } from "vitest";

import { entryOf } from "#stores/reports.fixtures.ts";
import { createReportStore, KEPT } from "#stores/reports.ts";

describe("createReportStore", () => {
  it("keeps the entries it is given in order", () => {
    const store = createReportStore();

    store.add(entryOf(1));
    store.add(entryOf(2));

    expect(store.get()).toStrictEqual([entryOf(1), entryOf(2)]);
  });

  it("keeps the last 100 entries", () => {
    const store = createReportStore();

    for (let index = 0; index <= KEPT; index += 1) store.add(entryOf(index));

    expect([store.get().length, store.get()[0]]).toStrictEqual([KEPT, entryOf(1)]);
  });
});
