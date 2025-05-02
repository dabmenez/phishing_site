import React from "react";

export const Table = ({ className = "", ...props }) => (
  <table className={`w-full text-sm ${className}`} {...props} />
);
