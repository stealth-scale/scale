import { screen } from "@testing-library/react";
import { type PageChangeDetails } from "@zag-js/pagination";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { address, composed } from "#pagination/pagination.fixtures.tsx";
import { PrevTrigger } from "#pagination/prev-trigger.tsx";
import { Root } from "#pagination/root.tsx";

describe("PrevTrigger", () => {
  it("renders a button named Previous page", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Previous page" }).tagName).toBe("BUTTON");
  });

  it("takes the name label gives", async () => {
    await drawn(
      <Root count={90}>
        <PrevTrigger label="Zurück" />
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Zurück" })).toBeTruthy();
  });

  it("moves to the previous page on a press", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "Previous page" }));

    expect(screen.getByRole("button", { name: "Page 11" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("sets aria-disabled on the first page", async () => {
    await drawn(composed({ defaultPage: 1 }));

    expect(
      screen.getByRole("button", { name: "Previous page" }).getAttribute("aria-disabled"),
    ).toBe("true");
  });

  it("leaves the disabled attribute out on the first page", async () => {
    await drawn(composed({ defaultPage: 1 }));

    expect(screen.getByRole("button", { name: "Previous page" }).hasAttribute("disabled")).toBe(
      false,
    );
  });

  it("leaves aria-disabled out after the first page", async () => {
    await drawn(composed());

    expect(
      screen.getByRole("button", { name: "Previous page" }).hasAttribute("aria-disabled"),
    ).toBe(false);
  });

  it("keeps the first page on a press at the start", async () => {
    await drawn(composed({ defaultPage: 1 }));
    await pressed(screen.getByRole("button", { name: "Previous page" }));

    expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("renders a link to the previous page when type is link", async () => {
    await drawn(composed({ getPageUrl: address, type: "link" }));

    expect(screen.getByRole("link", { name: "Previous page" }).getAttribute("href")).toBe(
      "#page-11",
    );
  });

  it("leaves the page unchanged on a press of the link", async () => {
    const told = vi.fn<(details: PageChangeDetails) => void>();

    await drawn(composed({ getPageUrl: address, onPageChange: told, type: "link" }));
    await pressed(screen.getByRole("link", { name: "Previous page" }));

    expect(told).not.toHaveBeenCalled();
  });

  it("drops the address of the link on the first page", async () => {
    await drawn(composed({ defaultPage: 1, getPageUrl: address, type: "link" }));

    expect(screen.getByRole("link", { name: "Previous page" }).hasAttribute("href")).toBe(false);
  });
});
