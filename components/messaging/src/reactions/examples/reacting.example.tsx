import { type ReactElement, useState } from "react";

import { SmilePlusIcon } from "lucide-react";

import { Avatar } from "@stealthscale/component-media";
import { Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Message from "#message/index.ts";
import * as Reactions from "#reactions/index.ts";

const KINDS = ["thumbs", "party", "eyes", "heart", "laugh", "rocket"] as const;

type Kind = (typeof KINDS)[number];

const GLYPHS: Readonly<Record<Kind, string>> = {
  eyes: "👀",
  heart: "❤️",
  laugh: "😄",
  party: "🎉",
  rocket: "🚀",
  thumbs: "👍",
};

interface Reaction {
  readonly count: number;
  readonly kind: Kind;
  readonly mine: boolean;
}

const INITIAL: readonly Reaction[] = [
  { count: 3, kind: "thumbs", mine: true },
  { count: 1, kind: "party", mine: false },
];

function toggled(reactions: readonly Reaction[], kind: Kind): readonly Reaction[] {
  const found = reactions.find((one) => one.kind === kind);

  if (found === undefined) return [...reactions, { count: 1, kind, mine: true }];

  const count = found.count + (found.mine ? -1 : 1);

  return count === 0
    ? reactions.filter((one) => one.kind !== kind)
    : reactions.map((one) => (one.kind === kind ? { count, kind, mine: !found.mine } : one));
}

export function Reacting(): ReactElement {
  const { t } = useWords("reactions");
  const [reactions, setReactions] = useState(INITIAL);

  return (
    <Message.Root>
      <Message.Avatar>
        <Avatar.Root aria-hidden name={t("ada")} size="sm">
          <Avatar.Fallback />
        </Avatar.Root>
      </Message.Avatar>
      <Message.Content>
        <Message.Header>
          <Strong>{t("ada")}</Strong>
        </Message.Header>
        <Message.Bubble>{t("shipped")}</Message.Bubble>
        <Reactions.Root label={t("label")}>
          {reactions.map((reaction) => (
            <Reactions.Item
              count={reaction.count}
              key={reaction.kind}
              label={t(reaction.mine ? "mine" : "theirs", {
                count: reaction.count,
                name: t(reaction.kind),
              })}
              onClick={() => {
                setReactions((was) => toggled(was, reaction.kind));
              }}
              pressed={reaction.mine}
            >
              {GLYPHS[reaction.kind]}
            </Reactions.Item>
          ))}
          <Reactions.Picker
            choicesLabel={t("choose")}
            icon={<SmilePlusIcon size="1em" />}
            label={t("add")}
            onSelect={(value) => {
              const kind = KINDS.find((one) => one === value);

              if (kind !== undefined) setReactions((was) => toggled(was, kind));
            }}
          >
            {KINDS.map((kind) => (
              <Reactions.Choice key={kind} label={t(kind)} value={kind}>
                {GLYPHS[kind]}
              </Reactions.Choice>
            ))}
          </Reactions.Picker>
        </Reactions.Root>
      </Message.Content>
    </Message.Root>
  );
}
