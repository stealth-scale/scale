/**
 * Lays out the catalogue page for the clipboard.
 *
 * @remarks
 *   The trigger carries no styling of its own, so every scene renders it through `as` as the
 *   library's button and sets that button's variants through its props provider, since `as` does
 *   not retype the props it forwards. Both glyphs are decorative, so the indicator hides them from
 *   assistive technology and the machine names the trigger instead. The text comes from keys under
 *   `clipboard` in the catalogue namespace, held beside this file in
 *   `locales/en/specimen/clipboard.json`.
 */

import { type ReactElement } from "react";

import { Input, InputPropsProvider } from "@stealthscale/component-forms";
import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

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

import { Button, ButtonPropsProvider, IconButton } from "#button/index.ts";
import * as Clipboard from "#clipboard/index.ts";
import { recipe } from "#clipboard/recipe.ts";

/**
 * The string every scene copies.
 */
const LINK = "https://stealthscale.io/payouts/4109";

/**
 * The check mark, as path data over a 24 unit viewBox.
 */
const CHECK = "M20 6 9 17l-5-5";

/**
 * The rear sheet of the copy glyph, as path data over the same viewBox.
 */
const SHEET = "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2";

/**
 * The pair of hold durations the final scene contrasts, in milliseconds.
 */
const TIMEOUTS = [250, 3000] as const;

/**
 * Renders the indicator, trading the stacked squares for a check once a copy lands.
 */
function Mark(): ReactElement {
  return (
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
 * Renders the value itself as the surface a reader clicks.
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
 * Renders a button the page builds itself, reading the machine through the consumer.
 */
function Own(): ReactElement {
  const { t } = useWords("clipboard");

  return (
    <Clipboard.Root value={LINK}>
      <Clipboard.Consumer>
        {(api) => (
          <Button onClick={api.copy} size="sm" status={api.copied ? "success" : "neutral"}>
            {api.copied ? t("copied") : t("copy")}
          </Button>
        )}
      </Clipboard.Consumer>
    </Clipboard.Root>
  );
}

/**
 * Draws the labelled row: the field holding the link, and the control that copies it.
 *
 * @remarks
 *   The size is handed to the field and the control as well as to the row, because the row's own
 *   axis moves the label and the gap and the two controls inside take their own. A row at one size
 *   around a field at another drew a label that stepped while the box stayed put.
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
 * Renders two buttons whose marks persist for different durations.
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
 * The scene for the value acting as its own trigger.
 */
export const value: Scene = {
  about: "clipboard.value.about",
  draw: Value,
  title: "clipboard.value.title",
};

/**
 * The scene for a control the page supplies through the consumer.
 */
export const own: Scene = {
  about: "clipboard.own.about",
  draw: Own,
  title: "clipboard.own.title",
};

/**
 * The scene comparing the hold durations.
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
