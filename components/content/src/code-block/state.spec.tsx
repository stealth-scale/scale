import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CodeProvider, useCode } from "#code-block/state.ts";

/**
 * Renders the context value as text, so a case can assert on both fields at once.
 */
function Reader(): ReactElement {
  const { code, language } = useCode();

  return (
    <span data-testid="state">
      {language ?? "plain"}:{code}
    </span>
  );
}

describe("useCode", () => {
  it("returns the code and the language the provider was given", () => {
    render(
      <CodeProvider value={{ code: "const a = 1;", language: "ts" }}>
        <Reader />
      </CodeProvider>,
    );

    expect(screen.getByTestId("state").textContent).toBe("ts:const a = 1;");
  });

  it("throws naming CodeBlock.Root when no provider is above the caller", () => {
    expect(() => render(<Reader />)).toThrow(/CodeBlock\.Root/u);
  });
});
