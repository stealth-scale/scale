/**
 * Renders its children into another part of the document.
 *
 * @remarks
 *   An element positioned against the viewport is still clipped and stacked by an ancestor that
 *   clips or opens a stacking context, which is the reason to portal out of one at all. Nothing is
 *   rendered before mount: the server has no document to portal into, and rendering on the first
 *   client pass instead would be a hydration mismatch the browser reports. A caller who wants the
 *   content left where it was written passes `disabled` rather than dropping the portal, which
 *   keeps the component tree identical either way.
 */

import { type ReactNode, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/**
 * Cancels a subscription that has nothing to cancel.
 */
function unsubscribe(): void {}

/**
 * Registers a listener that is never called, since the presence of a document never changes.
 *
 * @returns The unsubscribe function React calls on unmount.
 */
function subscribe(): () => void {
  return unsubscribe;
}

/**
 * Reports the client snapshot, which is true wherever a document exists.
 */
function drawn(): boolean {
  return true;
}

/**
 * Reports the server snapshot, which is false because rendering to a string has no document.
 */
function undrawn(): boolean {
  return false;
}

/**
 * Carries the content, the destination and the opt-out.
 */
export interface PortalProps {
  /**
   * The content to render at the destination.
   */
  children?: ReactNode | undefined;

  /**
   * The element to render into, `document.body` when the caller passes none.
   */
  container?: Element | null | undefined;

  /**
   * Whether to leave the content where it was written instead of moving it.
   */
  disabled?: boolean | undefined;
}

/**
 * Renders the children into the container, in place while `disabled`, or not at all before mount.
 */
export function Portal(props: PortalProps): ReactNode {
  const { children, container, disabled = false } = props;
  const mounted = useSyncExternalStore(subscribe, drawn, undrawn);

  if (disabled) return children;
  if (!mounted) return undefined;

  return createPortal(children, container ?? document.body);
}
