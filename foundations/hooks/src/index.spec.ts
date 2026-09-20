import { describe, expect, it } from "vitest";

import * as barrel from "#index.ts";

describe("index", () => {
  it("names everything the package publishes and nothing beside it", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "createRequiredContext",
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
