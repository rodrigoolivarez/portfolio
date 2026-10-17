import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import MotionPhotosOffOutlinedIcon from "@mui/icons-material/MotionPhotosOffOutlined";
import { useTranslation } from "react-i18next";
import { useMotion } from "../../contexts/MotionContext";

/** Activa / reduce las animaciones (salto hiperespacial, intro, estelas) */
const MotionToggle: React.FC = () => {
  const { reduced, toggleMotion } = useMotion();
  const { t } = useTranslation();
  const label = reduced ? t("nav.motionOn") : t("nav.motionOff");

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={toggleMotion}
        aria-label={label}
        aria-pressed={!reduced}
        size="small"
        sx={{
          color: reduced ? "var(--color-text-light-tertiary)" : "var(--color-accent-secondary)",
          "&:hover": { color: "var(--color-accent-secondary)" },
        }}
      >
        {reduced ? <MotionPhotosOffOutlinedIcon fontSize="small" /> : <AutoAwesomeOutlinedIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
};

export default MotionToggle;
