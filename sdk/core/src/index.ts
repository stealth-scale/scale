/**
 * Declares the contracts and manifests of plugins, evaluates their conditions, and resolves a
 * product from them.
 *
 * The package loads no other package at run time, so the build, the host and a service read the
 * same contract objects in Node and in a browser.
 *
 * @packageDocumentation
 */

export * from "#access.ts";
export * from "#catalogue.ts";
export * from "#code.ts";
export * from "#command.ts";
export * from "#condition.ts";
export * from "#config.ts";
export * from "#contract.ts";
export * from "#data.ts";
export * from "#declaration.ts";
export * from "#define.ts";
export * from "#flag.ts";
export * from "#host-api.ts";
export * from "#host.ts";
export * from "#identifiers.ts";
export * from "#manifest.ts";
export * from "#marker.ts";
export * from "#product.ts";
export * from "#reference.ts";
export * from "#resolve/options.ts";
export * from "#resolve/problem.ts";
export * from "#resolve/resolve.ts";
export * from "#resolve/resolved.ts";
export * from "#route.ts";
export * from "#session.ts";
export * from "#settings.ts";
export * from "#slot.ts";
export * from "#version.ts";
