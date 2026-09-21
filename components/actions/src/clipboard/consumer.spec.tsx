import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "#button/button.ts";
import { clipped, LINK, pressed } from "#clipboard/clipboard.fixtures.tsx";
import { Consumer } from "#clipboard/consumer.ts";

describe("Consumer", () => {
  it("passes the machine's value to the render function", () => {
    render(clipped(<Consumer>{(api) => <span>{api.value}</span>}</Consumer>));

    expect(screen.getByText(LINK)).toBeDefined();
  });

  it("re-renders the function with copied set once the caller's control calls copy", async () => {
    render(
      clipped(
        <Consumer>
          {(api) => (
            <Button onClick={api.copy} size="sm" variant="outline">
              {api.copied ? "Copied" : "Copy the link"}
            </Button>
          )}
        </Consumer>,
      ),
    );
    await pressed(screen.getByRole("button", { name: "Copy the link" }));

    expect(screen.getByRole("button", { name: "Copied" })).toBeDefined();
  });

  it("writes the machine's value to the system clipboard through the api's copy", async () => {
    render(
      clipped(
        <Consumer>
          {(api) => (
            <Button onClick={api.copy} size="sm" variant="outline">
              Copy the link
            </Button>
          )}
        </Consumer>,
      ),
    );
    await pressed(screen.getByRole("button", { name: "Copy the link" }));

    await expect(navigator.clipboard.readText()).resolves.toBe(LINK);
  });

  it("throws naming Clipboard when it renders with no root above it", () => {
    expect(() => render(<Consumer>{() => null}</Consumer>)).toThrow(/Clipboard/u);
  });
});
