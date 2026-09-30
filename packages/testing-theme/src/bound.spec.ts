import { describe, expect, it } from "vitest";

import { defineRecipe, defineSlotRecipe } from "@stealthscale/theme/authoring";

import { boundMachineViolations, boundViolations, type Draw, type DrawAsync } from "#bound.ts";
import { compoundClass, slotClass, slotVariantClass, variantClass } from "#classes.ts";

type Props = Readonly<Record<string, boolean | string | undefined>>;

const INK = { color: "fg" };

const button = defineRecipe({
  base: INK,
  className: "button",
  compoundVariants: [{ css: { fontWeight: "bold" }, name: "hero", size: "lg", variant: "solid" }],
  defaultVariants: { size: "md", variant: "solid" },
  variants: {
    loading: { true: { layerStyle: "disabled" } },
    size: { lg: { height: "control.lg" }, md: { height: "control.md" } },
    variant: { ghost: { layerStyle: "fill.ghost" }, solid: { layerStyle: "fill.solid" } },
  },
});

const card = defineSlotRecipe({
  base: { root: { display: "flex" }, title: { textStyle: "heading.md" } },
  className: "card",
  compoundVariants: [{ css: { root: { gap: "gap.xl" } }, name: "hero", size: "lg" }],
  defaultVariants: { size: "md" },
  slots: ["root", "title"],
  variants: {
    size: {
      lg: { root: { gap: "gap.lg" }, title: { textStyle: "heading.lg" } },
      md: { root: { gap: "gap.md" } },
    },
    tone: { muted: { title: { color: "fg.muted" } } },
  },
});

/**
 * Returns the classes the runtime writes on the button for the props given.
 */
function buttonClasses(props: Props): string[] {
  const size = String(props["size"] ?? "md");
  const variant = String(props["variant"] ?? "solid");
  const classes = [
    "button",
    variantClass("button", "size", size),
    variantClass("button", "variant", variant),
  ];

  if (props["loading"] === true) classes.push(variantClass("button", "loading", true));
  if (size === "lg" && variant === "solid") classes.push(compoundClass("button", "hero"));

  return classes;
}

/**
 * Renders an element with the classes given and `data-recipe` set to the recipe.
 */
function marked(classes: readonly string[], recipe = "button"): ParentNode {
  const container = document.createElement("div");
  const element = document.createElement("span");

  element.dataset["recipe"] = recipe;
  element.className = classes.join(" ");
  container.append(element);

  return container;
}

/**
 * Renders a card root containing a title with the classes given.
 */
function titled(classes: readonly string[]): ParentNode {
  const container = document.createElement("div");
  const root = document.createElement("div");
  const title = document.createElement("h2");

  root.dataset["recipe"] = "card";
  root.className = slotClass("card", "root");
  title.className = classes.join(" ");
  root.append(title);
  container.append(root);

  return container;
}

const correct: Draw<Props> = (props) => marked(buttonClasses(props));

const deaf: Draw<Props> = (props) => marked(buttonClasses({ ...props, variant: undefined }));

const loud: Draw<Props> = (props) => marked([...buttonClasses(props), "button--xl"]);

const plain: Draw<Props> = (props) =>
  marked(buttonClasses(props).filter((each) => each !== compoundClass("button", "hero")));

const ghost: Draw<Props> = (props) => marked(buttonClasses({ variant: "ghost", ...props }));

const unmarked: Draw<Props> = (props) => marked(buttonClasses(props), "other");

const styledTitle: Draw<Props> = (props) => {
  const classes = [slotClass("card", "title")];

  if (props["size"] === "lg") classes.push(slotVariantClass("card", "title", "size", "lg"));
  if (props["tone"] === "muted") classes.push(slotVariantClass("card", "title", "tone", "muted"));

  return titled(classes);
};

const sizedTitle: Draw<Props> = (props) =>
  titled([
    slotClass("card", "title"),
    slotVariantClass("card", "title", "size", String(props["size"] ?? "md")),
  ]);

