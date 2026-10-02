import { screen } from "@testing-library/react";
import { type PageChangeDetails } from "@zag-js/pagination";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { NextTrigger } from "#pagination/next-trigger.tsx";
import { address, composed } from "#pagination/pagination.fixtures.tsx";
import { Root } from "#pagination/root.tsx";

describe("NextTrigger", () => {
  it("renders a button named Next page", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Next page" }).tagName).toBe("BUTTON");
  });

  it("takes the name label gives", async () => {
    await drawn(
      <Root count={90}>
        <NextTrigger label="Weiter" />
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Weiter" })).toBeTruthy();
  });

  it("moves to the next page on a press", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "Next page" }));

    expect(screen.getByRole("button", { name: "Page 13" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("sets aria-disabled on the last page", async () => {
    await drawn(composed({ defaultPage: 24 }));

    expect(screen.getByRole("button", { name: "Next page" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("sets aria-disabled when there is no page", async () => {
    await drawn(composed({ count: 0, defaultPage: 1 }));

    expect(screen.getByRole("button", { name: "Next page" }).getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("leaves the disabled attribute out on the last page", async () => {
    await drawn(composed({ defaultPage: 24 }));

    expect(screen.getByRole("button", { name: "Next page" }).hasAttribute("disabled")).toBe(false);
  });

  it("leaves aria-disabled out before the last page", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Next page" }).hasAttribute("aria-disabled")).toBe(
      false,
    );
  });

  it("keeps the last page on a press at the end", async () => {
    await drawn(composed({ defaultPage: 24 }));
    await pressed(screen.getByRole("button", { name: "Next page" }));

    expect(screen.getByRole("button", { name: "Page 24" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("renders a link to the next page when type is link", async () => {
    await drawn(composed({ getPageUrl: address, type: "link" }));

    expect(screen.getByRole("link", { name: "Next page" }).getAttribute("href")).toBe("#page-13");
  });

  it("leaves the page unchanged on a press of the link", async () => {
    const told = vi.fn<(details: PageChangeDetails) => void>();

    await drawn(composed({ getPageUrl: address, onPageChange: told, type: "link" }));
    await pressed(screen.getByRole("link", { name: "Next page" }));

    expect(told).not.toHaveBeenCalled();
  });

  it("drops the address of the link on the last page", async () => {
    await drawn(composed({ defaultPage: 24, getPageUrl: address, type: "link" }));

    expect(screen.getByRole("link", { name: "Next page" }).hasAttribute("href")).toBe(false);
  });

  it("keeps the link in the tab order on the last page", async () => {
    await drawn(composed({ defaultPage: 24, getPageUrl: address, type: "link" }));

    expect(screen.getByRole("link", { name: "Next page" }).getAttribute("tabindex")).toBe("0");
  });
});
