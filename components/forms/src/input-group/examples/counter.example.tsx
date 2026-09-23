import { type ReactElement, useId, useState } from "react";

import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";

const LIMIT = 40;

export function Counter(): ReactElement {
  const { t } = useWords("input-group");
  const counted = useId();
  const [reference, setReference] = useState(t("typed"));

  return (
    <InputGroup.Root>
      <InputGroup.Field
        aria-describedby={counted}
        aria-label={t("reference")}
        maxLength={LIMIT}
        onChange={(event) => {
          setReference(event.target.value);
        }}
        value={reference}
      />
      <InputGroup.Mark id={counted}>
        {reference.length}/{LIMIT}
      </InputGroup.Mark>
    </InputGroup.Root>
  );
}
