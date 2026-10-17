import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type Ctx = {
  /** true = animaciones reducidas (sin saltos ni intro) */
  reduced: boolean;
  toggleMotion: () => void;
};

const MotionContext = createContext<Ctx>({ reduced: false, toggleMotion: () => {} });
export const useMotion = () => useContext(MotionContext);

const STORAGE_KEY = "motion";
const query = () => window.matchMedia?.("(prefers-reduced-motion: reduce)");

/** Elección guardada del visitante; si no eligió nada, manda la preferencia del sistema */
function readInitial(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "full") return false;
    if (saved === "reduced") return true;
  } catch {
    /* sin storage: usamos la preferencia del sistema */
  }
  return query()?.matches ?? false;
}

/**
 * Preferencia de movimiento. Por defecto respeta "reducir movimiento" del sistema
 * (muchos Windows lo traen activado sin que la persona lo sepa), pero el interruptor
 * de la barra permite activar las animaciones a mano y la elección queda guardada.
 */
export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reduced, setReduced] = useState(readInitial);

  // Si el visitante no eligió nada, seguimos los cambios del sistema
  useEffect(() => {
    const mq = query();
    if (!mq) return;
    const onChange = () => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        /* sin storage */
      }
      setReduced(mq.matches);
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // La clase en <html> apaga las animaciones CSS (ver index.css)
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduced);
  }, [reduced]);

  const toggleMotion = useCallback(() => {
    setReduced((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "reduced" : "full");
      } catch {
        /* sin storage: vale para esta visita */
      }
      return next;
    });
  }, []);

  return <MotionContext.Provider value={{ reduced, toggleMotion }}>{children}</MotionContext.Provider>;
};