const cardRoot: Draw<Props> = (props) => {
  const size = String(props["size"] ?? "md");
  const classes = [slotClass("card", "root"), slotVariantClass("card", "root", "size", size)];

  if (size === "lg") classes.push(compoundClass(slotClass("card", "root"), "hero"));

  return marked(classes, "card");
};

const drawnRaw: Draw<Props> = (props) =>
  marked(props["size"] === "lg" ? ["raw", "raw--lg"] : ["raw"], "raw");

const drawnWide: Draw<Props> = (props) => {
  const size = props["size"];
  const classes = ["wide"];

  if (typeof size === "string") classes.push(variantClass("wide", "size", size));
  if (size === "lg" || size === "md") classes.push("wide--broad");

  return marked(classes, "wide");
};

const drawnBare: Draw<Props> = () => marked(["bare"], "bare");

const drawnOdd: Draw<Props> = () => marked(["odd"], "odd");

const settling: DrawAsync<Props> = async (props) => {
  await Promise.resolve();

  return correct(props);
};

const settledDeaf: DrawAsync<Props> = async (props) => {
  await Promise.resolve();

  return deaf(props);
};

const settledSizedTitle: DrawAsync<Props> = async (props) => {
  await Promise.resolve();

  return sizedTitle(props);
};

describe("boundViolations", () => {
  it("returns an empty array when the element has every class the recipe writes", () => {
    expect(boundViolations(button, correct)).toStrictEqual([]);
  });

  it("reports a class the element lacks when its value is picked", () => {
    expect(boundViolations(button, deaf)).toStrictEqual([
      "button lacks button--ghost when variant is ghost",
      "button has button--solid when variant is ghost, which the recipe does not write",
    ]);
  });

  it("reports a class the element has that the recipe does not write", () => {
    expect(boundViolations(button, loud)).toHaveLength(6);
    expect(boundViolations(button, loud)[0]).toBe(
      "button has button--xl when nothing is picked, which the recipe does not write",
    );
  });

  it("expects the compound class when the selection matches", () => {
    expect(boundViolations(button, plain)).toStrictEqual([
      "button lacks button--hero when size is lg",
    ]);
  });

  it("expects the class of a value the binding fixes where nothing is picked", () => {
    const emitted = { ...button, staticCss: [{ variant: ["ghost"] }] };

    expect(boundViolations(emitted, ghost, { defaults: { variant: "ghost" } })).toStrictEqual([]);
    expect(boundViolations(button, ghost)[0]).toBe(
      "button lacks button--solid when nothing is picked",
    );
  });

  it("reports a fixed value that no staticCss entry emits", () => {
    const whole = { ...button, staticCss: ["*"] };
    const axis = { ...button, staticCss: [{ variant: "*" }] };
    const other = { ...button, staticCss: [{ size: ["lg"] }, "odd"] };

    expect(boundViolations(button, ghost, { defaults: { variant: "ghost" } })).toStrictEqual([
      "button fixes variant ghost through a default prop, which staticCss does not list",
    ]);
    expect(boundViolations(whole, ghost, { defaults: { variant: "ghost" } })).toStrictEqual([]);
    expect(boundViolations(axis, ghost, { defaults: { variant: "ghost" } })).toStrictEqual([]);
    expect(boundViolations(other, ghost, { defaults: { variant: "ghost" } })).toHaveLength(1);
  });

  it("reads the element the subject returns", () => {
    expect(
      boundViolations(button, unmarked, {
        subject: (container) => container.querySelector(".button") ?? document.body,
      }),
    ).toStrictEqual([]);
  });

  it("expects a value's class on a part only when the value styles the slot", () => {
    expect(boundViolations(card, styledTitle, { slot: "title" })).toStrictEqual([]);
  });

  it("reports a value's class on a part when the value does not style the slot", () => {
    expect(boundViolations(card, sizedTitle, { slot: "title" })).toStrictEqual([
      "card__title has card__title--md when nothing is picked, which the recipe does not write",
      "card__title has card__title--md when size is md, which the recipe does not write",
      "card__title lacks card__title--muted when tone is muted",
      "card__title has card__title--md when tone is muted, which the recipe does not write",
    ]);
  });

  it("expects a compound's class on the part its styles apply to", () => {
    expect(boundViolations(card, cardRoot, { slot: "root" })).toStrictEqual([]);
  });

  it("expects no class for a compound that is not an object or has no class name", () => {
    const raw = {
      base: INK,
      className: "raw",
      compoundVariants: [null, { css: { fontWeight: "bold" }, size: "lg" }],
      variants: { size: { lg: { height: "control.lg" } } },
    };

    expect(boundViolations(raw, drawnRaw)).toStrictEqual([]);
  });

  it("passes a boolean axis's false value as false", () => {
    const flag = {
      base: INK,
      className: "flag",
      variants: { open: { false: { display: "none" }, true: { display: "block" } } },
    };
    const seen: unknown[] = [];
    const drawn: Draw<Props> = (props) => {
      seen.push(props["open"]);

      return marked(props["open"] === true ? ["flag", "flag--open"] : ["flag"], "flag");
    };

    expect(boundViolations(flag, drawn)).toStrictEqual([]);
    expect(seen).toStrictEqual([undefined, false, true]);
  });

  it("matches a compound that lists several values on one axis", () => {
    const wide = {
      base: INK,
      className: "wide",
      compoundVariants: [
        { className: "wide--broad", css: { fontWeight: "bold" }, size: ["lg", "md"] },
      ],
      variants: {
        size: {
          lg: { height: "control.lg" },
          md: { height: "control.md" },
          sm: { height: "control.sm" },
        },
      },
    };

    expect(boundViolations(wide, drawnWide)).toStrictEqual([]);
  });

  it("renders once when the recipe offers no axis", () => {
    const bare = { base: INK, className: "bare" };

    expect(boundViolations(bare, drawnBare)).toStrictEqual([]);
  });

  it("skips an axis whose values are not an object", () => {
    const odd = { base: INK, className: "odd", variants: { size: "odd" } };

    expect(boundViolations(odd, drawnOdd)).toStrictEqual([]);
  });
});

