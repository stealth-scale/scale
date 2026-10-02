import { type ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as Field from "#field/index.ts";
import { lengthOf, useWired } from "#field/wired.ts";

/**
 * Renders a hook inside an invalid field with the identifier `notes`, a limit of 200 and size sm.
 */
function Invalid({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <Field.Root id="notes" invalid maxLength={200} size="sm">
      {children}
    </Field.Root>
  );
}

describe("wired", () => {
  it("measures no value as 0", () => {
    expect(lengthOf()).toBe(0);
  });

  it("measures a number by its digits", () => {
    expect(lengthOf(1250)).toBe(4);
  });

  it("measures a string in UTF-16 code units", () => {
    expect(lengthOf("😀a")).toBe(3);
  });

  it("returns the props a control takes from the field", () => {
    const { result } = renderHook(() => useWired(), { wrapper: Invalid });

    expect(result.current.props).toStrictEqual({
      "aria-describedby": "notes-helper notes-error notes-counter",
      "aria-invalid": true,
      disabled: false,
      id: "notes",
      maxLength: 200,
      readOnly: false,
      required: false,
      size: "sm",
    });
  });

  it("leaves out aria-invalid maxLength and size where the field sets none", () => {
    const { result } = renderHook(() => useWired(), {
      wrapper: ({ children }) => <Field.Root id="notes">{children}</Field.Root>,
    });

    expect(result.current.props).toStrictEqual({
      "aria-describedby": "notes-helper notes-error notes-counter",
      disabled: false,
      id: "notes",
      readOnly: false,
      required: false,
    });
  });
});
