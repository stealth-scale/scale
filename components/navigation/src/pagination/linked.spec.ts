import { describe, expect, it, vi } from "vitest";

import { linked, type LinkProps } from "#pagination/linked.ts";

/**
 * Returns props as the machine gives a link to page 4.
 *
 * @returns The props.
 */
function given(): LinkProps {
  return { "aria-label": "Next page", href: "#page-4", id: "next", onClick: vi.fn<() => void>() };
}

describe("linked", () => {
  it("drops the machine's click handler", () => {
    expect(linked(given())).not.toHaveProperty("onClick");
  });

  it("keeps the other props before an end", () => {
    expect(linked(given())).toStrictEqual({
      "aria-label": "Next page",
      href: "#page-4",
      id: "next",
    });
  });

  it("drops the address at an end", () => {
    expect(linked(given(), true)).not.toHaveProperty("href");
  });

  it("gives a link at an end the link role", () => {
    expect(linked(given(), true)).toMatchObject({ role: "link" });
  });

  it("gives a link at an end a tab stop", () => {
    expect(linked(given(), true)).toMatchObject({ tabIndex: 0 });
  });

  it("keeps the name at an end", () => {
    expect(linked(given(), true)).toMatchObject({ "aria-label": "Next page", id: "next" });
  });
});
