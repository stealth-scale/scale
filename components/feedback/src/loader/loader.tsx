/**
 * Renders a spinner beside words, or over content that keeps its size while it loads.
 *
 * @remarks
 *   With `text`, the loader renders the spinner and the words in one inline row, and `text`
 *   replaces the children. Without `text`, it hides the children with `visibility: hidden`, so they
 *   keep their box and the layout does not shift when they return, and centres the spinner over
 *   them. Hidden content leaves the accessibility tree, so `label` is rendered in its place for
 *   screen readers. With `loading` false, the children render unchanged. The default spinner is at
 *   `inherit` and `current`, so it matches the size and ink of the surrounding text.
 */

import { type ComponentProps, type ReactNode } from "react";

import { withContext, withProvider } from "#loader/context.ts";
import { Spinner } from "#spinner/spinner.ts";

/**
 * Renders the loader's root: an inline row with words, an inline grid over content.
 */
const Root = withProvider("span", "root");

/**
 * Renders the element that contains the spinner.
 */
const Indicator = withContext("span", "indicator");

/**
 * Renders the hidden content the spinner is centred over.
 */
const Content = withContext("span", "content");

/**
 * Renders the text screen readers read in place of the hidden content.
 */
const Label = withContext("span", "label");

/**
 * The default indicator: a spinner as tall as the surrounding text, in its ink.
 */
const SPINNER = <Spinner size="inherit" />;

/**
 * Selects the side of the words the spinner is rendered on.
 */
export type LoaderPlacement = "end" | "start";

/**
 * Describes the props of `Loader`: the root's props and variants, and what it renders while
 * loading.
 */
export interface LoaderProps extends Omit<ComponentProps<typeof Root>, "children" | "scrim"> {
  /**
   * The content the loader covers while loading, rendered unchanged when it is not.
   */
  readonly children?: ReactNode;

  /**
   * The text screen readers read in place of the hidden children. Defaults to `Loading`.
   */
  readonly label?: string | undefined;

  /**
   * Whether the loader is shown. Defaults to `true`.
   */
  readonly loading?: boolean | undefined;

  /**
   * The side of the words the spinner is rendered on. Defaults to `start`.
   */
  readonly placement?: LoaderPlacement | undefined;

  /**
   * The indicator to render in place of the default spinner.
   */
  readonly spinner?: ReactNode;

  /**
   * The words rendered beside the spinner, in place of the children.
   */
  readonly text?: ReactNode;
}

/**
 * Renders the spinner beside `text`, or over the hidden children, while `loading` is true.
 */
export function Loader({
  children,
  label = "Loading",
  loading = true,
  placement = "start",
  spinner = SPINNER,
  text,
  ...rest
}: LoaderProps): ReactNode {
  if (!loading) return children;

  const indicator = <Indicator>{spinner}</Indicator>;

  if (text !== undefined) {
    return (
      <Root {...rest}>
        {placement === "start" ? indicator : null}
        {text}
        {placement === "end" ? indicator : null}
      </Root>
    );
  }

  return (
    <Root {...rest}>
      <Content>{children}</Content>
      {indicator}
      <Label>{label}</Label>
    </Root>
  );
}
