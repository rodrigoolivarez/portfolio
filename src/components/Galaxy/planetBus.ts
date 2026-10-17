/**
 * Canal entre la escena 3D y la página de Proyectos.
 * - La escena publica en cada frame dónde se ve cada planeta en pantalla.
 * - La página avisa qué planeta está "fijado" (holograma abierto): las órbitas se detienen.
 */

export type PlanetOnScreen = {
  key: string;
  /** Centro en píxeles de la ventana */
  x: number;
  y: number;
  /** Radio aparente en píxeles */
  r: number;
  /** Delante de la pantalla y no tapado por la sombra del agujero negro */
  visible: boolean;
};

type PositionsListener = (planets: PlanetOnScreen[]) => void;
type FocusListener = (key: string | null) => void;

const positionListeners = new Set<PositionsListener>();
const focusListeners = new Set<FocusListener>();

export const planetBus = {
  publish(planets: PlanetOnScreen[]) {
    positionListeners.forEach((l) => l(planets));
  },
  subscribe(listener: PositionsListener) {
    positionListeners.add(listener);
    return () => {
      positionListeners.delete(listener);
    };
  },
  /** La página fija (o suelta) un planeta */
  focus(key: string | null) {
    focusListeners.forEach((l) => l(key));
  },
  onFocus(listener: FocusListener) {
    focusListeners.add(listener);
    return () => {
      focusListeners.delete(listener);
    };
  },
};
