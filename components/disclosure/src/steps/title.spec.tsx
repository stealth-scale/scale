import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { itemed } from "#steps/steps.fixtures.tsx";
import { Title } from "#steps/title.tsx";

describe("Title", () => {
  it("renders a span", async () => {
    const { container } = await drawn(itemed(<Title>Account</Title>));

    expect(slotElement(container, "steps", "title").tagName).toBe("SPAN");
  });

  it("puts Current before the current step's name", async () => {
    const { container } = await drawn(itemed(<Title>Account</Title>));

    expect(slotElement(container, "steps", "title").textContent).toBe("Current: Account");
  });

  it("puts Completed before a completed step's name", async () => {
    const { container } = await drawn(itemed(<Title>Account</Title>, { defaultStep: 1 }));

    expect(slotElement(container, "steps", "title").textContent).toBe("Completed: Account");
  });

  it("puts nothing before the name of a later step", async () => {
    const { container } = await drawn(itemed(<Title>Confirm</Title>, {}, 2));

    expect(slotElement(container, "steps", "title").textContent).toBe("Confirm");
  });

  it("takes the words for each state as props", async () => {
    const { container } = await drawn(
      itemed(
        <Title completedLabel="Fait : " currentLabel="En cours : ">
          Compte
        </Title>,
        { defaultStep: 1 },
      ),
    );

    expect(slotElement(container, "steps", "title").textContent).toBe("Fait : Compte");
  });

  it("renders the words in the visually hidden status part", async () => {
    const { container } = await drawn(itemed(<Title>Account</Title>));

    expect(slotElement(container, "steps", "status").textContent).toBe("Current: ");
  });

  it("sets data-incomplete on a later step", async () => {
    const { container } = await drawn(itemed(<Title>Confirm</Title>, {}, 2));

    expect(slotElement(container, "steps", "title").dataset["incomplete"]).toBe("");
  });
});
