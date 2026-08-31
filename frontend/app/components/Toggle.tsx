"use client";

type ToggleProps = {
  checked: boolean;
  onChange: () => void;
  label: string;
};

export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className="flex items-center gap-3"
    >
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </span>
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}