import React from "react";
import { Button, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

type Lang = "es" | "en";

/**
 * Alterna ES / EN. Se usan códigos en texto en lugar de banderas emoji:
 * Windows no renderiza banderas emoji (se ven como "ES" / "GB" sueltas).
 */
const LangFlagSelect: React.FC = () => {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language?.startsWith("en") ? "en" : "es";
  const next: Lang = lang === "es" ? "en" : "es";

  const change = () => {
    i18n.changeLanguage(next);
  };

  return (
    <Tooltip title={next === "en" ? "Switch to English" : "Cambiar a español"}>
      <Button
        onClick={change}
        size="small"
        aria-label={next === "en" ? "Switch to English" : "Cambiar a español"}
        sx={{
          minWidth: 0,
          px: 1,
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "0.8rem",
          color: "var(--color-text-light-secondary)",
          backgroundColor: "transparent",
          borderRadius: "8px",
          "&:hover": { color: "var(--color-accent-secondary)", backgroundColor: "var(--color-accent-soft)", filter: "none" },
        }}
      >
        <span style={{ color: "var(--color-accent-secondary)" }}>{lang.toUpperCase()}</span>
        <span style={{ opacity: 0.5, margin: "0 2px" }}>/</span>
        {next.toUpperCase()}
      </Button>
    </Tooltip>
  );
};

export default LangFlagSelect;
