# @stealthscale/component-content

Renders a body of content, starting with a passage of code. Each component binds a recipe, so a
theme restyles it by extending the recipe. The preset under `./theme` registers the recipes with an
application's compiler.

## Install

```bash
pnpm add @stealthscale/component-content
```

The package peers on `react`, `@stealthscale/theme` and `@stealthscale/hooks`. It depends on
`@tanstack/highlight`, which splits a passage of code into tokens, and on
`@stealthscale/component-actions` for the copy control.

## CodeBlock

A panel with a header over a horizontally scrolling passage of code. The recipe colours each token
kind from the theme's `code` family: `code.keyword`, `code.string` and the rest.

```tsx
import { CodeBlock } from "@stealthscale/component-content";
import { CheckIcon, CopyIcon } from "lucide-react";

<CodeBlock.Root code={source} language="tsx">
  <CodeBlock.Header>
    <CodeBlock.Title>send.tsx</CodeBlock.Title>
    <CodeBlock.Control>
      <CodeBlock.Copy copied={<CheckIcon aria-hidden size="1em" />} label="Copy the code">
        <CopyIcon aria-hidden size="1em" />
      </CodeBlock.Copy>
    </CodeBlock.Control>
  </CodeBlock.Header>
  <CodeBlock.Content>
    <CodeBlock.Code />
  </CodeBlock.Content>
</CodeBlock.Root>;
```

| Part      | Element  | What it renders                                                         |
| --------- | -------- | ----------------------------------------------------------------------- |
| `Root`    | `div`    | The panel. It takes the code, the language and the colour mode          |
| `Header`  | `div`    | A row with the title at the start and the controls at the end           |
| `Title`   | `div`    | A file name or another label, truncated on one line                     |
| `Control` | `div`    | The group of controls at the end of the header                          |
| `Copy`    | `button` | A ghost icon button that copies the root's code                         |
| `Content` | `pre`    | The scrolling region. It is focusable, so the arrow keys scroll it      |
| `Code`    | `code`   | The highlighted code, one `span` with `data-token` per classified token |

| Axis   | Values     | Default |
| ------ | ---------- | ------- |
| `size` | `sm`, `md` | `md`    |

`language` takes the highlighter's language names, such as `tsx`, `ts`, `json`, `shell` and `yaml`.
An absent or unknown language renders plain text.

`mode` sets the panel's colour mode: `dark` by default on any page, `light` on any page, or
`inherit` to follow the page.

`CodeBlock.Copy` takes the idle icon as its children and the copied icon as `copied`. `label` and
`copiedLabel` set its accessible name and default to "Copy to clipboard" and "Copied to clipboard".

The panel shows a focus ring while the scrolling region has focus.
