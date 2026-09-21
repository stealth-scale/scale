import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { withScratchWorkspace } from "@stealthscale/testing";

import { APP, WORKSPACE } from "#find.fixtures.ts";
import { found, namespaceOf, prefixOf } from "#find.ts";

/**
 * Finds the catalogues of the fixture workspace, each as `owner language/namespace`, with the
 * prefix a file is placed under after a colon.
 *
 * @param scopes - The scopes to follow, for a case that wants more than the application's own.
 * @returns One line per catalogue, in the order found.
 */
function listed(scopes?: readonly string[]): readonly string[] {
  return withScratchWorkspace(WORKSPACE, (scratch) =>
    found(join(scratch.root, APP), scopes).map(
      (one) =>
        `${one.owner} ${one.language}/${one.namespace}${one.prefix === "" ? "" : `:${one.prefix}`}`,
    ),
  );
}

describe("namespaceOf", () => {
  it("returns the file name without its extension", () => {
    expect(namespaceOf("menu.json")).toBe("menu");
  });

  it("returns the first directory name when the file is nested", () => {
    expect(namespaceOf("menu/sections.json")).toBe("menu");
  });
});

describe("prefixOf", () => {
  it("returns an empty string when the file is the namespace", () => {
    expect(prefixOf("menu.json")).toBe("");
  });

  it("joins the path below the namespace with dots", () => {
    expect(prefixOf("menu/sections/billing.yaml")).toBe("sections.billing");
  });
});

describe("found", () => {
  it("returns a package's catalogues before the application's own", () => {
    expect(listed()).toStrictEqual([
      "@house/hooks en/hooks",
      "@house/controls en/controls.demo",
      "@house/controls en/controls",
      "@house/overlays en/overlays",
      "@house/overlays nl/overlays",
      "@house/site en/overlays",
      "@house/site en/site",
      "@house/site en/site:legal",
      "@house/site nl/overlays",
      "@house/site nl/site",
    ]);
  });

  it("sets own to true for the application's catalogues", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const owned = found(join(scratch.root, APP)).map((one) => `${one.owner} ${String(one.own)}`);

      expect([...new Set(owned)].toSorted()).toStrictEqual([
        "@house/controls false",
        "@house/hooks false",
        "@house/overlays false",
        "@house/site true",
      ]);
    });
  });

  it("sets own to false when the root is a package", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { "kit/locales/en/kit.json": '{"go":"Go"}', "kit/package.json": '{"name":"@house/kit"}' },
      (scratch) => {
        expect(found(join(scratch.root, "kit")).map((one) => one.own)).toStrictEqual([false]);
      },
    );
  });

  it("skips a package outside the application's scope", () => {
    expect(listed()).not.toContain("outsider en/outsider");
  });

  it("follows a scope named in scopes", () => {
    expect(listed(["@house", ""])).toContain("outsider en/outsider");
  });

  it("skips a package's devDependencies", () => {
    expect(listed()).not.toContain("@house/never en/never");
  });

  it("normalises a file path to forward slashes", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const [first] = found(join(scratch.root, APP));

      expect(first?.file.endsWith("/@house/hooks/locales/en/hooks.json")).toBe(true);
      expect(first?.file).not.toContain("\\");
    });
  });

  it("returns an empty array when the directory has no manifest", () => {
    expect.hasAssertions();

    withScratchWorkspace({ "empty/.keep": "" }, (scratch) => {
      expect(found(join(scratch.root, "empty"))).toStrictEqual([]);
    });
  });

  it("returns an empty array when the manifest is not valid JSON", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { "app/locales/en/app.json": '{"x":"y"}', "app/package.json": "{not json" },
      (scratch) => {
        expect(found(join(scratch.root, "app"))).toStrictEqual([]);
      },
    );
  });

  it("uses the directory name when the manifest is an array", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { "app/locales/en/app.json": '{"x":"y"}', "app/package.json": "[]" },
      (scratch) => {
        expect(found(join(scratch.root, "app")).map((one) => one.owner)).toStrictEqual(["app"]);
      },
    );
  });

  it("uses the directory name when the manifest has no name", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { "nameless/locales/en/nameless.json": '{"x":"y"}', "nameless/package.json": "{}" },
      (scratch) => {
        expect(found(join(scratch.root, "nameless")).map((one) => one.owner)).toStrictEqual([
          "nameless",
        ]);
      },
    );
  });

  it("sets namespace to the directory name for a nested file", () => {
    expect.hasAssertions();

    withScratchWorkspace(WORKSPACE, (scratch) => {
      const legal = found(join(scratch.root, APP)).find((one) =>
        one.file.endsWith("/locales/en/site/legal.yaml"),
      );

      expect(legal?.namespace).toBe("site");
      expect(legal?.prefix).toBe("legal");
      expect(legal?.language).toBe("en");
    });
  });

  it("joins two directory levels into the prefix with dots", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      { ...WORKSPACE, [`${APP}/locales/en/site/legal/terms.json`]: '{"read":"Read"}' },
      (scratch) => {
        const terms = found(join(scratch.root, APP)).find((one) => one.file.endsWith("terms.json"));

        expect(terms?.namespace).toBe("site");
        expect(terms?.prefix).toBe("legal.terms");
      },
    );
  });

  it("returns an empty array for a package with no locales directory", () => {
    expect.hasAssertions();

    withScratchWorkspace({ "bare/package.json": '{"name":"bare"}' }, (scratch) => {
      expect(found(join(scratch.root, "bare"))).toStrictEqual([]);
    });
  });

  it("returns a package's catalogues once when two packages depend on it", () => {
    expect(listed().filter((line) => line === "@house/hooks en/hooks")).toHaveLength(1);
  });

  it("skips a dependency that is not installed", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      {
        "app/locales/en/app.json": '{"x":"y"}',
        "app/node_modules/@house/broken/locales/en/broken.json": '{"x":"y"}',
        "app/node_modules/@house/broken/package.json": "{not json",
        "app/package.json":
          '{"name":"@house/app","dependencies":{"@house/missing":"1","@house/broken":"1"}}',
      },
      (scratch) => {
        expect(found(join(scratch.root, "app")).map((one) => one.owner)).toStrictEqual([
          "@house/app",
        ]);
      },
    );
  });

  it("follows a package's peerDependencies", () => {
    expect.hasAssertions();

    withScratchWorkspace(
      {
        "app/node_modules/@house/kit/locales/en/kit.json": '{"go":"Go"}',
        "app/node_modules/@house/kit/package.json": '{"name":"@house/kit"}',
        "app/node_modules/@house/parts/package.json":
          '{"name":"@house/parts","peerDependencies":{"@house/kit":"1"}}',
        "app/package.json": '{"name":"@house/app","dependencies":{"@house/parts":"1"}}',
      },
      (scratch) => {
        expect(found(join(scratch.root, "app")).map((one) => one.owner)).toStrictEqual([
          "@house/kit",
        ]);
      },
    );
  });
});
