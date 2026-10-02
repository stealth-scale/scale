import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import * as Field from "#field/index.ts";
import { Input } from "#password-input/input.tsx";
import { composed } from "#password-input/password-input.fixtures.tsx";
import { Root } from "#password-input/root.tsx";

describe("Input", () => {
  it("renders an input of type password while the value is hidden", async () => {
    await drawn(composed());

    expect(screen.getByLabelText<HTMLInputElement>("Password").type).toBe("password");
  });

  it("renders an input of type text while the value is shown", async () => {
    await drawn(composed({ defaultVisible: true }));

    expect(screen.getByLabelText<HTMLInputElement>("Password").type).toBe("text");
  });

  it("asks for the current password by default", async () => {
    await drawn(composed());

    expect(screen.getByLabelText<HTMLInputElement>("Password").autocomplete).toBe(
      "current-password",
    );
  });

  it("asks for a new password when autoComplete is new-password", async () => {
    await drawn(composed({ autoComplete: "new-password" }));

    expect(screen.getByLabelText<HTMLInputElement>("Password").autocomplete).toBe("new-password");
  });

  it("marks the input for password managers to skip when ignorePasswordManagers is set", async () => {
    await drawn(composed({ ignorePasswordManagers: true }));

    expect(screen.getByLabelText("Password").dataset["1pIgnore"]).toBe("");
  });

  it("turns spell checking off", async () => {
    await drawn(composed());

    expect(screen.getByLabelText("Password").getAttribute("spellcheck")).toBe("false");
  });

  it("submits under the name the root passes", async () => {
    await drawn(composed({ name: "password" }));

    expect(screen.getByLabelText<HTMLInputElement>("Password").name).toBe("password");
  });

  it("hides the value again when its form submits", async () => {
    await drawn(
      <form
        aria-label="Sign in"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        {composed({ defaultVisible: true })}
      </form>,
    );
    fireEvent.submit(screen.getByRole("form"));
    await settled();

    expect(screen.getByLabelText<HTMLInputElement>("Password").type).toBe("password");
  });

  it("takes its name from the label of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Account password</Field.Label>
        <Root>
          <Input />
        </Root>
      </Field.Root>,
    );

    expect(screen.getByLabelText("Account password").tagName).toBe("INPUT");
  });

  it("lists the field's helper and error texts in aria-describedby", async () => {
    await drawn(
      <Field.Root id="password">
        {composed()}
        <Field.HelperText>At least 12 characters.</Field.HelperText>
      </Field.Root>,
    );

    expect(
      screen.getByLabelText("Password").getAttribute("aria-describedby")?.split(" "),
    ).toStrictEqual(["password-helper", "password-error"]);
  });

  it("sets no aria-describedby outside a field", async () => {
    await drawn(composed());

    expect(screen.getByLabelText("Password").getAttribute("aria-describedby")).toBeNull();
  });
});
