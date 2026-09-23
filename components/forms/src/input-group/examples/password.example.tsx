import { type ReactElement, useState } from "react";

import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";

export function Password(): ReactElement {
  const { t } = useWords("input-group");
  const [shown, setShown] = useState(false);

  return (
    <InputGroup.Root>
      <InputGroup.Mark aria-hidden>
        <LockIcon />
      </InputGroup.Mark>
      <InputGroup.Field
        aria-label={t("password")}
        autoComplete="current-password"
        defaultValue="correct horse battery staple"
        type={shown ? "text" : "password"}
      />
      <InputGroup.Mark>
        <IconButton
          aria-label={t("reveal")}
          aria-pressed={shown}
          onClick={() => {
            setShown(!shown);
          }}
          size="xs"
          variant="ghost"
        >
          {shown ? <EyeOffIcon /> : <EyeIcon />}
        </IconButton>
      </InputGroup.Mark>
    </InputGroup.Root>
  );
}
