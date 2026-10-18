import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx.ts";
import { Text } from "./Text.tsx";

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: ReactNode;
  hint?: ReactNode;
  /** Shown below the input as status text, and marks the input invalid. */
  error?: ReactNode;
  /** Class for the wrapper. `className` goes to the input. */
  fieldClassName?: string;
}

/** A labelled text input with hint and error text wired to `aria-describedby`. */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, id, className, fieldClassName, disabled, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `${autoId}-input`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [hintId, errorId, rest["aria-describedby"]].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cx("h-field", disabled && "h-field--disabled", fieldClassName)}>
      <Text as="label" size="sm" weight="medium" htmlFor={inputId} className="h-field__label">
        {label}
      </Text>
      <input
        ref={ref}
        id={inputId}
        className={cx("h-input", className)}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        {...rest}
        aria-describedby={describedBy}
      />
      {hint ? (
        <Text id={hintId} size="sm" tone="muted">
          {hint}
        </Text>
      ) : null}
      {error ? (
        <Text id={errorId} size="sm" status="danger">
          {error}
        </Text>
      ) : null}
    </div>
  );
});
