/**
 * Declares the commands a plugin runs and the events it announces.
 *
 * @remarks
 *   A command's label, keys and condition are data, so a host binds keys, lists the palette and
 *   disables controls before any command code loads. An event's payload is typed in the contract,
 *   so an emitter and a subscriber agree on it without sharing code.
 */

import { type When } from "#condition.ts";
import { type MarkerOptions } from "#marker.ts";
import { type Reference } from "#reference.ts";

/**
 * Records a command's arguments and result for the type checker.
 */
interface Typed<Args, Result> {
  /**
   * The arguments the command runs with.
   */
  readonly args: Args;

  /**
   * The value the command resolves with.
   */
  readonly result: Result;
}

/**
 * Records the arguments a command takes: in the type, and as a flag the build reads.
 */
export interface Taking<Args> {
  /**
   * The arguments, for the type checker alone.
   */
  readonly "~args"?: Args;

  /**
   * Marks the command as one that takes arguments.
   */
  readonly arguments: true;
}

/**
 * Records the value a command resolves with: in the type, and as a flag the build reads.
 */
export interface Returning<Result> {
  /**
   * The result, for the type checker alone.
   */
  readonly "~result"?: Result;

  /**
   * Marks the command as one that resolves with a result.
   */
  readonly result: true;
}

/**
 * Describes a command that keys, the palette and components run without arguments.
 */
export interface CommandOptions extends MarkerOptions {
  /**
   * Not stated: a command with arguments spreads `args`.
   */
  readonly arguments?: undefined;

  /**
   * Default binding in TanStack Hotkeys notation, `Mod+Shift+A`. Only a command without arguments
   * and without a result binds keys.
   */
  readonly keys?: string | undefined;

  /**
   * Key of the command's text in the plugin's catalogue.
   */
  readonly label: string;

  /**
   * Not stated: a command with a result spreads `returns`.
   */
  readonly result?: undefined;

  /**
   * Condition under which the command may run, however it is run. Always where it states none.
   */
  readonly when?: undefined | When;
}

/**
 * Lists what a command with arguments states beside its label: no keys, and a sample.
 */
export type Called<Args, Result> = {
  /**
   * Arguments the command's tests run it with.
   */
  readonly sample: NoInfer<Args>;
} & Omit<CommandOptions, "arguments" | "keys" | "result"> &
  Partial<Returning<Result>> &
  Taking<Args>;

/**
 * Lists what a command without arguments that resolves with a result states: no keys.
 */
export type Resolving<Result> = Omit<CommandOptions, "keys" | "result"> & Returning<Result>;

/**
 * Describes a command as its marker states it.
 */
export interface CommandMarker<Args = void, Result = void> extends MarkerOptions {
  /**
   * The command's arguments and result, for the type checker alone.
   */
  readonly "~types"?: Typed<Args, Result>;

  /**
   * True where the command takes arguments, so a key and the palette cannot run it.
   */
  readonly arguments?: true | undefined;

  /**
   * Default binding in TanStack Hotkeys notation.
   */
  readonly keys?: string | undefined;

  /**
   * The kind of the marker.
   */
  readonly kind: "command";

  /**
   * Key of the command's text in the plugin's catalogue.
   */
  readonly label: string;

  /**
   * True where the command resolves with a result, so the palette does not list it.
   */
  readonly result?: true | undefined;

  /**
   * Arguments the command's tests run it with.
   */
  readonly sample?: Args | undefined;

  /**
   * Condition under which the command may run.
   */
  readonly when?: undefined | When;
}

/**
 * Points at a command a plugin declared, with its arguments and its result in the type.
 */
export interface CommandReference<Id extends string = string, Args = unknown, Result = unknown>
  extends Partial<Omit<CommandMarker<Args, Result>, "kind">>, Reference<"command", Id> {}

/**
 * Types the arguments of a command reference.
 */
export type CommandArgs<R> = R extends CommandReference<string, infer A> ? A : never;

/**
 * Types the arguments a call of a command takes: none where the command takes none.
 */
export type CommandArguments<R> = [CommandArgs<R>] extends [void] ? [] : [args: CommandArgs<R>];

