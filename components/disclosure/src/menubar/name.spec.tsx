import { createRef } from "react";

import { fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { Menu, Root } from "#menubar/index.ts";
import { bar, clicked, expanded, focused, keyed, named } from "#menubar/menubar.fixtures.tsx";
import { Name } from "#menubar/name.tsx";

describe("Name", () => {
  it("renders a button", async () => {
    await drawn(bar());

    expect(named("File").tagName).toBe("BUTTON");
  });

  it("sets aria-haspopup menu", async () => {
    await drawn(bar());

    expect(named("File").getAttribute("aria-haspopup")).toBe("menu");
  });

  it("closes its menu when the name is pressed while the menu is open", async () => {
    await drawn(bar());
    await clicked(named("File"));
    await clicked(named("File"));

    expect(expanded("File")).toBe("false");
  });

  it("opens its menu on a mouse move while another menu is open", async () => {
    await drawn(bar({ defaultValue: "file" }));
    fireEvent.pointerMove(named("Edit"), { pointerType: "mouse" });
    await settled();

    expect([expanded("File"), expanded("Edit")]).toStrictEqual(["false", "true"]);
  });

  it("keeps the open menu on a touch move", async () => {
    await drawn(bar({ defaultValue: "file" }));
    fireEvent.pointerMove(named("Edit"), { pointerType: "touch" });
    await settled();

    expect(expanded("File")).toBe("true");
  });

  it("opens no menu on a mouse move while every menu is closed", async () => {
    await drawn(bar());
    fireEvent.pointerMove(named("Edit"), { pointerType: "mouse" });
    await settled();

    expect(expanded("Edit")).toBe("false");
  });

  it("moves focus to the next name that starts with a typed letter", async () => {
    await drawn(bar());
    await keyed(focused("File"), "v");

    expect(document.activeElement).toBe(named("View"));
  });

  it("moves focus past the last name to the first that starts with a typed letter", async () => {
    await drawn(bar());
    await keyed(focused("View"), "E");

    expect(document.activeElement).toBe(named("Edit"));
  });

  it("keeps focus on a letter typed with Control", async () => {
    await drawn(bar());
    await keyed(focused("File"), "v", { ctrlKey: true });

    expect(document.activeElement).toBe(named("File"));
  });

  it("keeps focus on a letter no name starts with", async () => {
    await drawn(bar());
    await keyed(focused("File"), "x");

    expect(document.activeElement).toBe(named("File"));
  });

  it("keeps focus on a key that types no character", async () => {
    await drawn(bar());
    await keyed(focused("File"), "Shift");

    expect(document.activeElement).toBe(named("File"));
  });

  it("passes its element to a ref object", async () => {
    const ref = createRef<HTMLButtonElement>();

    await drawn(
      <Root aria-label="Editor">
        <Menu value="file">
          <Name ref={ref}>File</Name>
        </Menu>
      </Root>,
    );

    expect(ref.current?.textContent).toBe("File");
  });
});
