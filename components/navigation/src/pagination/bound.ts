/**
 * Binds the library's `Button` to the pagination's item and trigger slots, as a button and as a
 * link.
 *
 * @remarks
 *   Each part renders the link binding when the machine's `type` is `link`, so the page or trigger
 *   is an `a` with the address `getPageUrl` returns and keeps the button's looks.
 */

import { type JSX } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { Anchor } from "#pagination/anchor.tsx";
import { withContext } from "#pagination/context.ts";
import { type LinkProps } from "#pagination/linked.ts";

/**
 * Renders a page as the library's `Button` with the pagination's item class.
 */
export const PageButton: (props: ButtonProps) => JSX.Element = withContext(Button, "item");

/**
 * Renders a page as the button's `a` with the pagination's item class.
 */
export const PageLink: (props: LinkProps) => JSX.Element = withContext(Anchor, "item");

/**
 * Renders a trigger as the library's `Button` with the pagination's trigger class.
 */
export const TriggerButton: (props: ButtonProps) => JSX.Element = withContext(Button, "trigger");

/**
 * Renders a trigger as the button's `a` with the pagination's trigger class.
 */
export const TriggerLink: (props: LinkProps) => JSX.Element = withContext(Anchor, "trigger");
