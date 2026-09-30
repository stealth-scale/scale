import { type ReactElement, useState } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as Toolbar from "#toolbar/index.ts";

const MODES = ["light", "dark"] as const;

export function Loose(): ReactElement {
  const { t } = useWords("toolbar");
  const [mode, setMode] = useState<(typeof MODES)[number]>("light");

  return (
    <Toolbar.Root aria-label={t("catalogue")} size="sm">
      <Toolbar.Start>
        <Toolbar.Link href="#pages">{t("pages")}</Toolbar.Link>
      </Toolbar.Start>
      <Toolbar.End>
        {MODES.map((each) => (
          <Button
            aria-pressed={mode === each}
            key={each}
            onClick={() => {
              setMode(each);
            }}
            variant="ghost"
          >
            {t(each)}
          </Button>
        ))}
      </Toolbar.End>
    </Toolbar.Root>
  );
}
