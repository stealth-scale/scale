import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { inTurn } from "#message/message.fixtures.tsx";
import { Status } from "#message/status.tsx";

describe("Status", () => {
  it("returns no conformance violation for its SPAN", () => {
    expect(
      violations(Status, {
        as: true,
        children: true,
        element: "SPAN",
        props: { status: "sent" },
        subject: (container) => slotElement(container, "message", "status"),
        wrapper: (children) => inTurn(children),
      }),
    ).toStrictEqual([]);
  });

  it.each(["sending", "sent", "delivered", "read", "failed"] as const)(
    "writes data-status as %s",
    (status) => {
      const { container } = render(inTurn(<Status status={status}>{status}</Status>));

      expect(slotElement(container, "message", "status").dataset["status"]).toBe(status);
    },
  );
});
