import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { inlined, OCTOBER_14 } from "#date-picker/date-picker.fixtures.tsx";
import { TableBody } from "#date-picker/table-body.tsx";
import { TableRow } from "#date-picker/table-row.tsx";
import { Table } from "#date-picker/table.tsx";
import { View } from "#date-picker/view.tsx";
import { WeekNumberCell, type WeekNumberCellProps } from "#date-picker/week-number-cell.tsx";

/**
 * Renders an inline picker with one week number cell for the week of October 14, 2026.
 *
 * @param props - The cell's word and text.
 * @returns The date picker.
 */
function numbered(props: Partial<WeekNumberCellProps> = {}): ReactElement {
  return inlined(
    { locale: "de-DE" },
    <View>
      <Table>
        <TableBody>
          <TableRow>
            <WeekNumberCell week={[OCTOBER_14]} weekIndex={0} {...props} />
          </TableRow>
        </TableBody>
      </Table>
    </View>,
  );
}

describe("WeekNumberCell", () => {
  it("renders a td in the rowheader role", async () => {
    await drawn(numbered());

    expect(screen.getByRole("rowheader").tagName).toBe("TD");
  });

  it("numbers the week by ISO 8601 in de-DE", async () => {
    await drawn(numbered());

    expect(screen.getByRole("rowheader").textContent).toBe("42");
  });

  it("is named Week followed by the number", async () => {
    await drawn(numbered());

    expect(screen.getByRole("rowheader", { name: "Week 42" })).toBeDefined();
  });

  it("is named by label followed by the number", async () => {
    await drawn(numbered({ label: "KW" }));

    expect(screen.getByRole("rowheader", { name: "KW 42" })).toBeDefined();
  });

  it("renders the caller's text in place of the number", async () => {
    await drawn(numbered({ children: "W42" }));

    expect(screen.getByRole("rowheader").textContent).toBe("W42");
  });
});
