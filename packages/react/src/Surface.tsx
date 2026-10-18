import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx.ts";
import type { SpaceStep } from "./Stack.tsx";
import { statusMeta, type Status } from "./Text.tsx";

export interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "article" | "aside" | "header" | "footer";
  padding?: SpaceStep;
  raised?: boolean;
  /** `subtle` sits on the page background; `default` is a card. */
  variant?: "default" | "subtle";
  /**
   * A status callout: tinted background, colored edge, and a glyph plus a visually hidden prefix,
   * so the status reads without color.
   */
  status?: Status;
  children?: ReactNode;
}

export function Surface({
  as: Element = "div",
  padding = 4,
  raised,
  variant = "default",
  status,
  className,
  children,
  ...rest
}: SurfaceProps) {
  const classes = cx(
    "h-surface",
    `h-surface--${variant}`,
    `h-pad-${padding}`,
    raised && "h-surface--raised",
    status && `h-surface--status h-surface--${status}`,
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
      <div className="h-surface__body">
        <span className="h-visually-hidden">{meta.label}: </span>
        {children}
      </div>
    </Element>
  );
}
