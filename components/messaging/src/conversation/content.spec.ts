import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { log, transcript } from "#conversation/conversation.fixtures.tsx";

describe("Content", () => {
  it("renders the transcript as a log named Messages", () => {
    render(transcript());

    expect(screen.getByRole("log", { name: "Messages" })).toBeDefined();
  });

  it("names the log by the root's label", () => {
    render(transcript({ root: { label: "Conversation with Ada" } }));

    expect(screen.getByRole("log", { name: "Conversation with Ada" })).toBeDefined();
  });

  it("announces additions politely", () => {
    render(transcript());

    expect([log().getAttribute("aria-live"), log().getAttribute("aria-relevant")]).toStrictEqual([
      "polite",
      "additions",
    ]);
  });

  it("renders the log as the scroll area's viewport", () => {
    const { container } = render(transcript());

    expect(slotElement(container, "conversation", "viewport")).toBe(log());
  });

  it("renders the turns inside the scroll area's content", () => {
    const { container } = render(transcript());

    expect(slotElement(container, "conversation", "content").classList).toContain(
      "scroll-area__content",
    );
  });

  it("passes the caller's props to the log", () => {
    render(transcript({ content: { "aria-busy": true } }));

    expect(log().getAttribute("aria-busy")).toBe("true");
  });
});
