import React, { createContext, useContext } from "react";

/* ---------------------------------------------------------------- context */
const TabsCtx = createContext();

/* ---------------------------------------------------------------- wrappers */
export const Tabs = ({ value, onValueChange, children }) => (
  <TabsCtx.Provider value={{ value, onValueChange }}>
    {children}
  </TabsCtx.Provider>
);

export const TabsList = ({ children }) => (
  <div className="flex w-full gap-1 rounded-lg bg-gray-200 p-1">
    {children}
  </div>
);

/* ---------------------------------------------------------------- trigger */
export const TabsTrigger = ({ value, children }) => {
  const { value: active, onValueChange } = useContext(TabsCtx);
  const isActive = value && active === value;

  return (
    <button
      className={`
        flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors
        ${isActive
          ? "!bg-green-600 !text-white shadow"
          : "!bg-gray-300 !text-gray-800 hover:!bg-gray-400"}
      `}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>

  );
};

/* ---------------------------------------------------------------- content */
export const TabsContent = ({ value, children }) => {
  const { value: active } = useContext(TabsCtx);
  return active === value ? children : null;
};
