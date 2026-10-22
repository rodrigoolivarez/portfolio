# Rodrigo Olivarez · Portfolio

Portfolio personal de **Rodrigo Olivarez**, desarrollador web Full Stack (Buenos Aires, Argentina).
Bilingüe (ES / EN), con modo claro/oscuro y un fondo animado de estrellas hecho a mano con Canvas API.

🔗 **Demo:** https://rodrigoolivarez.netlify.app/

## Stack

- **React 19 + TypeScript** con **Vite**
- **MUI** y **styled-components** para UI y estilos (tokens en variables CSS)
- **framer-motion** para animaciones de entrada
- **i18next** para internacionalización (español / inglés)
- **react-hook-form + EmailJS + reCAPTCHA** en el formulario de contacto
- Deploy en **Vercel**

## Lo destacable

- **Salto hiperespacial** (`src/components/Galaxy/`): todo el sitio vive dentro de una galaxia espiral en WebGL
  (three.js + shaders propios, hasta 45k partículas). Cada sección es una "estación": al navegar, la cámara
  hace un salto con estelas, cambio de FOV y destello. Hay intro de arranque, HUD de coordenadas y, en modo claro,
  una "carta estelar" en tinta sobre pergamino.
  En el centro, **Gargantúa**: un agujero negro con trazado de rayos relativista (la luz se curva con la gravedad
  y el disco de acreción se envuelve alrededor de la sombra, como en Interstellar).
  Se carga en diferido, dibuja a 30 fps en reposo (60 durante los saltos), baja la calidad sola si el equipo no llega,
  respeta `prefers-reduced-motion` (sin saltos ni intro; el gas sigue fluyendo más lento)
  y usa el fondo 2D (`ShootingStarCanvas`) cuando no hay WebGL o está activo el ahorro de datos.
- **Concepto "Noche dorada"**: un cielo nocturno donde cada constelación es parte de mi camino.
  En el hero, las constelaciones (`src/components/Home/Constellations.tsx`) se trazan de a una estrella,
  reaccionan al cursor y llevan a cada proyecto. Son links reales, así que funcionan con teclado y lector de pantalla.
- **Bitácora de vuelo**: la experiencia y la formación como una línea de tiempo de misiones.
- **Fondo de estrellas propio** (`src/components/Background/ShootingStarCanvas.tsx`):
  un solo canvas sin `shadowBlur`, sprite pre-renderizado para el brillo, FPS limitado en móviles,
  calidad adaptativa si el dispositivo no llega, pausa con la pestaña oculta y soporte de
  `prefers-reduced-motion`.
- **Code splitting por ruta**: las páginas secundarias (y reCAPTCHA / EmailJS) se cargan bajo demanda.
- **Accesibilidad**: navegación por teclado, `skip link`, foco visible, `aria-*` en menú y modal.
- **Tema sin parpadeo**: el modo claro/oscuro se aplica antes del primer pintado.

## Correr en local

```bash
npm install
cp .env.example .env   # completar las claves de EmailJS y reCAPTCHA
npm run dev
```

| Script            | Qué hace                         |
| ----------------- | -------------------------------- |
| `npm run dev`     | Servidor de desarrollo           |
| `npm run build`   | Build de producción en `dist/`   |
| `npm run preview` | Sirve el build localmente        |

## Métricas (Google Analytics 4)

Se activa sólo en producción y si está definida `VITE_GA_MEASUREMENT_ID` (respeta "Do Not Track").
Además de las vistas por sección, registra estos eventos:

| Evento            | Cuándo                                             |
| ----------------- | -------------------------------------------------- |
| `project_open`    | Se abre un proyecto (`project`, `category`, `view`) |
| `project_link`    | Clic en "Lanzar demo" o "Ver código" (`link_type`)  |
| `generate_lead`   | Se envía el formulario de contacto                 |
| `contact_channel` | Copia del email o clic en LinkedIn / GitHub        |
| `gate_enter` · `gate_skip` · `gate_reopen` | Uso de la puerta de entrada |
| `language_change` · `motion_toggle` | Preferencias del visitante |

## Capturas de proyectos

Están en `src/assets/projects/` en WebP (1000px de ancho). Para actualizar una, reemplazá el archivo
con el mismo nombre; el visor muestra la parte superior en proporción 16:9.

## Estructura

```
src/
├── components/   # NavBar, Footer, Layout, Modal, fondo animado, carrusel
├── pages/        # Home, Sobre mí, Proyectos, Contacto
├── contexts/     # Tema claro/oscuro
├── i18n/         # Traducciones ES / EN
└── styles/       # Estilos globales
```

## Contacto

- LinkedIn: [rodrigoolivarez](https://www.linkedin.com/in/rodrigoolivarez/)
- GitHub: [rodrigoolivarez](https://github.com/rodrigoolivarez)
- Email: rodrigovolivarez@gmail.com
