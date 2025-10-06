"use client";

import React, { createContext, useContext, useState } from "react";
import Loader from "../_components/loader/loader";

interface LoaderContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isEntered: boolean;
  setIsEntered: (entered: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | null>(null);

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEntered, setIsEntered] = useState(false);

  return (
    <LoaderContext.Provider
      value={{ isLoading, setIsLoading, isEntered, setIsEntered }}
    >
      {isLoading ? <Loader /> : null}
      {isEntered ? <div>{children}</div> : null}
    </LoaderContext.Provider>
  );
};
