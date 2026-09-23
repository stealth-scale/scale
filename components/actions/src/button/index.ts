/**
 * Exports the button's public API. The props provider takes the component's name, so a package
 * that exports several providers has no name collision.
 */

export { Button, type ButtonProps } from "#button/button.ts";
export { PropsProvider as ButtonPropsProvider } from "#button/context.ts";
export { IconButton, type IconButtonProps } from "#button/icon-button.ts";
