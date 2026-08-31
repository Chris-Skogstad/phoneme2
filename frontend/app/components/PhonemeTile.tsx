"use client";

import Tooltip from "./Tooltip";

type TileState = "default" | "answer" | "correct" | "wrong-position" | "absent";

type PhonemeTileProps = {
  token: string;
  state?: TileState;
  hint?: string;
  size?: "sm" | "md" | "kb" | "lg" | "xl" | "responsive";
  onClick?: () => void;
  disabled?: boolean;
};

const stateStyles: Record<TileState, string> = {
  default: "bg-gray-800 text-white",
  answer: "bg-indigo-500 text-white",
  correct: "bg-green-600 text-white",
  "wrong-position": "bg-amber-500 text-white",
  absent: "bg-gray-600 text-white",
};

const sizeStyles: Record <
  "sm" | "md" | "kb" | "lg" | "xl" | "responsive",
  string
> = {
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-sm",
  kb: "w-11 h-11 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-2xl",
  responsive: "w-full aspect-square text-xs sm:text-sm",
};

export default function PhonemeTile({
  token,
  state = "default",
  hint,
  size = "md",
  onClick,
  disabled,
}: PhonemeTileProps) {
  const baseClasses = `flex items-center justify-center font-bold rounded transition-colors ${stateStyles[state]} ${sizeStyles[size]}`;

  const tile = onClick ? (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
    >
      {token}
    </button>
  ) : (
    <div className={baseClasses}>{token}</div>
  );

  if (!hint) return tile;

  return <Tooltip label={hint}>{tile}</Tooltip>;
}