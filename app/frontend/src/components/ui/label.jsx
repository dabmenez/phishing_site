import React from "react";

export const Label = ({ className = "", children, ...props }) => (
  <label className={`text-sm font-medium ${className}`} {...props}>
    {children}
  </label>
);
