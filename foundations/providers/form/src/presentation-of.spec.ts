import { describe, expect, it } from "vitest";

import {
  leafPaths,
  memberKey,
  memberPaths,
  members,
  presentationOf,
  stepOf,
  unplaced,
  validatePresentation,
} from "#presentation-of.ts";
import { type Member, type Presentation } from "#presentation.ts";
import { type Schema } from "#schema.ts";

interface Checkout {
  billing: { city: string; line1: string };
  email: string;
  lines: Array<{ amount: number }>;
  notes: string;
}

const annotated: Schema = {
  properties: {
    billing: {
      properties: {
        city: { type: "string", "x-span": 2, "x-width": "medium" },
        line1: { type: "string", "x-label": "common.street" },
      },
      type: "object",
    },
    email: {
      type: "string",
      "x-autocomplete": "email",
      "x-control": "email",
      "x-placeholder": "checkout.hint",
    },
    lines: {
      items: { properties: { amount: { type: "number", "x-options": { currency: "EUR" } } } },
      type: "array",
    },
    notes: { type: "string", "x-description": "checkout.notes.help" },
  },
  type: "object",
  "x-form": {
    id: "checkout",
    of: ["email", { legend: true, name: "billing", of: ["billing.line1", "billing.city"] }],
  },
};

const paths = [
  "billing",
  "billing.city",
  "billing.line1",
  "email",
  "lines",
  "lines[]",
  "lines[].amount",
  "notes",
];

describe("presentationOf", () => {
  it("reads the keywords of every property into its field", () => {
    expect(presentationOf(annotated).fields).toStrictEqual({
      "billing.city": { span: 2, width: "medium" },
      "billing.line1": { label: "common.street" },
      email: { autocomplete: "email", control: "email", placeholder: "checkout.hint" },
      "lines[].amount": { options: { currency: "EUR" } },
      notes: { description: "checkout.notes.help" },
    });
  });

  it("reads the identifier and the members from the root keyword", () => {
    const presentation = presentationOf(annotated);

    expect(presentation.id).toBe("checkout");
    expect(presentation.of).toStrictEqual([
      "email",
      { legend: true, name: "billing", of: ["billing.line1", "billing.city"] },
    ]);
  });

  it("takes the field the caller states over the schema's", () => {
    const presentation = presentationOf<Checkout>(annotated, {
      fields: { email: { control: "text" } },
      id: "given",
    });

    expect(presentation.fields?.email).toStrictEqual({ control: "text" });
    expect(presentation.fields?.notes).toStrictEqual({ description: "checkout.notes.help" });
  });

  it("takes the members and the steps the caller states", () => {
    const presentation = presentationOf<Checkout>(annotated, {
      id: "given",
      steps: { kind: "wizard", of: [{ name: "who", of: ["email"] }] },
    });

    expect(presentation.fields?.email).toStrictEqual({
      autocomplete: "email",
      control: "email",
      placeholder: "checkout.hint",
    });
    expect(presentation).toMatchObject({
      id: "given",
      of: ["email", { legend: true, name: "billing", of: ["billing.line1", "billing.city"] }],
      steps: { kind: "wizard", of: [{ name: "who", of: ["email"] }] },
    });
  });

  it("reads the steps from the root keyword where they are a list", () => {
    const stepped: Schema = {
      properties: { a: { type: "string" } },
      "x-form": { steps: { kind: "tabs", of: [{ name: "one", of: ["a"] }] } },
    };

    expect(presentationOf(stepped)).toStrictEqual({
      fields: {},
      id: "form",
      steps: { kind: "tabs", of: [{ name: "one", of: ["a"] }] },
    });
    expect(presentationOf({ "x-form": { steps: { kind: "tabs" } } }).steps).toBeUndefined();
    expect(presentationOf({ "x-form": { of: "a", steps: 3 } })).toStrictEqual({
      fields: {},
      id: "form",
    });
  });

  it("gives a form nobody named the identifier form", () => {
    expect(presentationOf({ properties: { a: { type: "string" } } })).toStrictEqual({
      fields: {},
      id: "form",
    });
  });

  it("ignores a keyword of the wrong type", () => {
    const odd: Schema = {
      properties: { a: { type: "string", "x-options": 3, "x-span": "two", "x-width": "wide" } },
    };

    expect(presentationOf(odd).fields).toStrictEqual({});
  });

  it("ignores a root keyword that is not an object", () => {
    expect(presentationOf({ "x-form": "checkout" }).id).toBe("form");
  });
});

describe("members", () => {
  it("lists every path the groups and steps name in order", () => {
    const presentation: Presentation = {
      id: "p",
      steps: {
        of: [
          { name: "a", of: ["x", { of: ["y", { of: ["z"] }] }] },
          { name: "b", of: ["w"] },
        ],
      },
    };

    expect(members(presentation)).toStrictEqual(["x", "y", "z", "w"]);
  });
});

describe("memberPaths", () => {
  it("lists every path a run of members names with its groups walked", () => {
    const run: readonly Member[] = ["x", { of: ["y", { of: ["z"] }] }, "w"];

    expect(memberPaths(run)).toStrictEqual(["x", "y", "z", "w"]);
  });
});

describe("memberKey", () => {
  it("keys a path by itself and a group by its name or its members", () => {
    expect(memberKey("email")).toBe("email");
    expect(memberKey({ name: "who", of: ["email"] })).toBe("who");
    expect(memberKey({ of: ["email", "name"] })).toBe('["email","name"]');
  });
});

describe("stepOf", () => {
  const stepped: Presentation = { id: "p", steps: { of: [{ name: "who", of: ["email"] }] } };

  it("returns the step of the name given", () => {
    expect(stepOf(stepped, "who")).toStrictEqual({ name: "who", of: ["email"] });
  });

  it("throws when the presentation has no step of that name", () => {
    expect(() => stepOf(stepped, "pay")).toThrow(/"pay"/u);
    expect(() => stepOf({ id: "p" }, "pay")).toThrow(/"pay"/u);
  });
});

describe("leafPaths", () => {
  it("lists every field outside an array in order", () => {
    expect(leafPaths(paths)).toStrictEqual(["billing.city", "billing.line1", "email", "notes"]);
  });
});

describe("validatePresentation", () => {
  it("passes a presentation whose every member the schema has", () => {
    expect(() => {
      validatePresentation(presentationOf(annotated), paths);
    }).not.toThrow();
  });

  it("throws when a member names a path no branch of the schema has", () => {
    expect(() => {
      validatePresentation({ id: "p", of: ["billing.cty"] }, paths);
    }).toThrow(/"billing\.cty"/u);
  });

  it("throws when a field setting names a path no branch of the schema has", () => {
    expect(() => {
      validatePresentation({ fields: { gone: { span: 2 } }, id: "p" }, paths);
    }).toThrow(/"gone"/u);
  });

  it("throws when a repeat names a path no branch of the schema has", () => {
    expect(() => {
      validatePresentation({ id: "p", of: [{ of: ["lines[].amount"], repeat: "rows" }] }, paths);
    }).toThrow(/"rows"/u);
  });

  it("throws when of and steps are both present", () => {
    expect(() => {
      validatePresentation({ id: "p", of: ["email"], steps: { of: [] } }, paths);
    }).toThrow(/both of and steps/u);
  });
});

describe("unplaced", () => {
  it("lists the fields no member names", () => {
    expect(unplaced(presentationOf(annotated), paths)).toStrictEqual(["lines[].amount", "notes"]);
  });

  it("lists nothing for a presentation that states no members", () => {
    expect(unplaced({ id: "p" }, paths)).toStrictEqual([]);
  });
});
