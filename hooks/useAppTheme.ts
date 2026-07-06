import constate from "constate";
import { useState } from "react";
import { useColorScheme } from "react-native";

import { darkColors, lightColors } from "../constants/Colors";

const useAppTheme = () => {
  const initialThemeMode = useColorScheme() === "dark" ? "dark" : "light";

  const [theme, setTheme] = useState<"light" | "dark">(initialThemeMode);

  const colors = theme === "light" ? lightColors : darkColors;

  return {
    colors,
    theme,
    setTheme,
  };
};

export const [AppThemeProvider, useAppThemeContext] = constate(useAppTheme);
