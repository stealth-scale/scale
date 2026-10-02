import { type ReactElement, type ReactNode } from "react";

import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "#accessibility.ts";

function Named(): ReactElement {
  return <button type="button">Save</button>;
}

function Unnamed(): ReactElement {
  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label -- the case is a control without a label, which the audit has to report
    <button type="button" />
  );
}

function Concealed(): ReactElement {
  return <input hidden type="text" />;
}

function Item(): ReactElement {
  return <li>One</li>;
}

function Framed(): ReactElement {
  return <iframe sandbox="" srcDoc="<p>Paid</p>" title="Receipt" />;
}

function listed(children: ReactNode): ReactElement {
  return <ul>{children}</ul>;
}

describe("accessibilityViolations", () => {
  it("returns no violation for a button with a name", async () => {
    await expect(accessibilityViolations(Named)).resolves.toStrictEqual([]);
  });

  it("names the rule a button without a name breaks", async () => {
    const found = await accessibilityViolations(Unnamed);

    expect(found.map((each) => each.split(":")[0])).toContain("button-name");
  });

  it("leaves an element with the hidden attribute out of the audit", async () => {
    await expect(accessibilityViolations(Concealed)).resolves.toStrictEqual([]);
  });

  it("audits an iframe without entering its document", async () => {
    await expect(accessibilityViolations(Framed)).resolves.toStrictEqual([]);
  });

  it("audits a part inside the root it needs", async () => {
    await expect(accessibilityViolations(Item, { wrapper: listed })).resolves.toStrictEqual([]);
  });

  it("requests an animation frame before the audit with frame", async () => {
    const requested = vi.spyOn(globalThis, "requestAnimationFrame");

    await accessibilityViolations(Named, { frame: true });

    expect(requested).toHaveBeenCalledTimes(1);
  });

  it("requests no animation frame without frame", async () => {
    const requested = vi.spyOn(globalThis, "requestAnimationFrame");

    await accessibilityViolations(Named);

    expect(requested).not.toHaveBeenCalled();
  });
});
