import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { LastTrigger } from "#pagination/last-trigger.tsx";
import { address, composed } from "#pagination/pagination.fixtures.tsx";
import { Root } from "#pagination/root.tsx";

describe("LastTrigger", () => {
  it("renders a button named Last page", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Last page" }).tagName).toBe("BUTTON");
  });

  it("takes the name label gives", async () => {
    await drawn(
      <Root count={90}>
        <LastTrigger label="Letzte Seite" />
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Letzte Seite" })).toBeTruthy();
  });

  it("moves to the last page on a press", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "Last page" }));

    expect(screen.getByRole("button", { name: "Page 24" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("sets aria-disabled on the last page", async () => {
    await drawn(composed({ defaultPage: 24 }));

    expect(screen.getByRole("button", { name: "Last page" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("leaves aria-disabled out before the last page", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Last page" }).hasAttribute("aria-disabled")).toBe(
      false,
    );
  });

  it("renders a link to the last page when type is link", async () => {
    await drawn(composed({ getPageUrl: address, type: "link" }));

    expect(screen.getByRole("link", { name: "Last page" }).getAttribute("href")).toBe("#page-24");
  });

  it("drops the address of the link on the last page", async () => {
    await drawn(composed({ defaultPage: 24, getPageUrl: address, type: "link" }));

    expect(screen.getByRole("link", { name: "Last page" }).hasAttribute("href")).toBe(false);
  });
});
