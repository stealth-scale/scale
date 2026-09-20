/**
 * Indexes a parsed file by the names it declares at the top level and the modules it imports, and
 * resolves a set of names to the declarations they reach.
 *
 * @remarks
 *   A fragment has to compile on its own. A scene references a helper, the helper references a
 *   constant, and both are declared elsewhere in the file, so the fragment carries the transitive
 *   closure of the declarations the scene references and the imports those use.
 */

import { type ESTree } from "vite";

/**
 * One top-level statement of a file, including its `export` keyword.
 */
export type Stated = ESTree.Directive | ESTree.Statement;

/**
 * Describes one import declaration and the specifiers available from it.
 */
export interface Imported {
  /**
   * The declaration, which supplies the module specifier and the import kind.
   */
  declaration: ESTree.ImportDeclaration;

  /**
   * Each specifier, keyed by the local name it binds.
   */
  specifiers: Map<string, ESTree.ImportDeclarationSpecifier>;
}

/**
 * Describes a parsed file indexed by what it declares and what it imports.
 */
export interface Scoped {
  /**
   * Each top-level statement, keyed by a name it binds.
   */
  declared: Map<string, Stated>;

  /**
   * Every import declaration, in source order.
   */
  imports: Imported[];

  /**
   * The parsed file.
   */
  program: ESTree.Program;

  /**
   * The source text every fragment is sliced from.
   */
  text: string;
}

/**
 * The node properties that hold no child node, or hold a parent reference.
 */
const SKIPPED = new Set(["loc", "parent", "range"]);

/**
 * The declaration types that bind exactly one name, taken from their `id`.
 */
const NAMED = new Set([
  "ClassDeclaration",
  "FunctionDeclaration",
  "TSEnumDeclaration",
  "TSInterfaceDeclaration",
  "TSTypeAliasDeclaration",
]);

/**
 * Returns true when a value is a node of the syntax tree.
 */
export function isNode(value: unknown): value is ESTree.Node {
  return typeof value === "object" && value !== null && "type" in value;
}

/**
 * Returns the property of a node that names something instead of referencing it.
 *
 * @remarks
 *   A property key, a static member expression's property and a JSX attribute name are excluded
 *   from the traversal. A property named `title` does not reference a top-level `title`.
 */
function namingOf(node: ESTree.Node): string | undefined {
  if (node.type === "Property" && !node.computed) return "key";
  if (node.type === "MemberExpression" && !node.computed) return "property";
  if (node.type === "JSXAttribute") return "name";

  return undefined;
}

/**
 * Returns the child nodes of a node, in the order its properties declare them.
 */
export function childrenOf(node: ESTree.Node): ESTree.Node[] {
  const naming = namingOf(node);
  const children: ESTree.Node[] = [];

  for (const [key, value] of Object.entries(node)) {
    if (SKIPPED.has(key) || key === naming) continue;

    for (const child of Array.isArray(value) ? value : [value]) {
      if (isNode(child)) children.push(child);
    }
  }

  return children;
}

/**
 * The node types that open a scope of their own, each binding its parameters and its body.
 */
const FUNCTIONS = new Set(["ArrowFunctionExpression", "FunctionDeclaration", "FunctionExpression"]);

/**
 * Collects the names a binding pattern binds, and nothing the pattern merely mentions.
 *
 * @remarks
 *   A default value and a type annotation sit inside the pattern and reference what they like, so
 *   only the positions that bind are descended into. `{ look = LOOK }` binds `look` and references
 *   `LOOK`.
 */
function boundIn(pattern: ESTree.Node, names: Set<string>): void {
  if (pattern.type === "Identifier") names.add(pattern.name);
  if (pattern.type === "AssignmentPattern") boundIn(pattern.left, names);
  if (pattern.type === "RestElement") boundIn(pattern.argument, names);

  if (pattern.type === "ObjectPattern") {
    for (const property of pattern.properties) {
      boundIn(property.type === "RestElement" ? property.argument : property.value, names);
    }
  }

  if (pattern.type === "ArrayPattern") {
    for (const element of pattern.elements) if (isNode(element)) boundIn(element, names);
  }
}

/**
 * Reports whether a node opens a scope of its own.
 */
function isFunction(node: ESTree.Node): node is ESTree.Function {
  return FUNCTIONS.has(node.type);
}

/**
 * Collects the names the statements of a function's body declare directly.
 *
 * @remarks
 *   A block nested inside the body is left to the walk, which enters it as part of the function's
 *   own subtree. What matters here is that a variable of the body shadows a declaration of the
 *   file under the same name. An arrow written as one expression declares nothing.
 */
function localsIn(body: ESTree.Function["body"], names: Set<string>): void {
  if (body?.type !== "BlockStatement") return;

  for (const statement of body.body) {
    if (statement.type !== "VariableDeclaration") continue;

    for (const declarator of statement.declarations) boundIn(declarator.id, names);
  }
}

/**
 * Collects the names a function binds: its own, its parameters, and the variables its body
 * declares.
 */
function bindingsOf(node: ESTree.Function): Set<string> {
  const names = new Set<string>();

  if (isNode(node.id)) boundIn(node.id, names);

  for (const parameter of node.params) boundIn(parameter, names);

  localsIn(node.body, names);

  return names;
}

