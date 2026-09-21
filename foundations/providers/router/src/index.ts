/**
 * Publishes the pieces an application builds a router from: the options every router starts from,
 * a compiler that turns declarations into routes, and the way a component reaches a declared route
 * whose path its own types do not know.
 *
 * An application calls the library's `createRouter` itself, so every option the library states
 * stays its own to set.
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
  type SearchValidator,
} from "#declaration.ts";
export { declaredOf, type MatchedRoute, useDeclaredRoute, useRouteParams } from "#declared.ts";
export { routerDefaults } from "#defaults.ts";
export { routeHref, useRouteHref, useRouteMap } from "#href.ts";
export { RouteLink, type RouteLinkProps } from "#link.tsx";
export { namedRoute, routeMap, type RouteMap, type StaticName } from "#map.ts";
export { type AppRouterOptions, routerOptions, type RoutesContext } from "#options.ts";
export { type AnyParams, type RouteRef, type RouteTarget } from "#reference.ts";
export { createAppRootRoute } from "#root.ts";
export * from "#tanstack.ts";
