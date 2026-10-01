/**
 * Exports the shell's parts and hooks. A caller composes `AppShell.Root` with bars, a body and a
 * status bar, and the body with a panel on either side of `AppShell.Main`.
 */

export { Aside, type AsideProps } from "#app-shell/aside.tsx";
export { Body, type BodyProps } from "#app-shell/body.tsx";
export { Footer, type FooterProps } from "#app-shell/footer.tsx";
export { Header, type HeaderProps } from "#app-shell/header.tsx";
export { Main, type MainProps } from "#app-shell/main.tsx";
export { WINDOW_HEIGHT } from "#app-shell/metrics.ts";
export { Navbar, type NavbarProps } from "#app-shell/navbar.tsx";
export { type Panel } from "#app-shell/panels.ts";
export { Rail, type RailProps } from "#app-shell/rail.tsx";
export { Root, type RootProps } from "#app-shell/root.tsx";
export { Section, type SectionProps } from "#app-shell/section.tsx";
export {
  type Collapse,
  COLLAPSES,
  type Fold,
  FOLDS,
  type ShellWidth,
  type Side,
  useAppShellPanel,
  useNearestPanel,
  useOverlaid,
} from "#app-shell/state.ts";
export { Status, type StatusProps } from "#app-shell/status.tsx";
export { Trigger, type TriggerProps } from "#app-shell/trigger.tsx";
export { type PanelOptions } from "#app-shell/use-panel.ts";
