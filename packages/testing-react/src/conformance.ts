/**
 * Checks a React component against the contract every component in this repository keeps.
 *
 * @remarks
 *   A check reports the violations it found rather than a verdict, so a failing assertion names
 *   the part of the contract that broke instead of saying that false is not true.
 */

import { createElement, type ElementType, type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";

import { only, type Rendered } from "#part.ts";

/**
 * Turns on the optional checks and passes a component whatever it needs to render.
 *
 * @remarks
 *   Every field is absent by default, so a bare call checks only what each component owes whatever
 *   else it does: that it renders, merges a className, forwards a ref and spreads unknown props.
 */
export interface ConformanceOptions {
  /**
   * Whether to check that the component renders the element `as` names in place of its own.
   */
  as?: boolean | undefined;

  /**
   * Whether to check that the component renders its child's element in place of its own.
   */
  asChild?: boolean | undefined;

  /**
   * Whether to check that the component renders what it was handed as children.
   */
  children?: boolean | undefined;

  /**
   * The tag the component is expected to render, spelled upper-case.
   */
  element?: string | undefined;

  /**
   * Whether the accessibility audit reads the render one animation frame after the machine
   * commits, which a machine that sets its context again in that frame needs. The conformance
   * checks ignore it.
   */
  frame?: boolean | undefined;

  /**
   * The props the component needs before it can render at all.
   */
  props?: Readonly<Record<string, unknown>> | undefined;

  /**
   * Finds the element to check, where the component's own root is not the first one rendered.
   */
  subject?: ((container: ParentNode) => Rendered) | undefined;

  /**
   * Wraps the component in the provider it cannot render outside.
   */
  wrapper?: ((children: ReactNode) => ReactElement) | undefined;
}

/**
 * The class name handed to a component to see whether it merges a caller's className.
 */
const PROBE = "conformance-probe";

/**
 * An attribute no component names, which catches one that drops what it was not expecting.
 */
const MARK = "data-conformance";

/**
 * Renders a component, inside options.wrapper when one is given.
 */
function drawn(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  options: ConformanceOptions,
): ReturnType<typeof render> {
  const element = createElement(Component, props);

  return render(options.wrapper === undefined ? element : options.wrapper(element));
}

/**
 * Picks the element a check reads, the render's only element unless a subject was given.
 */
function subjectOf(container: ParentNode, options: ConformanceOptions): Rendered {
  return options.subject === undefined ? only(container) : options.subject(container);
}

/**
 * Renders a component, takes one reading off its element, and unmounts it.
 *
 * @remarks
 *   The component is unmounted even when read throws, so one check never reads the element another
 *   check rendered.
 */
function mounted<Held>(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  read: (element: Rendered) => Held,
  options: ConformanceOptions,
): Held {
  const { container, unmount } = drawn(Component, props, options);

  try {
    return read(subjectOf(container, options));
  } finally {
    unmount();
  }
}

/**
 * Describes what a render threw, whether or not it was an Error.
 */
function reason(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Reports whether a component failed to produce an element, and how it failed.
 *
 * @remarks
 *   This check establishes that there is an element to read at all. When it fails, the report
 *   holds that one entry and nothing else, because no later check can run without an element.
 * @returns The failure in words, or undefined once an element the later checks can read exists.
 */
function rendering(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  options: ConformanceOptions,
): string | undefined {
  let held: ReturnType<typeof render>;

  try {
    held = drawn(Component, props, options);
  } catch (error) {
    return `throws when it renders: ${reason(error)}`;
  }

  try {
    subjectOf(held.container, options);

    return undefined;
  } catch {
    return "renders no element";
  } finally {
    held.unmount();
  }
}

/**
 * Lists the ways a component mishandles the className it was passed.
 *
 * @remarks
 *   A component can fail this in two ways. One that never reads the prop drops the caller's class.
 *   One that reads it and assigns it drops its own. The second looks correct at the call site.
 */
function classNames(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  options: ConformanceOptions,
): readonly string[] {
  const merged = mounted(
    Component,
    { ...props, className: PROBE },
    (element) => [...element.classList],
    options,
  );
  const own = mounted(Component, props, (element) => [...element.classList], options);

  return [
    ...(merged.includes(PROBE) ? [] : ["does not merge className"]),
    ...(own.every((one) => merged.includes(one))
      ? []
      : ["replaces its own className instead of merging"]),
  ];
}

/**
 * Reports whether a ref and an unnamed prop both reach the element under check.
 *
 * @remarks
 *   A ref landing on some inner node rather than on the element under check counts as dropped
 *   here, because a caller measuring the component would otherwise measure the wrong box.
 */
function forwarding(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  options: ConformanceOptions,
): readonly string[] {
  let forwarded: unknown;
  const element = mounted(
    Component,
    {
      ...props,
      ref: (held: unknown) => {
        forwarded ??= held;
      },
    },
    (held) => held,
    options,
  );
  const spread = mounted(
    Component,
    { ...props, [MARK]: "held" },
    (held) => held.getAttribute(MARK),
    options,
  );

  return [
    ...(forwarded === element ? [] : ["does not forward ref"]),
    ...(spread === "held" ? [] : ["does not spread unknown props"]),
  ];
}

/**
 * The element a component is asked to render in place of its own, recognised by its A tag.
 */
const CHILD: ReactNode = createElement("a", { href: "#conformance" });

/**
 * The tag a component is asked to render through `as`, recognised the same way.
 */
const TAG = "a";

/**
 * Lists the failures among the parts a caller asked about, and looks at nothing else.
 *
 * @remarks
 *   Not every component takes children, answers to `as`, or answers to `asChild`. A check running
 *   unasked would report a violation against a component that never offered the behaviour in the
 *   first place.
 */
function optional(
  Component: ElementType,
  props: Readonly<Record<string, unknown>>,
  options: ConformanceOptions,
): readonly string[] {
  const found: string[] = [];

  if (options.children === true) {
    const text = mounted(
      Component,
      { ...props, children: "held" },
      (held) => held.textContent,
      options,
    );

    if (text !== "held") found.push("does not render children");
  }

  if (options.as === true) {
    const swapped = mounted(
      Component,
      { ...props, as: TAG },
      (held) => held.tagName.toUpperCase(),
      options,
    );

    if (swapped !== "A") found.push("does not honour as");
  }

  if (options.asChild === true) {
    const swapped = mounted(
      Component,
      { ...props, asChild: true, children: CHILD },
      (held) => held.tagName.toUpperCase(),
      options,
    );

    if (swapped !== "A") found.push("does not honour asChild");
  }

  return found;
}

/**
 * Lists every way a component departs from the contract, in the order the checks run.
 *
 * @remarks
 *   The component is rendered afresh for each check and unmounted after it, so no check reads
 *   state an earlier one left behind and the order of the report is fixed.
 * @returns Each violation as a phrase naming what the component did, or an empty array for a
 *   component that conforms.
 */
export function violations(
  Component: ElementType,
  options: ConformanceOptions = {},
): readonly string[] {
  const props = options.props ?? {};
  const failed = rendering(Component, props, options);

  if (failed !== undefined) return [failed];

  const element = mounted(Component, props, (held) => held.tagName.toUpperCase(), options);
  const wrong =
    options.element !== undefined && element !== options.element
      ? [`renders ${element}, not ${options.element}`]
      : [];

  return [
    ...wrong,
    ...classNames(Component, props, options),
    ...forwarding(Component, props, options),
    ...optional(Component, props, options),
  ];
}
