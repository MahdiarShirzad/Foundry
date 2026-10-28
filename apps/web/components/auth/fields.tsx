"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";

import { PASSWORD_RULES, passwordStrength } from "@/lib/auth/policy";

type BaseProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  hint?: string;
  disabled?: boolean;
  autoFocus?: boolean;
};

const LABEL = "font-mono text-[10.5px] uppercase tracking-[0.22em] text-faint";

function FieldShell({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={LABEL}>
          {label}
        </label>
        {hint ? (
          <span id={`${id}-hint`} className="text-[11.5px] text-faint">
            {hint}
          </span>
        ) : null}
      </div>
      <div className="relative mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-danger">
          <span aria-hidden className="mt-[2px] font-mono">
            !
          </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClasses(error?: string | null, extra = "") {
  return `h-11 w-full border bg-panel px-3 text-[15px] text-fg outline-none transition-colors placeholder:text-faint/70 disabled:cursor-not-allowed disabled:bg-bg disabled:text-muted ${
    error ? "border-danger" : "border-line hover:border-line-2 focus:border-accent"
  } ${extra}`;
}

function describedBy(id: string, error?: string | null, hint?: string) {
  const ids = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  disabled,
  autoFocus,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  spellCheck,
}: BaseProps & {
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  autoComplete?: string;
  inputMode?: "text" | "email" | "numeric";
  placeholder?: string;
  spellCheck?: boolean;
}) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        spellCheck={spellCheck}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={inputClasses(error)}
      />
    </FieldShell>
  );
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  disabled,
  autoComplete,
  showRules = false,
  autoFocus,
}: BaseProps & {
  autoComplete?: string;
  /** Renders the policy list + strength meter under the field. */
  showRules?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const strength = passwordStrength(value);

  return (
    <div>
      <FieldShell id={id} label={label} hint={hint} error={error}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          autoCapitalize="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [describedBy(id, error, hint), showRules ? `${id}-rules` : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={inputClasses(error, "pr-[4.5rem]")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-controls={id}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </FieldShell>

      {showRules ? (
        <div id={`${id}-rules`} className="mt-2.5">
          <div className="flex items-center gap-1.5" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-0.5 flex-1 transition-colors duration-300 ${
                  strength > i ? "bg-accent" : "bg-line"
                }`}
              />
            ))}
            <span className="ml-2 font-mono text-[9.5px] uppercase tracking-[0.18em] text-faint">
              {value ? ["", "weak", "fair", "strong"][strength] : "strength"}
            </span>
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {PASSWORD_RULES.map((rule) => (
              <li key={rule} className="flex items-center gap-1.5 text-[11.5px] text-faint">
                <span aria-hidden className="size-1 bg-line-2" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function CheckboxField({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-[3px] size-4 shrink-0 cursor-pointer border border-line-2 bg-panel accent-[var(--accent)]"
        />
        <label htmlFor={id} className="text-[12.5px] leading-relaxed text-muted">
          {children}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-danger">
          <span aria-hidden className="mt-[2px] font-mono">
            !
          </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}
