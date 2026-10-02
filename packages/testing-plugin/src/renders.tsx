/**
 * Derives the render cases of a plugin's routes and extensions, and the run case of its commands.
 *
 * @remarks
 *   Each case creates its own product, host and router. A route renders at its sample, an
 *   extension renders on its own with its target's props, and a command runs through the host's
 *   registry, so its condition and the commands it needs apply as they do in a product. A route
 *   and a command render under the first context in which their condition is true.
 */

import { createElement, type FunctionComponent, type ReactElement } from "react";

import { act } from "@testing-library/react";

import {
  type ExtensionPosition,
  type ExtensionTarget,
  isEvery,
  type LazyComponent,
  type PluginManifest,
  type RouteCode,
  targetKeyOf,
} from "@stealthscale/sdk-core";
import { Boundary, useCommand } from "@stealthscale/sdk-plugin";

import { audited, messageOf } from "#audit.tsx";
import { type Check } from "#check.ts";
import { renderPluginHook } from "#render.tsx";
import { validateEmpty } from "#resolution.ts";
import { satisfiedFor } from "#satisfied.ts";
import { type Subject } from "#subject.ts";

/**
 * Describes what an audited render of one extension saw.
 */
interface Seen {
  /**
   * Each error a render of the extension threw.
   */
  readonly errors: unknown[];

  /**
   * True once a render of the extension committed.
   */
  rendered: boolean;
}

/**
 * The content a wrapping extension renders around in its own case.
 */
const WRAPPED = "Wrapped content";

/**
 * Returns the props an extension renders with in its own case: its target's sample props, the
 * target's id, and content where it wraps.
 */
export function targetPropsOf(
  target: ExtensionTarget,
  position: ExtensionPosition,
): Readonly<Record<string, unknown>> {
  const wrapped = position === "wrap" ? { children: WRAPPED } : {};

  if (isEvery(target)) return { ...wrapped, targetId: targetKeyOf(target) };

  const own = target.kind === "route" ? { routeId: target.id } : (target.sample ?? {});

  return { ...own, ...wrapped, targetId: target.id };
}

/**
 * Imports an extension's component, and returns an element of it with the props.
 *
 * @param id - Qualified id of the extension, which the error names.
 * @param component - The importer the manifest maps the extension to, where it maps one.
 * @param props - The props the element renders with.
 * @throws {@link Error} Where the manifest maps no importer, or the module exports no function.
 */
export async function elementOf(
  id: string,
  component: LazyComponent | undefined,
  props: Readonly<Record<string, unknown>>,
): Promise<ReactElement> {
  const [found] = component === undefined ? [] : Object.values(await component());

  if (found === undefined) throw new Error(`extension ${id} has no component to render.`);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the manifest's types check the component against its target's props
  return createElement(found as FunctionComponent<Readonly<Record<string, unknown>>>, props);
}

/**
 * Returns a manifest whose code maps one route to another importer.
 */
function withRoute(manifest: PluginManifest, name: string, code: RouteCode): PluginManifest {
  return {
    ...manifest,
    code: { ...manifest.code, routes: { ...manifest.code.routes, [name]: code } },
  };
}

/**
 * Returns the cases of every route: its render and its data's load at its sample, and its
 * fallback's render.
 */
function routeCases(subject: Subject): readonly Check[] {
  const { contract, manifest } = subject;

  return Object.entries(contract.routes).flatMap(([name, route]) => {
    const code = manifest.code.routes?.[name];
    const fallback = typeof code === "function" ? undefined : code?.fallback;
    const at = { to: route };
    const rendering: Check = {
      name: `route ${route.id} renders at its sample`,
      run: async () => {
        validateEmpty(await audited({ options: satisfiedFor(subject, route.when), route: at }));
      },
    };

    if (fallback === undefined) return [rendering];

    return [
      rendering,
      {
        name: `route ${route.id}'s fallback renders at its sample`,
        run: async () => {
          const satisfied = satisfiedFor(subject, route.when);
          const options = { ...satisfied, manifest: withRoute(manifest, name, fallback) };

          validateEmpty(await audited({ options, route: at }));
        },
      },
    ];
  });
}

/**
 * Renders one extension with its target's props, and lists every fault: a render that threw or
 * never committed, and each rule axe found broken.
 */
async function extensionFaultsOf(
  subject: Subject,
  id: string,
  element: ReactElement,
): Promise<readonly string[]> {
  const seen: Seen = { errors: [], rendered: false };
  const ui = (
    <Boundary
      fallback={null}
      onError={(error) => {
        seen.errors.push(error);
      }}
      onRendered={() => {
        seen.rendered = true;
      }}
      resetKey={id}
    >
      {element}
    </Boundary>
  );
  const faults = await audited({ options: subject, ui });

  return [
    ...seen.errors.map((error) => `extension ${id} failed to render: ${messageOf(error)}`),
    ...(seen.rendered ? [] : [`extension ${id} never committed a render`]),
    ...faults,
  ];
}

/**
 * Returns the cases of every extension: its render with its target's props, and its fallback's.
 */
function extensionCases(subject: Subject): readonly Check[] {
  const { contract, manifest } = subject;

  return Object.entries(contract.extensions).flatMap(([name, extension]) => {
    const entry = manifest.code.extensions?.[name];
    const props = targetPropsOf(extension.target, extension.position);
    const named = `extension ${extension.id}`;

    /**
     * Returns the case that renders one of the extension's components with its target's props.
     */
    const caseOf = (title: string, component: LazyComponent | undefined): Check => ({
      name: title,
      run: async () => {
        const element = await elementOf(extension.id, component, props);

        validateEmpty(await extensionFaultsOf(subject, extension.id, element));
      },
    });

    return entry?.fallback === undefined
      ? [caseOf(`${named} renders with its target's props`, entry?.component)]
      : [
          caseOf(`${named} renders with its target's props`, entry.component),
          caseOf(`${named}'s fallback renders with its target's props`, entry.fallback),
        ];
  });
}

/**
 * Returns the case of every command: a run with its sample through the host's registry.
 */
function commandCases(subject: Subject): readonly Check[] {
  return Object.values(subject.contract.commands).map((reference) => ({
    name: `command ${reference.id} runs with its sample`,
    run: async () => {
      const options = satisfiedFor(subject, reference.when);
      const view = await renderPluginHook(() => useCommand(reference), options);

      try {
        await act(async () => {
          await view.result.current.run(reference.sample);
        });
      } finally {
        view.unmount();
      }
    },
  }));
}

/**
 * Returns the render cases of every route and extension, and the run case of every command.
 */
export function renderCases(subject: Subject): readonly Check[] {
  return [...routeCases(subject), ...extensionCases(subject), ...commandCases(subject)];
}
