/**
 * Draws the type a prop accepts, with each named type in it opening on what it holds.
 */

import { Fragment, type ReactElement } from "react";

import { Code } from "@stealthscale/component-typography";

import { shortOf, type Shown } from "#catalogue/parted.ts";
import { PropsShown } from "#catalogue/props-shown.tsx";

/**
 * Matches every character a name could hold that a regular expression reads as syntax.
 */
const SYNTAX = /[.*+?^${}()|[\]\\]/gu;

/**
 * Describes what the type takes.
 */
export interface PropsTypeProps {
  /**
   * The type as the compiler prints it.
   */
  readonly accepts: string;

  /**
   * Each named type the printed one refers to.
   */
  readonly shows: readonly Shown[];
}

/**
 * Splits the printed type on the names that can be opened, keeping the names in the pieces.
 *
 * @remarks
 *   The names are escaped before they reach the expression, because a name is the compiler's own
 *   and a type printed with a bracket in it would otherwise be read as syntax.
 */
function split(accepts: string, names: readonly string[]): readonly string[] {
  if (names.length === 0) return [accepts];

  const escaped = names.map((name) => name.replaceAll(SYNTAX, String.raw`\$&`));

  return accepts.split(new RegExp(`(${escaped.join("|")})`, "u"));
}

/**
 * Tells whether a named type holds properties rather than a list of values.
 *
 * @remarks
 *   A member of a union carries a name and nothing else: no type of its own, and nothing written
 *   about it. A member of an object carries at least one of the two. One member with either is
 *   enough, because an object may document some of its properties and not the rest.
 */
function described(shown: Shown): boolean {
  return shown.members.some((member) => member.accepts !== "" || member.says !== "");
}

/**
 * Writes a list of values as the type the compiler would have printed for it.
 */
function listed(shown: Shown): string {
  return shown.members.map((member) => member.name).join(" | ");
}

/**
 * Draws the type, each name in it opening on what it holds.
 *
 * @remarks
 *   A type the reader listed nothing for is drawn as the plain name it is. There is nothing behind
 *   it to open, and a control that opens an empty panel is worse than no control.
 *   A name that stands for a list of values is replaced by the values. The panel it would have
 *   opened is a single column of them, which is shorter written in the row than reached by a
 *   pointer, and a reader comparing two props reads both lists at once rather than one panel at a
 *   time. Only a name that stands for an object keeps its control, because an object carries a type
 *   and a sentence per property and does not fit in a cell.
 *   The whole type is one snippet and the pieces inside it are text. Drawn as a snippet each, a
 *   union of four members came out as four filled boxes with room on either side of every one, and
 *   the spaces and bars between them were dropped, because a snippet lays its content out as a flex
 *   line. What is left is a line of code with a control on each name that opens.
 *   The printed type is matched against the name the compiler prints, not the key the reader holds
 *   the shape by. The key names the package that declared the type as well, which is a name that
 *   appears nowhere in what the compiler printed.
 * @param props - The printed type and the named types in it.
 * @returns The type, with a control per name that stands for an object.
 */
export function PropsType({ accepts, shows }: PropsTypeProps): ReactElement {
  const known = new Map(
    shows.filter((one) => one.members.length > 0).map((one) => [shortOf(one.name), one]),
  );
  const pieces = split(accepts, [...known.keys()]);

  return (
    <Code display="inline" size="sm" variant="plain" whiteSpace="normal">
      {pieces.map((piece, at) => {
        const shown = known.get(piece);
        const key = `${String(at)}:${piece}`;

        if (shown === undefined) return <Fragment key={key}>{piece}</Fragment>;

        return described(shown) ? (
          <PropsShown key={key} shown={shown} />
        ) : (
          <Fragment key={key}>{listed(shown)}</Fragment>
        );
      })}
    </Code>
  );
}
