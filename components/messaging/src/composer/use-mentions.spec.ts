import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { composed, field, keyedIn, mentioning, PEOPLE } from "#composer/composer.fixtures.tsx";
import { type Query } from "#composer/mentions.ts";

/**
 * Returns the names of the options whose `aria-selected` is true.
 */
function highlighted(): string[] {
  return screen
    .getAllByRole("option")
    .filter((option) => option.getAttribute("aria-selected") === "true")
    .map((option) => option.textContent);
}

/**
 * Presses a key in the textarea and returns whether the press went uncancelled.
 */
function key(name: string, held: KeyboardEventInit = {}): boolean {
  return fireEvent.keyDown(field(), { key: name, ...held });
}

describe("useMentions", () => {
  it("opens the list of suggestions for a trigger", () => {
    render(mentioning());
    keyedIn("@ad");

    expect(screen.getAllByRole("option").map((option) => option.textContent)).toStrictEqual([
      "Ada OkaforFinance",
      "Adil Rahman",
    ]);
  });

  it("marks the textarea as one that lists suggestions", () => {
    render(mentioning());

    expect(field().getAttribute("aria-autocomplete")).toBe("list");
  });

  it("reports the query at the caret", () => {
    const onQueryChange = vi.fn<(query: Query | undefined) => void>();

    render(mentioning({ input: { onQueryChange } }));
    keyedIn("Thanks @ad");

    expect(onQueryChange.mock.lastCall).toStrictEqual([{ from: 7, term: "ad", trigger: "@" }]);
  });

  it("points aria-activedescendant at the first suggestion", () => {
    render(mentioning());
    keyedIn("@ad");

    expect(field().getAttribute("aria-activedescendant")).toBe(
      screen.getAllByRole("option")[0]?.id,
    );
  });

  it("points aria-controls at the list", () => {
    render(mentioning());
    keyedIn("@ad");

    expect(field().getAttribute("aria-controls")).toBe(screen.getByRole("listbox").id);
  });

  it("moves the highlight down with ArrowDown", () => {
    render(mentioning());
    keyedIn("@ad");
    key("ArrowDown");

    expect(highlighted()).toStrictEqual(["Adil Rahman"]);
  });

  it("moves the highlight from the first suggestion to the last with ArrowUp", () => {
    render(mentioning());
    keyedIn("@ad");
    key("ArrowUp");

    expect(highlighted()).toStrictEqual(["Adil Rahman"]);
  });

  it("inserts the highlighted suggestion on Enter", () => {
    render(mentioning());
    keyedIn("Thanks @ad");
    key("Enter");

    expect(field().value).toBe("Thanks @Ada Okafor ");
  });

  it("inserts the highlighted suggestion on Tab", () => {
    render(mentioning());
    keyedIn("@ad");
    key("ArrowDown");
    key("Tab");

    expect(field().value).toBe("@Adil Rahman ");
  });

  it("puts the caret after the inserted name", () => {
    render(mentioning());
    keyedIn("@ad");
    key("Enter");

    expect(field().selectionStart).toBe(12);
  });

  it("reports the inserted suggestion through onMention", () => {
    const onMention = vi.fn<(suggestion: unknown, query: Query) => void>();

    render(mentioning({ input: { onMention } }));
    keyedIn("@ad");
    key("Enter");

    expect(onMention.mock.lastCall).toStrictEqual([
      PEOPLE[0],
      { from: 0, term: "ad", trigger: "@" },
    ]);
  });

  it("closes the list after an insertion", () => {
    render(mentioning());
    keyedIn("@ad");
    key("Enter");

    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("sends nothing on the Enter that inserts", () => {
    const onSubmit = vi.fn<(value: string) => void>();

    render(mentioning({ root: { onSubmit } }));
    keyedIn("@ad");
    key("Enter");

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("closes the list on Escape and keeps the text", () => {
    render(mentioning());
    keyedIn("@ad");
    key("Escape");

    expect([screen.queryByRole("listbox"), field().value]).toStrictEqual([null, "@ad"]);
  });

  it("keeps the Escape that closes the list from the elements around the composer", () => {
    const outside = vi.fn<() => void>();

    render(mentioning());
    keyedIn("@ad");
    document.addEventListener("keydown", outside);
    key("Escape");
    document.removeEventListener("keydown", outside);

    expect(outside).not.toHaveBeenCalled();
  });

  it("closes the list when the textarea loses focus", () => {
    render(mentioning());
    keyedIn("@ad");
    act(() => {
      fireEvent.blur(field());
    });

    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("calls the caller's onBlur", () => {
    const onBlur = vi.fn<() => void>();

    render(mentioning({ input: { onBlur } }));
    fireEvent.blur(field());

    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("closes the list when the caret leaves the query", () => {
    render(mentioning());
    keyedIn("Thanks @ad");
    act(() => {
      field().setSelectionRange(2, 2);
      fireEvent.select(field());
    });

    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("calls the caller's onSelect", () => {
    const onSelect = vi.fn<() => void>();

    render(mentioning({ input: { onSelect } }));
    fireEvent.select(field());

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("keeps the list closed for a query without suggestions", () => {
    render(mentioning());
    keyedIn("@zz");

    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("leaves Enter to an input method while it composes", () => {
    render(mentioning());
    keyedIn("@ad");

    expect([key("Enter", { isComposing: true }), field().value]).toStrictEqual([true, "@ad"]);
  });

  it("leaves a key the list does not use to the textarea", () => {
    render(mentioning());
    keyedIn("@ad");

    expect(key("b")).toBe(true);
  });

  it("keeps the highlight on the last suggestion of a list that shrinks", () => {
    const { rerender } = render(mentioning());

    keyedIn("@ad");
    key("ArrowDown");
    rerender(mentioning({ limit: 1 }));

    expect(highlighted()).toStrictEqual(["Ada OkaforFinance"]);
  });

  it("opens no list without triggers", () => {
    render(composed());
    keyedIn("@ad");

    expect([
      screen.queryByRole("listbox"),
      field().hasAttribute("aria-autocomplete"),
    ]).toStrictEqual([null, false]);
  });

  it("keeps the query when the caret moves inside it", () => {
    const onQueryChange = vi.fn<(query: Query | undefined) => void>();

    render(mentioning({ input: { onQueryChange } }));
    keyedIn("@ad");
    fireEvent.select(field());

    expect(onQueryChange).toHaveBeenCalledTimes(1);
  });
});
