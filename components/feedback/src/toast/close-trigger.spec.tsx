import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { CloseTrigger, Region, Root } from "#toast/index.ts";
import { framed, raised, regioned, toasterOf } from "#toast/toast.fixtures.tsx";

describe("CloseTrigger", () => {
  it("renders a button named Dismiss notification", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { title: "Exported" });

    expect(screen.getByRole("button", { name: "Dismiss notification" }).tagName).toBe("BUTTON");
  });

  it("takes the name the caller passes as aria-label", async () => {
    const toaster = toasterOf();

    await drawn(
      <Region toaster={toaster}>
        {() => (
          <Root>
            <CloseTrigger aria-label="Close the export notice">x</CloseTrigger>
          </Root>
        )}
      </Region>,
    );
    await raised(toaster, { title: "Exported" });

    expect(screen.getByRole("button", { name: "Close the export notice" })).toBeDefined();
  });

  it("dismisses the toast on a press", async () => {
    const toaster = toasterOf();

    await drawn(regioned(toaster));
    await raised(toaster, { duration: Number.POSITIVE_INFINITY, title: "Exported" });
    await pressed(screen.getByRole("button", { name: "Dismiss notification" }));
    await framed();

    expect(screen.getByRole("status").dataset["state"]).toBe("closed");
  });
});
