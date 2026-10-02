import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Frame } from "#frame/index.ts";

import hillside from "./hillside.webp";

export function Hillside(props: Parameters<typeof Frame>[0]): ReactElement {
  const { t } = useWords("frame");

  return (
    <Frame {...props}>
      <img alt={t("hillside")} src={hillside} />
    </Frame>
  );
}
