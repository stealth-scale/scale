/**
 * Compiles declarations into routes under a parent, without touching the parent.
 */

import { createElement, type FunctionComponent } from "react";

import {
  type EnteredLocation,
  type Evaluate,
  type LayoutProps,
  type RouteDeclaration,
  type RouteLoader,
} from "#declaration.ts";
import { type AnyParams } from "#reference.ts";
import {
  type AnyRoute,
  createRoute,
  type ErrorRouteComponent,
  lazyRouteComponent,
  notFound,
  Outlet,
} from "#tanstack.ts";

/**
 * Describes what one compilation needs beyond the declarations themselves.
 */
export interface CompileOptions<Condition = unknown, Context = unknown> {
  /**
   * Builds the error component of each declaration's route, which renders when the page throws or
   * fails to load.
   */
  readonly errorComponent?:
    | ((declaration: RouteDeclaration<Condition>) => ErrorRouteComponent)
    | undefined;

  /**
   * Returns whether a route's condition is true. Required where any declaration states one.
   */
  readonly evaluate?: Evaluate<Condition, Context> | undefined;

  /**
   * The layouts a declaration may name.
   */
  readonly layouts?: Readonly<Record<string, FunctionComponent<LayoutProps>>> | undefined;

  /**
   * The route every compiled route hangs under, which this compilation never changes.
   */
  readonly parent: AnyRoute;
}

/**
 * Describes the state one compilation builds up.
 */
interface Building<Condition, Context> {
  /**
   * The layout names in force at each route built here, so a declaration cannot repeat one.
   */
  readonly applied: Map<AnyRoute, readonly string[]>;

  /**
   * Each declaration by its id, so one naming another as its parent finds it.
   */
  readonly byId: ReadonlyMap<string, RouteDeclaration<Condition>>;

  /**
   * The children of each route built here, attached once everything is created.
   */
  readonly children: Map<AnyRoute, AnyRoute[]>;

  /**
   * The route compiled for each declaration.
   */
  readonly compiled: Map<string, AnyRoute>;

  /**
   * The pathless layout routes built under each route, against the layouts they render.
   */
  readonly frames: Map<AnyRoute, Map<string, AnyRoute>>;

  /**
   * The options this compilation was asked for.
   */
  readonly options: CompileOptions<Condition, Context>;

  /**
   * The ids already used under each route, so a second frame does not collide with the first.
   */
  readonly taken: Map<AnyRoute, Set<string>>;

  /**
   * The routes the caller places itself.
   */
  readonly top: AnyRoute[];
}

/**
 * Describes the part of what the library passes a route's `beforeLoad` that the gate reads.
 *
 * @remarks
 *   The context is typed `unknown` here, because the library infers the route's own context type
 *   from this parameter, and a compiled route is outside the tree that types it.
 */
interface Entering {
  /**
   * The route's context, which contains the router's.
   */
  readonly context: unknown;

  /**
   * The address the navigation enters.
   */
  readonly location: EnteredLocation;
}

/**
 * Describes the part of what the library passes a route's loader that a declared loader reads.
 */
interface Loading {
  /**
   * The controller whose signal aborts when a later navigation supersedes this one.
   */
  readonly abortController: AbortController;

  /**
   * The route's context, which contains the router's.
   */
  readonly context: unknown;

  /**
   * The dependencies `loaderDeps` returned, which contain the route's search.
   */
  readonly deps: Searched;

  /**
   * The parameters the route's path names.
   */
  readonly params: AnyParams;

  /**
   * True where the router loads the route ahead of a navigation.
   */
  readonly preload: boolean;
}

/**
 * Describes the dependencies of a declared loader, which are the route's search alone.
 */
interface Searched {
  /**
   * The route's search, as its validator returned it.
   */
  readonly search: unknown;
}

/**
 * Describes the loader options a declaration with a loader compiles to.
 */
interface Loaded {
  /**
   * Runs the declared loader with the search from the dependencies.
   */
  readonly loader: (options: Loading) => Promise<void> | void;

  /**
   * Returns the route's search as the loader's dependencies.
   */
  readonly loaderDeps: (options: Searched) => Searched;
}

/**
 * Returns the component of a declaration's page, which loads on the first navigation where the page
 * is lazy.
 *
 * @param component - The page, or the importer that resolves to one.
 * @returns The component the route renders.
 */
function pageOf(component: RouteDeclaration["component"]): FunctionComponent {
  return "load" in component ? lazyRouteComponent(component.load, component.export) : component;
}

/**
 * Returns a component that renders a layout around the route below it.
 *
 * @param layout - The layout component the caller registered.
 * @param options - The options the declaration stated for this layout.
 * @returns A component the pathless route renders.
 */
function framed(
  layout: FunctionComponent<LayoutProps>,
  options: RouteDeclaration["layoutOptions"],
): FunctionComponent {
  /**
   * Renders the layout around the route below it.
   *
   * @returns The layout, with the outlet inside it.
   */
  return function Layout() {
    return createElement(layout, { options }, createElement(Outlet));
  };
}

