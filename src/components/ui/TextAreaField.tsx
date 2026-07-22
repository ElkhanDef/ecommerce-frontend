interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
}

export default function TextAreaField({ id, label, error, ...textareaProps }: TextAreaFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[13px] font-medium text-gray-600 mb-1.5"
      >
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full p-3 border rounded-xl text-[14px] outline-none focus:ring-[3px] transition-all resize-none ${
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
            : "border-gray-300 focus:border-gold focus:ring-gold/15"
        }`}
        {...textareaProps}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
