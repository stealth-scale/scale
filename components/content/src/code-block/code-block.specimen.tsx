/**
 * Shows the code block: a file with a copy control, every size, three languages, and plain text.
 *
 * @remarks
 *   The copy control is the clipboard's trigger drawn as the library's icon button, placed in the
 *   header's control by the page, so the block itself draws no button. The words are keys under
 *   `code-block` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/code-block.json`.
 */

import { type ReactElement } from "react";

import { ButtonPropsProvider, Clipboard, IconButton } from "@stealthscale/component-actions";
import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as CodeBlock from "#code-block/index.ts";
import { recipe } from "#code-block/recipe.ts";

/**
 * The path of the check mark, in a 24 unit box.
 */
const CHECK = "M20 6 9 17l-5-5";

/**
 * The path of the sheet behind the copy glyph's front square, in a 24 unit box.
 */
const SHEET = "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2";

/**
 * A component file, the passage the first two scenes set.
 */
const FILE = `import { Button } from "@stealthscale/component-actions";

/**
 * Sends the invoice once a person confirms it.
 */
export function Send({ onSend }: SendProps) {
  const [sent, setSent] = useState(false);

  return (
    <Button disabled={sent} onClick={() => { onSend(); setSent(true); }} variant="solid">
      {sent ? "Sent" : "Send the invoice"}
    </Button>
  );
}`;

/**
 * One passage per language the third scene sets.
 */
const PASSAGES = {
  json: `{
  "name": "@stealthscale/component-content",
  "version": "0.1.0",
  "sideEffects": false
}`,
  shell: `pnpm add @stealthscale/component-content
# then list the preset under ./theme with the compiler
vp dev --port 5179`,
  yaml: `catalog:
  "@tanstack/highlight": 0.1.0
  "@zag-js/clipboard": 1.44.0`,
} as const;

/**
 * The languages the third scene sets, in the order they are shown.
 */
const LANGUAGES = ["json", "shell", "yaml"] as const;

/**
 * The three modes the root offers, in the order they are shown.
 */
const MODES = ["dark", "light", "inherit"] as const;

/**
 * Draws the clipboard trigger that copies the passage, as an icon button in the header.
 */
function CopyControl({ code }: { readonly code: string }): ReactElement {
  const { t } = useWords("code-block");

  return (
    <Clipboard.Root
      translations={{ triggerLabel: (copied) => t(copied ? "copied" : "copy") }}
      value={code}
    >
      <ButtonPropsProvider value={{ size: "xs", status: "neutral", variant: "ghost" }}>
        <Clipboard.Trigger as={IconButton}>
          <Clipboard.Indicator
            copied={
              <Icon viewBox="0 0 24 24">
                <path d={CHECK} fill="none" stroke="currentColor" strokeWidth="2" />
              </Icon>
            }
          >
            <Icon viewBox="0 0 24 24">
              <rect
                fill="none"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
                width="14"
                x="8"
                y="8"
              />
              <path d={SHEET} fill="none" stroke="currentColor" strokeWidth="2" />
            </Icon>
          </Clipboard.Indicator>
        </Clipboard.Trigger>
      </ButtonPropsProvider>
    </Clipboard.Root>
  );
}

/**
 * Draws a file with its name and a copy control.
 */
function File(): ReactElement {
  return (
    <CodeBlock.Root code={FILE} language="tsx">
      <CodeBlock.Header>
        <CodeBlock.Title>send.tsx</CodeBlock.Title>
        <CodeBlock.Control>
          <CopyControl code={FILE} />
        </CodeBlock.Control>
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Code />
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}

/**
 * Draws the same file at every size.
 */
function Sizes(): ReactElement {
  return (
    <Matrix knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <CodeBlock.Root code={FILE} language="tsx" size={size}>
          <CodeBlock.Header>
            <CodeBlock.Title>send.tsx</CodeBlock.Title>
          </CodeBlock.Header>
          <CodeBlock.Content>
            <CodeBlock.Code />
          </CodeBlock.Content>
        </CodeBlock.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a passage in each of three languages.
 */
function Languages(): ReactElement {
  return (
    <Matrix knob="language" of={LANGUAGES}>
      {(language) => (
        <CodeBlock.Root code={PASSAGES[language]} language={language}>
          <CodeBlock.Content>
            <CodeBlock.Code />
          </CodeBlock.Content>
        </CodeBlock.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws a passage with no language named.
 */
function Plain(): ReactElement {
  return (
    <CodeBlock.Root code={PASSAGES.shell}>
      <CodeBlock.Content>
        <CodeBlock.Code />
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}

/**
 * Draws the same passage in each mode the root offers.
 */
function Modes(): ReactElement {
  return (
    <Matrix knob="mode" of={MODES}>
      {(mode) => (
        <CodeBlock.Root code={PASSAGES.json} language="json" mode={mode}>
          <CodeBlock.Content>
            <CodeBlock.Code />
          </CodeBlock.Content>
        </CodeBlock.Root>
      )}
    </Matrix>
  );
}

/**
 * A file with a copy control.
 */
export const file: Scene = {
  about: "code-block.file.about",
  draw: File,
  title: "code-block.file.title",
};

/**
 * Every size.
 */
export const sizes: Scene = {
  about: "code-block.sizes.about",
  draw: Sizes,
  title: "code-block.sizes.title",
};

/**
 * Three languages.
 */
export const languages: Scene = {
  about: "code-block.languages.about",
  draw: Languages,
  title: "code-block.languages.title",
};

/**
 * Plain text.
 */
export const plain: Scene = {
  about: "code-block.plain.about",
  draw: Plain,
  title: "code-block.plain.title",
};

/**
 * Every mode.
 */
export const modes: Scene = {
  about: "code-block.modes.about",
  draw: Modes,
  title: "code-block.modes.title",
};

export default specimen({
  about: "code-block.about",
  group: "Content",
  id: "content/code-block",
  scenes: [file, sizes, languages, plain, modes],
  title: "code-block.title",
});
