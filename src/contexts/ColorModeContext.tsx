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
  primary: { main: "#016fb9" },
  secondary: { main: "#2e7d32" },
  background: { default: "#f5f7fb", paper: "#ffffff" },
  text: { primary: "#0A0D12", secondary: "#344054", disabled: "#98A2B3" },
  divider: "#E5E7EB",
};

const darkPalette = {
  mode: "dark" as const,
  primary: { main: "#58A6FF" },
  secondary: { main: "#3FB950" },
  background: { default: "#0D1117", paper: "#161B22" },
  text: { primary: "#E6EDF3", secondary: "#B0BAC6", disabled: "#7D8590" },
  divider: "#30363D",
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
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem("mode") as Mode) || "dark");

  useEffect(() => {
    // preferencia del SO la primera vez
    if (!localStorage.getItem("mode")) {
      const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
      setMode(prefersLight ? "light" : "dark");
    }
  }, []);

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
