import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { scoped } from "#format/format.fixtures.tsx";
import { clocked } from "#timestamp/timestamp.fixtures.ts";
import { Timestamp } from "#timestamp/timestamp.tsx";

const NOW = new Date("2026-07-25T14:30:00Z");

const EARLIER = new Date("2026-07-25T12:15:00Z");

const AMSTERDAM: Intl.DateTimeFormatOptions = {
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
  timeZone: "Europe/Amsterdam",
  year: "numeric",
};

const EXACT = "25 Jul 2026, 14:15";

describe("Timestamp", () => {
  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(() => (
        <Timestamp locale="en-GB" now={NOW} options={AMSTERDAM} reads="both" value={EARLIER} />
      )),
    ).resolves.toStrictEqual([]);
  });

  it("renders a time element whose dateTime is the instant in ISO 8601", () => {
    const { container } = render(<Timestamp locale="en-GB" options={AMSTERDAM} value={EARLIER} />);
    const time = slotElement(container, "timestamp", "root");

    expect(time.tagName).toBe("TIME");
    expect(time.getAttribute("datetime")).toBe("2026-07-25T12:15:00.000Z");
  });

  it("writes the exact form when reads is absent", () => {
    render(<Timestamp locale="en-GB" options={AMSTERDAM} value={EARLIER} />);

    expect(screen.getByText(EXACT).tagName).toBe("TIME");
  });

  it("writes a medium date and a short time when options is absent", () => {
    const plain = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

    render(<Timestamp locale="en-GB" value={EARLIER} />);

    expect(screen.getByText(plain.format(EARLIER)).tagName).toBe("TIME");
  });

  it.each([
    { label: "milliseconds", value: EARLIER.getTime() },
    { label: "a string", value: "2026-07-25T12:15:00Z" },
  ])("reads an instant given as $label", ({ value }) => {
    const { container } = render(<Timestamp locale="en-GB" options={AMSTERDAM} value={value} />);

    expect(slotElement(container, "timestamp", "root").getAttribute("datetime")).toBe(
      "2026-07-25T12:15:00.000Z",
    );
  });

  it("renders an empty element without dateTime when the value names no instant", () => {
    const { container } = render(<Timestamp value="niet bezorgd" />);
    const time = slotElement(container, "timestamp", "root");

    expect(time.textContent).toBe("");
    expect(time.hasAttribute("datetime")).toBe(false);
  });

  it("writes the distance from now when reads is relative", () => {
    render(
      <Timestamp locale="en-GB" now={NOW} options={AMSTERDAM} reads="relative" value={EARLIER} />,
    );

    expect(screen.getByText("2 hours ago").tagName).toBe("TIME");
  });

  it("sets title to the exact form when reads is relative", () => {
    render(
      <Timestamp locale="en-GB" now={NOW} options={AMSTERDAM} reads="relative" value={EARLIER} />,
    );

    expect(screen.getByText("2 hours ago").title).toBe(EXACT);
  });

  it("applies a title the caller passes over the exact form", () => {
    render(
      <Timestamp
        locale="en-GB"
        now={NOW}
        options={AMSTERDAM}
        reads="relative"
        title="Posted"
        value={EARLIER}
      />,
    );

    expect(screen.getByText("2 hours ago").title).toBe("Posted");
  });

  it("writes the exact form after the distance when reads is both", () => {
    const { container } = render(
      <Timestamp locale="en-GB" now={NOW} options={AMSTERDAM} reads="both" value={EARLIER} />,
    );

    expect(slotElement(container, "timestamp", "root").textContent).toBe(`2 hours ago (${EXACT})`);
  });

  it("renders the exact form in the exact part when reads is both", () => {
    const { container } = render(
      <Timestamp locale="en-GB" now={NOW} options={AMSTERDAM} reads="both" value={EARLIER} />,
    );

    expect(slotElement(container, "timestamp", "exact").textContent).toBe(`(${EXACT})`);
  });

  it("sets no title when reads is both", () => {
    const { container } = render(
      <Timestamp locale="en-GB" now={NOW} options={AMSTERDAM} reads="both" value={EARLIER} />,
    );

    expect(slotElement(container, "timestamp", "root").hasAttribute("title")).toBe(false);
  });

  it("writes the distance in the locale in scope", () => {
    render(scoped("nl-NL", <Timestamp now={NOW} reads="relative" value={EARLIER} />));

    expect(screen.getByText("2 uur geleden").tagName).toBe("TIME");
  });

  it("writes the distance in the stated locale over the locale in scope", () => {
    render(
      scoped("de-DE", <Timestamp locale="nl-NL" now={NOW} reads="relative" value={EARLIER} />),
    );

    expect(screen.getByText("2 uur geleden").tagName).toBe("TIME");
  });

  it("passes the element's props to the element", () => {
    render(<Timestamp className="posted" locale="en-GB" options={AMSTERDAM} value={EARLIER} />);

    expect(screen.getByText(EXACT).classList.contains("posted")).toBe(true);
  });

  it("reads the clock again every updateInterval when now is absent", () => {
    const { container } = clocked(NOW, () => {
      const rendered = render(
        <Timestamp reads="relative" updateInterval={250} value={NOW.getTime() - 59_500} />,
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      return rendered;
    });

    expect(slotElement(container, "timestamp", "root").textContent).toBe("1 minute ago");
  });

  it("keeps the distance read at mount when updateInterval is absent", () => {
    const { container } = clocked(NOW, () => {
      const rendered = render(<Timestamp reads="relative" value={NOW.getTime() - 59_500} />);

      act(() => {
        vi.advanceTimersByTime(60_000);
      });

      return rendered;
    });

    expect(slotElement(container, "timestamp", "root").textContent).toBe("59 seconds ago");
  });

  it("starts no timer when reads is absolute", () => {
    const timers = clocked(NOW, () => {
      render(<Timestamp updateInterval={250} value={EARLIER} />);

      return vi.getTimerCount();
    });

    expect(timers).toBe(0);
  });
});
