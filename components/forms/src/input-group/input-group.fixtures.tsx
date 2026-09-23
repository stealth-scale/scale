/**
 * Builds the input groups the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { Field } from "#input-group/field.ts";
import { Mark } from "#input-group/mark.ts";
import { Root, type RootProps } from "#input-group/root.tsx";
import { Row } from "#input-group/row.ts";

/**
 * Renders the children inside a root, with the props the case sets on the root.
 */
export function grouped(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Root {...props}>{children}</Root>;
}

/**
 * Renders an amount field between a currency mark and a unit mark.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Mark aria-hidden>€</Mark>
      <Field aria-label="Amount" />
      <Mark aria-hidden>EUR</Mark>
    </Root>
  );
}

/**
 * Renders a card number on one row, and an expiry and a security code on the next.
 */
export function stacked(props: RootProps = {}): ReactElement {
  return (
    <Root {...props}>
      <Row>
        <Field aria-label="Card number" />
      </Row>
      <Row>
        <Field aria-label="Expiry" />
        <Field aria-label="Security code" />
      </Row>
    </Root>
  );
}