describe("boundMachineViolations", () => {
  it("returns an empty array when the element has every class the recipe writes", async () => {
    await expect(boundMachineViolations(button, settling)).resolves.toStrictEqual([]);
  });

  it("reports a class the element lacks when its value is picked", async () => {
    await expect(boundMachineViolations(button, settledDeaf)).resolves.toStrictEqual([
      "button lacks button--ghost when variant is ghost",
      "button has button--solid when variant is ghost, which the recipe does not write",
    ]);
  });

  it("reads a slot of a slot recipe the same way the synchronous check does", async () => {
    await expect(
      boundMachineViolations(card, settledSizedTitle, { slot: "title" }),
    ).resolves.toStrictEqual([
      "card__title has card__title--md when nothing is picked, which the recipe does not write",
      "card__title has card__title--md when size is md, which the recipe does not write",
      "card__title lacks card__title--muted when tone is muted",
      "card__title has card__title--md when tone is muted, which the recipe does not write",
    ]);
  });

  it("reports a value a default prop fixes that staticCss does not list", async () => {
    await expect(
      boundMachineViolations(button, settling, { defaults: { variant: "solid" } }),
    ).resolves.toContain(
      "button fixes variant solid through a default prop, which staticCss does not list",
    );
  });

  it("calls draw once for every render the synchronous check makes", async () => {
    let drawings = 0;
    const counted: DrawAsync<Props> = async (props) => {
      drawings += 1;
      await Promise.resolve();

      return marked(buttonClasses(props));
    };

    await boundMachineViolations(button, counted);

    expect(drawings).toBe(6);
  });
});
