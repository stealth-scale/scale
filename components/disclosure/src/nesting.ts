/**
 * Decides whether a menu or a popover closes with an overlay that Zag removes before it.
 *
 * @remarks
 *   Zag 1.44 closes an overlay one animation frame after a press outside it, and removing an
 *   overlay's dismissable layer dismisses every layer registered after it. A press on the trigger
 *   of a second overlay opens that overlay and registers its layer within the frame, so the removal
 *   of the first overlay's layer reaches the second. The machine calls `onRequestDismiss` before
 *   each such dismissal and skips the dismissal when the event is cancelled.
 */

/**
 * Describes the detail of a dismissal: the panel Zag is about to close and the panel it removes.
 */
interface DismissalDetail {
  /**
   * The panel Zag is about to close.
   */
  readonly originalLayer: HTMLElement;

  /**
   * The panel of the overlay Zag removes, or `undefined` when it removes none.
   */
  readonly targetLayer: HTMLElement | undefined;
}

/**
 * Describes the event a machine passes to `onRequestDismiss`.
 */
export type Dismissal = CustomEvent<DismissalDetail>;

/**
 * Cancels a dismissal unless the removed overlay's panel contains the control that opens the
 * closing panel.
 *
 * @remarks
 *   The control is the element whose `aria-controls` names the closing panel: a trigger, or the row
 *   that opens a submenu. A submenu closes with its menu, a popover opened from inside another
 *   popover closes with it, and a menu opened beside another menu stays open. A context menu has no
 *   such control, so it stays open.
 * @param event - The event the machine passes to `onRequestDismiss`.
 */
export function dismissNested(event: Dismissal): void {
  const { originalLayer, targetLayer } = event.detail;
  const control = originalLayer.ownerDocument.querySelector(
    `[aria-controls="${originalLayer.id}"]`,
  );

  if (control === null || targetLayer?.contains(control) !== true) event.preventDefault();
}
