import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useTranslation } from "react-i18next";
import { useColorMode } from "../../contexts/ColorModeContext";

const ThemeToggle: React.FC = () => {
  const { mode, toggleMode } = useColorMode();
  const { t } = useTranslation();
  const label = mode === "dark" ? t("nav.toLight") : t("nav.toDark");

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={toggleMode}
        aria-label={label}
        size="small"
        sx={{ color: "var(--color-text-light-secondary)", "&:hover": { color: "var(--color-accent-secondary)" } }}
      >
        {mode === "dark" ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
