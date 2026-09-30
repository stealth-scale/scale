import { type ReactElement, useId, useState } from "react";
import { flushSync } from "react-dom";

import { ArrowUpIcon, CheckIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Timestamp } from "@stealthscale/component-data";
import { Popover } from "@stealthscale/component-disclosure";
import { Stack } from "@stealthscale/component-layout";
import { Avatar } from "@stealthscale/component-media";
import { Portal } from "@stealthscale/component-primitives";
import { Span, Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Composer from "#composer/index.ts";
import * as Message from "#message/index.ts";
import * as Reactions from "#reactions/index.ts";

const NOW = Date.parse("2026-09-30T10:00:00Z");

const OPENING = [
  { author: "ada", id: "c1", key: "move", likes: 2, minutes: 130 },
  { author: "bram", id: "c2", key: "works", likes: 1, minutes: 95 },
  { author: "me", id: "c3", key: "tell", likes: 0, minutes: 40 },
] as const;

type Said = (typeof OPENING)[number]["key"];

interface Comment {
  readonly author: (typeof OPENING)[number]["author"];
  readonly edited: boolean;
  readonly id: string;
  readonly key?: Said;
  readonly likes: number;
  readonly minutes: number;
  readonly typed?: string;
}

interface Scope {
  readonly base: string;
  readonly confirming: string | undefined;
  readonly editing: string | undefined;
  readonly liked: ReadonlySet<string>;
  readonly onConfirm: (id?: string) => void;
  readonly onEdit: (id: string) => void;
  readonly onLike: (id: string) => void;
  readonly onRemove: (id: string) => void;
  readonly onSave: (id: string, text?: string) => void;
  readonly t: ReturnType<typeof useWords>["t"];
}

function revised(comment: Comment, typed: string): Comment {
  return {
    author: comment.author,
    edited: true,
    id: comment.id,
    likes: comment.likes,
    minutes: comment.minutes,
    typed,
  };
}

function toggled(liked: ReadonlySet<string>, id: string): ReadonlySet<string> {
  return new Set(liked.has(id) ? [...liked].filter((one) => one !== id) : [...liked, id]);
}

function editorOf(comment: Comment, text: string, scope: Scope): ReactElement {
  return (
    <Composer.Root
      defaultValue={text}
      onCancelContext={() => {
        scope.onSave(comment.id);
      }}
      onSubmit={(typed) => {
        scope.onSave(comment.id, typed);
      }}
      size="sm"
    >
      <Composer.Context>
        <PencilIcon aria-hidden />
        <Span>{scope.t("editing")}</Span>
      </Composer.Context>
      <Composer.Input id={`${scope.base}-editor`} label={scope.t("editLabel")} />
      <Composer.Toolbar>
        <Button
          onClick={() => {
            scope.onSave(comment.id);
          }}
          size="xs"
          variant="ghost"
        >
          {scope.t("cancel")}
        </Button>
        <Composer.Submit label={scope.t("save")}>
          <CheckIcon size="1em" />
        </Composer.Submit>
      </Composer.Toolbar>
    </Composer.Root>
  );
}

function deletion(comment: Comment, scope: Scope): ReactElement {
  return (
    <Popover.Root
      initialFocusEl={() => document.querySelector(`[id="${scope.base}-keep"]`)}
      onOpenChange={(details) => {
        scope.onConfirm(details.open ? comment.id : undefined);
      }}
      open={scope.confirming === comment.id}
    >
      <ButtonPropsProvider value={{ size: "xs", variant: "ghost" }}>
        <Popover.Trigger as={Button}>
          <Trash2Icon size="1em" />
          {scope.t("delete")}
        </Popover.Trigger>
      </ButtonPropsProvider>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Title as="h3">{scope.t("deleteTitle")}</Popover.Title>
            <Popover.Description>{scope.t("deleteNote")}</Popover.Description>
            <Stack direction="row" gap="sm">
              <Button
                onClick={() => {
                  scope.onRemove(comment.id);
                }}
                palette="error"
                size="sm"
              >
                {scope.t("delete")}
              </Button>
              <Button
                id={`${scope.base}-keep`}
                onClick={() => {
                  scope.onConfirm();
                }}
                size="sm"
                variant="outline"
              >
                {scope.t("cancel")}
              </Button>
            </Stack>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

function footerOf(comment: Comment, scope: Scope): ReactElement {
  const mine = scope.liked.has(comment.id);
  const count = comment.likes + (mine ? 1 : 0);

  return (
    <Message.Footer>
      <Reactions.Root label={scope.t("reactions")}>
        <Reactions.Item
          label={scope.t(mine ? "likedMine" : "liked", { count })}
          onClick={() => {
            scope.onLike(comment.id);
          }}
          pressed={mine}
          {...(count > 0 ? { count } : {})}
        >
          👍
        </Reactions.Item>
      </Reactions.Root>
      {comment.author === "me" ? (
        <Message.Actions>
          <Button
            id={`${scope.base}-edit-${comment.id}`}
            onClick={() => {
              scope.onEdit(comment.id);
            }}
            size="xs"
            variant="ghost"
          >
            <PencilIcon size="1em" />
            {scope.t("edit")}
          </Button>
          {deletion(comment, scope)}
        </Message.Actions>
      ) : null}
    </Message.Footer>
  );
}

function commentOf(comment: Comment, scope: Scope): ReactElement {
  const name = scope.t(comment.author === "me" ? "you" : comment.author);
  const text = comment.key === undefined ? (comment.typed ?? "") : scope.t(comment.key);

  return (
    <Message.Root key={comment.id} look="plain" reveal="always">
      <Message.Avatar>
        <Avatar.Root aria-hidden name={name} size="sm">
          <Avatar.Fallback />
        </Avatar.Root>
      </Message.Avatar>
      <Message.Content>
        <Message.Header>
          <Strong>{name}</Strong>
          <Timestamp now={NOW} reads="relative" value={NOW - comment.minutes * 60_000} />
          {comment.edited ? <Span>{scope.t("edited")}</Span> : null}
        </Message.Header>
        {scope.editing === comment.id ? (
          editorOf(comment, text, scope)
        ) : (
          <Message.Bubble>{text}</Message.Bubble>
        )}
        {scope.editing === comment.id ? null : footerOf(comment, scope)}
      </Message.Content>
    </Message.Root>
  );
}

export function Thread(): ReactElement {
  const { t } = useWords("message");
  const base = useId();
  const [comments, setComments] = useState<readonly Comment[]>(
    OPENING.map(({ author, id, key, likes, minutes }) => ({
      author,
      edited: false,
      id,
      key,
      likes,
      minutes,
    })),
  );
  const [liked, setLiked] = useState<ReadonlySet<string>>(new Set(["c1"]));
  const [editing, setEditing] = useState<string>();
  const [confirming, setConfirming] = useState<string>();
  const scope: Scope = {
    base,
    confirming,
    editing,
    liked,
    onConfirm: setConfirming,
    onEdit: (id) => {
      flushSync(() => {
        setEditing(id);
      });
      document.querySelector<HTMLElement>(`[id="${base}-editor"]`)?.focus();
    },
    onLike: (id) => {
      setLiked((was) => toggled(was, id));
    },
    onRemove: (id) => {
      flushSync(() => {
        setComments((was) => was.filter((one) => one.id !== id));
      });
      document.querySelector<HTMLElement>(`[id="${base}-reply"]`)?.focus();
    },
    onSave: (id, text) => {
      flushSync(() => {
        if (text !== undefined) {
          setComments((was) => was.map((one) => (one.id === id ? revised(one, text) : one)));
        }
        setEditing(undefined);
      });
      document.querySelector<HTMLElement>(`[id="${base}-edit-${id}"]`)?.focus();
    },
    t,
  };

  return (
    <Stack gap="lg">
      {comments.map((comment) => commentOf(comment, scope))}
      <Composer.Root
        onSubmit={(typed) => {
          setComments((was) => [
            ...was,
            {
              author: "me",
              edited: false,
              id: `c${String(Date.now())}`,
              likes: 0,
              minutes: 0,
              typed,
            },
          ]);
        }}
      >
        <Composer.Input
          id={`${base}-reply`}
          label={t("replyLabel")}
          placeholder={t("replyPlaceholder")}
        />
        <Composer.Toolbar>
          <Composer.Submit label={t("send")}>
            <ArrowUpIcon size="1em" />
          </Composer.Submit>
        </Composer.Toolbar>
      </Composer.Root>
    </Stack>
  );
}
