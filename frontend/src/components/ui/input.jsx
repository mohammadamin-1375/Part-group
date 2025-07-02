import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-md bg-zinc-900 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
      {...props}
    />
  );
}
