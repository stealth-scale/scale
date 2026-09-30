import { type ReactElement, type ReactNode } from "react";
import { renderToString } from "react-dom/server";

import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  createFilterScope,
  FilterContext,
  type FilterScope,
  useFilterActive,
  useFilteredRow,
  useFilterEmpty,
  useFilterScope,
} from "#use-filter-scope.ts";

/**
 * Describes the props of the scope under test.
 */
interface ScopedProps {
  /**
   * The rows and messages inside the scope.
   */
  readonly children?: ReactNode;

  /**
   * Receives the scope, for a case that sets its query.
   */
  readonly onScope?: ((scope: FilterScope) => void) | undefined;
}

/**
 * Renders a scope inside the nearest scope around it, and hands the scope to the case.
 */
function Scoped({ children, onScope }: ScopedProps): ReactElement {
  const scope = useFilterScope();

  onScope?.(scope);

  return <FilterContext value={scope}>{children}</FilterContext>;
}

/**
 * Renders a row with its words, hidden while its scope leaves it out.
 */
function Row({ words }: { readonly words: string }): ReactElement {
  const { hidden, ref } = useFilteredRow<HTMLLIElement>();

  return (
    <li hidden={hidden} ref={ref}>
      {words}
    </li>
  );
}

/**
 * Registers a row that attaches its ref to no element.
 */
function Unattached(): null {
  useFilteredRow();

  return null;
}

/**
 * Renders whether the scope is active and whether it is empty.
 */
function Status(): ReactElement {
  return (
    <output>
      {String(useFilterActive())} {String(useFilterEmpty())}
    </output>
  );
}

/**
 * Reads the words of the rows that are not hidden.
 */
function shown(): ReadonlyArray<null | string> {
  return screen
    .getAllByRole("listitem", { hidden: true })
    .filter((row) => !row.hasAttribute("hidden"))
    .map((row) => row.textContent);
}

/**
 * Renders two rows and a status in a scope, and returns the scope.
 */
function scoped(): FilterScope {
  let held: FilterScope | undefined;

  render(
    <Scoped
      onScope={(scope) => {
        held = scope;
      }}
    >
      <ul>
        <Row words="Invoices" />
        <Row words="Customers" />
      </ul>
      <Status />
    </Scoped>,
  );

  if (held === undefined) throw new Error("no scope rendered");

  return held;
}

describe("useFilterScope", () => {
  it("keeps every row without a query", () => {
    scoped();

    expect(shown()).toStrictEqual(["Invoices", "Customers"]);
  });

  it("hides a row whose words do not contain the query", () => {
    const scope = scoped();

    act(() => {
      scope.setQuery("inv");
    });

    expect(shown()).toStrictEqual(["Invoices"]);
  });

  it("matches the query without regard to case or surrounding spaces", () => {
    const scope = scoped();

    act(() => {
      scope.setQuery("  CUST ");
    });

    expect(shown()).toStrictEqual(["Customers"]);
  });

  it("reports an active scope that keeps rows as not empty", () => {
    const scope = scoped();

    act(() => {
      scope.setQuery("inv");
    });

    expect(screen.getByRole("status").textContent).toBe("true false");
  });

  it("reports a scope whose query keeps no row as empty", () => {
    const scope = scoped();

    act(() => {
      scope.setQuery("reports");
    });

    expect(screen.getByRole("status").textContent).toBe("true true");
  });

  it("reports a scope without a query as inactive", () => {
    scoped();

    expect(screen.getByRole("status").textContent).toBe("false false");
  });

  it("reports a scope with zero rows as empty without a query", () => {
    render(
      <Scoped>
        <Status />
      </Scoped>,
    );

    expect(screen.getByRole("status").textContent).toBe("false true");
  });

  it("matches a row in an inner scope against the outer query", () => {
    let outer: FilterScope | undefined;

    render(
      <Scoped
        onScope={(scope) => {
          outer = scope;
        }}
      >
        <Scoped>
          <ul>
            <Row words="Invoices" />
            <Row words="Customers" />
          </ul>
        </Scoped>
      </Scoped>,
    );
    act(() => {
      outer?.setQuery("cust");
    });

    expect(shown()).toStrictEqual(["Customers"]);
  });

  it("counts a row in an inner scope in the outer scope", () => {
    const outer = createFilterScope();
    const inner = createFilterScope(outer);

    inner.list("row", "Invoices");

    expect(outer.matched()).toBe(1);
  });

  it("removes a row from the outer scope when the inner scope drops it", () => {
    const outer = createFilterScope();
    const inner = createFilterScope(outer);

    inner.list("row", "Invoices");
    inner.drop("row");

    expect(outer.matched()).toBe(0);
  });

  it("ignores a drop of a row it does not hold", () => {
    const outer = createFilterScope();

    outer.list("row", "Invoices");
    outer.drop("other");

    expect(outer.matched()).toBe(1);
  });

  it("counts every registered row as listed whatever the query keeps", () => {
    const scope = createFilterScope();

    scope.list("invoices", "Invoices");
    scope.list("customers", "Customers");
    scope.setQuery("cust");

    expect(scope.listed()).toBe(2);
  });

  it("returns an empty string for the words of a row that has not registered", () => {
    expect(createFilterScope().wordsOf("row")).toBe("");
  });

  it("calls no listener when the query does not change", () => {
    const scope = createFilterScope();
    let calls = 0;

    scope.subscribe(() => {
      calls += 1;
    });
    scope.setQuery(" ");

    expect(calls).toBe(0);
  });

  it("calls no listener when a row registers the same words again", () => {
    const scope = createFilterScope();
    let calls = 0;

    scope.list("row", "Invoices");
    scope.subscribe(() => {
      calls += 1;
    });
    scope.list("row", "Invoices");

    expect(calls).toBe(0);
  });

  it("stops calling a listener it removed", () => {
    const scope = createFilterScope(createFilterScope());
    let calls = 0;
    const stop = scope.subscribe(() => {
      calls += 1;
    });

    stop();
    scope.setQuery("inv");

    expect(calls).toBe(0);
  });

  it("drops a row from its scope when the row unmounts", () => {
    const scope = createFilterScope();
    const { unmount } = render(
      <FilterContext value={scope}>
        <ul>
          <Row words="Invoices" />
        </ul>
      </FilterContext>,
    );

    unmount();

    expect(scope.matched()).toBe(0);
  });

  it("registers a row that attaches no element with no words", () => {
    const scope = createFilterScope();

    render(
      <FilterContext value={scope}>
        <Unattached />
      </FilterContext>,
    );

    expect(scope.matched()).toBe(1);
  });

  it("renders a row outside every scope", () => {
    render(
      <ul>
        <Row words="Invoices" />
      </ul>,
    );

    expect(shown()).toStrictEqual(["Invoices"]);
  });

  it("reports an empty scope without a query outside every scope", () => {
    render(<Status />);

    expect(screen.getByRole("status").textContent).toBe("false true");
  });

  it("renders every row and no active query on the server", () => {
    const scope = createFilterScope();

    scope.setQuery("reports");

    const html = renderToString(
      <FilterContext value={scope}>
        <ul>
          <Row words="Invoices" />
        </ul>
        <Status />
      </FilterContext>,
    );

    expect(html.includes("hidden")).toBe(false);
    expect(html.match(/false/gu)).toHaveLength(2);
  });
});
