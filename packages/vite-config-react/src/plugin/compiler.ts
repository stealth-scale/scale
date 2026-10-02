/**
 * Configures the React Compiler, which memoises a component so that nothing has to by hand.
 *
 * @remarks
 *   The compiler runs through `oxc-transform-react`, oxc's native port of it, in a transform of
 *   this package's own. The React plugin's `compiler` option runs the same port, but only over the
 *   React plugin's `include` and `exclude`, which leave out every specimen and example, and the
 *   packer never runs the React plugin. The transform leaves JSX in place, and the bundler's own
 *   transform compiles it afterwards.
 */

import { type TransformResult } from "oxc-transform-react";
import { type Environment, type Plugin, type UserConfig } from "vite";

import { type Layer, located, override, type Override } from "@stealthscale/vite-config";

import { major } from "#version.ts";

/**
 * The mode a specification run composes its configuration under.
 *
 * @remarks
 *   The compiler writes a memo cache around every component it compiles, and coverage counts each
 *   cache as a branch. Under a full branch-coverage requirement, a package would then have to
 *   exercise the compiler's caching. Specifications read the source as written, and the build
 *   proves the compiled form.
 */
const TESTING = "test";

/**
 * Matches the id of a TypeScript, JavaScript or MDX module, with or without the query a dev server
 * appends.
 *
 * @remarks
 *   The pattern names `.mdx` in an alternative of its own, because a character class of `jtm` would
 *   match `.msx` and miss `.mdx`. The MDX plugin runs first, so an `.mdx` module arrives here as
 *   the component its document compiled to.
 */
const COMPILED = /\.(?:[jt]sx?|mdx)(?:$|\?)/u;

/**
 * Dependency path pattern. Installed packages contain compiled code.
 */
const UNTOUCHED = /\/node_modules\//u;

/**
 * Declaration file pattern: `.d.ts`, `.d.mts`, `.d.cts` and `.d.<extension>.ts`.
 *
 * @remarks
 *   A declaration contains no component. The packer's declaration build passes every declaration
 *   through the plugins as a module of its own form, and the compiler parses a file with a
 *   declaration name as ambient code, which refuses that form.
 */
const DECLARED = /\.d\.(?:[^./?]+\.)?[cm]?ts(?:$|\?)/u;

/**
 * Source text that contains a component or hook name: a capitalised name, a name that opens on
 * `use` and a capital or a digit, `memo` or `forwardRef`.
 *
 * @remarks
 *   The React plugin tests a module with the same expression before it hands the module to the
 *   compiler. The bundler applies it before it calls the transform, so the transform never receives
 *   a module without a match.
 */
const CANDIDATE = /forwardRef|memo|\b(?:[A-Z]|use[A-Z0-9])/u;

/**
 * The query a dev server appends to a module id.
 *
 * @remarks
 *   The compiler reads the language from the file's extension, and it fails to parse a TypeScript
 *   module whose id still ends in a query.
 */
const QUERY = /\?.*$/su;

/**
 * The newest React the compiler has a target for.
 */
const NEWEST = "19";

/**
 * The oldest React the compiler has a target for.
 */
const OLDEST = "17";

/**
 * The Reacts the compiler writes a memo cache for.
 */
const TARGETS = [OLDEST, "18", NEWEST] as const;

/**
 * The compiler errors that stop a build.
 *
 * @remarks
 *   A critical error is the compiler failing one of its own invariants, and an unrecognised one is
 *   a case it has no handling for. Both mean the compiler is wrong and the code is not. At the
 *   compiler's default of `none`, both leave the function uncompiled without a diagnostic. Every
 *   other bail is a pattern the compiler declines on purpose and skips without a diagnostic.
 */
const RAISED = "critical_errors";

/**
 * The compiler's package, in a variable so that the specifier below is not a literal.
 *
 * @remarks
 *   Vite bundles a configuration file before it runs it, and it resolves a literal specifier inside
 *   a dynamic import at bundle time, against the configuration. A variable leaves the specifier for
 *   {@link located} to resolve from this package.
 */
