/**
 * Configures the checks commitlint runs on every commit message.
 *
 * @remarks
 *   The form is `type(scope): summary`. `docs/standards/commit-messages.md` states the register,
 *   the bullets and what a message leaves out, and this file states what a machine can check. The
 *   header has the Conventional Commits limit of 100 characters and the summary a limit of 80 of
 *   its own, because `refactor(vite-config-typescript): ` takes 34 characters before the summary
 *   starts. A body line is at most 80 characters, and git wraps one at 72.
 */

import { globSync, readFileSync } from "node:fs";

/**
 * The types a commit may state: the Conventional Commits set without `style`, because `vp fmt`
 * settles formatting before a commit exists.
 */
const TYPES = ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "test"];

/**
 * The npm scope every package publishes under. A commit scope leaves it off.
 */
const ORG = "@stealthscale/";

/**
 * Returns the name a manifest declares, without the npm scope.
 *
 * @remarks
 *   The name comes from the manifest and not from the package's directory, because a package one
 *   level deeper is named for what it is.
 * @param at - Path of the manifest to read.
 * @returns The scope a commit writes for the package.
 */
function named(at: string): string {
  const manifest: unknown = JSON.parse(readFileSync(at, "utf8"));
  const name: unknown =
    typeof manifest === "object" && manifest !== null ? Reflect.get(manifest, "name") : "";

  return typeof name === "string" ? name.replace(ORG, "") : "";
}

/**
 * The package scopes a commit may name.
 *
 * @remarks
 *   The list is read from the tree, so a new package is a scope as soon as it has a manifest. An
 *   example takes no scope, and neither does a change that spans packages.
 */
const SCOPES = globSync([
  "apps/*/package.json",
  "components/*/package.json",
  "foundations/*/package.json",
  "foundations/providers/*/package.json",
  "packages/*/package.json",
  "sdk/*/package.json",
  "themes/*/package.json",
])
  .map((at) => named(at))
  .toSorted();

/**
 * Describes the part of a parsed commit the rule reads.
 */
interface Parsed {
  /**
   * The summary after the type and the scope, or `null` where the header has none.
   */
  subject: null | string;
}

/**
 * Reports whether the subject names the change and stops there.
 *
 * @remarks
 *   A trailing `, so …`, `, which …` or `, not …` adds a reason, a contrast or a cause, and each
 *   of those belongs in the body. No upstream rule reports it. A header pattern that refused the
 *   comma would report it as an empty type instead.
 * @param parsed - The parsed commit, of which only the subject is read.
 * @returns Whether the rule passed, and the message to print where it did not.
 */
function subjectNoComma({ subject }: Parsed): [boolean, string] {
  return [
    subject === null || !subject.includes(","),
    "subject may not contain a comma: name the change and stop, and put the reason in the body",
  ];
}

/**
 * Registers the rule as a commitlint plugin.
 */
const SUBJECT_NO_COMMA = { rules: { "subject-no-comma": subjectNoComma } };

export default {
  plugins: [SUBJECT_NO_COMMA],
  rules: {
    "body-leading-blank": [2, "always"],
    "body-max-line-length": [2, "always", 80],
    "footer-leading-blank": [2, "always"],
    "header-max-length": [2, "always", 100],
    "scope-enum": [2, "always", SCOPES.concat(["rfc", "adr", "examples", "scripts"])],
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "subject-max-length": [2, "always", 80],
    "subject-no-comma": [2, "always"],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [2, "always", TYPES],
  },
};
