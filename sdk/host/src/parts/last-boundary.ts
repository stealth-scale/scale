/**
 * Catches an error that escapes every plugin's boundary: in the product's frame, in a part of the
 * host or in a provider.
 */

import { Component, createElement, type ReactNode } from "react";

import { type HostRuntime } from "@stealthscale/sdk-plugin";

import { HostFailed } from "#parts/failed.tsx";

/**
 * Describes the props of the last boundary.
 */
export interface LastBoundaryProps {
  /**
   * The tree the boundary guards.
   */
  readonly children?: ReactNode;

  /**
   * The runtime whose report receives the error, and whose product the failure page names.
   */
  readonly runtime: Pick<HostRuntime, "product" | "report">;
}

/**
 * Describes what the last boundary keeps between renders.
 */
interface LastBoundaryState {
  /**
   * True after a render of the tree threw.
   */
  readonly failed: boolean;
}

/**
 * Renders its children, and the host's failure page in their place once a render of them throws.
 *
 * @remarks
 *   React catches a render error in a class component alone. The boundary never resets, because
 *   the state of the providers above the failure is unknown, so a person reloads the page to leave
 *   it. Each error is reported as `render-failed` with the target `host`.
 */
export class LastBoundary extends Component<LastBoundaryProps, LastBoundaryState> {
  /**
   * Returns the state after a render of the tree threw.
   */
  static getDerivedStateFromError(): LastBoundaryState {
    return { failed: true };
  }

  /**
   * The state before any render threw.
   */
  override state: LastBoundaryState = { failed: false };

  /**
   * Reports the error a render threw.
   */
  override componentDidCatch(error: unknown): void {
    this.props.runtime.report({ error, kind: "render-failed", target: "host" });
  }

  /**
   * Renders the tree, or the failure page after a render of it threw.
   */
  override render(): ReactNode {
    return this.state.failed
      ? createElement(HostFailed, { product: this.props.runtime.product })
      : this.props.children;
  }
}
