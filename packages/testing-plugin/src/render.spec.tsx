import { act, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NOBODY } from "@stealthscale/sdk-core";
import { useSession } from "@stealthscale/sdk-plugin";

import { NOTES } from "#manifest.fixtures.ts";
import { NOTE, notesContract, orphanContract, tagsContract } from "#notes.fixtures.ts";
import {
  AccessProbe,
  CustomFrame,
  DataProbe,
  FlagProbe,
  ScopeProbe,
  SessionProbe,
  SettingsProbe,
} from "#probes.fixtures.tsx";
import { renderPlugin, renderPluginHook } from "#render.tsx";

async function settledAfter(change: () => void): Promise<void> {
  await act(async () => {
    change();
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 20);
    });
  });
}

describe("renderPlugin", () => {
  it("renders the element in the plugin's scope", async () => {
    const view = await renderPlugin(<ScopeProbe />, NOTES);

    expect(within(view.container).getByText("scope notes")).toBeTruthy();
  });

  it("renders the element after the frame the options state", async () => {
    const view = await renderPlugin(<ScopeProbe />, {
      ...NOTES,
      frame: CustomFrame,
      route: { to: notesContract.routes.list },
    });

    expect(view.container.textContent).toBe("custom frameNotesscope notes");
  });

  it("opens the router at the route's sample", async () => {
    const view = await renderPlugin(null, { ...NOTES, route: { to: notesContract.routes.note } });

    expect([
      view.router.state.location.pathname,
      within(view.container).getByRole("main").textContent,
    ]).toStrictEqual(["/notes/n1", "NotesBuy milk"]);
  });

  it("opens the router at the parameters the route states", async () => {
    const view = await renderPlugin(null, {
      ...NOTES,
      route: { params: { noteId: "n2" }, to: notesContract.routes.note },
      samples: { [NOTE.id]: { respond: ({ id }) => ({ id, text: `Note ${String(id)}` }) } },
    });

    expect(within(view.container).getByText("Note n2")).toBeTruthy();
  });

  it("opens the router with the search the route states", async () => {
    const view = await renderPlugin(null, {
      ...NOTES,
      route: { search: { sort: "date" }, to: notesContract.routes.list },
    });

    expect({ ...view.router.state.location.search }).toStrictEqual({ sort: "date" });
  });

  it("replaces the session the host reads", async () => {
    const view = await renderPlugin(<SessionProbe />, NOTES);

    await settledAfter(() => {
      view.session.set(NOBODY);
    });

    expect(within(view.container).getByText("signed out")).toBeTruthy();
  });

  it("allows a check on one resource at first", async () => {
    const view = await renderPlugin(<AccessProbe />, NOTES);

    await settledAfter(() => {});

    expect(within(view.container).getByText("edit allowed")).toBeTruthy();
  });

  it("denies a check on one resource after deny", async () => {
    const view = await renderPlugin(<AccessProbe />, NOTES);

    await settledAfter(() => {
      view.access.deny();
    });

    expect(within(view.container).getByText("edit denied")).toBeTruthy();
  });

  it("serves the flags the options state over the defaults", async () => {
    const view = await renderPlugin(<FlagProbe />, { ...NOTES, flags: { "notes/archive": false } });

    expect(within(view.container).getByText("archive false, layout list")).toBeTruthy();
  });

  it("reads the settings values the options seed", async () => {
    const view = await renderPlugin(<SettingsProbe />, {
      ...NOTES,
      settings: { "notes/display": { size: "sm" } },
    });

    expect(within(view.container).getByText("size sm")).toBeTruthy();
  });

  it("serves the contract's sample where the options state no sample", async () => {
    const view = await renderPlugin(<DataProbe />, NOTES);

    expect(within(view.container).getByText("Buy milk")).toBeTruthy();
  });

  it("serves the samples the options state", async () => {
    const view = await renderPlugin(<DataProbe />, {
      ...NOTES,
      samples: { [NOTE.id]: { data: { id: "n1", text: "Call the bank" } } },
    });

    expect(within(view.container).getByText("Call the bank")).toBeTruthy();
  });

  it("installs the plugins beside it from their contracts alone", async () => {
    const view = await renderPlugin(null, {
      ...NOTES,
      beside: [tagsContract],
      route: { to: tagsContract.routes.tags },
    });

    expect(within(view.container).getByRole("heading", { level: 1 }).textContent).toBe("tags/tags");
  });

  it("disposes the host when the render unmounts", async () => {
    const view = await renderPlugin(<ScopeProbe />, NOTES);
    const dispose = vi.spyOn(view.host, "dispose");

    view.unmount();

    expect(dispose).toHaveBeenCalledExactlyOnceWith();
  });

  it("throws where the product does not resolve", async () => {
    await expect(renderPlugin(null, { contract: orphanContract })).rejects.toThrow(
      "The product does not resolve",
    );
  });

  it("returns what a hook returned in the plugin's scope", async () => {
    const view = await renderPluginHook(() => useSession().authenticated, NOTES);

    expect(view.result.current).toBe(true);
  });

  it("returns what a hook returned at its last render", async () => {
    const view = await renderPluginHook(() => useSession().authenticated, NOTES);

    await settledAfter(() => {
      view.session.set(NOBODY);
    });

    expect(view.result.current).toBe(false);
  });
});
