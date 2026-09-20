import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { usePanels } from "#catalogue/use-panels.ts";

/**
 * Points the hook at an element an audit can read, holding whatever a case wants audited.
 */
function staged(html = "<p>A line of words.</p>"): { current: HTMLElement | null } {
  const held = document.createElement("div");

  held.innerHTML = html;
  document.body.append(held);

  return { current: held };
}

/**
 * A scene that breaks one rule, which is what gives an audit a panel to open.
 */
const BROKEN = '<img src="x">';

describe("usePanels", () => {
  it("opens neither panel until a reader asks", () => {
    const { result } = renderHook(() => usePanels(staged()));

    expect(result.current.open).toBe("none");
  });

  it("opens the source when asked", () => {
    const { result } = renderHook(() => usePanels(staged()));

    act(() => {
      result.current.toggleSource();
    });

    expect(result.current.open).toBe("source");
  });

  it("shuts the source when asked again", () => {
    const { result } = renderHook(() => usePanels(staged()));

    act(() => {
      result.current.toggleSource();
    });
    act(() => {
      result.current.toggleSource();
    });

    expect(result.current.open).toBe("none");
  });

  it("opens what a broken audit found once it has run", async () => {
    expect.hasAssertions();

    const { result } = renderHook(() => usePanels(staged(BROKEN)));

    act(() => {
      result.current.toggleAudit();
    });

    await waitFor(() => {
      expect(result.current.open).toBe("audit");
    });
  });

  it("keeps what the audit found", async () => {
    expect.hasAssertions();

    const { result } = renderHook(() => usePanels(staged(BROKEN)));

    act(() => {
      result.current.toggleAudit();
    });

    await waitFor(() => {
      expect(result.current.audit?.findings).toHaveLength(1);
    });
  });

  it("opens nothing for a scene that broke no rule", async () => {
    expect.hasAssertions();

    const { result } = renderHook(() => usePanels(staged()));

    act(() => {
      result.current.toggleAudit();
    });

    await waitFor(() => {
      expect(result.current.audit).toBeDefined();
    });

    expect(result.current.open).toBe("none");
  });

  it("shuts the audit when asked again", async () => {
    expect.hasAssertions();

    const { result } = renderHook(() => usePanels(staged(BROKEN)));

    act(() => {
      result.current.toggleAudit();
    });
    await waitFor(() => {
      expect(result.current.open).toBe("audit");
    });
    act(() => {
      result.current.toggleAudit();
    });

    expect(result.current.open).toBe("none");
  });

  it("shuts the source when the audit opens", async () => {
    expect.hasAssertions();

    const { result } = renderHook(() => usePanels(staged(BROKEN)));

    act(() => {
      result.current.toggleSource();
    });
    act(() => {
      result.current.toggleAudit();
    });

    await waitFor(() => {
      expect(result.current.open).toBe("audit");
    });
  });

  it("shuts the audit when the source opens", async () => {
    expect.hasAssertions();

    const { result } = renderHook(() => usePanels(staged(BROKEN)));

    act(() => {
      result.current.toggleAudit();
    });
    await waitFor(() => {
      expect(result.current.open).toBe("audit");
    });
    act(() => {
      result.current.toggleSource();
    });

    expect(result.current.open).toBe("source");
  });

  it("runs nothing where the scene was never drawn", () => {
    const { result } = renderHook(() => usePanels({ current: null }));

    act(() => {
      result.current.toggleAudit();
    });

    expect(result.current.running).toBe(false);
  });
});
