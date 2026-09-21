/**
 * Renames every class selector of a compiled stylesheet into the scheme, and removes the rules
 * nothing can reach.
 *
 * @remarks
 *   The stylesheet is parsed once per compile, each class in each selector is renamed, and the
 *   parser escapes the new name as it writes it back. A class for a boolean axis at `false` is one
 *   no element carries, so a selector that needs it is removed and reported, a block the removal
 *   leaves empty goes with it, and `:not()` of it is kept as written, since the negation matches
 *   everything at its own specificity. Two classes that rename to one name are a collision and are
 *   reported as an error, since the rules of one would apply to the other. A class under a raw
 *   selector or at-rule condition is reported as a warning, because the scheme keeps it as written
 *   and a named condition in the preset would read better.
 */

import { type AtRule, type Container, type Node, parse, type Rule } from "postcss";
import selectorParser from "postcss-selector-parser";

import { type CompilerConfig, conditionsOf, rename } from "@stealthscale/pandacss-naming";

import { type Diagnostic } from "#pandacss.ts";

/**
 * Describes a renamed stylesheet with what the rename found.
 */
export interface Renamed {
  /**
   * The stylesheet with every class selector in the scheme.
   */
  css: string;
  /**
   * Each collision as an error, then the classes whose rules were removed and the classes kept
   * under a raw condition as one warning each.
   */
  diagnostics: readonly Diagnostic[];
}

/**
 * Records which classes the compiler wrote were renamed to each name.
 */
type Sources = Map<string, Set<string>>;

/**
 * Describes what one call reads and records while it renames.
 */
interface Pass {
  /**
   * The classes kept under a raw condition.
   */
  raw: Set<string>;
  /**
   * The class of the scheme for each class the compiler wrote. A class appears in many selectors,
   * so each is renamed once per call.
   */
  renamed: Map<string, string>;
  /**
   * The classes the compiler wrote, by the name each was renamed to.
   */
  sources: Sources;
  /**
   * The classes no element carries, whose rules were removed.
   */
  unreachable: Set<string>;
}

/**
 * Matches the name of an at-rule whose inner rules are keyframe steps rather than selectors.
 */
const KEYFRAMES = /keyframes$/u;

/**
 * Opens a raw selector or at-rule condition in a class the compiler wrote.
 */
const RAW = "[";

/**
 * Marks a selector that names a class at all.
 */
const CLASS = ".";

/**
 * The pseudo-class that matches everything once its argument matches nothing.
 */
const NOT = ":not";

/**
 * Matches a class an author named inside a raw selector condition, such as `.childBox` in
 * `[&_.childBox]:c_red`.
 */
const NAMED = /\.[\w-]+/gu;

/**
 * Lists the classes an author named inside the raw conditions of the compiler's classes in one
 * selector.
 *
 * @remarks
 *   A declaration nested under a selector, such as `css({ "& .childBox": { color: "red" } })`,
 *   compiles to a rule whose subject is the compiler's class and whose descendant is the author's,
 *   and the author's class also appears inside the raw condition of the compiler's. The markup
 *   carries the author's class as written, so the rename leaves it alone.
 */
function authoredIn(root: selectorParser.Root): ReadonlySet<string> {
  const found = new Set<string>();

  root.walkClasses((node) => {
    for (const condition of conditionsOf(node.value)) {
      if (!condition.startsWith(RAW)) continue;

      for (const match of condition.matchAll(NAMED)) found.add(match[0].slice(1));
    }
  });

  return found;
}

/**
 * Tells whether a node is an at-rule.
 */
function isAtRule(node: Node | undefined): node is AtRule {
  return node?.type === "atrule";
}

/**
 * Tells whether a rule's selectors are keyframe steps, which name no class.
 */
function inKeyframes(rule: Rule): boolean {
  return isAtRule(rule.parent) && KEYFRAMES.test(rule.parent.name);
}

/**
 * Records that one class the compiler wrote was renamed to a name.
 */
function record(sources: Sources, renamed: string, pandaClass: string): void {
  const from = sources.get(renamed) ?? new Set<string>();

  from.add(pandaClass);
  sources.set(renamed, from);
}

/**
 * Tells whether a class sits under a raw selector or at-rule condition, at any depth.
 */
function isRaw(pandaClass: string): boolean {
  return conditionsOf(pandaClass).some((condition) => condition.startsWith(RAW));
}

/**
 * Renames one class the compiler wrote, once per call, and records what it saw of it.
 */
function renamedOf(pandaClass: string, config: CompilerConfig, pass: Pass): string {
  const known = pass.renamed.get(pandaClass);

  if (known !== undefined) return known;

  const renamed = rename(pandaClass, config);

  pass.renamed.set(pandaClass, renamed);
  if (renamed === "") pass.unreachable.add(pandaClass);
  else {
    record(pass.sources, renamed, pandaClass);
    if (isRaw(pandaClass)) pass.raw.add(pandaClass);
  }

  return renamed;
}

