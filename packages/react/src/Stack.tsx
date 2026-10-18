import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx.ts";

export type SpaceStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

export interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "ul" | "ol" | "nav" | "header" | "footer" | "form" | "main";
  direction?: "column" | "row";
  gap?: SpaceStep;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  children?: ReactNode;
}

/** The layout escape hatch: flex with a token gap. Reach for this before writing layout CSS. */
export function Stack({
  as: Element = "div",
  direction = "column",
  gap = 3,
  align,
  justify,
  wrap,
  className,
  ...rest
}: StackProps) {
  return (
    <Element
      className={cx(
        "h-stack",
        `h-stack--${direction}`,
        `h-gap-${gap}`,
        align && `h-align-${align}`,
        justify && `h-justify-${justify}`,
        wrap && "h-stack--wrap",
        className,
      )}
      {...rest}
    />
  );
}
