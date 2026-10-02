/**
 * Renders a GitHub callout, such as `> [!WARNING]`, with the feedback `Alert`.
 *
 * @remarks
 *   A callout is content present from the first render, so its alert has no live role. Its title
 *   is its kind in the document's words, because an alert that states its severity through color
 *   and icon alone fails WCAG 1.4.1. The kinds take the alert's statuses: a note is `info`, a tip
 *   `success`, a warning `warning`, a caution `error`, and an important callout `neutral`. The icon
 *   is the caller's glyph for the kind, and a callout without one renders none.
 */

import { type ReactElement } from "react";

import { type CalloutNode } from "@tanstack/markdown";

import { Alert } from "@stealthscale/component-feedback";

import { renderFlow } from "#markdown/flow.tsx";
import { type Scope } from "#markdown/scope.ts";

/**
 * Describes a status of the feedback `Alert`.
 */
type Status = "error" | "info" | "neutral" | "success" | "warning";

/**
 * Maps each of GitHub's callout kinds to the alert's status.
 */
const STATUSES: Readonly<Record<string, Status>> = {
  caution: "error",
  important: "neutral",
  note: "info",
  tip: "success",
  warning: "warning",
};

/**
 * Renders a callout as an alert titled by its kind.
 *
 * @param node - The callout block.
 * @param scope - The document's components, glyphs, words and ids.
 */
export function renderCallout(node: CalloutNode, scope: Scope): ReactElement {
  const icon = scope.glyphs.callouts?.[node.kind];

  return (
    <Alert.Root live="off" size={scope.size} status={STATUSES[node.kind] ?? "info"}>
      {icon === undefined ? null : <Alert.Indicator>{icon}</Alert.Indicator>}
      <Alert.Content>
        <Alert.Title>{scope.words.calloutLabel(node.kind)}</Alert.Title>
        {renderFlow(node.children, scope)}
      </Alert.Content>
    </Alert.Root>
  );
}
