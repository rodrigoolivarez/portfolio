import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

import { SectionHeader } from '../../components/ui/Hud';
import { planetBus } from '../../components/Galaxy/planetBus';
import { PROJECTS } from '../../data/projects';
import { trackEvent } from '../../lib/analytics';
import OrbitalView from './OrbitalView';
import ProjectDossier from './ProjectDossier';
import {
  ProjectsContainer,
  Systems,
  Console,
  PlanetList,
  PlanetTab,
  Planet,
  Dossier,
} from './styles';

type View = 'pending' | 'orbital' | 'classic';

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const { hash } = useLocation();
  const hashKey = PROJECTS.find((p) => `#${p.key}` === hash)?.key ?? null;

  // Vista orbital si la escena 3D publica planetas; si no llega (sin WebGL), dossier clásico
  const [view, setView] = useState<View>('pending');
  const [selected, setSelected] = useState<string | null>(null);
  const [active, setActive] = useState(() => Math.max(0, PROJECTS.findIndex((p) => p.key === hashKey)));
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    // Si la escena tarda (equipo lento, shaders compilando), los planetas pueden llegar después
    // del fallback: en ese caso igual se pasa a la vista orbital.
    let off = () => {};
    off = planetBus.subscribe(() => {
      setView('orbital');
      off();
    });
    const fallback = window.setTimeout(() => setView((v) => (v === 'pending' ? 'classic' : v)), 2500);
    return () => {
      off();
      window.clearTimeout(fallback);
    };
  }, []);

  // Llegando desde una constelación (/proyectos#clave): abrir ese planeta
  useEffect(() => {
    if (!hashKey) return;
    if (view === 'orbital') {
      // Dar tiempo a que la nave llegue a la estación antes de proyectar
      const id = window.setTimeout(() => setSelected(hashKey), 900);
      return () => window.clearTimeout(id);
    }
    if (view === 'classic') setActive(PROJECTS.findIndex((p) => p.key === hashKey));
  }, [hashKey, view]);

  const select = useCallback((key: string | null) => setSelected(key), []);

  // Métrica: qué proyecto se abre (vista orbital y vista clásica)
  useEffect(() => {
    if (!selected) return;
    const p = PROJECTS.find((x) => x.key === selected);
    trackEvent('project_open', { project: selected, category: p?.category ?? '', view: 'orbital' });
  }, [selected]);

  const openClassic = (i: number) => {
    setActive(i);
    trackEvent('project_open', { project: PROJECTS[i].key, category: PROJECTS[i].category, view: 'classic' });
  };

  // Flechas del teclado en la vista clásica (patrón de pestañas accesibles)
  const onKeyDown = (e: React.KeyboardEvent) => {
    const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const back = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    if (!forward && !back) return;
    e.preventDefault();
    const next = (active + (forward ? 1 : -1) + PROJECTS.length) % PROJECTS.length;
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <ProjectsContainer id="projects" className={view === 'orbital' ? 'orbital' : undefined}>
      <SectionHeader
        sector={t('projects.sector')}
        title={t('projects.featured')}
        lead={view === 'orbital' ? t('projects.leadOrbital') : t('projects.lead')}
      />

      {view !== 'classic' && (
        <Systems aria-label={t('projects.systems')}>
          {(['current', 'side'] as const).map((category) => (
            <div className="group" key={category}>
              <span className="label">{t(`projects.categoryPlural.${category}`)}</span>
              <ul>
                {PROJECTS.map((p, i) =>
                  p.category !== category ? null : (
                    <li key={p.key}>
                      <button
                        type="button"
                        className={[selected === p.key ? 'active' : '', category].join(' ').trim()}
                        aria-pressed={selected === p.key}
                        onClick={() => setSelected(selected === p.key ? null : p.key)}
                        style={{ '--planet': p.planet.light } as React.CSSProperties}
                      >
                        <span className="dot" aria-hidden="true" />
                        0{i + 1} · {t(`projects.items.${p.key}.title`)}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </Systems>
      )}

      {view === 'orbital' && <OrbitalView selected={selected} onSelect={select} />}

      {view === 'classic' && (
        <Console>
          <PlanetList role="tablist" aria-label={t('projects.listLabel')} aria-orientation="vertical" onKeyDown={onKeyDown}>
            {PROJECTS.map((p, i) => (
              <PlanetTab
                key={p.key}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                id={`tab-${p.key}`}
                aria-selected={i === active}
                aria-controls="project-dossier"
                tabIndex={i === active ? 0 : -1}
                className={i === active ? 'active' : undefined}
                onClick={() => openClassic(i)}
              >
                <Planet $light={p.planet.light} $dark={p.planet.dark} aria-hidden="true">
                  <span className="moon" />
                </Planet>
                <span className="text">
                  <span className="index">0{i + 1}</span>
                  <span className="name">{t(`projects.items.${p.key}.title`)}</span>
                  <span className="type">{t(`projects.items.${p.key}.type`)}</span>
                </span>
              </PlanetTab>
            ))}
          </PlanetList>

          <Dossier role="tabpanel" id="project-dossier" aria-labelledby={`tab-${PROJECTS[active].key}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={PROJECTS[active].key}
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.35 }}
              >
                <ProjectDossier project={PROJECTS[active]} index={active} />
              </motion.div>
            </AnimatePresence>
          </Dossier>
        </Console>
      )}
    </ProjectsContainer>
  );
};

export { Projects };
export default Projects;
