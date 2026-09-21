/**
 * Forms the public surface of the button component, qualifying the shared props provider with the
 * component's name so that a package re-exporting several of them has no collision.
 */

export { Button, type ButtonProps } from "#button/button.ts";
export { PropsProvider as ButtonPropsProvider } from "#button/context.ts";
export { IconButton, type IconButtonProps } from "#button/icon-button.ts";