/**
 * Records a route as a child of another, or as one the caller places itself.
 *
 * @param building - The state this compilation has built up.
 * @param under - The route it hangs under.
 * @param route - The route being placed.
 */
function place<Condition, Context>(
  building: Building<Condition, Context>,
  under: AnyRoute,
  route: AnyRoute,
): void {
  if (under === building.options.parent) {
    building.top.push(route);

    return;
  }

  const siblings = building.children.get(under) ?? [];

  siblings.push(route);
  building.children.set(under, siblings);
}

/**
 * Returns an id no sibling of a route has used yet.
 *
 * @param building - The state this compilation has built up.
 * @param under - The route the id has to be unique among the children of.
 * @param name - The layout's name, which the id is derived from.
 * @returns The id, suffixed where the plain one is already used.
 */
function freeId<Condition, Context>(
  building: Building<Condition, Context>,
  under: AnyRoute,
  name: string,
): string {
  const used = building.taken.get(under) ?? new Set<string>();

  building.taken.set(under, used);

  let id = `_${name}`;
  let next = 2;

  while (used.has(id)) {
    id = `_${name}${String(next)}`;
    next += 1;
  }

  used.add(id);

  return id;
}

/**
 * Builds the pathless routes a declaration's layouts need, reusing one already built.
 *
 * @remarks
 *   Two declarations share a frame where they name the same layouts with the same options. A frame
 *   is a route, so two declarations wanting different options need two of them. The key is the JSON
 *   of the names and the options together, which no pair of different chains can produce.
 * @param building - The state this compilation has built up.
 * @param declaration - The declaration whose layouts are being built.
 * @param under - The route the outermost layout hangs under.
 * @returns The route the declaration's own route hangs under.
 * @throws {@link Error} Where a layout nothing provides is named, or where one a route above
 *   already renders is named again.
 */
function framing<Condition, Context>(
  building: Building<Condition, Context>,
  declaration: RouteDeclaration<Condition>,
  under: AnyRoute,
): AnyRoute {
  const names = [...(building.applied.get(under) ?? [])];
  let current = under;

  for (const name of declaration.layout ?? []) {
    const layout = building.options.layouts?.[name];

    if (layout === undefined) {
      throw new Error(`The route ${declaration.id} names the layout ${name}, which is absent.`);
    }

    if (names.includes(name)) {
      throw new Error(
        `The route ${declaration.id} names the layout ${name}, which a route above it already renders.`,
      );
    }

    names.push(name);

    const key = JSON.stringify([names, declaration.layoutOptions ?? null]);
    const built = building.frames.get(current) ?? new Map<string, AnyRoute>();

    building.frames.set(current, built);

    const existing = built.get(key);
    const above = current;

    if (existing === undefined) {
      const frame = createRoute({
        component: framed(layout, declaration.layoutOptions),
        getParentRoute: () => above,
        id: freeId(building, above, name),
      });

      place(building, above, frame);
      built.set(key, frame);
      current = frame;
    } else {
      current = existing;
    }

    building.applied.set(current, [...names]);
  }

  return current;
}

/**
 * Builds the loader options of a route whose declaration states a loader.
 *
 * @remarks
 *   The search is the loader's dependencies, so the router runs the loader again when the search
 *   changes, and keeps one result per search.
 * @param loader - The loader the declaration stated.
 * @returns The options to spread into the route.
 */
function loading(loader: RouteLoader): Loaded {
  return {
    loader: ({ abortController, context, deps, params, preload }) =>
      loader({ context, params, preload, search: deps.search, signal: abortController.signal }),
    loaderDeps: ({ search }) => ({ search }),
  };
}

/**
 * Builds the route one declaration compiles to.
 *
 * @param building - The state this compilation has built up.
 * @param declaration - The route being compiled.
 * @param under - The route it hangs under, frames included.
 * @returns The route, which renders the declaration's page inside the frames it named.
 */
function routeOf<Condition, Context>(
  building: Building<Condition, Context>,
  declaration: RouteDeclaration<Condition>,
  under: AnyRoute,
): AnyRoute {
  const { errorComponent } = building.options;
  const { id, loader, navigation, when } = declaration;

  return createRoute({
    component: pageOf(declaration.component),
    getParentRoute: () => under,
    path: declaration.path,
    staticData: { declared: { id, ...(navigation === undefined ? {} : { navigation }) } },
    ...(errorComponent === undefined ? {} : { errorComponent: errorComponent(declaration) }),
    ...(declaration.search === undefined ? {} : { validateSearch: declaration.search }),
    ...(when === undefined ? {} : { beforeLoad: gate(building, declaration, when) }),
    ...(loader === undefined ? {} : loading(loader)),
  });
}

/**
 * Builds the check a route runs before it is entered.
 *
 * @remarks
 *   The evaluator is read once, when the route is built, so the compiler refuses a declaration that
 *   states a condition without an evaluator before any navigation.
 * @param building - The state this compilation has built up.
 * @param declaration - The route being compiled.
 * @param when - The condition the declaration stated.
 * @returns The check, which the route runs with its context before it loads.
 * @throws {@link Error} Where no evaluator was given.
 */
