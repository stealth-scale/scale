/**
 * Lays out the smallest workspace that reproduces every case the reader classifies.
 *
 * @remarks
 *   `tone` is a variant, `gap` a variant a style prop shadows, `label` an option the component
 *   declares, `open` an option the machine it depends on declares, `onEscapeKeyDown` an option a
 *   package the machine depends on declares, `margin` a style prop of a peer, `stack` a property
 *   the compiler's own library declares, and the conditions properties with no declaration at all.
 *   The packages sit under `node_modules` for real, so the compiler resolves them the way it
 *   resolves anything.
 */

/**
 * Twenty-five members, which is more than a table has room for.
 */
const SPRAWLING = Array.from(
  { length: 25 },
  (_, index) => `  at${String(index).padStart(2, "0")}: string;`,
);

/**
 * The styling package, whose props are noise and one of whose names a variant shares.
 */
const SYSTEM = [
  "export interface StyleProps {",
  "  /** How far apart the children sit. */",
  "  gap?: string;",
  "  /** The room around it. */",
  "  margin?: string;",
  "}",
  "",
].join("\n");

/**
 * The state machine the component is built over, a dependency of the kit, whose props a caller
 * sets on the component.
 */
const MACHINE = [
  'import { type DismissHandlers } from "@kit/dismiss";',
  "",
  "export interface MachineProps extends DismissHandlers {",
  "  /** Called when it opens or closes. */",
  "  onOpenChange?: (details: { open: boolean }) => void;",
  "  /** Whether it is open. */",
  "  open?: boolean;",
  "}",
  "",
].join("\n");

/**
 * A package the machine depends on, which the kit never names itself.
 */
const DISMISS = [
  "export interface DismissHandlers {",
  "  /** Called when escape is pressed. */",
  "  onEscapeKeyDown?: () => void;",
  "}",
  "",
].join("\n");

/**
 * The component's recipe, which declares the axes a theme moves.
 */
const RECIPE = [
  "/** How loud it is. */",
  'export type Tone = "loud" | "quiet";',
  "",
  "export interface Variants {",
  "  /** How far apart the parts sit. */",
  '  gap?: "lg" | "sm";',
  "  /** How loud it is. */",
  "  tone?: Tone;",
  "}",
  "",
].join("\n");

/**
 * The component itself, whose props type is the recipe's axes over the styling package's.
 */
const BADGE = [
  'import { type MachineProps } from "@kit/machine";',
  'import { type StyleProps } from "@kit/system";',
  "",
  'import { type Variants } from "#badge/recipe.ts";',
  "",
  "/** What a change hands back. */",
  "export interface Details {",
  "  /** Whether it is open now. */",
  "  open: boolean;",
  "}",
  "",
  "/** One entry it lists. */",
  "export interface Entry {",
  "  /** What the entry says. */",
  "  label: string;",
  "}",
  "",
  "export interface Branching {",
  "  /** The one below it. */",
  "  under: Branching | undefined;",
  "}",
  "",
  "export interface Sprawling {",
  ...SPRAWLING,
  "}",
  "",
  "/** The leaf of a chain deeper than the walk follows. */",
  "export interface Deep4 {",
  "  /** The end of it. */",
  "  leaf: string;",
  "}",
  "",
  "export interface Deep3 {",
  "  /** The one below it. */",
  "  next: Deep4;",
  "}",
  "",
  "export interface Deep2 {",
  "  /** The one below it. */",
  "  next: Deep3;",
  "}",
  "",
  "export interface Deep1 {",
  "  /** The one below it. */",
  "  next: Deep2;",
  "}",
  "",
  'export interface Own extends Pick<Error, "stack"> {',
  "  /**",
  "   * The words it shows.",
  "   *",
  '   * @defaultValue ""',
  "   */",
  "  label?: string;",
  "",
  "  /** Both at once. */",
  "  both?: Details & Entry;",
  "",
  "  /** A chain deeper than the walk follows. */",
  "  chain?: Deep1;",
  "",
  "  /** The entries it lists. */",
  "  entries?: readonly Entry[];",
  "",
  "  /** Something with no name of its own. */",
  "  inline?: { at: string };",
  "",
  "  /** Called when it opens. */",
  "  onOpen?: (details: Details) => void;",
  "",
  "  /** The tree it draws. */",
  "  tree?: Branching;",
  "",
  "  /** More than a table has room for. */",
  "  wide?: Sprawling;",
  "",
  "  /** What it is named, which a caller has to pass. */",
  "  named: string;",
  "}",
  "",
  'export type Conditions = { [K in "_focus" | "_hover"]?: StyleProps };',
  "",
  "export type BadgeProps = Conditions & MachineProps & Own & StyleProps & Variants;",
  "",
  "export function Badge(): void {}",
  "",
  "export interface GhostProps {",
  "  /** Nothing exports a Ghost, so this is no part. */",
  "  haunts: string;",
  "}",
  "",
].join("\n");

