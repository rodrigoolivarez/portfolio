import React from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import i18n from "../../i18n";

type Lang = "es" | "en";

const Flag: React.FC<{ code: Lang }> = ({ code }) => (
  <span style={{ fontSize: 18, lineHeight: 1 }}>
    {code === "es" ? "🇪🇸" : "🇬🇧"}
  </span>
);

const LangFlagSelect: React.FC = () => {
  const initial: Lang = i18n.language.startsWith("en") ? "en" : "es";
  const [lang, setLang] = React.useState<Lang>(initial);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const change = (v: Lang) => {
    setLang(v);
    i18n.changeLanguage(v);
    localStorage.setItem("i18nextLng", v);
    handleClose();
  };

  return (
    <>
      <Tooltip title={lang === "es" ? "Español" : "English"}>
        <IconButton onClick={handleOpen} color="inherit" size="small" aria-label="change language">
          <Flag code={lang} />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => change("es")} selected={lang === "es"}>
          <ListItemIcon><Flag code="es" /></ListItemIcon>
          <ListItemText primary="Español" />
        </MenuItem>
        <MenuItem onClick={() => change("en")} selected={lang === "en"}>
          <ListItemIcon><Flag code="en" /></ListItemIcon>
          <ListItemText primary="English" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default LangFlagSelect;
