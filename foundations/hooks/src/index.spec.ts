import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("exports the public runtime names and no others", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "createRequiredContext",
      "omitUndefined",
      "speakable",
      "splitEnumerable",
      "useAnnounce",
      "useCallbackRef",
      "useCoarsePointer",
      "useConst",
      "useControllableState",
      "useIsOverflowing",
      "useLiveRef",
      "useMatrixCrosshair",
      "useMediaQuery",
      "useSafeLayoutEffect",
      "useStickyOffsets",
    ]);
  });
});
