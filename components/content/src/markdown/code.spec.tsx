import { describe, expect, it, vi } from "vitest";

import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { rendered } from "#markdown/markdown.fixtures.tsx";
import { type MarkdownCodeProps } from "#markdown/scope.ts";

const FENCE = '```ts title="purge.ts" {2}\nexport const days = 30;\n```\n';

describe("renderCode", () => {
  it("highlights the language the fence names", () => {
    const { container } = rendered(FENCE);

    expect(container.querySelector("code [data-token=keyword]")?.textContent).toBe("export");
  });

  it("renders the fence's title in the block's header", () => {
    const { getByText } = rendered(FENCE);

    expect(getByText("purge.ts").closest(`.${slotClass("code-block", "header")}`)).not.toBeNull();
  });

  it("names a fence without a title by codeLabel from its language", () => {
    const { container } = rendered("```sh\npnpm test\n```\n");

    expect(slotElement(container, "code-block", "viewport").getAttribute("aria-label")).toBe(
      "Code, sh",
    );
  });

  it("renders no header for a fence without a title or a copy control", () => {
    const { container } = rendered("```sh\npnpm test\n```\n");

    expect(container.querySelector(`.${slotClass("code-block", "header")}`)).toBeNull();
  });

  it("renders a copy control with the caller's glyphs", () => {
    const { getByRole } = rendered("```sh\npnpm test\n```\n", {
      glyphs: { copy: { copied: <b>copied</b>, idle: <i>copy</i> } },
    });

    expect(getByRole("button", { name: "Copy to clipboard" }).textContent).toContain("copy");
  });

  it("renders a fence through the caller's replacement with the fence's facts", () => {
    const Replacement = vi.fn<(props: MarkdownCodeProps) => null>(() => null);

    rendered(FENCE, { components: { code: Replacement } });

    expect(Replacement.mock.lastCall?.[0]).toStrictEqual({
      code: "export const days = 30;",
      highlightLines: [2],
      language: "ts",
      meta: 'title="purge.ts" {2}',
      title: "purge.ts",
    });
  });
});
