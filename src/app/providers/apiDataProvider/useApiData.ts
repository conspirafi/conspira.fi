"use client";

import { useContext } from "react";
import { type ApiDataContextType, ApiDataContext } from "./ApiDataContext";

export const useApiData = (): ApiDataContextType => {
  const context = useContext(ApiDataContext);
  if (context === undefined) {
    throw new Error("useApiData must be used within an ApiDataProvider");
  }
  return context;
};
