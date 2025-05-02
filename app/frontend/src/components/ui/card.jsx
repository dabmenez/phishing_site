import React from "react";

export const Card = ({ className = "", children, ...props }) => (
  <div className={`rounded-xl border bg-white shadow ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ className = "", children }) => (
  <div className={`flex flex-col gap-1 p-4 border-b ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-sm font-medium text-muted-foreground ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ className = "", children }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
