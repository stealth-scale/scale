/**
 * Renders an `iframe` sandboxed by default, for a document the application does not control.
 *
 * @remarks
 *   `sandbox` defaults to the empty value, which grants nothing: no scripts, no forms, no popups
 *   and no same-origin access. A caller widens it one capability at a time,
 *   `sandbox="allow-scripts"` for a document that needs scripts. `allow-scripts` with
 *   `allow-same-origin` lets a same-origin document remove its own sandbox. `referrerPolicy`
 *   defaults to `no-referrer`, so the framed origin is not told which page framed it. `loading`
 *   defaults to `lazy`, which lets the browser defer a frame below the fold until the reader
 *   scrolls near it. The frame sets no `allow`, so it is delegated no permission the page has, such
 *   as the camera. `title` is required, because it is the frame's accessible name.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#iframe/context.ts";

/**
 * Renders the `iframe` element with the recipe's class.
 */
const Drawn = withContext("iframe");

/**
 * Describes the props of `Iframe`: the props of an `iframe` element, with `title` required.
 */
export interface IframeProps extends Omit<ComponentProps<typeof Drawn>, "title"> {
  /**
   * Accessible name of the frame: what it shows, such as "Preview of the March invoice email", for
   * a reader who cannot see it.
   */
  readonly title: string;
}

/**
 * Renders the frame with the sandbox, the referrer policy and the lazy loading it defaults to.
 *
 * @param props - The props of an `iframe` element, with `title` required.
 * @returns The `iframe` element.
 */
export function Iframe({
  loading = "lazy",
  referrerPolicy = "no-referrer",
  sandbox = "",
  ...rest
}: IframeProps): ReactElement {
  return <Drawn {...rest} loading={loading} referrerPolicy={referrerPolicy} sandbox={sandbox} />;
}
