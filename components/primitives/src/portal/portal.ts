/**
 * Renders its children into another element of the document.
 *
 * @remarks
 *   An ancestor with `overflow` clipping or its own stacking context clips and stacks a fixed or
 *   absolute descendant, and a portal moves the content out of that ancestor. The portal renders
 *   nothing on the server and in the hydrating render, because the server has no document and the
 *   hydrating render must match the server's HTML. `disabled` renders the children in place, so
 *   the component tree is the same with and without the move.
 */

import { type ReactNode, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/**
 * Does nothing, because the subscription has nothing to release.
 */
function unsubscribe(): void {}

/**
 * Returns the no-op unsubscribe, because the presence of a document never changes.
 */
function subscribe(): () => void {
  return unsubscribe;
}

/**
 * Returns the client snapshot: true, because the client has a document.
 */
function clientSnapshot(): boolean {
  return true;
}

/**
 * Returns the server snapshot: false, because rendering to a string has no document.
 */
function serverSnapshot(): boolean {
  return false;
}

/**
 * Describes the props of Portal: the content, the destination and the opt-out.
 */
export interface PortalProps {
  /**
   * Content to render at the destination.
   */
  children?: ReactNode | undefined;

  /**
   * Element to render into. Defaults to `document.body`.
   */
  container?: Element | null | undefined;

  /**
   * Renders the content in place instead of moving it.
   */
  disabled?: boolean | undefined;
}

/**
 * Renders the children into the container, in place while `disabled`, and nothing on the server.
 */
export function Portal(props: PortalProps): ReactNode {
  const { children, container, disabled = false } = props;
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);

  if (disabled) return children;
  if (!mounted) return undefined;

  return createPortal(children, container ?? document.body);
}
