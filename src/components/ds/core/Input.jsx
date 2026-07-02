import React from 'react';

/**
 * Input — text field with optional label, leading icon and hint/error.
 * Dark surface, cyan focus glow.
 */
export function Input({
  label,
  hint,
  error,
  iconLeft = null,
  id,
  full = true,
  className = '',
  ...rest
}) {
  const inputId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <label htmlFor={inputId} className={full ? 'block w-full' : 'inline-block'}>
      {label && (
        <span className="mb-[7px] block font-code text-xs uppercase tracking-wide text-muted">{label}</span>
      )}
      <span
        className={`flex h-[46px] items-center gap-[9px] rounded-md border-[1.5px] bg-surface px-[14px] transition-control ${error ? 'border-status-danger' : 'border-line'}`}
      >
        {iconLeft && <span className="inline-flex text-faint">{iconLeft}</span>}
        <input
          id={inputId}
          className={`min-w-0 flex-1 border-none bg-transparent font-sans text-base text-body outline-none ${className}`}
          {...rest}
        />
      </span>
      {(hint || error) && (
        <span className={`mt-1.5 block text-sm ${error ? 'text-status-danger' : 'text-faint'}`}>{error || hint}</span>
      )}
    </label>
  );
}
