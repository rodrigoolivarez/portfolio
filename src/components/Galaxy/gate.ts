/** Cualquier botón del sitio puede pedir volver a la puerta de entrada (lo escucha GalaxyBackground) */
export const REOPEN_GATE_EVENT = "galaxy:reopen-gate";
export const reopenGate = () => window.dispatchEvent(new Event(REOPEN_GATE_EVENT));
