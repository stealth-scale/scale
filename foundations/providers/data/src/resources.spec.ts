import { describe, expect, it, vi } from "vitest";

import {
  containsRecord,
  patchRecords,
  type RecordPatch,
  type ResourceSelector,
} from "#resources.ts";

/**
 * The kind of every record the specification reads.
 */
const REQUEST = "time-off/request";

/**
 * A selector over the requests of a list.
 */
const REQUESTS: ResourceSelector = { at: "requests.items", id: "id", list: true, type: REQUEST };

/**
 * A selector over a request that is the data itself.
 */
const ITSELF: ResourceSelector = { id: "id", type: REQUEST };

/**
 * Builds a list of two open requests.
 *
 * @returns The data.
 */
function listed(): { readonly requests: { readonly items: readonly object[] } } {
  return {
    requests: {
      items: [
        { id: "7", status: "open" },
        { id: "8", status: "open" },
      ],
    },
  };
}

/**
 * Builds a patch that approves one request.
 *
 * @param id - Id of the request.
 * @returns The patch.
 */
function approving(id: string): RecordPatch {
  return { apply: (record) => ({ ...record, status: "approved" }), id, type: REQUEST };
}

/**
 * Builds a patch that removes one request.
 *
 * @param id - Id of the request.
 * @returns The patch.
 */
function removing(id: string): RecordPatch {
  return { apply: vi.fn<RecordPatch["apply"]>(), id, type: REQUEST };
}

describe("resources", () => {
  it("finds a record that is the data itself", () => {
    expect(containsRecord({ id: "7" }, [ITSELF], { id: "7", type: REQUEST })).toBe(true);
  });

  it("finds a record in a list at a path", () => {
    expect(containsRecord(listed(), [REQUESTS], { id: "8", type: REQUEST })).toBe(true);
  });

  it("walks every page of a list", () => {
    const pages = { pages: [{ items: [{ id: "7" }] }, { items: [{ id: "8" }] }] };
    const selector = { at: "pages.items", id: "id", type: REQUEST };

    expect(containsRecord(pages, [selector], { id: "8", type: REQUEST })).toBe(true);
  });

  it("reads an empty path as the data itself", () => {
    const selector = { at: "", id: "id", type: REQUEST };

    expect(containsRecord({ id: "7" }, [selector], { id: "7", type: REQUEST })).toBe(true);
  });

  it("compares a numeric id as a string", () => {
    expect(containsRecord({ id: 7 }, [ITSELF], { id: "7", type: REQUEST })).toBe(true);
  });

  it("skips a record whose id is neither a string nor a number", () => {
    expect(containsRecord({ id: null }, [ITSELF], { id: "null", type: REQUEST })).toBe(false);
  });

  it("ignores a selector of another kind", () => {
    expect(containsRecord(listed(), [REQUESTS], { id: "7", type: "time-off/policy" })).toBe(false);
  });

  it("finds nothing where the path ends at a value that is not a record", () => {
    const selector = { at: "requests.items.id", id: "id", type: REQUEST };

    expect(containsRecord(listed(), [selector], { id: "7", type: REQUEST })).toBe(false);
  });

  it("patches the record with the patch's id in a list", () => {
    expect(patchRecords(listed(), [REQUESTS], approving("7"))).toStrictEqual({
      requests: {
        items: [
          { id: "7", status: "approved" },
          { id: "8", status: "open" },
        ],
      },
    });
  });

  it("patches a record that is the data itself", () => {
    const patched = patchRecords({ id: "7", status: "open" }, [ITSELF], approving("7"));

    expect(patched).toStrictEqual({ id: "7", status: "approved" });
  });

  it("leaves a record with another id as it is", () => {
    const record = { id: "8", status: "open" };

    expect(patchRecords(record, [ITSELF], approving("7"))).toBe(record);
  });

  it("drops a record the patch removes from a list", () => {
    expect(patchRecords(listed(), [REQUESTS], removing("7"))).toStrictEqual({
      requests: { items: [{ id: "8", status: "open" }] },
    });
  });

  it("keeps a record outside a list that the patch removes", () => {
    const record = { id: "7", status: "open" };

    expect(patchRecords(record, [ITSELF], removing("7"))).toBe(record);
  });

  it("patches the records of every page of a list", () => {
    const pages = { pages: [{ items: [{ id: "8" }] }, { items: [null, { id: "7" }] }] };
    const selector = { at: "pages.items", id: "id", type: REQUEST };

    expect(patchRecords(pages, [selector], approving("7"))).toStrictEqual({
      pages: [{ items: [{ id: "8" }] }, { items: [null, { id: "7", status: "approved" }] }],
    });
  });

  it("leaves the data as it is where the path does not exist", () => {
    const data = listed();
    const selector = { at: "policies.items", id: "id", type: REQUEST };

    expect(patchRecords(data, [selector], approving("7"))).toBe(data);
  });

  it("leaves data that is not an object as it is", () => {
    expect(patchRecords("closed", [REQUESTS], approving("7"))).toBe("closed");
  });

  it("applies only the selectors of the patch's kind", () => {
    const data = listed();
    const policies = { ...REQUESTS, type: "time-off/policy" };

    expect(patchRecords(data, [policies], approving("7"))).toBe(data);
  });

  it("leaves the data it patches unchanged", () => {
    const data = listed();

    patchRecords(data, [REQUESTS], approving("7"));

    expect(data).toStrictEqual(listed());
  });
});
