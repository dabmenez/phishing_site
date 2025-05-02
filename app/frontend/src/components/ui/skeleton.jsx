import React from "react";

/* Bloquinho cinza pulsante para loading */
export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
);
