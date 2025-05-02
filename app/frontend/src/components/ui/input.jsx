import React from "react";

export const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none ${className}`}
    {...props}
  />
);