/**
 * Types the value a command reference resolves with.
 */
export type CommandResult<R> =
  R extends CommandReference<string, unknown, infer Result> ? Result : never;

/**
 * Declares the arguments a command takes: in the type, and as a flag the build reads.
 *
 * @returns An object whose type records `Args`, which a command's options spread.
 */
export function args<Args>(): Taking<Args> {
  return { arguments: true };
}

/**
 * Declares the value a command resolves with: in the type, and as a flag the build reads.
 *
 * @returns An object whose type records `Result`, which a command's options spread.
 */
export function returns<Result>(): Returning<Result> {
  return { result: true };
}

/**
 * Marks a command that keys, the palette and components run without arguments.
 *
 * @param options - The label, the keys and the condition.
 * @returns The marker.
 */
export function command(options: CommandOptions): CommandMarker;

/**
 * Marks a command that takes arguments, and resolves with a result where it spreads `returns`.
 *
 * @remarks
 *   The return type takes no part in inference. A contract's definition types its commands as
 *   `CommandMarker<unknown, unknown>`, and a command that spreads no `returns` keeps `void` as its
 *   result inside it.
 * @param options - The label, the condition and the sample, with `args` spread.
 * @returns The marker, with the arguments and the result in its type.
 */
export function command<Args, Result = void>(
  options: Called<Args, Result>,
): NoInfer<CommandMarker<Args, Result>>;

/**
 * Marks a command without arguments that resolves with a result, such as a picker.
 *
 * @param options - The label and the condition, with `returns` spread.
 * @returns The marker, with the result in its type.
 */
export function command<Result>(options: Resolving<Result>): NoInfer<CommandMarker<void, Result>>;

/**
 * Marks a command.
 *
 * @param options - The command's label and the members its form states.
 * @returns The marker.
 */
export function command(
  options: Called<unknown, unknown> | CommandOptions | Resolving<unknown>,
): CommandMarker<unknown, unknown> {
  return { ...options, kind: "command" };
}

/**
 * Describes an event: who may emit it, and whether a late subscriber receives the last payload.
 */
export interface EventOptions extends MarkerOptions {
  /**
   * `"owner"` lets the declaring plugin alone emit it. `"anyone"` lets every plugin emit it, for a
   * request the owner acts on. The owner alone where left out.
   */
  readonly emit?: "anyone" | "owner" | undefined;

  /**
   * Keeps the last payload and hands it to each new subscriber at once.
   */
  readonly sticky?: true | undefined;
}

/**
 * Records an event's payload for the type checker.
 */
interface WithPayload<Payload> {
  /**
   * The value an emitter passes and a subscriber receives.
   */
  readonly payload: Payload;
}

/**
 * Describes an event as its marker states it.
 */
export interface EventMarker<Payload = void> extends EventOptions {
  /**
   * The event's payload, for the type checker alone.
   */
  readonly "~types"?: WithPayload<Payload>;

  /**
   * The kind of the marker.
   */
  readonly kind: "event";
}

/**
 * Points at an event a plugin declared, with its payload in the type.
 */
export interface EventReference<Id extends string = string, Payload = unknown>
  extends Partial<EventOptions>, Reference<"event", Id> {
  /**
   * The event's payload, for the type checker alone.
   */
  readonly "~types"?: WithPayload<Payload>;
}

/**
 * Types the payload of an event reference.
 */
export type EventPayload<E> = E extends EventReference<string, infer P> ? P : never;

/**
 * Marks an event with its payload: `event<{ readonly requestId: string }>()`.
 *
 * @remarks
 *   The payload is an explicit type argument, because the marker has no other type parameter to
 *   derive. The return type takes no part in inference, so an event without a type argument keeps
 *   `void` inside a contract's definition.
 * @param options - Who may emit the event, and whether it is sticky.
 * @returns The marker, with the payload in its type.
 */
// eslint-disable-next-line typescript/no-unnecessary-type-parameters -- the caller states the payload as a type argument, and `NoInfer` hides its one use from the rule
export function event<Payload = void>(options: EventOptions = {}): NoInfer<EventMarker<Payload>> {
  return { ...options, kind: "event" };
}