/**
 * Collects every identifier a subtree references, leaving out the ones a scope inside it binds.
 *
 * @remarks
 *   A name bound by a function is that function's own and reaches no declaration of the file. A
 *   parameter called `wrap` beside a scene declared as `wrap` closed the whole of that scene into
 *   the snippet, so a page of two scenes showed both of them under either one.
 * @param node - The root of the subtree.
 * @param names - The set to add to, which is returned.
 * @param shadowed - The names an enclosing scope has bound, which reference nothing outside it.
 */
export function referred(
  node: ESTree.Node,
  names = new Set<string>(),
  shadowed: ReadonlySet<string> = new Set<string>(),
): Set<string> {
  if ((node.type === "Identifier" || node.type === "JSXIdentifier") && !shadowed.has(node.name)) {
    names.add(node.name);
  }

  const inner = isFunction(node) ? new Set([...shadowed, ...bindingsOf(node)]) : shadowed;

  for (const child of childrenOf(node)) referred(child, names, inner);

  return names;
}

/**
 * Returns the declaration a top-level statement makes, unwrapping a named export.
 *
 * @returns The declaration, or undefined when the statement declares nothing.
 */
export function declarationOf(statement: Stated): ESTree.Node | undefined {
  const declaration =
    statement.type === "ExportNamedDeclaration" ? statement.declaration : statement;

  return declaration ?? undefined;
}

/**
 * Returns the names a top-level statement binds.
 *
 * @returns Every name, and an empty array when the statement declares nothing or destructures.
 */
function boundBy(statement: Stated): string[] {
  const declaration = declarationOf(statement);

  if (declaration === undefined) return [];

  if (declaration.type === "VariableDeclaration") {
    return declaration.declarations.flatMap((declarator) =>
      declarator.id.type === "Identifier" ? [declarator.id.name] : [],
    );
  }

  const id =
    NAMED.has(declaration.type) && "id" in declaration && isNode(declaration.id)
      ? declaration.id
      : undefined;

  return id?.type === "Identifier" ? [id.name] : [];
}

/**
 * Indexes a parsed file by the names it declares and the modules it imports.
 */
export function scoped(program: ESTree.Program, text: string): Scoped {
  const scope: Scoped = { declared: new Map(), imports: [], program, text };

  for (const statement of program.body) {
    if (statement.type === "ImportDeclaration") {
      const specifiers = new Map<string, ESTree.ImportDeclarationSpecifier>();

      for (const specifier of statement.specifiers) specifiers.set(specifier.local.name, specifier);

      scope.imports.push({ declaration: statement, specifiers });
      continue;
    }

    for (const name of boundBy(statement)) scope.declared.set(name, statement);
  }

  return scope;
}

/**
 * Unwraps the type annotations on an expression.
 *
 * @returns The expression beneath any `satisfies` or `as`.
 */
export function bare(expression: ESTree.Expression): ESTree.Expression {
  let unwrapped = expression;

  while (unwrapped.type === "TSSatisfiesExpression" || unwrapped.type === "TSAsExpression") {
    unwrapped = unwrapped.expression;
  }

  return unwrapped;
}

/**
 * Returns the object literal a top-level name is initialised with.
 *
 * @returns The object, or undefined when the name is initialised with anything else or is not a
 *   variable.
 */
export function objectOf(scope: Scoped, name: string): ESTree.ObjectExpression | undefined {
  for (const statement of scope.program.body) {
    const declaration = declarationOf(statement);

    if (declaration?.type !== "VariableDeclaration") continue;

    for (const declarator of declaration.declarations) {
      if (declarator.id.type !== "Identifier" || declarator.id.name !== name) continue;
      if (declarator.init === null) continue;

      const initialiser = bare(declarator.init);

      return initialiser.type === "ObjectExpression" ? initialiser : undefined;
    }
  }

  return undefined;
}

/**
 * Rewrites one import declaration with only the specifiers a fragment uses.
 *
 * @remarks
 *   The specifiers are kept as the file wrote them, so an alias survives. `used` holds the local
 *   names the fragment references.
 * @returns The statement, or undefined when the fragment uses none of the specifiers.
 */
export function importing(
  scope: Scoped,
  imported: Imported,
  used: Set<string>,
): string | undefined {
  const taken = [...imported.specifiers.values()].filter((specifier) =>
    used.has(specifier.local.name),
  );

  if (taken.length === 0) return undefined;

  const clauses: string[] = [];
  const named: string[] = [];

  for (const specifier of taken) {
    const written = scope.text.slice(specifier.start, specifier.end);

    if (specifier.type === "ImportSpecifier") named.push(written);
    else clauses.push(written);
  }

  if (named.length > 0) clauses.push(`{ ${named.join(", ")} }`);

  const keyword = imported.declaration.importKind === "type" ? "import type " : "import ";
  const source = scope.text.slice(
    imported.declaration.source.start,
    imported.declaration.source.end,
  );

  return `${keyword}${clauses.join(", ")} from ${source};`;
}

/**
 * Resolves a set of names to the top-level statements they reach, transitively.
 *
 * @remarks
 *   Each name is visited once, so declarations that reference each other terminate the walk. The
 *   `names` set is the starting point and is added to in place.
 * @returns Every top-level statement the names reach.
 */
export function closing(scope: Scoped, names: Set<string>): Set<Stated> {
  const reached = new Set<Stated>();
  const pending = [...names];

  for (const name of pending) {
    const statement = scope.declared.get(name);

    if (statement === undefined) continue;

    reached.add(statement);

    for (const referenced of referred(statement)) {
      if (!names.has(referenced)) pending.push(referenced);
      names.add(referenced);
    }
  }

  return reached;
}
