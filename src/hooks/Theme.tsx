import { MantineProvider, DefaultMantineColor as Color } from "@mantine/core";
import { useState, useContext, createContext, ReactNode } from "react";

type ThemeContextType = {
  dark: boolean;
  toggleTheme: () => void;
  primaryShade: number;
  changePrimaryColor: (c: Color) => void;
};

const init = {
  dark: true,
  toggleTheme: () => {},
  primaryShade: 8,
  changePrimaryColor: () => {},
};

const ThemeContext = createContext<ThemeContextType>(init);
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(getIsDark());
  const [primaryColor, setPrimaryColor] = useState<Color>(getPrimaryColor());
  const [primaryShade, setPrimaryShade] = useState(getIsDark() ? 8 : 6);

  function toggleTheme() {
    setDark(p => !p);
    setPrimaryShade(p => (p === 8 ? 6 : 8));
    storeIsDark(dark ? false : true);
  }

  function changePrimaryColor(c: Color) {
    setPrimaryColor(c);
    storePrimaryColor(c);
  }

  return (
    <ThemeContext.Provider
      value={{
        dark,
        toggleTheme,
        primaryShade,
        changePrimaryColor,
      }}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: dark ? "dark" : "light",
          primaryColor,
        }}
      >
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
}

function getPrimaryColor() {
  const pc = localStorage.getItem("primaryColor");
  return pc ? JSON.parse(pc) : "blue";
}

function storePrimaryColor(c: Color) {
  localStorage.setItem("primaryColor", JSON.stringify(c));
}

function getIsDark() {
  const isDark = localStorage.getItem("isDark");
  return isDark?.includes("false") ? false : true;
}

function storeIsDark(d: boolean) {
  localStorage.setItem("isDark", JSON.stringify(d));
}
