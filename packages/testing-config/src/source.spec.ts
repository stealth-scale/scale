import { describe, expect, it } from "vitest";

import { type ScratchFiles, withScratchWorkspace } from "@stealthscale/testing";

import { type Published } from "#manifest.ts";
import { declared, jsx, specs } from "#source.ts";

const VALUE = "export function held(): number {\n  return 1;\n}\n";

const TYPES = "export type Held = string;\n\nexport type { Other } from 'elsewhere';\n";

const INTERFACES = "export interface Held {\n  readonly name: string;\n}\n";

const MANIFEST: Published = { name: "@scope/held", peerDependencies: { react: "catalog:" } };

function checked(tree: ScratchFiles): readonly string[] {
  return withScratchWorkspace(tree, (workspace) => specs(workspace.root));
}

function imported(tree: ScratchFiles, published: Published = MANIFEST): readonly string[] {
  return withScratchWorkspace(tree, (workspace) => declared(workspace.root, published));
}

function suffixed(tree: ScratchFiles): readonly string[] {
  return withScratchWorkspace(tree, (workspace) => jsx(workspace.root));
}

describe("specs", () => {
  it("returns no violation for a package with an empty src", () => {
    expect(checked({})).toStrictEqual([]);
  });

  it("returns no violation for a source with a .spec.ts file beside it", () => {
    expect(checked({ "src/held.spec.ts": "", "src/held.ts": VALUE })).toStrictEqual([]);
  });

  it("returns no violation for a source with a .spec.tsx file beside it", () => {
    expect(checked({ "src/held.spec.tsx": "", "src/held.ts": VALUE })).toStrictEqual([]);
  });

  it("reports a source without a spec file beside it", () => {
    expect(checked({ "src/held.ts": VALUE })).toStrictEqual([
      "src/held.ts has no specification beside it",
    ]);
  });

  it("reports a source without a spec file in a nested directory", () => {
    expect(checked({ "src/stores/held.ts": VALUE })).toStrictEqual([
      "src/stores/held.ts has no specification beside it",
    ]);
  });

  it("reports every source without a spec file in path order", () => {
    expect(checked({ "src/a/two.ts": VALUE, "src/one.ts": VALUE })).toStrictEqual([
      "src/a/two.ts has no specification beside it",
      "src/one.ts has no specification beside it",
    ]);
  });

  it("skips a barrel by default", () => {
    expect(checked({ "src/index.ts": VALUE })).toStrictEqual([]);
  });

  it("skips a barrel in a nested directory by default", () => {
    expect(checked({ "src/lint/index.ts": VALUE })).toStrictEqual([]);
  });

  it("reports a barrel without a spec file when barrels is true", () => {
    const found = withScratchWorkspace(
      { "src/index.ts": VALUE, "src/list/index.spec.ts": "", "src/list/index.ts": VALUE },
      (workspace) => specs(workspace.root, true),
    );

    expect(found).toStrictEqual(["src/index.ts has no specification beside it"]);
  });

  it("skips a fixtures file", () => {
    expect(checked({ "src/held.fixtures.tsx": VALUE })).toStrictEqual([]);
  });

  it("skips a specimen file", () => {
    expect(checked({ "src/held.specimen.tsx": VALUE })).toStrictEqual([]);
  });

  it("skips an example file", () => {
    expect(checked({ "src/held/examples/held.example.tsx": VALUE })).toStrictEqual([]);
  });

  it("skips a declaration file", () => {
    expect(checked({ "src/held.d.ts": TYPES })).toStrictEqual([]);
  });

  it("skips a module that exports only types", () => {
    expect(checked({ "src/held.ts": TYPES })).toStrictEqual([]);
  });

  it("skips a module that exports only interfaces", () => {
    expect(checked({ "src/held.ts": INTERFACES })).toStrictEqual([]);
  });

  it("reports a module that exports an interface next to a value", () => {
    expect(checked({ "src/held.ts": `${INTERFACES}\n${VALUE}` })).toStrictEqual([
      "src/held.ts has no specification beside it",
    ]);
  });

  it("reports a module that exports a type next to a value", () => {
    expect(checked({ "src/held.ts": `${TYPES}\n${VALUE}` })).toStrictEqual([
      "src/held.ts has no specification beside it",
    ]);
  });

  it("reports a module without exports", () => {
    expect(checked({ "src/held.ts": "const held = 1;\n" })).toStrictEqual([
      "src/held.ts has no specification beside it",
    ]);
  });

  it("does not report a spec file as a source", () => {
    expect(checked({ "src/held.spec.ts": VALUE })).toStrictEqual([]);
  });
});

