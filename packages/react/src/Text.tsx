import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx.ts";

export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type TextTone = "default" | "muted" | "accent";
export type TextWeight = "regular" | "medium" | "bold";
export type Status = "success" | "warning" | "danger" | "info";

type TextElement = "p" | "span" | "div" | "label" | "h1" | "h2" | "h3" | "h4" | "strong" | "small";

/** Glyph and spoken prefix for each status, so status is never carried by color alone. */
export const statusMeta: Record<Status, { glyph: string; label: string }> = {
  success: { glyph: "✓", label: "Success" },
  warning: { glyph: "!", label: "Warning" },
  danger: { glyph: "✕", label: "Error" },
  info: { glyph: "i", label: "Info" },
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextElement;
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  mono?: boolean;
  /**
   * Renders status text: colored, with a glyph and a visually hidden prefix such as "Error:".
   * Overrides `tone`.
   */
  status?: Status;
  htmlFor?: string;
  children?: ReactNode;
}

export function Text({
  as: Element = "span",
  size = "md",
  tone = "default",
  weight,
  mono,
  status,
  className,
  children,
  ...rest
}: TextProps) {
  const classes = cx(
    "h-text",
    `h-text--${size}`,
    status ? `h-text--status h-text--${status}` : `h-text--${tone}`,
    weight && `h-text--${weight}`,
    mono && "h-text--mono",
    className,
  );
  if (!status) {
    return (
      <Element className={classes} {...rest}>
        {children}
      </Element>
    );
  }
  const meta = statusMeta[status];
  return (
    <Element className={classes} {...rest}>
      <span className="h-status-glyph" aria-hidden="true">
        {meta.glyph}
      </span>
      <span className="h-visually-hidden">{meta.label}: </span>
      {children}
    </Element>
  );
}