const PORT = "oxc-transform-react";

/**
 * The React a memo cache is written for.
 */
type Target = (typeof TARGETS)[number];

/**
 * Narrows what the compiler reads and which runtime it writes against.
 */
export interface Compiled {
  /**
   * Restricts the compiler to a build when set to `build`. The compiler otherwise runs everywhere
   * but in a specification run.
   *
   * @remarks
   *   `build` takes the compiler's cost out of a dev server's transforms and keeps the memoised
   *   form in what a package publishes. A dev server then reports no compiler error while a
   *   component is edited, and the build reports it instead.
   */
  only?: "build";

  /**
   * Which React the memo cache is written for. A caller that states none gets the installed React.
   * React 19 includes the runtime, and an earlier one takes it from `react-compiler-runtime`.
   */
  target?: Target;
}

/**
 * Reads the target from the React a build resolves.
 *
 * @remarks
 *   The target comes from the tree, so a major upgrade needs no edit in this package and no edit in
 *   a consumer. A React newer than the compiler knows about takes the newest target, because every
 *   one of those includes the runtime, which is the whole of what the newest target means.
 * @param stated - The target a caller named, if any.
 * @returns The target to write the memo cache against.
 * @throws {@link Error} When the installed React is older than any target the compiler has.
 */
function targeted(stated: Compiled["target"]): Target {
  if (stated !== undefined) return stated;

  const held = major();
  const found = TARGETS.find((one) => one === held);

  if (found !== undefined) return found;
  if (Number(held) > Number(NEWEST)) return NEWEST;

  throw new Error(
    `the React Compiler has no target for React ${held}. It writes a memo cache for React ` +
      `${OLDEST} and later. Upgrade React, or pass compiler: false to react.layers().`,
  );
}

/**
 * Returns the module a memo cache imports its runtime from.
 */
function runtimeOf(target: Target): string {
  return target === NEWEST ? "react/compiler-runtime" : "react-compiler-runtime";
}

/**
 * Resolves the compiler from this package, naming the package to install where it is missing.
 *
 * @remarks
 *   The configuration is composed before any module is compiled, so a package without the compiler
 *   fails here with an instruction, before its first transform.
 * @throws {@link Error} When the compiler is not installed beside this package.
 */
function resolved(): string {
  try {
    return located(PORT, import.meta.url);
  } catch (error) {
    throw new Error(
      `the React Compiler cannot be loaded: add ${PORT} to this package, or pass compiler: false to react.layers()`,
      { cause: error },
    );
  }
}

/**
 * Returns the message a failed compile is reported with: each diagnostic and its code frame.
 */
function failure(file: string, result: TransformResult): string {
  const diagnostics = result.errors.map((error) =>
    [error.message, error.codeframe].filter((part) => part !== null).join("\n"),
  );

  return [`the React Compiler could not compile ${file}`, ...diagnostics].join("\n\n");
}

/**
 * Builds the transform that runs the compiler over what a package compiles.
 *
 * @remarks
 *   The compiler loads at the first module the transform receives, so a run that compiles nothing
 *   never loads it. The transform leaves a server environment alone, as the React plugin does, and
 *   the dev server pre-bundles the runtime the memo cache imports.
 * @param target - The React the memo cache is written for.
 * @param port - The compiler's entry, resolved from this package.
 */
