# @stealthscale/component-content

Presents a body of something: a passage of code, and later markdown, a diff, a document, a record
about a thing. Every component binds a recipe and draws nothing of its own, so a theme restyles all
of them by extending the recipe. The preset under `./theme` registers the recipes with an
application's compiler.

## Install

```bash
pnpm add @stealthscale/component-content
```

The package peers on `react`, `@stealthscale/theme` and `@stealthscale/hooks`, and depends on
`@tanstack/highlight` for the tokens a passage of code is cut into.

## CodeBlock

Draws a passage of code in a panel: the code set in the code role, each kind of token in the ink the
theme's code family states for it, headed by what the code is and whatever control a page puts
beside it. The root holds the code and its language, the code part cuts the passage into tokens and
writes each kind as `data-token`, and the recipe inks the kinds from `code.keyword`, `code.string`
and the rest. The panel is drawn in the dark mode whatever the page is in, so a block reads the same
on every page.

```tsx
import { ButtonPropsProvider, Clipboard, IconButton } from "@stealthscale/component-actions";
import { CodeBlock } from "@stealthscale/component-content";

<CodeBlock.Root code={source} language="tsx" size="sm">
  <CodeBlock.Header>
    <CodeBlock.Title>send.tsx</CodeBlock.Title>
    <CodeBlock.Control>
      <Clipboard.Root value={source}>
        <ButtonPropsProvider value={{ size: "xs", status: "neutral", variant: "ghost" }}>
          <Clipboard.Trigger as={IconButton}>
            <Clipboard.Indicator copied={<Check />}>
              <Copy />
            </Clipboard.Indicator>
          </Clipboard.Trigger>
        </ButtonPropsProvider>
      </Clipboard.Root>
    </CodeBlock.Control>
  </CodeBlock.Header>
  <CodeBlock.Content>
    <CodeBlock.Code />
  </CodeBlock.Content>
</CodeBlock.Root>;
```

The block draws no copy control of its own. A page puts the clipboard's trigger from the actions
package in the control, drawn as the library's icon button, so the block and the button are styled
by their own recipes.

`language` names the language as the highlighter names it: `tsx`, `ts`, `json`, `shell`, `yaml` and
the rest of its thirty-one. A language it does not know, or none, sets the passage as plain text.
`mode` draws the panel `dark` by default, `light` on any page, or in the page's own mode with
`inherit`.

| Axis   | Values     | Default |
| ------ | ---------- | ------- |
| `size` | `sm`, `md` | `md`    |
