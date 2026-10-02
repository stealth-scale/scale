import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { maskerOf } from "#input-mask/mask.ts";
import { MaskingProvider, useMasking } from "#input-mask/state.ts";

function Reading(): ReactElement {
  const { name, value } = useMasking();

  return <span data-testid="masking">{`${String(name)} ${value}`}</span>;
}

describe("state", () => {
  it("returns the state the root above passes", () => {
    render(
      <MaskingProvider
        value={{
          disabled: undefined,
          invalid: undefined,
          masker: maskerOf({ mask: "99" }),
          name: "code",
          readOnly: undefined,
          required: undefined,
          set: () => {},
          value: "12",
        }}
      >
        <Reading />
      </MaskingProvider>,
    );

    expect(screen.getByTestId("masking").textContent).toBe("code 12");
  });

  it("throws for an input outside a root", () => {
    expect(() => render(<Reading />)).toThrow(
      "A part of InputMask was drawn outside the root that holds it together.",
    );
  });
});
