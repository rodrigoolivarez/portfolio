import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createTheme, type Theme } from "@mui/material";

type Mode = "light" | "dark";

type Ctx = {
  mode: Mode;
  toggleMode: () => void;
  theme: Theme;
};

const ColorModeContext = createContext<Ctx>({} as Ctx);
export const useColorMode = () => useContext(ColorModeContext);

const lightPalette = {
  mode: "light" as const,
  primary: { main: "#2B4C9B" },
  secondary: { main: "#8E6118" },
  background: { default: "#F5EFE3", paper: "#FBF7EF" },
  text: { primary: "#1C2541", secondary: "#464C63", disabled: "#9A9AA8" },
  divider: "#DCCFB6",
};

const darkPalette = {
  mode: "dark" as const,
  primary: { main: "#A9BFFF" },
  secondary: { main: "#D4A85A" },
  background: { default: "#070A14", paper: "#141A2E" },
  text: { primary: "#ECE6D9", secondary: "#B9B3A6", disabled: "#847F76" },
  divider: "#2A3352",
};

function createMuiTheme(mode: Mode) {
  return createTheme({
    palette: mode === "light" ? lightPalette : darkPalette,
    typography: { fontFamily: "var(--font-primary)" },
    components: {
      MuiAppBar: { styleOverrides: { root: { boxShadow: "none", borderBottom: "1px solid var(--color-border-primary)" } } },
    },
  });
}

/** Actualiza variables CSS para styled-components */
function applyCssVars(mode: Mode) {
  const root = document.documentElement;
  if (mode === "light") {
    root.classList.add("light");
  } else {
    root.classList.remove("light");
  }
}

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Misma lógica que el script de index.html: guardado > preferencia del SO
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem("mode");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    localStorage.setItem("mode", mode);
    applyCssVars(mode);
  }, [mode]);

  const theme = useMemo(() => createMuiTheme(mode), [mode]);
  const toggleMode = () => setMode(prev => (prev === "light" ? "dark" : "light"));

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode, theme }}>
      {children}
    </ColorModeContext.Provider>
  );
};
