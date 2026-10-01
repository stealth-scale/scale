/**
 * Builds an application's router over TanStack Router from declared routes, and resolves a
 * reference to a declared route whose path a component's types do not know.
 *
 * The application calls `createRouter` itself, so every option TanStack Router exposes remains the
 * application's to set.
 *
 * @packageDocumentation
 */

export { basepathOf } from "#basepath.ts";
export { type CompileOptions, compileRoutes } from "#compile.ts";
export {
  type DeclaredRoute,
  type Evaluate,
  type LayoutProps,
  type LazyPage,
  type RouteDeclaration,
  type RouteLoader,
  type RouteLoaderArgs,
  type SearchValidator,
} from "#declaration.ts";
export {
  declaredOf,
  type MatchedRoute,
  useDeclaredRoute,
  useRouteParams,
  useRouteSearch,
} from "#declared.ts";
export { routerDefaults } from "#defaults.ts";
export { routeHref, useRouteHref, useRouteMap } from "#href.ts";
export { RouteLink, type RouteLinkProps } from "#link.tsx";
export { namedRoute, routeMap, type RouteMap, type StaticName } from "#map.ts";
export { type AppRouterOptions, routerOptions, type RoutesContext } from "#options.ts";
export { type AnyParams, type RouteRef, type RouteTarget } from "#reference.ts";
export { createAppRootRoute } from "#root.ts";
export * from "#tanstack.ts";