/**
 * A second component, in a directory of its own, so the reader has one to order after the first.
 */
const OTHER = [
  "export interface OtherProps {",
  "  /** How far away it is. */",
  "  far?: string;",
  "}",
  "",
  "export function Other(): void {}",
  "",
].join("\n");

/**
 * A factory and the props it passes to the component it is given, named after the factory.
 */
const FACTORY = [
  "export interface CreateOverlayProps {",
  "  /** Closes it. */",
  "  close: () => void;",
  "}",
  "",
  "export function createOverlay(): void {}",
  "",
].join("\n");

/**
 * The compiler options the kit is read under.
 */
const CONFIG = JSON.stringify({
  compilerOptions: {
    jsx: "preserve",
    module: "esnext",
    moduleResolution: "bundler",
    skipLibCheck: true,
    strict: true,
    types: [],
  },
  include: ["src"],
});

/**
 * Returns the kit's files, keyed by the path they are written to.
 */
export function kit(): Readonly<Record<string, string>> {
  return {
    "node_modules/@kit/dismiss/index.d.ts": DISMISS,
    "node_modules/@kit/dismiss/package.json": '{ "name": "@kit/dismiss", "types": "index.d.ts" }',
    "node_modules/@kit/machine/index.d.ts": MACHINE,
    "node_modules/@kit/machine/package.json": JSON.stringify({
      dependencies: { "@kit/dismiss": "*" },
      name: "@kit/machine",
      types: "index.d.ts",
    }),
    "node_modules/@kit/system/index.d.ts": SYSTEM,
    "node_modules/@kit/system/package.json": '{ "name": "@kit/system", "types": "index.d.ts" }',
    "package.json": JSON.stringify({
      dependencies: { "@kit/machine": "*" },
      imports: { "#*": "./src/*" },
      name: "kit",
      peerDependencies: { "@kit/system": "*" },
      type: "module",
    }),
    "src/badge/badge.specimen.tsx": [
      'import { type StyleProps } from "@kit/system";',
      "",
      'import { type OtherProps } from "#other/other.ts";',
      'import { type BadgeProps, type GhostProps } from "#badge/badge.ts";',
      "",
      'export default specimen({ id: "badge", scenes: [] });',
      "",
    ].join("\n"),
    "src/badge/badge.ts": BADGE,
    "src/badge/recipe.ts": RECIPE,
    "src/other/other.ts": OTHER,
    "src/overlay/overlay.specimen.tsx": [
      'import { type CreateOverlayProps } from "#overlay/overlay.ts";',
      "",
      'export default specimen({ id: "overlay", scenes: [] });',
      "",
    ].join("\n"),
    "src/overlay/overlay.ts": FACTORY,
    "src/parts.specimen.tsx": [
      'import { absent } from "@kit/absent";',
      "",
      'import { type BadgeProps } from "#parts.ts";',
      "",
      'export default specimen({ id: "parts", scenes: [absent] });',
      "",
    ].join("\n"),
    "src/parts.ts": 'export { Badge, type BadgeProps } from "#badge/badge.ts";\n',
    "tsconfig.json": CONFIG,
  };
}
