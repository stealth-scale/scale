/**
 * Caps a selector's specificity and its dependence on the markup.
 */

/**
 * Rejects an id in a selector and a class qualified by an element type.
 *
 * @remarks
 *   One id outranks any number of classes, so a stylesheet with one starts an
 *   escalation the cascade cannot settle. Qualifying a class with an element
 *   type ties a style to the markup, and a component that renders a different
 *   element loses the style with no error anywhere.
 */
export const SELECTOR = {
  "selector-max-id": 0,
  "selector-no-qualifying-type": true,
};
