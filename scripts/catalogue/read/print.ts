/**
 * Formats a `pnpm dom` reading as text, one block per reading.
 */

import { type Finding } from "./audit.ts";
import { type Box } from "./boxes.ts";
import { type Measure, type Row } from "./measure.ts";
import { type Outline } from "./outline.ts";
import { type Computed, type Rule } from "./styles.ts";
import { type Drawn, lined } from "./tree.ts";

/**
 * Every reading one run took. Each optional member is present only when requested.
 */
export interface Reading {
  /**
   * Accessibility tree, as Playwright's ARIA snapshot.
   */
  readonly aria?: string;

  /**
   * Axe violations.
   */
  readonly axe?: readonly Finding[];

  /**
   * Element boxes.
   */
  readonly boxes?: readonly Box[];

  /**
   * Computed styles, one record per element.
   */
  readonly css?: readonly Computed[];

  /**
   * Measurement rows by measurement.
   */
  readonly measures?: Readonly<Partial<Record<Measure, readonly Row[]>>>;

  /**
   * Outline of the region.
   */
  readonly outline: Outline;

  /**
   * Rules matching the element, least specific first.
   */
  readonly rules?: readonly Rule[];

  /**
   * Target slug.
   */
  readonly target: string;

  /**
   * Custom properties on the root, by name.
   */
  readonly tokens?: Readonly<Record<string, string>>;

  /**
   * Element tree.
   */
  readonly tree?: readonly Drawn[];
}

/**
 * Formats the full outline.
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
 * Formats the computed styles, one indented block per element.
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
 * Formats the matched rules, one indented block per rule.
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
 * Formats the axe violations, one block per rule with its targets.
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
 * Formats the boxes, one line per element.
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
 * Formats the measurements, one block per measurement and one line per row.
 */
function measureLines(measures: Readonly<Partial<Record<Measure, readonly Row[]>>>): string[] {
  const lines: string[] = [];

  for (const [kind, rows] of Object.entries(measures)) {
    lines.push("", `measure ${kind}:${rows.length === 0 ? " nothing to measure" : ""}`);

    for (const { named, ...values } of rows) {
      const pairs = Object.entries(values).map(([label, value]) => `${label}=${String(value)}`);

      lines.push(`  ${String(named)}  ${pairs.join(" ")}`);
    }
  }

  return lines;
}

/**
 * Formats the element tree.
 */
function treeLines(tree: readonly Drawn[]): string[] {
  const lines = ["", "tree:"];

  for (const node of tree) lined(node, 1, lines);

  return lines;
}

/**
 * Formats a reading as text.
 *
 * @remarks
 *   The full outline is printed when it is the only reading or when `outline` is true. Otherwise
 *   only the scene titles and the console errors are printed above the other readings.
 * @param reading - Every reading one run took.
 * @param outline - Prints the full outline beside the other readings.
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
    optional(reading.measures, measureLines),
    optional(reading.tokens, tokenLines),
  ];

  return [`== ${reading.target}`, ...head, ...blocks.flat()].join("\n");
}

/**
 * Formats an optional reading, or returns no lines when it is absent.
 */
function optional<Value>(
  value: undefined | Value,
  write: (value: Value) => readonly string[],
): readonly string[] {
  return value === undefined ? [] : write(value);
}

/**
 * Formats the scene titles and the console errors, the part of the outline printed beside any
 * other reading.
 */
function briefLines(outline: Outline): string[] {
  return [
    `scenes: ${outline.scenes.join(" | ")}`,
    `console errors: ${outline.errors.length === 0 ? "none" : ""}`,
    ...outline.errors.map((one) => `  ${one}`),
  ];
}

/**
 * Formats the accessibility tree, indented.
 */
function ariaLines(aria: string): string[] {
  return ["", "aria:", ...aria.split("\n").map((one) => `  ${one}`)];
}

/**
 * Formats the tokens, one line per custom property.
 */
function tokenLines(tokens: Readonly<Record<string, string>>): string[] {
  return ["", "tokens:", ...Object.entries(tokens).map(([name, value]) => `  ${name}: ${value}`)];
}
