import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Button } from "#button/index.ts";
import * as Clipboard from "#clipboard/index.ts";

export function Own(): ReactElement {
  const { t } = useWords("clipboard");

  return (
    <Clipboard.Root value="https://stealthscale.io/payouts/4109">
      <Clipboard.Consumer>
        {(api) => (
          <Button onClick={api.copy} palette={api.copied ? "success" : "neutral"} size="sm">
            {api.copied ? t("copied") : t("copy")}
          </Button>
        )}
      </Clipboard.Consumer>
    </Clipboard.Root>
  );
}
