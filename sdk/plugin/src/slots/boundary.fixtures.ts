import { createElement, type FunctionComponent, Suspense } from "react";

import { render } from "@testing-library/react";
import { vi } from "vitest";

import { Boundary, type BoundaryProps } from "#slots/boundary.ts";

export function propsOf(resetKey: unknown): BoundaryProps {
  return {
    fallback: "fallback",
    onError: vi.fn<(error: unknown) => void>(),
    onRendered: vi.fn<() => void>(),
    resetKey,
  };
}

export function caught(component: FunctionComponent<object>): (error: unknown) => void {
  const onError = vi.fn<(error: unknown) => void>();

  render(
    createElement(
      Suspense,
      { fallback: null },
      createElement(
        Boundary,
        { fallback: null, onError, onRendered: vi.fn<() => void>(), resetKey: 1 },
        createElement(component),
      ),
    ),
  );

  return onError;
}
