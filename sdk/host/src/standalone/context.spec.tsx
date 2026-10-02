import { type ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { standaloneSources } from "#standalone.ts";
import { StandaloneContext, type StandaloneState, useStandalone } from "#standalone/context.ts";
import { operationModes } from "#standalone/data.ts";
import { WORKBENCH } from "#standalone/workbench.fixtures.tsx";

const SOURCES = standaloneSources(WORKBENCH);

const STATE: StandaloneState = {
  access: SOURCES.access,
  flags: [],
  glyphs: {},
  modes: operationModes(),
  routes: new Map(),
  session: SOURCES.session,
};

function provided({ children }: { readonly children?: ReactNode }): ReactNode {
  return <StandaloneContext value={STATE}>{children}</StandaloneContext>;
}

describe("useStandalone", () => {
  it("returns the standalone page's state", () => {
    expect(renderHook(() => useStandalone(), { wrapper: provided }).result.current).toBe(STATE);
  });

  it("throws outside the standalone page", () => {
    expect(() => renderHook(() => useStandalone())).toThrow(
      "The development panel renders inside the standalone page alone.",
    );
  });
});
