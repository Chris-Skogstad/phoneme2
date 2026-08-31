"use client";

import { ReactNode } from "react";

type TooltipProps = {
  label: string;
  children: ReactNode;
};

export default function Tooltip({ label, children }: TooltipProps) {
  return (
    <div className="group relative inline-flex items-center justify-center cursor-default">
      {children}
      <span className="absolute left-1/2 -translate-x-1/2 -top-8 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
        {label}
      </span>
    </div>
  );
}