/**
 * Clears the space a selector opens with once it leads a list, which the parser keeps on the
 * selector's first node.
 */
function trimStart(selector: selectorParser.Selector): void {
  selector.first.spaces.before = "";
}

/**
 * Removes the selector around a node that never matches, and what its absence implies for the
 * selector around that.
 *
 * @remarks
 *   The node is a class no element carries, or a pseudo-class whose argument was removed. At the
 *   top level its selector goes. Inside `:not()` nothing changes, because the negation of a class
 *   nothing carries matches everything, and it does so at the specificity of the class, which a
 *   rewrite to `*` would lose. Inside `:is()`, `:where()` or `:has()` the selector goes and the
 *   list stands, unless it was the last one, in which case the list never matches and the
 *   pseudo-class is removed the same way. A selector an earlier removal took away is left as it
 *   is.
 */
function drop(node: selectorParser.Node): void {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a class and a pseudo-class with an argument sit inside a selector
  const selector = node.parent as selectorParser.Selector;
  const list = selector.parent;

  if (list === undefined) return;
  if (!selectorParser.isPseudo(list)) {
    selector.remove();

    return;
  }
  if (list.value.toLowerCase() === NOT) return;
  if (list.length > 1) {
    selector.remove();
    trimStart(list.first);

    return;
  }
  drop(list);
}

/**
 * Builds the selector transform for one call: it renames each class the compiler wrote, then
 * removes each selector that needs a class no element carries.
 *
 * @remarks
 *   The removals run after the walk, so the walk never visits a node its own callback removed. A
 *   class an author named inside a raw condition is passed over, because the markup carries it as
 *   written.
 */
function transformer(config: CompilerConfig, pass: Pass): (selector: string) => string {
  const processor = selectorParser((root) => {
    const dead: selectorParser.ClassName[] = [];
    const authored = authoredIn(root);

    root.walkClasses((node) => {
      if (authored.has(node.value)) return;

      const renamed = renamedOf(node.value, config, pass);

      if (renamed === "") dead.push(node);
      else if (renamed !== node.value) node.value = renamed;
    });
    for (const node of dead) drop(node);
  });

  return (selector) => processor.processSync(selector).trim();
}

/**
 * Removes every rule and at-rule block the rename left empty, innermost first.
 *
 * @remarks
 *   An at-rule without a block, such as a layer order statement, has no nodes and is kept.
 */
function prune(container: Container): void {
  container.each((node) => {
    if (node.type !== "atrule" && node.type !== "rule") return;

    prune(node);

    if (node.nodes?.length === 0) node.remove();
  });
}

/**
 * Lists each name two or more classes were renamed to.
 */
function collisions(sources: Sources): Diagnostic[] {
  return [...sources]
    .filter(([, from]) => from.size > 1)
    .map(([renamed, from]): Diagnostic => ({
      code: "naming/collision",
      message: `${[...from].toSorted().join(", ")} rename to one class, ${renamed}`,
      severity: "error",
    }));
}

/**
 * Reports a set of classes as one warning that opens with their count, or nothing where the set
 * is empty.
 */
function warning(code: string, classes: ReadonlySet<string>, rest: string): Diagnostic[] {
  if (classes.size === 0) return [];

  const count = classes.size === 1 ? "1 class is" : `${String(classes.size)} classes are`;

  return [
    { code, help: [...classes].toSorted(), message: `${count} ${rest}`, severity: "warning" },
  ];
}

/**
 * Renames every class selector of a stylesheet into the scheme.
 *
 * @remarks
 *   A rule inside a keyframes block and a rule that names no class are left as they are.
 * @returns The stylesheet renamed, with a diagnostic for each collision, one for the classes whose
 *   rules were removed, and one for the classes kept under a raw condition.
 */
export function renameSelectors(css: string, config: CompilerConfig): Renamed {
  const root = parse(css);
  const pass: Pass = {
    raw: new Set(),
    renamed: new Map(),
    sources: new Map(),
    unreachable: new Set(),
  };
  const transform = transformer(config, pass);

  root.walkRules((rule) => {
    if (inKeyframes(rule) || !rule.selector.includes(CLASS)) return;

    rule.selector = transform(rule.selector);
    if (rule.selector === "") rule.remove();
  });
  prune(root);

  return {
    css: root.toString(),
    diagnostics: [
      ...collisions(pass.sources),
      ...warning(
        "naming/unreachable",
        pass.unreachable,
        "styled for a boolean axis at false, which no element carries, so the rules were removed. Style the false look in base.",
      ),
      ...warning(
        "naming/raw-condition",
        pass.raw,
        "kept under a raw selector or at-rule condition. A condition named in the preset is renamed.",
      ),
    ],
  };
}
