/**
 * Shows the code block: a file with a copy control, every size, three languages, and plain text.
 *
 * @remarks
 *   The copy control is `CodeBlock.Copy`, which reads the code off the root and wires the
 *   clipboard itself. The page hands it the two marks and the words, because the library ships no
 *   icon set and this package ships no words. The marks come from Lucide, which this package takes
 *   for its specimens alone: a published component still takes its glyph from whoever draws it.
 *   The words are keys under `code-block` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/code-block.json`.
 */

import { type ReactElement } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as CodeBlock from "#code-block/index.ts";
import { recipe } from "#code-block/recipe.ts";

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
 * Draws the control that copies the passage, named in the catalogue's words.
 */
function CopyControl(): ReactElement {
  const { t } = useWords("code-block");

  return (
    <CodeBlock.Copy
      copied={<CheckIcon size="1em" />}
      translations={{ triggerLabel: (copied) => t(copied ? "copied" : "copy") }}
    >
      <CopyIcon size="1em" />
    </CodeBlock.Copy>
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
          <CopyControl />
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
  frame: "bleed",
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
  frame: "bleed",
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
  imports: 'import { CodeBlock } from "@stealthscale/component-content";',
  scenes: [file, sizes, languages, plain, modes],
  title: "code-block.title",
});