function bridge(target: Target, port: string): Plugin {
  let loading: Promise<typeof import("oxc-transform-react")> | undefined;

  return {
    applyToEnvironment: (environment) => environment.config.consumer === "client",
    config: (): UserConfig => ({ optimizeDeps: { include: [runtimeOf(target)] } }),
    enforce: "pre",
    name: "react.plugin.compiler",
    transform: {
      filter: { code: CANDIDATE, id: { exclude: [UNTOUCHED, DECLARED], include: COMPILED } },

      /**
       * Compiles one module, and stops the build with the compiler's diagnostics where it fails.
       *
       * @remarks
       *   The packer's context has no environment, and a module compiled there gets a source map.
       *   A build writes one only where it writes source maps itself.
       */
      async handler(code, id) {
        // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a dynamic import of a specifier in a variable resolves to any, and PORT gives the reason for the variable
        loading ??= import(port) as Promise<typeof import("oxc-transform-react")>;

        const environment: Environment | undefined = this.environment;
        const file = id.replace(QUERY, "");
        const result = await (
          await loading
        ).transform(file, code, {
          jsx: "preserve",
          reactCompiler: { panicThreshold: RAISED, target },
          sourcemap:
            environment?.config.command !== "build" || environment.config.build.sourcemap !== false,
        });

        if (result.fatal) this.error(failure(file, result));

        return { code: result.code, map: result.map ?? null };
      },
    },
  };
}

/**
 * One bundle the packer builds, which is the whole of `pack` unless a package states an array.
 */
type Bundle = Exclude<NonNullable<UserConfig["pack"]>, readonly unknown[]>;

/**
 * Appends the transform to one bundle's own plugin list.
 *
 * @remarks
 *   The bundle's own list is nested in a list, because the packer's plugin field takes a single
 *   plugin, a list, a promise of either, or `false`, and the packer flattens nested lists. A spread
 *   would iterate whichever of those the field contains.
 */
function also(bundle: Bundle, plugin: Plugin): Bundle {
  return { ...bundle, plugins: [bundle.plugins ?? [], plugin] };
}

/**
 * The command a dev server composes its configuration under.
 */
const SERVING = "serve";

/**
 * Adds the compiler to the plugins a tier built, except in a specification run and in a dev server
 * where the caller asked for the compiler under a build alone.
 *
 * @remarks
 *   An override, because only an override receives the mode and the command the configuration is
 *   composed under.
 */
function built(stated: Compiled, target: Target, port: string): Override {
  const plugin = bridge(target, port);

  return override({
    because: "a memoised component renders again only when what it reads has changed",
    name: "react.plugin.compiler",
    refine: (context, config) => {
      const skipped =
        context.mode === TESTING || (stated.only === "build" && context.command === SERVING);

      return skipped ? config : { ...config, plugins: [...(config.plugins ?? []), plugin] };
    },
  });
}

/**
 * Adds the compiler to the plugins the packer runs, for a package that has a packer.
 *
 * @remarks
 *   The packer reads `pack.plugins` and nothing under `plugins`, so a library states the transform
 *   a second time for its published components to be memoised. A consumer compiles nothing under
 *   `node_modules`. The layer is an override, because a contribution would add a packer to an
 *   application, which builds through `plugins` alone.
 */
function packed(target: Target, port: string): Override {
  const plugin = bridge(target, port);

  return override({
    because: "the packer reads its own plugin list, and a published component is memoised there",
    name: "react.plugin.compiler(pack)",
    refine: (context, config) => {
      if (context.mode === TESTING || config.pack === undefined) return config;

      const pack = Array.isArray(config.pack)
        ? config.pack.map((one) => also(one, plugin))
        : also(config.pack, plugin);

      return { ...config, pack };
    },
  });
}

/**
 * Memoises every component and hook a package compiles, in the build and in the packer.
 *
 * @remarks
 *   A component the compiler memoised needs `useMemo` and `useCallback` only where a caller depends
 *   on one identity for the life of the component. The compiler caches against the values a
 *   component read, so an identity changes when one of them does. Each call constructs its own two
 *   plugin instances.
 * @param stated - The React to write the memo cache for, and whether to compile under a build
 *   alone. The installed React by default.
 * @returns Each layer under the name of the call that produced it.
 * @throws {@link Error} When the installed React has no target, or the compiler is not installed.
 */
export function compiler(stated: Compiled = {}): readonly Layer[] {
  const target = targeted(stated.target);
  const port = resolved();

  return [built(stated, target, port), packed(target, port)];
}
