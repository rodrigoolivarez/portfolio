import React from "react";
import { Stack, Switch, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useColorMode } from "../../contexts/ColorModeContext";

const ThemeToggle: React.FC = () => {
  const { mode, toggleMode } = useColorMode();
  const checked = mode === "dark";

  return (
    <Tooltip title={checked ? "Modo oscuro" : "Modo claro"}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <LightModeIcon fontSize="small" />
        <Switch
          size="small"
          checked={checked}
          onChange={toggleMode}
          inputProps={{ "aria-label": "toggle theme" }}
        />
        <DarkModeIcon fontSize="small" />
      </Stack>
    </Tooltip>
  );
};

export default ThemeToggle;
