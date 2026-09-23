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

  it("calls the render function again with copied true after copy", async () => {
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

  it("throws an error that names Clipboard when no root is mounted", () => {
    expect(() => render(<Consumer>{() => null}</Consumer>)).toThrow(/Clipboard/u);
  });
});
