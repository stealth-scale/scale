/**
 * Exports the menubar's parts, composed as `Menubar.Root` around menus, each a `Menubar.Menu` with
 * a `Menubar.Trigger` and a `Menubar.Content` of the menu's rows, and the type `onValueChange`
 * receives.
 */

export { type ValueChangeDetails } from "#menubar/bar.ts";
export { Content, type ContentProps } from "#menubar/content.tsx";
export { Menu, type MenuProps } from "#menubar/menu.tsx";
export { Root, type RootProps } from "#menubar/root.tsx";
export { Trigger, type TriggerProps } from "#menubar/trigger.tsx";
