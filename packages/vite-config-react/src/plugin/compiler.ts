/**
 * Configures the React Compiler, which memoises a component so that nothing has to by hand.
 *
 * @remarks
 *   The compiler runs as a Babel pass rather than through the React plugin's own `compiler`
 *   option. That option asks the plugin to resolve `babel-plugin-react-compiler` from its own
 *   directory, and an isolated node_modules gives it no way to reach a package this workspace
 *   installed, so the option compiles nothing and silently turns fast refresh off as well.
 *   Running the preset through the Babel bridge resolves it from here, where it is declared.
 */

import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { type UserConfig } from "vite";

import { type Layer, override, type Override } from "@stealthscale/vite-config";

import { major } from "#version.ts";

/**
 * The mode a specification run composes its configuration under.
 *
 * @remarks
 *   The compiler writes a memo cache around every component it compiles, and each cache is a branch
 *   the author did not write. Coverage counts those branches, so a package holding itself to full
 *   branch coverage would be asked to exercise a compiler's caching rather than its own code. A
 *   specification reads what the author wrote, and the build is what proves the compiled form.
 */
const TESTING = "test";

/**
 * The file kinds the compiler reads.
 *
 * @remarks
 *   Markdown that renders is named apart rather than folded into the character class, because a
 *   class of `jtm` would claim `.msx` and still miss `.mdx`. The MDX plugin puts itself ahead of
 *   this one, so what arrives here is the component a document compiled to. The alternative closes
 *   on a query instead of on the end of the identifier, because the dev server appends one to
 *   every module it re-transforms and a pattern anchored at the end would skip all of them.
 */
const COMPILED = /\.(?:[jt]sx?|mdx)(?:$|\?)/u;

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
 * The errors the compiler raises rather than swallowing.
 *
 * @remarks
 *   A critical error is the compiler failing its own invariant, and an unrecognised one is a case
 *   it has no reading for. Both mean the compiler is wrong rather than the code, and at the
 *   shipped default of `none` both leave the function uncompiled without a word. Every other bail
 *   is a pattern the compiler declines on purpose and still skips quietly.
 */
const RAISED = "critical_errors";

/**
 * Narrows what the compiler reads and which runtime it writes against.
 */
export interface Compiled {
  /**
   * Whether the compiler runs under a build alone, leaving a dev server's transforms to the JSX
   * plugin. Everywhere but a specification run where a caller states nothing.
   *
   * @remarks
   *   The compiler is most of what a cold dev transform costs, so a package that wants the faster
   *   loop states `build` and keeps the memoised form for what it ships. What it gives up is the
   *   compiler's reading of its components while it edits them, which is where the compiler
   *   reports a memoisation it could not keep.
   */
  only?: "build";

  /**
   * Which React the memo cache is written for. The installed one where a caller states none. React
   * 19 carries the runtime itself, and an earlier one takes it from `react-compiler-runtime`.
   */
  target?: (typeof TARGETS)[number];
}

/**
 * Reads the target from the React a build resolves.
 *
 * @remarks
 *   The target comes from the tree rather than from a constant here, so a major upgrade needs no
 *   edit in this package and no edit in a consumer. A React newer than the compiler knows about
 *   takes the newest target, because every one of those carries the runtime in React itself, which
 *   is the whole of what the newest target means.
 * @param stated - The target a caller named, if any.
 * @returns The target to write the memo cache against.
 * @throws {@link Error} When the installed React is older than any target the compiler has.
 */
function targeted(stated: Compiled["target"]): (typeof TARGETS)[number] {
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
 * Returns the preset, having proved that the compiler behind it can be loaded.
 *
 * @remarks
 *   The preset resolves the compiler when Babel first asks it for one, which is during a
 *   transform. A package missing the dependency would then compile every file with a preset that
 *   contributes nothing, and would build clean while memoising none of it. Asking for the preset
 *   here moves that failure to the moment the configuration is composed, where it names the
 *   package that has to install something.
 * @param target - The React the memo cache is written for.
 * @returns The preset, ready for the Babel bridge.
 * @throws {@link Error} When the compiler cannot be resolved from this package.
 */
function installed(target: Compiled["target"]): ReturnType<typeof reactCompilerPreset> {
  const preset = reactCompilerPreset({ panicThreshold: RAISED, target });
  const build = preset.preset;

  if (typeof build !== "function") return preset;

  try {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the preset takes the api Babel hands it, and forcing the resolve needs none of it
    (build as () => unknown)();
  } catch (error) {
    throw new Error(
      "the React Compiler cannot be loaded: add babel-plugin-react-compiler and @rolldown/plugin-babel to this package, or pass compiler: false to react.layers()",
      { cause: error },
    );
  }

  return preset;
}

/**
 * Builds the bridge that runs the compiler over what a package compiles.
 *
 * @param target - The React the memo cache is written for.
 * @returns The plugin, which the bundler resolves before it runs.
 */
function bridge(target: Compiled["target"]): ReturnType<typeof babel> {
  return babel({ include: COMPILED, presets: [installed(target)] });
}

/**
 * One bundle the packer builds, which is the whole of `pack` unless a package states several.
 */
type Bundle = Exclude<NonNullable<UserConfig["pack"]>, readonly unknown[]>;

/**
 * Appends the bridge to one bundle's own plugin list.
 *
 * @remarks
 *   What the bundle already holds is nested rather than spread, because the packer's plugin field
 *   takes a single plugin, a list, a promise of either, or `false`, and a list nested inside a list
 *   is flattened. Spreading it would iterate whichever of those it is.
 */
function also(bundle: Bundle, plugin: ReturnType<typeof babel>): Bundle {
  return { ...bundle, plugins: [bundle.plugins ?? [], plugin] };
}

/**
 * The command a dev server composes its configuration under.
 */
const SERVING = "serve";

/**
 * Adds the compiler to the plugins a tier already built, for everything but a specification run,
 * and but a dev server where the caller asked for the compiler under a build alone.
 *
 * @remarks
 *   An override rather than a contribution, because only an override is handed the mode and the
 *   command the configuration is being composed under.
 */
function built(stated: Compiled, target: Compiled["target"]): Override {
  const plugin = bridge(target);

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
 *   The packer reads `pack.plugins` and nothing under `plugins`, so a library needs the bridge
 *   stated a second time. Without it a library publishes what its author wrote, and a consumer
 *   installing it compiles nothing under `node_modules`, so the published copy is the one place
 *   the memo cache never gets written.
 *   An override rather than a contribution, because a contribution would invent a packer for an
 *   application, which has none and builds through `plugins` alone. An override reads the config
 *   every layer composed and can leave an application as it found it.
 */
function packed(target: Compiled["target"]): Override {
  const plugin = bridge(target);

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
 *   A component the compiler memoised needs no `useMemo` and no `useCallback` for speed. Both are
 *   still written where a caller depends on one identity for the life of a component, which the
 *   compiler does not promise: it caches against the values it read, so an identity changes when
 *   one of them does.
 *   Both plugin instances are constructed when this call runs, not when the configuration
 *   resolves, so two calls produce two independent pairs.
 * @param stated - Which React to write the memo cache for, React 19 where a caller states none,
 *   and whether to compile under a build alone.
 * @returns Each layer under the name of the call that produced it.
 */
export function compiler(stated: Compiled = {}): readonly Layer[] {
  const target = targeted(stated.target);

  return [built(stated, target), packed(target)];
}
