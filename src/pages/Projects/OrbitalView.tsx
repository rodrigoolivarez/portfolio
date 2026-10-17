import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';

import { PROJECTS } from '../../data/projects';
import { planetBus, type PlanetOnScreen } from '../../components/Galaxy/planetBus';
import ProjectDossier from './ProjectDossier';
import { PlanetLayer, PlanetHit, Beam, Hologram, Backdrop } from './styles';

type Props = {
  selected: string | null;
  onSelect: (key: string | null) => void;
};

const HEADER_SAFE = 76; // alto de la barra de navegación
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Capa sobre la escena 3D: un botón real sobre cada planeta (sigue su órbita cuadro a cuadro)
 * y, al fijar uno, un haz en V que proyecta el holograma del proyecto desde el planeta.
 * Las posiciones se escriben directo en el DOM para no re-renderizar React 30 veces por segundo.
 */
const OrbitalView: React.FC<Props> = ({ selected, onSelect }) => {
  const { t } = useTranslation();
  const layerRef = useRef<HTMLDivElement>(null);
  const hitRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<SVGPolygonElement>(null);
  const edgeRef = useRef<SVGPolylineElement>(null);
  const lastRef = useRef<PlanetOnScreen[]>([]);
  const selectedRef = useRef(selected);
  const [below, setBelow] = useState(false);

  selectedRef.current = selected;

  // Ubica el holograma y el haz respecto del planeta fijado
  const placeHologram = (p: PlanetOnScreen, flip: boolean) => {
    const panel = panelRef.current;
    if (!panel) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(540, vw - 24);
    const left = clamp(p.x - width / 2, 12, vw - width - 12);
    const gap = Math.max(48, p.r + 40);

    panel.style.left = `${left}px`;
    panel.style.width = `${width}px`;

    let apexY: number;
    let baseY: number;
    if (!flip) {
      baseY = p.y - gap;
      apexY = p.y - p.r * 0.35;
      panel.style.top = '';
      panel.style.bottom = `${vh - baseY}px`;
      panel.style.maxHeight = `${Math.max(200, baseY - HEADER_SAFE)}px`;
    } else {
      baseY = p.y + gap;
      apexY = p.y + p.r * 0.35;
      panel.style.bottom = '';
      panel.style.top = `${baseY}px`;
      panel.style.maxHeight = `${Math.max(200, vh - baseY - 16)}px`;
    }

    const a = `${left + width * 0.1},${baseY}`;
    const b = `${left + width * 0.9},${baseY}`;
    const apex = `${p.x},${apexY}`;
    beamRef.current?.setAttribute('points', `${a} ${apex} ${b}`);
    edgeRef.current?.setAttribute('points', `${a} ${apex} ${b}`);
  };

  // Posiciones de los planetas, cada frame
  useEffect(() => {
    return planetBus.subscribe((planets) => {
      lastRef.current = planets;
      for (const p of planets) {
        const el = hitRefs.current[p.key];
        if (!el) continue;
        const size = Math.max(48, p.r * 2 + 18);
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.transform = `translate(${p.x - size / 2}px, ${p.y - size / 2}px)`;
        el.style.opacity = p.visible ? '1' : '0';
        // Cerca de los bordes, la etiqueta se alinea hacia adentro para no cortarse
        const vw = window.innerWidth;
        el.dataset.edge = p.x < 110 ? 'left' : p.x > vw - 110 ? 'right' : '';
        el.style.pointerEvents = p.visible ? 'auto' : 'none';
      }
      const sel = selectedRef.current;
      if (sel) {
        const p = planets.find((x) => x.key === sel);
        if (p) placeHologram(p, panelRef.current?.dataset.flip === 'true');
      }
    });
  }, []);

  // Fijar / soltar el planeta en la escena (detiene las órbitas mientras se lee)
  useEffect(() => {
    planetBus.focus(selected);
    if (selected) {
      const p = lastRef.current.find((x) => x.key === selected);
      // Se proyecta hacia arriba (la "V"); si arriba no entra cómodo y abajo hay más lugar, hacia abajo
      if (p) {
        const gap = Math.max(48, p.r + 40);
        const above = p.y - gap - HEADER_SAFE;
        const belowSpace = window.innerHeight - (p.y + gap) - 16;
        setBelow(above < 460 && belowSpace > above);
      }
    }
  }, [selected]);

  useEffect(() => () => planetBus.focus(null), []);

  // Ubicar apenas se monta el panel (antes de pintar)
  useLayoutEffect(() => {
    if (!selected) return;
    const p = lastRef.current.find((x) => x.key === selected);
    if (p) placeHologram(p, below);
  }, [selected, below]);

  // Esc cierra la señal y devuelve el foco al planeta
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const key = selected;
        onSelect(null);
        hitRefs.current[key]?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, onSelect]);

  // La capa acompaña sólo la parte de arriba de la página (al bajar al footer, se oculta)
  useEffect(() => {
    const onScroll = () => {
      const layer = layerRef.current;
      if (!layer) return;
      const hide = window.scrollY > window.innerHeight * 0.35;
      layer.style.opacity = hide ? '0' : '1';
      layer.style.visibility = hide ? 'hidden' : 'visible';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const index = PROJECTS.findIndex((p) => p.key === selected);
  const project = index >= 0 ? PROJECTS[index] : null;

  return (
    <PlanetLayer ref={layerRef}>
      {/* Tocar afuera cierra la señal. Los planetas quedan por encima: tocar otro cambia de proyecto */}
      <AnimatePresence>
        {project && (
          <Backdrop
            key="backdrop"
            aria-hidden="true"
            onClick={() => onSelect(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {PROJECTS.map((p, i) => (
        <PlanetHit
          key={p.key}
          ref={(el) => {
            hitRefs.current[p.key] = el;
          }}
          type="button"
          className={selected === p.key ? 'selected' : undefined}
          aria-label={`${t('projects.explore')}: ${t(`projects.items.${p.key}.title`)}`}
          aria-expanded={selected === p.key}
          onClick={() => onSelect(selected === p.key ? null : p.key)}
          style={{ '--planet': p.planet.light } as React.CSSProperties}
        >
          <span className="ring" aria-hidden="true" />
          <span className="label" aria-hidden="true">
            <span className="index">0{i + 1}</span>
            {t(`projects.items.${p.key}.title`)}
          </span>
        </PlanetHit>
      ))}

      {/* mode="wait": el holograma anterior se repliega antes de proyectar el nuevo (las refs quedan limpias) */}
      <AnimatePresence mode="wait">
        {project && (
          <React.Fragment key={project.key}>
            <Beam aria-hidden="true">
              <defs>
                <linearGradient id="beam-fill" x1="0" y1={below ? '0' : '1'} x2="0" y2={below ? '1' : '0'}>
                  <stop offset="0%" stopColor="var(--color-accent-secondary)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0.06" />
                </linearGradient>
              </defs>
              <motion.polygon
                ref={beamRef}
                fill="url(#beam-fill)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.polyline
                ref={edgeRef}
                fill="none"
                stroke="var(--color-accent-secondary)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Beam>

            <Hologram
              ref={panelRef}
              data-flip={below}
              role="dialog"
              aria-labelledby="hologram-title"
              initial={{ opacity: 0, scaleY: 0.05, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scaleY: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scaleY: 0.05, filter: 'blur(6px)' }}
              transition={{ duration: 0.45, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ transformOrigin: below ? 'top center' : 'bottom center' }}
              onAnimationComplete={() => panelRef.current?.querySelector<HTMLElement>('h2')?.focus()}
            >
              <button
                type="button"
                className="close"
                onClick={() => {
                  onSelect(null);
                  hitRefs.current[project.key]?.focus();
                }}
                aria-label={t('projects.closeSignal')}
              >
                <CloseIcon fontSize="small" />
              </button>
              <ProjectDossier project={project} index={index} titleId="hologram-title" />
            </Hologram>
          </React.Fragment>
        )}
      </AnimatePresence>
    </PlanetLayer>
  );
};

export default OrbitalView;
