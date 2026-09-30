import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Content } from "#checkbox-card/content.ts";
import { Description } from "#checkbox-card/description.tsx";
import { Label } from "#checkbox-card/label.tsx";
import { Root } from "#checkbox-card/root.tsx";

describe("state", () => {
  it("throws for a description rendered outside CheckboxCard.Root", () => {
    expect(() => render(<Description>Every morning.</Description>)).toThrow("Checkbox");
  });

  it("keeps the ID the caller passes to a description", async () => {
    await drawn(
      <Root>
        <Content>
          <Label>Email</Label>
          <Description id="morning">Every morning.</Description>
        </Content>
      </Root>,
    );

    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")).toBe("morning");
  });

  it("drops a description's ID from the input when it unmounts", async () => {
    const { rerender } = await drawn(
      <Root>
        <Label>Email</Label>
        <Description>Every morning.</Description>
      </Root>,
    );

    await act(async () => {
      rerender(
        <Root>
          <Label>Email</Label>
        </Root>,
      );
      await Promise.resolve();
    });

    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")).toBeNull();
  });
});
