import { useContext } from "react";
import IsBackgroundDisabledContext from "../context/isBackgroundDisabledProvider";

const useIsBackgroundDisabled = () => {
  const context = useContext(IsBackgroundDisabledContext);
  if (context === undefined) {
    throw new Error(
      "useIsBackgroundDisabled must be used within an isBackgroundDisabledProvider"
    );
  }
  return context;
};

export default useIsBackgroundDisabled;
