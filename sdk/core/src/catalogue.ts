/**
 * Declares the catalogues a build writes beside a product for the services that grant access, serve
 * flags and publish operations.
 *
 * @remarks
 *   A deployment sends each catalogue to its service before the product goes live, so a permission,
 *   a flag and an operation exist in their services before a page reads them.
 */

import { type FlagKind } from "#flag.ts";

/**
 * Describes the product a catalogue was built for.
 */
export interface CatalogueProduct {
  /**
   * Id of the product.
   */
  readonly id: string;

  /**
   * Version of the product.
   */
  readonly version: string;
}

/**
 * Describes one declared name in a catalogue.
 */
export interface CatalogueEntry {
  /**
   * The contract's deprecation note. Absent where the name is not deprecated.
   */
  readonly deprecated?: string | undefined;

  /**
   * The description in each language the plugin's catalogues contain, by language.
   */
  readonly description: Readonly<Record<string, string>>;

  /**
   * Qualified id of the name.
   */
  readonly id: string;

  /**
   * Id of the plugin that declares the name: `host` for a kill switch.
   */
  readonly plugin: string;
}

/**
 * Describes a permission in the access catalogue.
 */
export interface CataloguePermission extends CatalogueEntry {
  /**
   * Qualified id of the resource kind a scoped permission is granted on. Absent on a permission for
   * the whole tenant.
   */
  readonly resource?: string | undefined;
}

/**
 * Describes a role in the access catalogue.
 */
export interface CatalogueRole extends CatalogueEntry {
  /**
   * Qualified ids of the permissions the role grants.
   */
  readonly permissions: readonly string[];
}

/**
 * Describes every access declaration of a product's installed plugins, for the access service and
 * the licence service.
 *
 * @remarks
 *   Each list is sorted by id, so a diff of two releases' catalogues lists every added and removed
 *   name.
 */
export interface AccessCatalogue {
  /**
   * Every entitlement.
   */
  readonly entitlements: readonly CatalogueEntry[];

  /**
   * Every permission.
   */
  readonly permissions: readonly CataloguePermission[];

  /**
   * The product the catalogue was built for.
   */
  readonly product: CatalogueProduct;

  /**
   * Every resource kind.
   */
  readonly resources: readonly CatalogueEntry[];

  /**
   * Every role.
   */
  readonly roles: readonly CatalogueRole[];
}

/**
 * Describes one flag in the flag catalogue.
 */
export interface CatalogueFlag extends CatalogueEntry {
  /**
   * The contract's default.
   */
  readonly default: boolean | string;

  /**
   * Date by which the flag is removed, where it states one. A kill switch states none.
   */
  readonly expires?: string | undefined;

  /**
   * The flag's kind.
   */
  readonly kind: FlagKind;

  /**
   * The product's value, where the product states one.
   */
  readonly product?: boolean | string | undefined;

  /**
   * The variants of an experiment.
   */
  readonly variants?: readonly string[] | undefined;
}

/**
 * Describes every flag of a product's installed plugins, one kill switch per plugin included, for
 * the flag service.
 */
export interface FlagCatalogue {
  /**
   * Every flag, sorted by id.
   */
  readonly flags: readonly CatalogueFlag[];

  /**
   * The product the catalogue was built for.
   */
  readonly product: CatalogueProduct;
}

/**
 * Describes one query or mutation an installed plugin declares.
 */
export interface CataloguedOperation {
  /**
   * The id the gateway runs the operation under.
   */
  readonly id: string;

  /**
   * `"query"` for an operation that reads records, `"mutation"` for one that changes them.
   */
  readonly kind: "mutation" | "query";

  /**
   * Name of the declaration in its contract.
   */
  readonly name: string;

  /**
   * Id of the plugin that declares the operation.
   */
  readonly plugin: string;
}

/**
 * Describes every query and mutation a product's installed plugins declare, for the gateway's
 * publishing step.
 */
export interface OperationCatalogue {
  /**
   * Each declaration, in the order of the installed plugins.
   */
  readonly operations: readonly CataloguedOperation[];

  /**
   * The product the catalogue was built for.
   */
  readonly product: CatalogueProduct;
}