function gate<Condition, Context>(
  building: Building<Condition, Context>,
  declaration: RouteDeclaration<Condition>,
  when: Condition,
): (entering: Entering) => void {
  const { evaluate } = building.options;

  if (evaluate === undefined) {
    throw new Error(`The route ${declaration.id} states a condition and no evaluator was given.`);
  }

  return ({ context, location }) => {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the caller typed the router's context as `Context`, which the library cannot see for a compiled route
    const allowed = evaluate(when, context as Context, location);

    // eslint-disable-next-line typescript/only-throw-error -- the library's refusal is a value, not an Error subclass
    if (!allowed) throw notFound();
  };
}

/**
 * Compiles one declaration, and whatever it nests under, first.
 *
 * @param building - The state this compilation has built up.
 * @param declaration - The route being compiled.
 * @param seen - The ids being compiled further up this chain, which detects a cycle.
 * @returns The route the declaration compiled to.
 * @throws {@link Error} Where a parent is absent or the parents form a cycle.
 */
function compiledFor<Condition, Context>(
  building: Building<Condition, Context>,
  declaration: RouteDeclaration<Condition>,
  seen: ReadonlySet<string>,
): AnyRoute {
  const already = building.compiled.get(declaration.id);

  if (already !== undefined) return already;

  if (seen.has(declaration.id)) {
    throw new Error(`The route ${declaration.id} nests under itself.`);
  }

  const above = declaration.parent;
  let under = building.options.parent;

  if (above !== undefined) {
    const owner = building.byId.get(above);

    if (owner === undefined) {
      throw new Error(`The route ${declaration.id} names the parent ${above}, which is absent.`);
    }

    under = compiledFor(building, owner, new Set([...seen, declaration.id]));
  }

  const inside = framing(building, declaration, under);
  const route = routeOf(building, declaration, inside);

  place(building, inside, route);
  building.applied.set(route, building.applied.get(inside) ?? []);
  building.compiled.set(declaration.id, route);

  return route;
}

/**
 * Refuses a declaration this package cannot honour, before any of them is compiled.
 *
 * @remarks
 *   A matched route renders the whole screen, so a page rendered beside another as a pane has no
 *   route of its own. The library has no named outlet: `Outlet` takes no name, one route matches
 *   per level, and two outlets in one component render the same child twice.
 * @param declarations - The routes to compile.
 * @throws {@link Error} Where one states an outlet.
 */
function refuse<Condition>(declarations: ReadonlyArray<RouteDeclaration<Condition>>): void {
  for (const declaration of declarations) {
    if (declaration.outlet !== undefined) {
      throw new Error(
        `The route ${declaration.id} states the outlet ${declaration.outlet}. A route renders the whole screen, so no pane exists to render a second page in.`,
      );
    }
  }
}

/**
 * Indexes declarations by id, refusing a second one that claims an id already taken.
 *
 * @param declarations - The routes to compile.
 * @returns Each declaration against its id.
 * @throws {@link Error} Where two declarations share an id.
 */
function indexed<Condition>(
  declarations: ReadonlyArray<RouteDeclaration<Condition>>,
): ReadonlyMap<string, RouteDeclaration<Condition>> {
  const byId = new Map<string, RouteDeclaration<Condition>>();

  for (const declaration of declarations) {
    if (byId.has(declaration.id)) {
      throw new Error(`Two routes declare the id ${declaration.id}.`);
    }

    byId.set(declaration.id, declaration);
  }

  return byId;
}

/**
 * Compiles declarations into routes under the parent a caller states.
 *
 * @remarks
 *   The compiler creates routes and never mutates the parent, so a second call returns a second set
 *   of routes that shares no object with the first. Two routers in one process therefore never read
 *   each other's tree through the library's process-wide cache. Compile every contributor's
 *   declarations in one call: two calls under one parent cannot see each other's paths, and
 *   `routeMap` reports the collision once the tree is assembled.
 * @param declarations - The routes to compile, in any order.
 * @param options - The parent, and what the declarations may name.
 * @returns The routes to place in the parent's own `addChildren` call.
 * @throws {@link Error} Where two declarations share an id, where one names a parent or a layout
 *   nothing provides, where one names a layout a route above it already renders, where parents form
 *   a cycle, where one states a condition and no evaluator was given, or where one states an
 *   outlet.
 */
export function compileRoutes<Condition = unknown, Context = unknown>(
  declarations: ReadonlyArray<RouteDeclaration<Condition>>,
  options: CompileOptions<Condition, Context>,
): readonly AnyRoute[] {
  refuse(declarations);

  const building: Building<Condition, Context> = {
    applied: new Map(),
    byId: indexed(declarations),
    children: new Map(),
    compiled: new Map(),
    frames: new Map(),
    options,
    taken: new Map(),
    top: [],
  };

  for (const declaration of declarations) compiledFor(building, declaration, new Set());

  for (const [route, children] of building.children) route.addChildren(children);

  return building.top;
}
