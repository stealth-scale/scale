import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "#button/button.ts";
import { clipped, LINK, pressed } from "#clipboard/clipboard.fixtures.tsx";
import { Consumer } from "#clipboard/consumer.ts";

describe("Consumer", () => {
  it("hands the machine's value to the function it is given", () => {
    render(clipped(<Consumer>{(api) => <span>{api.value}</span>}</Consumer>));

    expect(screen.getByText(LINK)).toBeDefined();
  });

  it("draws a control of the caller's own that copies through the machine", async () => {
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
    await expect(navigator.clipboard.readText()).resolves.toBe(LINK);
  });

  it("throws where it is drawn outside a root", () => {
    expect(() => render(<Consumer>{() => null}</Consumer>)).toThrow(/Clipboard/u);
  });
});
