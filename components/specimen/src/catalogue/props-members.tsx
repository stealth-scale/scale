/**
 * Draws the members of one named type as a table.
 */

import { type ReactElement } from "react";

import { Table } from "@stealthscale/component-collections";
import { Code, Text } from "@stealthscale/component-typography";

import { type Member } from "#catalogue/types.ts";
import { useWords } from "#words.ts";

/**
 * Describes what the table takes.
 */
export interface PropsMembersProps {
  /**
   * Read out as the name of the table, which is the type it belongs to.
   */
  readonly label: string;

  /**
   * The members to draw, one per row.
   */
  readonly members: readonly Member[];
}

/**
 * Draws a member's name.
 */
function named(member: Member): ReactElement {
  return <Code size="sm">{member.name}</Code>;
}

/**
 * Draws the type a member holds, as the plain words it is.
 */
function accepts(member: Member): ReactElement {
  return (
    <Code display="inline" size="sm" variant="plain" whiteSpace="normal">
      {member.accepts}
    </Code>
  );
}

/**
 * Draws the opening sentence of a member's doc comment.
 */
function says(member: Member): ReactElement {
  return <Text size="sm">{member.says}</Text>;
}

/**
 * Draws what a named type holds, one row per member.
 *
 * @remarks
 *   A column is drawn only where a member fills it. The members of a union are options rather than
 *   properties: each has a name and no type of its own and nothing written about it, so a table of
 *   three columns would be one column of names beside two of nothing.
 *   The table runs to the panel's edges and its column names sit on nothing. The panel is already a
 *   surface of its own, small and headed, so a fill behind the names would be a second panel inside
 *   the first. The rule under them is what marks the band at this size.
 * @param props - The name of the table and the members to draw.
 * @returns One row per member.
 */
export function PropsMembers({ label, members }: PropsMembersProps): ReactElement {
  const { t } = useWords();
  const typed = members.some((member) => member.accepts !== "");
  const said = members.some((member) => member.says !== "");

  return (
    <Table.Simple<Member>
      aria-label={label}
      columns={[
        { cell: named, key: "name", label: t("props.name"), rowHeader: true },
        ...(typed ? [{ cell: accepts, key: "accepts", label: t("props.accepts") }] : []),
        ...(said ? [{ cell: says, key: "says", label: t("props.says") }] : []),
      ]}
      rows={members}
      rowToKey={(member) => member.name}
      size="sm"
    />
  );
}
