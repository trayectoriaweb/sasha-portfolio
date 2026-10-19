// ─── DATA DE PROYECTOS ──────────────────────────────────────
const REPO_RAW = 'https://raw.githubusercontent.com/trayectoriaweb/sasha-portfolio/main';

const projects = [
  {
    id: 'cofitness',
    title: 'COFITNESS',
    tag: 'Reels & Brand Motion · 2024',
    videos: [
      { file: 'cofitness_video/COFITNESS_REEL 1.mp4' },
      { file: 'cofitness_video/COFITNESS_REEL 2.mp4' },
      { file: 'cofitness_video/COFITNESS_REEL 4.mp4' },
      { file: 'cofitness_video/COFITNESS_REEL 5.mp4' },
      { file: 'cofitness_video/COFITNESS_REEL 6.mp4' },
      { file: 'cofitness_video/COFITNESS_REEL 7.mp4' },
      { file: 'cofitness_video/COFITNESS_REEL 8.mp4' },
      { file: 'cofitness_video/COFITNESS_REEL 9.mp4' },
    ]
  },
  {
    id: 'social',
    title: 'SOCIAL & BRAND CONTENT',
    tag: 'Reels / Edición & Montaje',
    videos: [
      { file: 'instagram_videos/DDfgYkTPG0Y.mp4' },
      { file: 'instagram_videos/DDxjW7YP2OA.mp4' },
      { file: 'instagram_videos/DD72ewYP0lr.mp4' },
    ]
  },
  {
    id: 'incidentes',
    title: 'INCIDENTES GRACIOSOS',
    tag: 'Creatividad & Narrative Editing',
    videos: [
      { file: 'Incidentes graciosos/Incidentes graciosos - CHOQUE - Sasha Goy y Mara Barbiani.mp4' },
      { file: 'Incidentes graciosos/Incidentes graciosos - Incendio - Sasha Goy y Mara Barbiani.mp4' },
      { file: 'Incidentes graciosos/Incidentes graciosos - ROBO - Sasha Goy y Mara Barbiani.mp4' },
    ]
  },
  {
    id: 'casamiento',
    title: 'AI WEDDING FILM',
    tag: 'Generative AI & Conceptual Video',
    videos: [
      { file: 'IA video para casamiento/video casamiento.mp4' },
    ]
  }
];

// ─── RENDER DE PROYECTOS ───────────────────────────────────
function renderProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;
  container.innerHTML = '';

  const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:';

  projects.forEach((proj) => {
    const sec = document.createElement('div');
    sec.className = 'project-section';
    sec.dataset.category = proj.id;

    sec.innerHTML = `
      <div class="project__header">
        <h3 class="project__label">${proj.title}</h3>
        <span class="project__tag">${proj.tag}</span>
      </div>
      <div class="video-grid"></div>
    `;

    const grid = sec.querySelector('.video-grid');

    proj.videos.forEach(({ file }) => {
      const item = document.createElement('div');
      item.className = 'video-item';

      const video = document.createElement('video');
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';

      // Encode path parts correctly for GitHub raw hosting / local
      const encodedPath = file.split('/').map(part => encodeURIComponent(part)).join('/');
      video.src = isLocal ? file : `${REPO_RAW}/${encodedPath}`;

      video.addEventListener('loadedmetadata', () => {
        const isVertical = video.videoHeight > video.videoWidth;
        item.classList.add(isVertical ? 'video-item--vertical' : 'video-item--horizontal');
        video.classList.add('loaded');
      }, { once: true });

      const overlay = document.createElement('div');
      overlay.className = 'video-item__overlay';
      overlay.innerHTML = '<div class="play-icon"></div>';

      item.appendChild(video);
      item.appendChild(overlay);

      // Click to toggle play / unmute or fullscreen
      item.addEventListener('click', () => {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });

      grid.appendChild(item);
    });

    container.appendChild(sec);
  });
}

// ─── FILTROS DE PROYECTOS ──────────────────────────────────
function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const sections = document.querySelectorAll('.project-section');

      sections.forEach(sec => {
        if (filter === 'all' || sec.dataset.category === filter) {
          sec.classList.remove('hidden');
        } else {
          sec.classList.add('hidden');
        }
      });
    });
  });
}

// ─── LAZY LOAD + AUTOPLAY EN VIEWPORT ──────────────────────
function initVideoObserver() {
  const items = document.querySelectorAll('.video-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if (!video) return;

      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2, rootMargin: '250px' });

  items.forEach(item => {
    observer.observe(item);

    // Hover preview on desktop
    item.addEventListener('mouseenter', () => {
      const video = item.querySelector('video');
      if (video) video.play().catch(() => {});
    });

    item.addEventListener('mouseleave', () => {
      const video = item.querySelector('video');
      if (video && !isInViewport(item)) {
        video.pause();
      }
    });
  });
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

// ─── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  initFilters();
  initVideoObserver();
});