describe("declared", () => {
  it("returns no violation for a package with an empty src", () => {
    expect(imported({})).toStrictEqual([]);
  });

  it("accepts an import listed in peerDependencies", () => {
    expect(imported({ "src/held.ts": 'import { useId } from "react";\n' })).toStrictEqual([]);
  });

  it("accepts an import listed in dependencies", () => {
    const published = { ...MANIFEST, dependencies: { zod: "^4.0.0" } };

    expect(imported({ "src/held.ts": 'import { z } from "zod";\n' }, published)).toStrictEqual([]);
  });

  it("reports an import the manifest does not declare", () => {
    expect(imported({ "src/held.ts": 'import { render } from "elsewhere";\n' })).toStrictEqual([
      "src/held.ts imports elsewhere, which the manifest does not declare",
    ]);
  });

  it("reports a scoped import by its full scoped name", () => {
    expect(imported({ "src/held.ts": 'import { theme } from "@scope/theme";\n' })).toStrictEqual([
      "src/held.ts imports @scope/theme, which the manifest does not declare",
    ]);
  });

  it("resolves a subpath import to its package name", () => {
    expect(
      imported({ "src/held.ts": 'import { m } from "react/compiler-runtime";\n' }),
    ).toStrictEqual([]);
  });

  it("resolves a scoped subpath import to its package name", () => {
    const published = { ...MANIFEST, peerDependencies: { "@scope/theme": "workspace:^" } };
    const tree = { "src/held.ts": 'import { recipe } from "@scope/theme/authoring";\n' };

    expect(imported(tree, published)).toStrictEqual([]);
  });

  it("ignores a relative import", () => {
    expect(imported({ "src/held.ts": 'import { near } from "./near.ts";\n' })).toStrictEqual([]);
  });

  it("ignores a # subpath import", () => {
    expect(imported({ "src/held.ts": 'import { near } from "#near.ts";\n' })).toStrictEqual([]);
  });

  it("ignores a node: builtin import", () => {
    expect(imported({ "src/held.ts": 'import { join } from "node:path";\n' })).toStrictEqual([]);
  });

  it("ignores a virtual: module import", () => {
    expect(
      imported({ "src/held.ts": 'import { catalogues } from "virtual:i18n";\n' }),
    ).toStrictEqual([]);
  });

  it("reports the package a module re-exports from", () => {
    expect(imported({ "src/index.ts": 'export { Portal } from "elsewhere";\n' })).toStrictEqual([
      "src/index.ts imports elsewhere, which the manifest does not declare",
    ]);
  });

  it("reports a side-effect import", () => {
    expect(imported({ "src/held.ts": 'import "elsewhere/styles.css";\n' })).toStrictEqual([
      "src/held.ts imports elsewhere, which the manifest does not declare",
    ]);
  });

  it("ignores an import inside a template literal", () => {
    const tree = { "src/held.ts": 'const code = `import { x } from "elsewhere";`;\n' };

    expect(imported(tree)).toStrictEqual([]);
  });

  it("reports a multi-line import", () => {
    const tree = { "src/held.ts": 'import {\n  one,\n  two,\n} from "elsewhere";\n' };

    expect(imported(tree)).toStrictEqual([
      "src/held.ts imports elsewhere, which the manifest does not declare",
    ]);
  });

  it("ignores a quoted string in an export statement", () => {
    expect(imported({ "src/held.ts": 'export const NAME = "elsewhere";\n' })).toStrictEqual([]);
  });

  it("ignores the imports of a spec file", () => {
    expect(imported({ "src/held.spec.ts": 'import { it } from "vitest";\n' })).toStrictEqual([]);
  });

  it("ignores the imports of a fixtures file", () => {
    expect(imported({ "src/held.fixtures.ts": 'import { it } from "vitest";\n' })).toStrictEqual(
      [],
    );
  });

  it("ignores the imports of a specimen file", () => {
    expect(
      imported({ "src/held.specimen.tsx": 'import { specimen } from "@kit/specimen";\n' }),
    ).toStrictEqual([]);
  });

  it("ignores the imports of an example file", () => {
    expect(
      imported({ "src/held/examples/held.example.tsx": 'import { XIcon } from "lucide-react";\n' }),
    ).toStrictEqual([]);
  });

  it("reports every undeclared import in path order", () => {
    const tree = {
      "src/a/two.ts": 'import { two } from "second";\n',
      "src/one.ts": 'import { one } from "first";\n',
    };

    expect(imported(tree)).toStrictEqual([
      "src/a/two.ts imports second, which the manifest does not declare",
      "src/one.ts imports first, which the manifest does not declare",
    ]);
  });
});

describe("jsx", () => {
  it("returns no violation for a package with an empty src", () => {
    expect(suffixed({})).toStrictEqual([]);
  });

  it("accepts a .tsx file with a closing tag", () => {
    expect(suffixed({ "src/held.tsx": "const held = <p>Here</p>;\n" })).toStrictEqual([]);
  });

  it("accepts a .tsx file with a self-closing tag", () => {
    expect(suffixed({ "src/held.tsx": "const held = <Portal />;\n" })).toStrictEqual([]);
  });

  it("accepts a .tsx file with a member expression tag", () => {
    expect(suffixed({ "src/held.tsx": "const held = <Skip.Link>Go</Skip.Link>;\n" })).toStrictEqual(
      [],
    );
  });

  it("reports a .tsx file without JSX", () => {
    expect(suffixed({ "src/held.tsx": VALUE })).toStrictEqual([
      "src/held.tsx writes no JSX, so its suffix is ts",
    ]);
  });

  it("reports a .spec.tsx file without JSX", () => {
    expect(suffixed({ "src/held.spec.tsx": VALUE })).toStrictEqual([
      "src/held.spec.tsx writes no JSX, so its suffix is ts",
    ]);
  });

  it("skips a .ts file", () => {
    expect(suffixed({ "src/held.ts": VALUE })).toStrictEqual([]);
  });

  it("reports every .tsx file without JSX in path order", () => {
    expect(suffixed({ "src/a/two.tsx": VALUE, "src/one.tsx": VALUE })).toStrictEqual([
      "src/a/two.tsx writes no JSX, so its suffix is ts",
      "src/one.tsx writes no JSX, so its suffix is ts",
    ]);
  });
});
