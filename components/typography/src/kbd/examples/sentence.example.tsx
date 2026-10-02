import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Kbd from "#kbd/index.ts";
import { Text } from "#text/index.ts";

export function Sentence(): ReactElement {
  const { t } = useWords("kbd");

  return (
    <Text>
      {t("press")}{" "}
      <Kbd.Group>
        <Kbd.Root>⌘</Kbd.Root>
        <Kbd.Root>K</Kbd.Root>
      </Kbd.Group>{" "}
      {t("find")}
    </Text>
  );
}
