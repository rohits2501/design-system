import type { ColorRoles } from "@house/tokens";

export type Role = keyof ColorRoles;

/** Where a legacy color was used. The same hex can mean a fill in one place and text in another. */
export type Usage = "background" | "text" | "border";

export type Mapping =
  | { kind: "role"; role: Role }
  /** No longer part of the system. `replacement` is the role to use instead, or null to delete it. */
  | { kind: "deprecated"; replacement: Role | null; reason: string };

export const role = (r: Role): Mapping => ({ kind: "role", role: r });
export const deprecated = (replacement: Role | null, reason: string): Mapping => ({
  kind: "deprecated",
  replacement,
  reason,
});

/** The role a migrated file should end up using, or null when the value is simply removed. */
export function targetRole(mapping: Mapping): Role | null {
  return mapping.kind === "role" ? mapping.role : mapping.replacement;
}
