/**
 * Shows the clipboard: a button that copies a link, the same beside a field, the value itself as
 * the control, a control of the page's own, every size, and two timeouts.
 *
 * @remarks
 *   The trigger draws no look of its own, so every scene draws it as the library's button through
 *   `as`, with the button's variants set through its provider because `as` retypes nothing. The
 *   marks are a copy glyph and a check, both decorative, so the indicator hides them and the
 *   machine names the trigger. The words are keys under `clipboard` in the catalogue's namespace,
 *   kept beside this file in `locales/en/specimen/clipboard.json`.
 */

import { type ReactElement } from "react";

import { Input, InputPropsProvider } from "@stealthscale/component-forms";
import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Button, ButtonPropsProvider, IconButton } from "#button/index.ts";
import * as Clipboard from "#clipboard/index.ts";
import { recipe } from "#clipboard/recipe.ts";

/**
 * The link every scene copies.
 */
const LINK = "https://stealthscale.io/payouts/4109";

/**
 * The path of the check mark, in a 24 unit box.
 */
const CHECK = "M20 6 9 17l-5-5";

/**
 * The path of the sheet behind the copy glyph's front square, in a 24 unit box.
 */
const SHEET = "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2";

/**
 * The two timeouts the last scene compares, in milliseconds.
 */
const TIMEOUTS = [250, 3000] as const;

/**
 * Draws the mark that swaps from two squares to a check while the copy is fresh.
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
 * Draws the button on its own.
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
 * Draws the button beside the field that shows what it copies.
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
 * Draws the value as the thing pressed.
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
 * Draws a control of the page's own from the machine's state.
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
 * Draws the labelled row at every size.
 */
function Sizes(): ReactElement {
  const { t } = useWords("clipboard");

  return (
    <Matrix knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <Clipboard.Root size={size} value={LINK}>
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
      )}
    </Matrix>
  );
}

/**
 * Draws two buttons whose marks stay for different lengths of time.
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
 * The button on its own.
 */
export const alone: Scene = {
  about: "clipboard.alone.about",
  draw: Alone,
  title: "clipboard.alone.title",
};

/**
 * Beside a field.
 */
export const beside: Scene = {
  about: "clipboard.beside.about",
  draw: Beside,
  title: "clipboard.beside.title",
};

/**
 * The value itself.
 */
export const value: Scene = {
  about: "clipboard.value.about",
  draw: Value,
  title: "clipboard.value.title",
};

/**
 * A control of the page's own.
 */
export const own: Scene = {
  about: "clipboard.own.about",
  draw: Own,
  title: "clipboard.own.title",
};

/**
 * Every size.
 */
export const sizes: Scene = {
  about: "clipboard.sizes.about",
  draw: Sizes,
  title: "clipboard.sizes.title",
};

/**
 * Two timeouts.
 */
export const held: Scene = {
  about: "clipboard.held.about",
  draw: Held,
  title: "clipboard.held.title",
};

export default specimen({
  about: "clipboard.about",
  group: "Actions",
  id: "actions/clipboard",
  scenes: [alone, beside, value, own, sizes, held],
  title: "clipboard.title",
});
