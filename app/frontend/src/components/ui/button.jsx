import React from "react";

export const Button = ({ className = "", disabled, ...props }) => (
  <button
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);
