"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

const DESKTOP_BREAKPOINT = 768;

interface ViewportContextType {
  width: number;
  isMobile: boolean;
  isDesktop: boolean;
}

const ViewportContext = createContext<ViewportContextType | undefined>(
  undefined,
);

export const ViewportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const value = useMemo(
    () => ({
      width,
      isMobile: width > 0 && width < DESKTOP_BREAKPOINT,
      isDesktop: width >= DESKTOP_BREAKPOINT,
    }),
    [width],
  );

  return (
    <ViewportContext.Provider value={value}>
      {children}
    </ViewportContext.Provider>
  );
};

export const useViewport = () => {
  const context = useContext(ViewportContext);
  if (context === undefined) {
    throw new Error("useViewport must be used within a ViewportProvider");
  }
  return context;
};
