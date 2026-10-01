/**
 * Catches a contribution that throws while it renders, and renders its fallback in its place.
 */

import { Component, type ReactNode } from "react";

/**
 * Describes the props of `Boundary`.
 */
export interface BoundaryProps {
  /**
   * The contribution.
   */
  readonly children?: ReactNode;

  /**
   * Content rendered in the contribution's place after it throws.
   */
  readonly fallback: ReactNode;

  /**
   * Receives each error a render of the contribution throws.
   */
  readonly onError: (error: unknown) => void;

  /**
   * Called after a render of the contribution commits.
   */
  readonly onRendered: () => void;

  /**
   * A value whose change renders the contribution again after it threw.
   */
  readonly resetKey: unknown;
}

/**
 * Describes what the boundary keeps between renders.
 */
interface BoundaryState {
  /**
   * True after a render of the contribution threw.
   */
  readonly failed: boolean;

  /**
   * The reset key of the last render.
   */
  readonly resetKey: unknown;
}

/**
 * Renders a contribution, and its fallback once a render of it throws, until the reset key changes.
 *
 * @remarks
 *   React catches a render error in a class component alone. Each new reset key renders the
 *   contribution again, so every render that throws counts once towards its quarantine, and every
 *   render that commits calls `onRendered`.
 */
export class Boundary extends Component<BoundaryProps, BoundaryState> {
  /**
   * Returns the state after a render of the contribution threw.
   */
  static getDerivedStateFromError(): Partial<BoundaryState> {
    return { failed: true };
  }

  /**
   * Returns the state that renders the contribution again where the reset key changed.
   */
  static getDerivedStateFromProps(
    props: BoundaryProps,
    state: BoundaryState,
  ): BoundaryState | null {
    return props.resetKey === state.resetKey ? null : { failed: false, resetKey: props.resetKey };
  }

  /**
   * The state before any render threw.
   */
  override state: BoundaryState = { failed: false, resetKey: this.props.resetKey };

  /**
   * Passes the error a render threw to `onError`.
   */
  override componentDidCatch(error: unknown): void {
    this.props.onError(error);
  }

  /**
   * Calls `onRendered` where the first render of the contribution committed.
   */
  override componentDidMount(): void {
    if (!this.state.failed) this.props.onRendered();
  }

  /**
   * Calls `onRendered` where a later render of the contribution committed.
   */
  override componentDidUpdate(): void {
    if (!this.state.failed) this.props.onRendered();
  }

  /**
   * Renders the contribution, or the fallback after a render of it threw.
   */
  override render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
