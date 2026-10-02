import { describe, expect, it } from "vitest";

import { classesOf, recipeClasses, recipeElement, slotClasses, slotElement } from "#rendered.ts";

function drawn(html: string): HTMLElement {
  const container = document.createElement("div");

  container.innerHTML = html;

  return container;
}

describe("rendered", () => {
  it("finds the element a recipe was applied to", () => {
    const container = drawn('<button data-recipe="button" class="button">Save</button>');

    expect(recipeElement(container, "button").tagName).toBe("BUTTON");
  });

  it("throws naming the recipe when no element declares it", () => {
    expect(() => recipeElement(drawn("<div></div>"), "button")).toThrow(/data-recipe="button"/u);
  });

  it("finds the element one slot was applied to by the part its anatomy stamps", () => {
    const container = drawn('<div data-part="content" class="dialog-content"></div>');

    expect(slotElement(container, "dialog", "content").className).toBe("dialog-content");
  });

  it("finds a slot named in camel case by the kebab-case part its anatomy stamps", () => {
    const container = drawn('<div data-part="item-indicator" class="menu-indicator"></div>');

    expect(slotElement(container, "menu", "itemIndicator").className).toBe("menu-indicator");
  });

  it("finds the element one slot was applied to by the slot class its binding writes", () => {
    const container = drawn('<header class="card__header card__header--md"></header>');

    expect(slotElement(container, "card", "header").tagName).toBe("HEADER");
  });

  it("returns the slot class over another component's part of the same name", () => {
    const container = drawn(
      '<div data-part="root" class="scroll-area__root"><nav class="nav-list__root"></nav></div>',
    );

    expect(slotElement(container, "nav-list", "root").tagName).toBe("NAV");
  });

  it("throws naming the part and the slot class when no element has either", () => {
    expect(() => slotElement(drawn("<div></div>"), "dialog", "content")).toThrow(
      /data-part="content".*\.dialog__content/u,
    );
  });

  it("lists every class on an element sorted", () => {
    expect(classesOf(drawn('<i class="z a m"></i>').children[0] as Element)).toStrictEqual([
      "a",
      "m",
      "z",
    ]);
    expect(classesOf(drawn("<i></i>").children[0] as Element)).toStrictEqual([]);
  });

  it("lists the classes on the element a recipe applies to", () => {
    const container = drawn(
      '<button data-recipe="button" class="button button--variant-solid"></button>',
    );

    expect(recipeClasses(container, "button")).toStrictEqual(["button", "button--variant-solid"]);
  });

  it("lists the classes on one slot", () => {
    const container = drawn('<div class="dialog__content dialog__content--lg"></div>');

    expect(slotClasses(container, "dialog", "content")).toStrictEqual([
      "dialog__content",
      "dialog__content--lg",
    ]);
  });
});
