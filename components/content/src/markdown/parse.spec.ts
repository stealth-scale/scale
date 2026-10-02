import { parseMarkdown } from "@tanstack/markdown/parser";
import { describe, expect, it } from "vitest";

import { documentOf } from "#markdown/parse.ts";

describe("documentOf", () => {
  it("returns a document parsed ahead unchanged", () => {
    const parsed = parseMarkdown("# Ahead");

    expect(documentOf(parsed, { streaming: false })).toBe(parsed);
  });

  it("gives a heading a duplicate-safe id", () => {
    const { children } = documentOf("# Setup\n\n# Setup\n", { streaming: false });

    expect(children.map((node) => (node.type === "heading" ? node.id : undefined))).toStrictEqual([
      "setup",
      "setup-2",
    ]);
  });

  it("parses a GitHub callout into a callout node", () => {
    const [node] = documentOf("> [!TIP]\n> Rotate keys.\n", { streaming: false }).children;

    expect(node?.type === "callout" ? node.kind : undefined).toBe("tip");
  });

  it("keeps raw HTML as literal text", () => {
    const [node] = documentOf("<b>bold</b>\n", { streaming: false }).children;

    expect(node).toStrictEqual({
      children: [{ type: "text", value: "<b>bold</b>" }],
      type: "paragraph",
    });
  });

  it("closes an open fence while the source streams", () => {
    const { children } = documentOf("```ts\nconst a = 1", { streaming: true });

    expect(children).toStrictEqual([{ lang: "ts", type: "code", value: "const a = 1" }]);
  });

  it("applies the caller's URL policy to a link", () => {
    const [node] = documentOf("[docs](/docs)\n", {
      streaming: false,
      urlTransform: (url) => `https://example.com${url}`,
    }).children;

    expect(node?.type === "paragraph" ? node.children[0] : undefined).toMatchObject({
      href: "https://example.com/docs",
    });
  });
});
