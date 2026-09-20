/**
 * Prints a reading as text, one block per part of it.
 */

import { type Finding } from "./audit.ts";
import { type Box } from "./boxes.ts";
import { type Outline } from "./outline.ts";
import { type Computed, type Rule } from "./styles.ts";
import { type Drawn, lined } from "./tree.ts";

/**
 * Describes everything one run read.
 */
export interface Reading {
  /**
   * The accessibility tree, as a screen reader hears it, where asked.
   */
  readonly aria?: string;

  /**
   * The audit's findings, where asked.
   */
  readonly axe?: readonly Finding[];

  /**
   * The boxes, where asked.
   */
  readonly boxes?: readonly Box[];

  /**
   * The computed styles, where asked: one record per element.
   */
  readonly css?: readonly Computed[];

  /**
   * The outline.
   */
  readonly outline: Outline;

  /**
   * The rules that reached the element, where asked.
   */
  readonly rules?: readonly Rule[];

  /**
   * The target read, named.
   */
  readonly target: string;

  /**
   * The tokens in force, where asked.
   */
  readonly tokens?: Readonly<Record<string, string>>;

  /**
   * The tree, where asked.
   */
  readonly tree?: readonly Drawn[];
}

/**
 * Writes the outline's blocks.
 */
function outlineLines(outline: Outline): string[] {
  return [
    `scenes: ${outline.scenes.join(" | ")}`,
    "",
    "headings:",
    ...outline.headings.map((one) => `  ${one}`),
    "",
    "landmarks:",
    ...outline.landmarks.map((one) => `  ${one}`),
    "",
    "controls:",
    ...outline.controls.map((one) => `  ${one}`),
    "",
    "recipes:",
    ...Object.entries(outline.recipes)
      .toSorted(([one], [other]) => one.localeCompare(other))
      .map(([recipe, count]) => `  ${recipe} ×${String(count)}`),
    "",
    `raw keys: ${outline.raw.length === 0 ? "none" : outline.raw.join(", ")}`,
    `console errors: ${outline.errors.length === 0 ? "none" : ""}`,
    ...outline.errors.map((one) => `  ${one}`),
  ];
}

/**
 * Writes the computed styles' block.
 */
function cssLines(css: readonly Computed[]): string[] {
  const lines = ["", `css:${css.length === 0 ? " nothing matched" : ""}`];

  for (const styles of css) {
    lines.push(`  ${styles[""] ?? ""}`);

    for (const [name, value] of Object.entries(styles)) {
      if (name !== "") lines.push(`    ${name}: ${value}`);
    }
  }

  return lines;
}

/**
 * Writes the rules' block.
 */
function ruleLines(rules: readonly Rule[]): string[] {
  const lines = ["", "rules, least specific first:"];

  for (const rule of rules) {
    lines.push(`  ${rule.selector}  (${rule.origin})`);

    for (const declaration of rule.declarations) lines.push(`    ${declaration}`);
  }

  return lines;
}

/**
 * Writes the audit's block.
 */
function axeLines(findings: readonly Finding[]): string[] {
  const lines = ["", `axe: ${findings.length === 0 ? "no violations" : ""}`];

  for (const finding of findings) {
    lines.push(`  ${finding.id} (${finding.impact}): ${finding.help}`);

    for (const target of finding.targets) lines.push(`    ${target}`);
  }

  return lines;
}

/**
 * Writes the boxes' block.
 */
function boxLines(boxes: readonly Box[]): string[] {
  return [
    "",
    `boxes:${boxes.length === 0 ? " nothing matched" : ""}`,
    ...boxes.map(
      (box) =>
        `  ${box.named}  x=${String(box.x)} y=${String(box.y)} w=${String(box.width)} h=${String(box.height)}`,
    ),
  ];
}

/**
 * Writes the tree's block.
 */
function treeLines(tree: readonly Drawn[]): string[] {
  const lines = ["", "tree:"];

  for (const node of tree) lined(node, 1, lines);

  return lines;
}

/**
 * Prints a reading as text.
 *
 * @remarks
 *   The outline is printed in full only where nothing else was read, or where asked for beside
 *   the rest, so a reading of one element's styles is not buried under the page's headings. The
 *   scenes and the console errors are printed either way, because a scene's title is what the
 *   next command names and an error is never noise.
 * @param reading - Everything one run read.
 * @param outline - Whether the whole outline is printed beside the other readings.
 * @returns The text, block by block.
 */
export function printed(reading: Reading, outline: boolean): string {
  const alone = Object.keys(reading).every((key) => key === "outline" || key === "target");
  const head = outline || alone ? outlineLines(reading.outline) : briefLines(reading.outline);
  const blocks = [
    optional(reading.tree, treeLines),
    optional(reading.css, cssLines),
    optional(reading.rules, ruleLines),
    optional(reading.aria, ariaLines),
    optional(reading.axe, axeLines),
    optional(reading.boxes, boxLines),
    optional(reading.tokens, tokenLines),
  ];

  return [`== ${reading.target}`, ...head, ...blocks.flat()].join("\n");
}

/**
 * Writes a block for a reading that may be absent, and nothing where it is.
 */
function optional<Read>(
  read: Read | undefined,
  write: (read: Read) => readonly string[],
): readonly string[] {
  return read === undefined ? [] : write(read);
}

/**
 * Writes the two lines of the outline that are printed beside any other reading.
 */
function briefLines(outline: Outline): string[] {
  return [
    `scenes: ${outline.scenes.join(" | ")}`,
    `console errors: ${outline.errors.length === 0 ? "none" : ""}`,
    ...outline.errors.map((one) => `  ${one}`),
  ];
}

/**
 * Writes the accessibility tree's block.
 */
function ariaLines(aria: string): string[] {
  return ["", "aria:", ...aria.split("\n").map((one) => `  ${one}`)];
}

/**
 * Writes the tokens' block.
 */
function tokenLines(tokens: Readonly<Record<string, string>>): string[] {
  return ["", "tokens:", ...Object.entries(tokens).map(([name, value]) => `  ${name}: ${value}`)];
}
