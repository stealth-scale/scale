import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  type DrawEndDetails,
  type SignaturePadOptions,
  splitSignaturePadProps,
  useSignaturePad,
  useSignaturePadMachine,
} from "#signature-pad/machine.ts";
import { hiddenInput, stroked } from "#signature-pad/signature-pad.fixtures.tsx";

interface Probed extends SignaturePadOptions {
  readonly control?: string | undefined;
}

function Parts(): ReactElement {
  const api = useSignaturePad();

  return (
    <div {...api.getRootProps()}>
      <div {...api.getControlProps()} data-testid="control" />
      <span data-testid="strokes">{String(api.paths.length)}</span>
      <input {...api.getHiddenInputProps({ value: "" })} />
    </div>
  );
}

function Running({ control, ...options }: Probed): ReactElement {
  const { api, labelId } = useSignaturePadMachine(options, control);

  return (
    <ApiProvider value={api}>
      <span data-testid="label">{labelId}</span>
      <Parts />
    </ApiProvider>
  );
}

describe("machine", () => {
  it("returns a label ID built from id", async () => {
    await drawn(<Running id="consent" />);

    expect(screen.getByTestId("label").textContent).toBe("signature-pad:consent:label");
  });

  it("returns the label ID the caller passes in ids", async () => {
    await drawn(<Running ids={{ label: "consent-label" }} />);

    expect(screen.getByTestId("label").textContent).toBe("consent-label");
  });

  it("gives the hidden input the control ID of the field around it", async () => {
    const { container } = await drawn(<Running control="consent-control" />);

    expect(hiddenInput(container).id).toBe("consent-control");
  });

  it("keeps the hidden input ID the caller passes over the field's", async () => {
    const { container } = await drawn(
      <Running control="consent-control" ids={{ hiddenInput: "consent-input" }} />,
    );

    expect(hiddenInput(container).id).toBe("consent-input");
  });

  it("commits a stroke a primary pointer draws", async () => {
    await drawn(<Running />);
    await stroked(screen.getByTestId("control"));

    expect(screen.getByTestId("strokes").textContent).toBe("1");
  });

  it("calls onDrawEnd with the committed strokes", async () => {
    const onDrawEnd = vi.fn<(details: DrawEndDetails) => void>();

    await drawn(<Running onDrawEnd={onDrawEnd} />);
    await stroked(screen.getByTestId("control"));

    expect(onDrawEnd.mock.lastCall?.[0].paths).toHaveLength(1);
  });

  it("splits the machine's options from the element's props without translations", () => {
    const [options, rest] = splitSignaturePadProps({
      name: "signature",
      title: "Signature",
      translations: { control: "pad" },
    });

    expect([options, rest]).toStrictEqual([{ name: "signature" }, { title: "Signature" }]);
  });
});
