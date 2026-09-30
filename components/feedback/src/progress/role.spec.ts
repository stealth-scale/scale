import { use } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RoleContext } from "#progress/role.ts";

describe("RoleContext", () => {
  it("returns progressbar outside a meter's root", () => {
    const { result } = renderHook(() => use(RoleContext));

    expect(result.current).toBe("progressbar");
  });
});
