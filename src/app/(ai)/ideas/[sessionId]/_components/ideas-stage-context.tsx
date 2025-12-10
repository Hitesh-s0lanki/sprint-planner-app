"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface IdeasStageContextType {
  activeStep: number;
  setActiveStep: (step: number) => void;
}

const IdeasStageContext = createContext<IdeasStageContextType | undefined>(
  undefined
);

export function IdeasStageProvider({ children }: { children: ReactNode }) {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <IdeasStageContext.Provider value={{ activeStep, setActiveStep }}>
      {children}
    </IdeasStageContext.Provider>
  );
}

export function useIdeasStage() {
  const context = useContext(IdeasStageContext);
  if (context === undefined) {
    throw new Error("useIdeasStage must be used within IdeasStageProvider");
  }
  return context;
}


