/**
 * Renames the class selectors in a compiled stylesheet to the scheme, and drops the rules left
 * unmatchable.
 *
 * @remarks
 *   The stylesheet is parsed once per compile, and postcss escapes each new name as it writes the
 *   selector back. A boolean axis at `false` emits no class at all, so a selector that requires one
 *   is dead and goes. Two classes that rename to the same name are an error rather than a warning:
 *   one set of rules would start applying to the other, silently.
 */

import { type AtRule, type Container, type Node, parse, type Rule } from "postcss";
import selectorParser from "postcss-selector-parser";

import { type CompilerConfig, conditionsOf, rename } from "@stealthscale/pandacss-naming";

import { type Diagnostic } from "#pandacss.ts";

/**
 * A renamed stylesheet and everything the rename had to report about it.
 */
export interface Renamed {
  /**
   * The stylesheet, with every class selector in the scheme.
   */
  css: string;
  /**
   * An error per collision, then one warning for the classes whose rules were removed and one for
   * the classes kept under a raw condition.
   */
  diagnostics: readonly Diagnostic[];
}

/**
 * The compiler classes behind each new name, keyed by the new name.
 */
type Sources = Map<string, Set<string>>;

/**
 * The state one rename threads through its walk of the stylesheet.
 */
interface Pass {
  /**
   * The compiler classes kept under a raw condition.
   */
  raw: Set<string>;
  /**
   * The new name for each compiler class. A class turns up in many selectors, and this keeps it to
   * one rename per call.
   */
  renamed: Map<string, string>;
  /**
   * The compiler classes behind each new name, for reporting collisions at the end.
   */
  sources: Sources;
  /**
   * The compiler classes no element can carry, whose rules were removed.
   */
  unreachable: Set<string>;
}

/**
 * The at-rules whose child rules are keyframe steps rather than selectors.
 */
const KEYFRAMES = /keyframes$/u;

/**
 * The character that opens a raw selector or at-rule condition inside a compiler class.
 */
const RAW = "[";

/**
 * The character that opens a class in a selector.
 */
const CLASS = ".";

/**
 * The pseudo-class that matches every element when its argument matches none.
 */
const NOT = ":not";

/**
 * An author's own class inside a raw condition, such as `.childBox` in `[&_.childBox]:c_red`.
 */
const NAMED = /\.[\w-]+/gu;

/**
 * Collects the author's own class names out of the raw conditions in one selector.
 *
 * @remarks
 *   A nested declaration such as `css({ "& .childBox": { color: "red" } })` compiles to a rule
 *   whose subject is the compiler's class and whose descendant is the author's, with the author's
 *   class repeated inside the raw condition. Those names stay as written: the author types them
 *   into the markup, so renaming them would break the match.
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
 * Narrows a node to an at-rule.
 */
function isAtRule(node: Node | undefined): node is AtRule {
  return node?.type === "atrule";
}

/**
 * Reports whether a rule sits in a keyframes block, where the selectors are steps and not classes.
 */
function inKeyframes(rule: Rule): boolean {
  return isAtRule(rule.parent) && KEYFRAMES.test(rule.parent.name);
}

/**
 * Notes that a compiler class produced one of the new names.
 */
function record(sources: Sources, renamed: string, pandaClass: string): void {
  const from = sources.get(renamed) ?? new Set<string>();

  from.add(pandaClass);
  sources.set(renamed, from);
}

/**
 * Reports whether a compiler class carries a raw selector or at-rule condition, at any depth.
 */
function isRaw(pandaClass: string): boolean {
  return conditionsOf(pandaClass).some((condition) => condition.startsWith(RAW));
}

/**
 * Renames one compiler class, caching the result and its bookkeeping for the rest of the pass.
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
 * Strips the leading space the parser left on a selector that has just become first in its list.
 */
function trimStart(selector: selectorParser.Selector): void {
  selector.first.spaces.before = "";
}

/**
 * Removes the selector holding an unmatchable node, and the pseudo-class around it when that
 * empties its list.
 *
 * @remarks
 *   Nothing is removed inside `:not()`. Negating a class no element carries matches every element,
 *   at that class's specificity, and rewriting it to `*` would throw the specificity away. Nodes an
 *   earlier removal already detached are left alone.
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
 * Builds the selector transform for one pass: rename every compiler class, then drop the selectors
 * left unmatchable.
 *
 * @remarks
 *   Removals are held back until the walk finishes, so the walk never steps into a node its own
 *   callback detached. Classes the author named inside a raw condition are skipped, since the
 *   author writes those in the markup.
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
 * Removes the rules and at-rule blocks the rename emptied, innermost first.
 *
 * @remarks
 *   An at-rule with no block at all, such as a layer order statement, has no nodes and is kept.
 */
function prune(container: Container): void {
  container.each((node) => {
    if (node.type !== "atrule" && node.type !== "rule") return;

    prune(node);

    if (node.nodes?.length === 0) node.remove();
  });
}

/**
 * Reports every new name that two or more compiler classes landed on.
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
 * Wraps a set of classes in a single warning headed by its count, or nothing when the set is empty.
 */
function warning(code: string, classes: ReadonlySet<string>, rest: string): Diagnostic[] {
  if (classes.size === 0) return [];

  const count = classes.size === 1 ? "1 class is" : `${String(classes.size)} classes are`;

  return [
    { code, help: [...classes].toSorted(), message: `${count} ${rest}`, severity: "warning" },
  ];
}

/**
 * Renames every class selector in a stylesheet to the scheme.
 *
 * @remarks
 *   Rules inside a keyframes block and rules that name no class are passed through untouched.
 * @returns The renamed stylesheet, with a diagnostic per collision, one for the classes whose rules
 *   were removed, and one for the classes kept under a raw condition.
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
