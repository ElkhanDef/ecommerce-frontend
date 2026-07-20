interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export default function TextField({ id, label, error, ...inputProps }: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[13px] font-medium text-gray-600 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full p-3 border rounded-xl text-[14px] outline-none focus:ring-[3px] transition-all ${
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
            : "border-gray-300 focus:border-gold focus:ring-gold/15"
        }`}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
