/**
 * Builds the sources, documents and renders the Markdown specs read.
 */

import { type ReactElement } from "react";

import { type MarkdownInput } from "@tanstack/markdown";
import { render, type RenderResult } from "@testing-library/react";

import { Markdown, type MarkdownProps } from "#markdown/markdown.tsx";
import { type Scope } from "#markdown/scope.ts";
import { wordsOf } from "#markdown/words.ts";

/**
 * Lists a document that uses every construct the renderer maps.
 */
export const EVERYTHING = `# Retention policy

Exports are kept **30 days**, then *purged*; run \`purge()\` or read [the runbook](https://example.com/runbook "Runbook"). Old ~~60~~ days.[^1]

## Obligations

- [x] Review the processing record
- [ ] Sign off the audit

| Store | Days | Owner |
| :--- | ---: | :---: |
| Mail | 30 | Ops |

> Personal data never leaves the EU.

> [!WARNING]
> Keys rotate on Monday.

\`\`\`ts title="purge.ts"
export const days = 30;
\`\`\`

---

![Diagram of the pipeline](/pipeline.png)

[^1]: Set by the data protection officer.
`;

/**
 * Renders a document from a source, or a document parsed ahead, with the caller's props.
 */
export function rendered(source: MarkdownInput, props: Partial<MarkdownProps> = {}): RenderResult {
  return render(<Markdown source={source} {...props} />);
}

/**
 * Renders the document that uses every construct.
 */
export function everything(props: Partial<MarkdownProps> = {}): ReactElement {
  return <Markdown source={EVERYTHING} {...props} />;
}

/**
 * Returns a document's scope for a renderer a case calls directly: English words, no replacements,
 * no glyphs, a `#` at `h1`, the md size.
 */
export function scopeOf(scope: Partial<Scope> = {}): Scope {
  return {
    blocks: () => [],
    components: {},
    glyphs: {},
    headingLevel: 1,
    prefix: "doc-",
    size: "md",
    words: wordsOf({}),
    ...scope,
  };
}
