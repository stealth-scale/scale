import { type Root } from "react-dom/client";

import { act, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderStandalone } from "#standalone/app.tsx";
import { cataloguesOf, WORKBENCH } from "#standalone/workbench.fixtures.tsx";

function started(element?: HTMLElement): Promise<Root> {
  window.history.replaceState(null, "", "/");
  localStorage.clear();

  return act(async () => {
    const root = await renderStandalone({
      catalogues: cataloguesOf(),
      element,
      product: WORKBENCH,
    });

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 20);
    });

    return root;
  });
}

function stopped(root: Root, element: HTMLElement): void {
  act(() => {
    root.unmount();
  });
  element.remove();
}

describe("renderStandalone", () => {
  it("renders the page into the element given", async () => {
    const element = document.createElement("div");

    document.body.append(element);

    const root = await started(element);

    await expect(within(element).findByText("Development panel")).resolves.toBeTruthy();

    stopped(root, element);
  });

  it("renders into the element with the id root where no element is given", async () => {
    const element = document.createElement("div");

    element.id = "root";
    document.body.append(element);

    const root = await started();

    await expect(within(element).findByText("Development panel")).resolves.toBeTruthy();

    stopped(root, element);
  });

  it("rejects where no element is given in a document without an element of the id root", async () => {
    await expect(renderStandalone({ product: WORKBENCH })).rejects.toThrow(
      "The standalone page renders into the element with the id root, and the document has none.",
    );
  });
});
