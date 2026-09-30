import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { FirstTrigger } from "#pagination/first-trigger.tsx";
import { address, composed } from "#pagination/pagination.fixtures.tsx";
import { Root } from "#pagination/root.tsx";

describe("FirstTrigger", () => {
  it("renders a button named First page", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "First page" }).tagName).toBe("BUTTON");
  });

  it("takes the name label gives", async () => {
    await drawn(
      <Root count={90}>
        <FirstTrigger label="Erste Seite" />
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Erste Seite" })).toBeTruthy();
  });

  it("moves to the first page on a press", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "First page" }));

    expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("sets aria-disabled on the first page", async () => {
    await drawn(composed({ defaultPage: 1 }));

    expect(screen.getByRole("button", { name: "First page" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("leaves aria-disabled out after the first page", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "First page" }).hasAttribute("aria-disabled")).toBe(
      false,
    );
  });

  it("renders a link to the first page when type is link", async () => {
    await drawn(composed({ getPageUrl: address, type: "link" }));

    expect(screen.getByRole("link", { name: "First page" }).getAttribute("href")).toBe("#page-1");
  });

  it("drops the address of the link on the first page", async () => {
    await drawn(composed({ defaultPage: 1, getPageUrl: address, type: "link" }));

    expect(screen.getByRole("link", { name: "First page" }).hasAttribute("href")).toBe(false);
  });
});
