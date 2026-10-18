import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx.ts";

export type ButtonVariant = "default" | "primary" | "danger";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", size = "md", type = "button", className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx("h-button", `h-button--${variant}`, `h-button--${size}`, className)}
      {...rest}
    />
  );
});

export interface IconButtonProps extends Omit<ButtonProps, "children" | "aria-label"> {
  /** Accessible name. Required because the button shows only an icon. */
  label: string;
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, title, className, ...rest },
  ref,
) {
  return (
    <Button
      ref={ref}
      aria-label={label}
      title={title ?? label}
      className={cx("h-icon-button", className)}
      {...rest}
    >
      <span className="h-icon" aria-hidden="true">
        {icon}
      </span>
    </Button>
  );
});
