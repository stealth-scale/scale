/**
 * Catalogue entry for the code block, covering a titled file with a copy control, both sizes,
 * three languages, plain text, and all three colour modes.
 *
 * @remarks
 *   The copy control is `CodeBlock.Copy`, which takes the code from the root and drives the
 *   clipboard itself. The page passes it the two glyphs and the label, because the library ships
 *   neither an icon set nor any user-facing strings. The glyphs come from Lucide, which this
 *   package depends on for specimens only; published components still take their glyphs from the
 *   consumer. Copy comes from the `code-block` namespace in `locales/en/specimen/code-block.json`.
 */

import { type ReactElement } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

import { Matrix, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

/**
 * The call site the generated scene's source snippet is built from.
 */
const SAMPLE = {
  children: [
    "<CodeBlock.Header>",
    "  <CodeBlock.Title>send.tsx</CodeBlock.Title>",
    "</CodeBlock.Header>",
    "<CodeBlock.Content>",
    "  <CodeBlock.Code />",
    "</CodeBlock.Content>",
  ].join("\n"),
  imports: 'import { CodeBlock } from "@stealthscale/component-content";',
  name: "CodeBlock.Root",
};

import * as CodeBlock from "#code-block/index.ts";
import { recipe } from "#code-block/recipe.ts";

/**
 * The TypeScript source the first two scenes render.
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
 * Sample source in each of the non-TypeScript languages the scenes render.
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
 * The axis of the languages scene, in the order the cells appear.
 */
const LANGUAGES = ["json", "shell", "yaml"] as const;

/**
 * The axis of the modes scene, in the order the cells appear.
 */
const MODES = ["dark", "light", "inherit"] as const;

/**
 * Renders the copy control with Lucide glyphs and a translated accessible label.
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
 * Renders the block with every slot in place, including a file name and a copy control.
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
 * Draws the same source, headed by its file name, in whatever the scene hands over.
 */
function Sized(props: CodeBlock.RootProps): ReactElement {
  return (
    <CodeBlock.Root {...props} code={FILE} language="tsx">
      <CodeBlock.Header>
        <CodeBlock.Title>send.tsx</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content>
        <CodeBlock.Code />
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}

/**
 * Renders one block per language, to show the token colours across different grammars.
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
 * Renders a block with the language omitted, so the source falls back to plain text.
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
 * Renders the same source once per colour mode the root accepts.
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
 * Scene showing the block fully composed.
 */
export const file: Scene = {
  about: "code-block.file.about",
  draw: File,
  frame: "bleed",
  title: "code-block.file.title",
};

/**
 * Scene covering highlighting across three languages.
 */
export const languages: Scene = {
  about: "code-block.languages.about",
  draw: Languages,
  title: "code-block.languages.title",
};

/**
 * Scene covering source rendered with no language set.
 */
export const plain: Scene = {
  about: "code-block.plain.about",
  draw: Plain,
  frame: "bleed",
  title: "code-block.plain.title",
};

/**
 * Scene covering the three colour modes of the panel.
 */
export const modes: Scene = {
  about: "code-block.modes.about",
  draw: Modes,
  title: "code-block.modes.title",
};

export default specimen({
  about: "code-block.about",
  id: "components/content/code-block",
  imports: 'import { CodeBlock } from "@stealthscale/component-content";',
  scenes: [
    file,
    ...scenesOf<CodeBlock.RootProps>(recipe, {
      draw: (props) => <Sized {...props} />,
      namespace: "code-block",
      sample: SAMPLE,
    }),
    languages,
    plain,
    modes,
  ],
  title: "code-block.title",
});
