import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CodeProvider, useCode } from "#code-block/state.ts";

/**
 * Reads the code through the hook a part reads it through.
 *
 * @returns The code and its language, drawn as text.
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
  it("reads the code and the language the provider holds", () => {
    render(
      <CodeProvider value={{ code: "const a = 1;", language: "ts" }}>
        <Reader />
      </CodeProvider>,
    );

    expect(screen.getByTestId("state").textContent).toBe("ts:const a = 1;");
  });

  it("throws where no root stands above the reader", () => {
    expect(() => render(<Reader />)).toThrow(/CodeBlock\.Root/u);
  });
});
