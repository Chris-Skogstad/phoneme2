"use client";

type DifficultyOption<T extends string> = {
  value: T;
  label: string;
};

type DifficultySelectorProps<T extends string> = {
  options: DifficultyOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function DifficultySelector<T extends string>({
  options,
  value,
  onChange,
}: DifficultySelectorProps<T>) {
  return (
    <div className="flex gap-2 mb-6">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            value === option.value
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}