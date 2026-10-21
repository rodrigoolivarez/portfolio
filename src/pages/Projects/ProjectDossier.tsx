import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { HudAnchor } from '../../components/ui/Hud';
import type { Project } from '../../data/projects';
import { trackEvent } from '../../lib/analytics';
import { DossierTop, Screen, MetaGrid, Modules, Actions } from './styles';

type Props = {
  project: Project;
  index: number;
  /** id del título, para aria-labelledby del contenedor */
  titleId?: string;
};

/** Contenido de un proyecto: captura holográfica, descripción, módulos y acciones */
const ProjectDossier: React.FC<Props> = ({ project, index, titleId }) => {
  const { t } = useTranslation();
  // La captura se ve como holograma; "Ver original" muestra los colores reales
  const [rawImage, setRawImage] = useState(false);
  useEffect(() => setRawImage(false), [project.key]);

  const title = t(`projects.items.${project.key}.title`);
  const role = t(`projects.items.${project.key}.role`, { defaultValue: '' });

  return (
    <>
      <DossierTop>
        <span>
          {t('projects.dossier')} · 0{index + 1}
          <span className={`category ${project.category}`}>{t(`projects.category.${project.category}`)}</span>
        </span>
        <span className={`status ${project.status}`}>
          <span className="dot" aria-hidden="true" />
          {t(`projects.status.${project.status}`)}
        </span>
      </DossierTop>

      <Screen className={rawImage ? 'raw' : undefined}>
        <img src={project.image} alt={title} loading="lazy" decoding="async" />
        <span className="tint" aria-hidden="true" />
        <span className="signal" aria-hidden="true">
          {rawImage ? t('projects.signalRaw') : t('projects.signalHolo')}
        </span>
        <button type="button" className="toggle" onClick={() => setRawImage((v) => !v)} aria-pressed={rawImage}>
          {rawImage ? t('projects.viewHolo') : t('projects.viewRaw')}
        </button>
      </Screen>

      <h2 id={titleId} tabIndex={-1}>
        {title}
      </h2>
      <p className="desc">{t(`projects.items.${project.key}.desc`)}</p>

      <MetaGrid>
        <div>
          <dt>{t('projects.typeLabel')}</dt>
          <dd>{t(`projects.items.${project.key}.type`)}</dd>
        </div>
        <div>
          <dt>{t('projects.statusLabel')}</dt>
          <dd>{t(`projects.status.${project.status}`)}</dd>
        </div>
        {role && (
          <div className="wide">
            <dt>{t('projects.roleLabel')}</dt>
            <dd>{role}</dd>
          </div>
        )}
      </MetaGrid>

      <Modules aria-label={t('projects.modules')}>
        <span className="label">{t('projects.modules')}</span>
        <ul>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </Modules>

      <Actions>
        {project.url && (
          <HudAnchor
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('projects.demo')} - ${title}`}
            onClick={() => trackEvent('project_link', { project: project.key, link_type: 'demo' })}
          >
            <OpenInNewIcon fontSize="small" />
            {t('projects.demo')}
          </HudAnchor>
        )}
        {project.github && (
          <HudAnchor
            $variant="secondary"
            href={project.github}
            onClick={() => trackEvent('project_link', { project: project.key, link_type: 'code' })}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('projects.code')} - ${title}`}
          >
            <GitHubIcon fontSize="small" />
            {t('projects.code')}
          </HudAnchor>
        )}
        {project.privateRepo && (
          <span className="private">
            <LockOutlinedIcon fontSize="small" aria-hidden="true" />
            {t('projects.privateRepo')}
          </span>
        )}
      </Actions>
    </>
  );
};

export default ProjectDossier;
