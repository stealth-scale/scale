/**
 * Catalogues the clipboard: the trigger alone, beside a field, as the value, as a caller-built
 * control, at each size, and with two copied-state durations.
 *
 * @remarks
 *   The trigger has no styles of its own, so every scene renders it as the library's button through
 *   `as` and sets the button's variants through `ButtonPropsProvider`, because `as` does not retype
 *   the props it forwards. Both icons are decorative. The indicator hides them from assistive
 *   technology, and the machine names the trigger. The words are keys under `clipboard` in the
 *   catalogue namespace, stored at `locales/en/specimen/clipboard.json`.
 */

import { type ReactElement } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";

import { Input, InputPropsProvider } from "@stealthscale/component-forms";
import { Matrix, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { Button, ButtonPropsProvider, IconButton } from "#button/index.ts";
import * as Clipboard from "#clipboard/index.ts";
import { recipe } from "#clipboard/recipe.ts";

/**
 * The call site the generated scene's source snippet is built from.
 */
const SAMPLE = {
  children: [
    "<Clipboard.Label>Share link</Clipboard.Label>",
    "<Clipboard.Control>",
    "  <Clipboard.Input as={Input} />",
    "  <Clipboard.Trigger as={IconButton}>…</Clipboard.Trigger>",
    "</Clipboard.Control>",
  ].join("\n"),
  imports: 'import { Clipboard } from "@stealthscale/component-actions";',
  name: "Clipboard.Root",
};

/**
 * The string every scene copies.
 */
const LINK = "https://stealthscale.io/payouts/4109";

/**
 * The two copied-state durations the last scene compares, in milliseconds.
 */
const TIMEOUTS = [250, 3000] as const;

/**
 * Renders the indicator: the copy icon, replaced by a check mark after a copy.
 */
function Mark(): ReactElement {
  return (
    <Clipboard.Indicator copied={<CheckIcon size="1em" />}>
      <CopyIcon size="1em" />
    </Clipboard.Indicator>
  );
}

/**
 * Renders a copy button with no field beside it.
 */
function Alone(): ReactElement {
  const { t } = useWords("clipboard");

  return (
    <Clipboard.Root value={LINK}>
      <ButtonPropsProvider value={{ size: "sm", variant: "outline" }}>
        <Clipboard.Trigger as={Button}>
          <Mark />
          {t("copy")}
        </Clipboard.Trigger>
      </ButtonPropsProvider>
    </Clipboard.Root>
  );
}

/**
 * Renders a labelled field with an icon button that copies it.
 */
function Beside(): ReactElement {
  const { t } = useWords("clipboard");

  return (
    <Clipboard.Root value={LINK}>
      <Clipboard.Label>{t("label")}</Clipboard.Label>
      <Clipboard.Control>
        <InputPropsProvider value={{ size: "sm" }}>
          <Clipboard.Input as={Input} />
        </InputPropsProvider>
        <ButtonPropsProvider value={{ size: "sm", variant: "ghost" }}>
          <Clipboard.Trigger as={IconButton}>
            <Mark />
          </Clipboard.Trigger>
        </ButtonPropsProvider>
      </Clipboard.Control>
    </Clipboard.Root>
  );
}

/**
 * Renders the value text as the trigger.
 */
function Value(): ReactElement {
  return (
    <Clipboard.Root value={LINK}>
      <ButtonPropsProvider value={{ size: "sm", variant: "ghost" }}>
        <Clipboard.Trigger as={Button}>
          <Clipboard.ValueText />
          <Mark />
        </Clipboard.Trigger>
      </ButtonPropsProvider>
    </Clipboard.Root>
  );
}

/**
 * Renders a caller-built button that reads the machine through `Clipboard.Consumer`.
 */
function Own(): ReactElement {
  const { t } = useWords("clipboard");

  return (
    <Clipboard.Root value={LINK}>
      <Clipboard.Consumer>
        {(api) => (
          <Button onClick={api.copy} palette={api.copied ? "success" : "neutral"} size="sm">
            {api.copied ? t("copied") : t("copy")}
          </Button>
        )}
      </Clipboard.Consumer>
    </Clipboard.Root>
  );
}

/**
 * Renders the labelled row: the field that shows the link and the control that copies it.
 *
 * @remarks
 *   The size goes to the field and the control as well as the root. The root's size axis sets the
 *   label and the gap, and the input and the button read their own size axes, so a root size alone
 *   leaves both controls at their default size.
 */
function Labelled({ size = "md", ...rest }: Clipboard.RootProps): ReactElement {
  const { t } = useWords("clipboard");

  return (
    <Clipboard.Root size={size} value={LINK} {...rest}>
      <Clipboard.Label>{t("label")}</Clipboard.Label>
      <Clipboard.Control>
        <InputPropsProvider value={{ size }}>
          <Clipboard.Input as={Input} />
        </InputPropsProvider>
        <ButtonPropsProvider value={{ size, variant: "outline" }}>
          <Clipboard.Trigger as={IconButton}>
            <Mark />
          </Clipboard.Trigger>
        </ButtonPropsProvider>
      </Clipboard.Control>
    </Clipboard.Root>
  );
}

/**
 * Renders two triggers whose copied state lasts for different durations.
 */
function Held(): ReactElement {
  return (
    <Matrix knob="timeout" of={TIMEOUTS}>
      {(timeout) => (
        <Clipboard.Root timeout={timeout} value={LINK}>
          <ButtonPropsProvider value={{ size: "sm", variant: "outline" }}>
            <Clipboard.Trigger as={Button}>
              <Mark />
              {timeout}ms
            </Clipboard.Trigger>
          </ButtonPropsProvider>
        </Clipboard.Root>
      )}
    </Matrix>
  );
}

/**
 * The scene for a copy button standing alone.
 */
export const alone: Scene = {
  about: "clipboard.alone.about",
  draw: Alone,
  title: "clipboard.alone.title",
};

/**
 * The scene for a copy button next to a field.
 */
export const beside: Scene = {
  about: "clipboard.beside.about",
  draw: Beside,
  title: "clipboard.beside.title",
};

/**
 * The scene for the value text used as the trigger.
 */
export const value: Scene = {
  about: "clipboard.value.about",
  draw: Value,
  title: "clipboard.value.title",
};

/**
 * The scene for a caller-built control that reads the machine through the consumer.
 */
export const own: Scene = {
  about: "clipboard.own.about",
  draw: Own,
  title: "clipboard.own.title",
};

/**
 * The scene comparing the two copied-state durations.
 */
export const held: Scene = {
  about: "clipboard.held.about",
  draw: Held,
  title: "clipboard.held.title",
};

export default specimen({
  about: "clipboard.about",
  id: "components/actions/clipboard",
  imports:
    'import { Button, ButtonPropsProvider, Clipboard, IconButton } from "@stealthscale/component-actions";',
  scenes: [
    alone,
    beside,
    value,
    own,
    ...scenesOf<Clipboard.RootProps>(recipe, {
      draw: (props) => <Labelled {...props} />,
      namespace: "clipboard",
      sample: SAMPLE,
    }),
    held,
  ],
  title: "clipboard.title",
});
