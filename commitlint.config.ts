/**
 * What a commit message is checked against.
 *
 * The form is `type(scope): summary`, and `docs/standards/commit-messages.md` holds the rest. What
 * is written here is what a machine can decide; the register, the bullets and what never appears
 * are in that document.
 *
 * Two limits rather than one. `refactor(vite-config-typescript): ` spends 34 characters before the
 * summary starts, so a single 72-character header would leave 38 for the prose and the longest
 * package names would pay for the shortest summaries. The header takes the Conventional Commits
 * limit of 100 and the summary is held to 60 on its own, which is what keeps a subject short
 * whatever it is scoped to. A body line still wraps at 72, where git wraps one.
 */

import { globSync, readFileSync } from "node:fs";

/**
 * The kinds of change a commit can be.
 *
 * Conventional Commits' set without `style`, which this repository has no use for because `vp fmt`
 * settles formatting before a commit exists.
 */
const TYPES = ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "test"];

/**
 * The organisation every package here publishes under, which a scope leaves off.
 */
const ORG = "@stealthscale/";

/**
 * Reads the name a manifest declares, without the organisation in front of it.
 *
 * The name comes from the manifest rather than from the directory holding it, because a package
 * nested a level deeper is named for what it is rather than for where it sits.
 *
 * @param at - The path of the manifest to read.
 * @returns The scope a commit writes to name that package.
 */
function named(at: string): string {
  const held: unknown = JSON.parse(readFileSync(at, "utf8"));
  const name: unknown = typeof held === "object" && held !== null ? Reflect.get(held, "name") : "";

  return typeof name === "string" ? name.replace(ORG, "") : "";
}

/**
 * The packages a commit can name.
 *
 * Read from the tree rather than listed, so a new package is a scope without anybody remembering to
 * add it here. An example takes no scope, and neither does a change spanning packages.
 */
const SCOPES = globSync([
  "apps/*/package.json",
  "components/*/package.json",
  "foundations/*/package.json",
  "foundations/providers/*/package.json",
  "packages/*/package.json",
  "themes/*/package.json",
])
  .map((at) => named(at))
  .toSorted();

/**
 * The part of a parsed commit this rule reads.
 */
interface Parsed {
  /**
   * The summary after the type and the scope, or `null` where the header carries none.
   */
  subject: null | string;
}

/**
 * Reports whether the subject names the change and then stops.
 *
 * A trailing `, so …`, `, which …` or `, not …` carries the reason, the contrast or the thing that
 * made the change possible, and each of those belongs in the body. No upstream rule reports it, and
 * a header pattern that rejected the comma would report it as an empty type instead.
 *
 * @param parsed - The parsed commit, of which only the subject is read.
 * @returns Whether the rule passed, and what to print when it did not.
 */
function subjectNoComma({ subject }: Parsed): [boolean, string] {
  return [
    subject === null || !subject.includes(","),
    "subject may not contain a comma: name the change and stop, and put the reason in the body",
  ];
}

/**
 * The rule as commitlint takes it.
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
