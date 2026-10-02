import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#file-upload/context.ts";

describe("context", () => {
  it("applies the slot class to an element it binds", () => {
    const Grouped = withProvider("div", "root");
    const Dropped = withContext("div", "dropzone");
    const { container } = render(createElement(Grouped, null, createElement(Dropped)));

    expect(slotClasses(container, "file-upload", "dropzone")).toContain(
      slotClass("file-upload", "dropzone"),
    );
  });

  it("applies the root's variant to a part inside it", () => {
    const Grouped = withProvider("div", "root");
    const Dropped = withContext("div", "dropzone");
    const { container } = render(
      createElement(Grouped, { variant: "subtle" }, createElement(Dropped)),
    );

    expect(slotClasses(container, "file-upload", "dropzone")).toContain(
      variantClass(slotClass("file-upload", "dropzone"), "variant", "subtle"),
    );
  });
});
