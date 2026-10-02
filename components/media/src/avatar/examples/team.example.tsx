import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Avatar from "#avatar/index.ts";

import ada from "./ada.webp";
import bram from "./bram.webp";
import cleo from "./cleo.webp";
import devi from "./devi.webp";

const TEAM = [
  ["ada", ada],
  ["bram", bram],
  ["cleo", cleo],
  ["devi", devi],
] as const;

export function Team(props: Avatar.GroupProps): ReactElement {
  const { t } = useWords("avatar");

  return (
    <Avatar.Group {...props}>
      {TEAM.map(([person, picture]) => (
        <Avatar.Root key={person} name={t(person)}>
          <Avatar.Fallback />
          <Avatar.Image src={picture} />
        </Avatar.Root>
      ))}
      <Avatar.Root name={t("more")}>
        <Avatar.Fallback>+3</Avatar.Fallback>
      </Avatar.Root>
    </Avatar.Group>
  );
}
