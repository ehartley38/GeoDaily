import { useState, createContext, ReactNode } from "react";

type IsBackgroundDisabledProviderProps = {
  children: ReactNode;
};

type IsBackgroundDisabledContextType = {
  isBackgroundDisabled: boolean;
  setIsBackgroundDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const IsBackgroundDisabledContext = createContext<
  IsBackgroundDisabledContextType | undefined
>(undefined);

export const IsBackgroundDisabledProvider = ({
  children,
}: IsBackgroundDisabledProviderProps) => {
  const [isBackgroundDisabled, setIsBackgroundDisabled] =
    useState<boolean>(false);

  return (
    <IsBackgroundDisabledContext.Provider
      value={{ isBackgroundDisabled, setIsBackgroundDisabled }}
    >
      {children}
    </IsBackgroundDisabledContext.Provider>
  );
};

export default IsBackgroundDisabledContext;
