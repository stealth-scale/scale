import { describe, expect, it } from "vitest";

import * as barrel from "#date-picker/index.ts";

describe("index", () => {
  it("exports thirty-one parts beside five date functions", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "ClearTrigger",
      "Content",
      "Control",
      "DayTable",
      "Header",
      "Input",
      "Label",
      "MonthSelect",
      "MonthTable",
      "NextTrigger",
      "Positioner",
      "PresetTrigger",
      "PrevTrigger",
      "RangeText",
      "Root",
      "Table",
      "TableBody",
      "TableCell",
      "TableCellTrigger",
      "TableHead",
      "TableHeader",
      "TableRow",
      "Trigger",
      "ValueText",
      "View",
      "ViewControl",
      "ViewTrigger",
      "WeekNumberCell",
      "WeekNumberHeaderCell",
      "YearSelect",
      "YearTable",
      "getLocalTimeZone",
      "parseDate",
      "parseDateTime",
      "parseZonedDateTime",
      "today",
    ]);
  });
});
