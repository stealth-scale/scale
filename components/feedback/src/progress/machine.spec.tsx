import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  type ProgressOptions,
  splitProgressProps,
  useProgress,
  useProgressMachine,
} from "#progress/machine.ts";

/**
 * Starts a machine and renders its label's ID and value through the hook the parts use.
 */
function Running(props: ProgressOptions): ReactElement {
  const { api, labelId } = useProgressMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader labelId={labelId} />
    </ApiProvider>
  );
}

/**
 * Renders the label's ID and the machine's formatted value.
 */
function Reader({ labelId }: { readonly labelId: string }): ReactElement {
  const api = useProgress();

  return (
    <span data-testid="state" id={labelId}>
      {api.valueAsString}
    </span>
  );
}

describe("splitProgressProps", () => {
  it("returns the machine's own settings in the first half", () => {
    const [options] = splitProgressProps({ max: 10, title: "Import", value: 4 });

    expect(options).toStrictEqual({ max: 10, value: 4 });
  });

  it("returns every other prop in the second half", () => {
    const [, rest] = splitProgressProps({ max: 10, title: "Import", value: 4 });

    expect(rest).toStrictEqual({ title: "Import" });
  });
});

describe("useProgressMachine", () => {
  it("derives the label's ID from the id the caller passes", async () => {
    await drawn(<Running id="ada" />);

    expect(screen.getByTestId("state").id).toBe("progress-ada-label");
  });

  it("derives the label's ID from a generated id without one", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("state").id).toMatch(/^progress-.+-label$/u);
  });

  it("keeps the label ID the caller passes in ids", async () => {
    await drawn(<Running ids={{ label: "import-label" }} />);

    expect(screen.getByTestId("state").id).toBe("import-label");
  });

  it("formats the value as a percentage by default", async () => {
    await drawn(<Running value={62} />);

    expect(screen.getByTestId("state").textContent).toBe("62%");
  });
});
