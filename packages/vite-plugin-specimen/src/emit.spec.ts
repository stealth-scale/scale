import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { type Source } from "#contract.ts";
import {
  accepting,
  anatomised,
  fragmented,
  listings,
  ownerOf,
  type Resolved,
  written,
} from "#emit.ts";

const SERVING: Resolved = { command: "serve", root: "/work" };

const BUILDING: Resolved = { command: "build", root: "/work" };

function file(id: string, path = "/work/src/badge/badge.specimen.tsx"): Source {
  return { path, text: `export default specimen({ id: "${id}", scenes: [] });\n` };
}

function listed(held: ReadonlyMap<string, { listing: string }>, path: string): string {
  return held.get(path)?.listing ?? "";
}

describe("emit", () => {
  it("says a page's path against the root", () => {
    const held = listings(SERVING, [file("feedback/badge")]);

    expect(listed(held, "/work/src/badge/badge.specimen.tsx")).toMatch(
      /path: "src\/badge\/badge\.specimen\.tsx"/u,
    );
  });

  it("imports a page's scenes from the absolute path the bundler resolves", () => {
    const held = listings(SERVING, [file("feedback/badge")]);

    expect(listed(held, "/work/src/badge/badge.specimen.tsx")).toMatch(
      /load: \(\) => import\("\/work\/src\/badge\/badge\.specimen\.tsx"\)/u,
    );
  });

  it("imports nothing a catalogue does not read", () => {
    const held = listings(SERVING, [file("feedback/badge")]);

    expect(listed(held, "/work/src/badge/badge.specimen.tsx")).not.toMatch(/\?raw|source:/u);
  });

  it("imports a page's fragments under its identifier", () => {
    const held = listings(SERVING, [file("feedback/badge")]);

    expect(listed(held, "/work/src/badge/badge.specimen.tsx")).toMatch(
      /virtual:specimen-fragments\/feedback\/badge/u,
    );
  });

  it("records the identifier a listing is addressed by", () => {
    const held = listings(SERVING, [file("feedback/badge")]);

    expect(held.get("/work/src/badge/badge.specimen.tsx")?.id).toBe("feedback/badge");
  });

  it("records no identifier for a file it refused", () => {
    const held = listings(SERVING, [{ path: "/work/a.specimen.tsx", text: "export default 1;\n" }]);

    expect(held.get("/work/a.specimen.tsx")?.id).toBeUndefined();
  });

  it("lists a refused file under its path with the reason as its opening", () => {
    const held = listings(SERVING, [{ path: "/work/a.specimen.tsx", text: "export default 1;\n" }]);

    expect(listed(held, "/work/a.specimen.tsx")).toMatch(/about: "states a default export/u);
  });

  it("loads a rejection for a refused file", () => {
    const held = listings(SERVING, [{ path: "/work/a.specimen.tsx", text: "export default 1;\n" }]);

    expect(listed(held, "/work/a.specimen.tsx")).toMatch(/Promise\.reject/u);
  });

  it("carries no fragments loader on a refused file", () => {
    const held = listings(SERVING, [{ path: "/work/a.specimen.tsx", text: "export default 1;\n" }]);

    expect(listed(held, "/work/a.specimen.tsx")).not.toMatch(/fragments:/u);
  });

  it("throws when a build met a file it cannot read", () => {
    expect(() =>
      listings(BUILDING, [{ path: "/work/a.specimen.tsx", text: "export default 1;\n" }]),
    ).toThrow(/could not index 1 of 1 files/u);
  });

  it("names every unreadable file in the one error a build throws", () => {
    expect(() =>
      listings(BUILDING, [
        { path: "/work/a.specimen.tsx", text: "export default 1;\n" },
        { path: "/work/b.specimen.tsx", text: "export const b = 1;\n" },
      ]),
    ).toThrow(/b\.specimen\.tsx/u);
  });

  it("keeps a page in the index when a build read it", () => {
    const held = listings(BUILDING, [file("feedback/badge")]);

    expect(held.size).toBe(1);
  });

  it("writes the pages as one exported list", () => {
    const refused = new Map([["/work/src/a.specimen.tsx", { id: undefined, listing: "  { a }" }]]);

    expect(written(refused)).toBe("export const pages = [\n  { a },\n];\n");
  });

  it("writes the statement that makes a module accept its own hot update and tell the window", () => {
    expect(accepting("data/badge", "module")).toBe(
      "if (import.meta.hot) import.meta.hot.accept((replaced) => { if (replaced !== undefined) " +
        'window.dispatchEvent(new CustomEvent("specimen:updated", ' +
        '{ detail: { module: replaced, id: "data/badge" } })); });\n',
    );
    expect(accepting("data/badge", "fragments")).toContain(
      '{ fragments: replaced, id: "data/badge" }',
    );
  });

  it("carries a props loader when the index was asked to read props", () => {
    const held = listings(SERVING, [file("feedback/badge")], true);

    expect(listed(held, "/work/src/badge/badge.specimen.tsx")).toMatch(
      /props: \(\) => import\("virtual:specimen-props\/feedback\/badge"\)/u,
    );
  });

  it("carries no props loader when it was not", () => {
    const held = listings(SERVING, [file("feedback/badge")]);

    expect(listed(held, "/work/src/badge/badge.specimen.tsx")).not.toMatch(/props:/u);
  });

  it("writes the anatomy as three exported records", () => {
    expect(anatomised({ dropped: {}, parts: {}, shapes: {} })).toBe(
      "export const dropped = {};\nexport const parts = {};\nexport const shapes = {};\n",
    );
  });

  it("writes the fragments as one exported record beside the imported names that accepts its own update", () => {
    expect(fragmented({ Sizes: "const a = 1;" }, ["Badge"], "data/badge")).toBe(
      'export const fragments = {"Sizes":"const a = 1;"};\nexport const imported = ["Badge"];\n' +
        accepting("data/badge", "fragments"),
    );
  });

  it("names the package whose manifest sits nearest above a file", () => {
    const held = withScratchWorkspace(
      {
        "package.json": '{ "name": "@kit/root" }',
        "packages/actions/package.json": '{ "name": "@kit/actions" }',
        "packages/actions/src/button.specimen.tsx": "",
      },
      (scratch) => ownerOf(scratch.path("packages/actions/src/button.specimen.tsx")),
    );

    expect(held).toBe("@kit/actions");
  });

  it("climbs past a manifest that states no name", () => {
    const held = withScratchWorkspace(
      {
        "packages/actions/package.json": '{ "name": "@kit/actions" }',
        "packages/actions/src/button.specimen.tsx": "",
        "packages/actions/src/package.json": '{ "type": "module" }',
      },
      (scratch) => ownerOf(scratch.path("packages/actions/src/button.specimen.tsx")),
    );

    expect(held).toBe("@kit/actions");
  });

  it("returns an empty name when no manifest above the file states one", () => {
    expect(ownerOf("/no-such-tree-for-a-specimen/a.specimen.tsx")).toBe("");
  });

  it("records every manifest directory it walked under the name it found", () => {
    const owners = new Map<string, string>();
    const held = withScratchWorkspace(
      {
        "packages/actions/package.json": '{ "name": "@kit/actions" }',
        "packages/actions/src/button.specimen.tsx": "",
        "packages/actions/src/package.json": '{ "type": "module" }',
      },
      (scratch) => [
        ownerOf(scratch.path("packages/actions/src/button.specimen.tsx"), owners),
        [scratch.path("packages/actions/src"), scratch.path("packages/actions")],
      ],
    );

    expect(held[0]).toBe("@kit/actions");
    expect([...owners.keys()]).toStrictEqual(held[1]);
    expect([...owners.values()]).toStrictEqual(["@kit/actions", "@kit/actions"]);
  });

  it("stops at a directory another file already walked", () => {
    const owners = new Map<string, string>();
    const held = withScratchWorkspace(
      {
        "packages/actions/package.json": '{ "name": "@kit/actions" }',
        "packages/actions/src/button.specimen.tsx": "",
        "packages/actions/src/parts/icon.specimen.tsx": "",
      },
      (scratch) => {
        owners.set(scratch.path("packages/actions"), "@kit/cached");

        return ownerOf(scratch.path("packages/actions/src/parts/icon.specimen.tsx"), owners);
      },
    );

    expect(held).toBe("@kit/cached");
    expect(owners.size).toBe(1);
  });

  it("climbs past a manifest that does not parse", () => {
    const held = withScratchWorkspace(
      {
        "packages/actions/package.json": '{ "name": "@kit/actions" }',
        "packages/actions/src/button.specimen.tsx": "",
        "packages/actions/src/package.json": "{",
      },
      (scratch) => ownerOf(scratch.path("packages/actions/src/button.specimen.tsx")),
    );

    expect(held).toBe("@kit/actions");
  });

  it("climbs past a manifest whose name is empty", () => {
    const held = withScratchWorkspace(
      {
        "packages/actions/package.json": '{ "name": "@kit/actions" }',
        "packages/actions/src/button.specimen.tsx": "",
        "packages/actions/src/package.json": '{ "name": "" }',
      },
      (scratch) => ownerOf(scratch.path("packages/actions/src/button.specimen.tsx")),
    );

    expect(held).toBe("@kit/actions");
  });

  it("says a path that does not sit under the root against the root as well", () => {
    const held = listings(SERVING, [file("feedback/badge", "/elsewhere/badge.specimen.tsx")]);

    expect(listed(held, "/elsewhere/badge.specimen.tsx")).toMatch(
      /path: "\.\.\/elsewhere\/badge\.specimen\.tsx"/u,
    );
  });

  it("names a page's package in its listing", () => {
    const held = withScratchWorkspace(
      {
        "package.json": '{ "name": "@kit/actions" }',
        "src/button.specimen.tsx": "",
      },
      (scratch) =>
        listings({ command: "serve", root: scratch.root }, [
          file("actions/button", scratch.path("src/button.specimen.tsx")),
        ]),
    );

    expect([...held.values()][0]?.listing).toMatch(/package: "@kit\/actions"/u);
  });

  it("carries the namespace a page names its catalogue by", () => {
    const held = listings(SERVING, [
      {
        path: "/work/src/badge/badge.specimen.tsx",
        text: `export default specimen({ id: "data/badge", namespace: "data", scenes: [] });\n`,
      },
    ]);

    expect(listed(held, "/work/src/badge/badge.specimen.tsx")).toMatch(/namespace: "data"/u);
  });

  it("carries an empty namespace for a page that names none", () => {
    const held = listings(SERVING, [file("feedback/badge")]);

    expect(listed(held, "/work/src/badge/badge.specimen.tsx")).toMatch(/namespace: ""/u);
  });
});
