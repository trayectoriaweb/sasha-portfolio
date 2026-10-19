// ─── DATA DE PROYECTOS ──────────────────────────────────────
const REPO_RAW = 'https://media.githubusercontent.com/media/trayectoriaweb/sasha-portfolio/main';

const projects = [
  {
    id: 'cofitness',
    title: 'COFITNESS',
    tag: 'Reels & Brand Motion · 2024',
    videos: [
      { file: 'cofitness_video/COFITNESS_REEL 1.mp4', orientation: 'vertical', title: 'Cofitness — Reel 01' },
      { file: 'cofitness_video/COFITNESS_REEL 2.mp4', orientation: 'vertical', title: 'Cofitness — Reel 02' },
      { file: 'cofitness_video/COFITNESS_REEL 4.mp4', orientation: 'vertical', title: 'Cofitness — Reel 04' },
      { file: 'cofitness_video/COFITNESS_REEL 5.mp4', orientation: 'vertical', title: 'Cofitness — Reel 05' },
      { file: 'cofitness_video/COFITNESS_REEL 6.mp4', orientation: 'vertical', title: 'Cofitness — Reel 06' },
      { file: 'cofitness_video/COFITNESS_REEL 7.mp4', orientation: 'vertical', title: 'Cofitness — Reel 07' },
      { file: 'cofitness_video/COFITNESS_REEL 8.mp4', orientation: 'vertical', title: 'Cofitness — Reel 08' },
      { file: 'cofitness_video/COFITNESS_REEL 9.mp4', orientation: 'vertical', title: 'Cofitness — Reel 09' },
    ]
  },
  {
    id: 'social',
    title: 'SOCIAL & BRAND CONTENT',
    tag: 'Reels / Edición & Montaje',
    videos: [
      { file: 'instagram_videos/REEL DULCE DE LECHE.mp4', orientation: 'vertical', title: 'Dulce de Leche — Reel' },
      { file: 'instagram_videos/DDfgYkTPG0Y.mp4', orientation: 'vertical', title: 'Social Content 01' },
      { file: 'instagram_videos/DDxjW7YP2OA.mp4', orientation: 'vertical', title: 'Social Content 02' },
      { file: 'instagram_videos/DD72ewYP0lr.mp4', orientation: 'vertical', title: 'Social Content 03' },
    ]
  },
  {
    id: 'patagonia',
    title: 'PATAGONIA MÚSICA',
    tag: 'Videoclips & Lyric Videos',
    videos: [
      {
        youtubeId: 'SvvCewSqBlk',
        title: 'DULCE DE LECHE — Lyric Video',
        orientation: 'horizontal'
      },
      {
        youtubeId: 'M2xwEUojB7M',
        title: 'GIRA NACIONAL — Videoclip',
        orientation: 'horizontal'
      }
    ]
  },
  {
    id: 'videocasos',
    title: 'VIDEOCASOS PUBLICITARIOS',
    tag: 'Creatividad, Guion & Edición Publicitaria',
    videos: [
      { file: 'videocasos publicitarios/PullVid.com - Modo Redirexionar - TaDa.mp4', orientation: 'horizontal', title: 'Modo Redirexionar — TaDa' },
      { file: 'videocasos publicitarios/Incidentes graciosos - CHOQUE - Sasha Goy y Mara Barbiani.mp4', orientation: 'horizontal', title: 'Incidentes Graciosos — Choque' },
      { file: 'videocasos publicitarios/Incidentes graciosos - Incendio - Sasha Goy y Mara Barbiani.mp4', orientation: 'horizontal', title: 'Incidentes Graciosos — Incendio' },
      { file: 'videocasos publicitarios/Incidentes graciosos - ROBO - Sasha Goy y Mara Barbiani.mp4', orientation: 'horizontal', title: 'Incidentes Graciosos — Robo' },
    ]
  },
  {
    id: 'casamiento',
    title: 'AI WEDDING FILM',
    tag: 'Generative AI & Conceptual Video',
    videos: [
      { file: 'IA video para casamiento/video casamiento.mp4', orientation: 'horizontal', title: 'AI Wedding Conceptual Film' },
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

    proj.videos.forEach((videoData) => {
      const item = document.createElement('div');
      item.className = 'video-item';
      const orientation = videoData.orientation || 'vertical';
      item.classList.add(`video-item--${orientation}`);

      if (videoData.youtubeId) {
        // YouTube video card with HD thumbnail
        const thumb = document.createElement('img');
        thumb.className = 'video-thumb';
        thumb.src = `https://img.youtube.com/vi/${videoData.youtubeId}/maxresdefault.jpg`;
        thumb.alt = videoData.title;
        thumb.loading = 'lazy';
        thumb.onerror = () => {
          thumb.src = `https://img.youtube.com/vi/${videoData.youtubeId}/hqdefault.jpg`;
        };

        const overlay = document.createElement('div');
        overlay.className = 'video-item__overlay';
        overlay.innerHTML = '<div class="play-icon"></div>';

        item.appendChild(thumb);
        item.appendChild(overlay);

        item.addEventListener('click', () => {
          openYouTubeModal(videoData.youtubeId, videoData.title, proj.title);
        });
      } else {
        // HTML5 local/hosted video card
        const file = videoData.file;
        const video = document.createElement('video');
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('webkit-playsinline', 'true');
        video.preload = 'metadata';

        const encodedPath = file.split('/').map(part => encodeURIComponent(part)).join('/');
        const relativeUrl = encodedPath;
        const fallbackUrl = `${REPO_RAW}/${encodedPath}`;

        video.src = relativeUrl;

        // Fallback to raw media storage if relative fetch encounters issues
        video.addEventListener('error', () => {
          if (video.src !== fallbackUrl && !isLocal) {
            video.src = fallbackUrl;
            video.load();
          }
        }, { once: true });

        // Update orientation dynamically if metadata provides different aspect ratio
        video.addEventListener('loadedmetadata', () => {
          if (video.videoHeight && video.videoWidth) {
            const isVert = video.videoHeight > video.videoWidth;
            item.classList.remove('video-item--vertical', 'video-item--horizontal');
            item.classList.add(isVert ? 'video-item--vertical' : 'video-item--horizontal');
          }
        });

        const overlay = document.createElement('div');
        overlay.className = 'video-item__overlay';
        overlay.innerHTML = '<div class="play-icon"></div>';

        item.appendChild(video);
        item.appendChild(overlay);

        item.addEventListener('click', () => {
          openVideoModal(video.currentSrc || relativeUrl, file, proj.title, orientation, videoData.title);
        });
      }

      grid.appendChild(item);
    });

    container.appendChild(sec);
  });
}

// ─── FILTROS DE PROYECTOS ──────────────────────────────────
function setFilter(filter) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(b => {
    b.classList.toggle('active', b.dataset.filter === filter);
  });

  const sections = document.querySelectorAll('.project-section');
  sections.forEach(sec => {
    if (filter === 'all' || sec.dataset.category === filter) {
      sec.classList.remove('hidden');
    } else {
      sec.classList.add('hidden');
    }
  });
}

function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter);
    });
  });

  // Connect hero showcase cards to filters
  const showcaseCards = document.querySelectorAll('.showcase-card');
  showcaseCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const target = card.dataset.filterTarget;
      if (target) {
        setFilter(target);
      }
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
  }, { threshold: 0.15, rootMargin: '200px' });

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

// ─── VIDEO LIGHTBOX MODAL CONTROLLER ──────────────────────
const modal = document.getElementById('video-modal');
const modalPlayer = document.getElementById('modal-video-player');
const modalNativeContainer = document.getElementById('modal-native-container');
const modalYouTubeContainer = document.getElementById('modal-youtube-container');
const modalYouTubePlayer = document.getElementById('modal-youtube-player');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalTitle = document.getElementById('modal-video-title');
const modalProject = document.getElementById('modal-video-project');

function openVideoModal(videoSrc, filePath, projectTitle, orientation = 'vertical', customTitle = '') {
  if (!modal || !modalPlayer) return;

  // Set modal format classes (vertical vs horizontal)
  modal.classList.remove('video-modal--vertical', 'video-modal--horizontal');
  modal.classList.add(orientation === 'vertical' ? 'video-modal--vertical' : 'video-modal--horizontal');

  // Toggle containers
  if (modalYouTubeContainer) modalYouTubeContainer.style.display = 'none';
  if (modalYouTubePlayer) modalYouTubePlayer.removeAttribute('src');
  if (modalNativeContainer) modalNativeContainer.style.display = 'flex';

  // Title
  if (customTitle) {
    modalTitle.textContent = customTitle;
  } else {
    const rawFileName = filePath.split('/').pop().replace(/\.[^/.]+$/, '');
    const cleanTitle = rawFileName
      .replace(/^PullVid\.com - /, '')
      .replace(/^COFITNESS_/, '')
      .replace(/^Incidentes graciosos - /, '')
      .replace(/^REEL /, '')
      .replace(/ - Sasha Goy.*$/, '');
    modalTitle.textContent = cleanTitle || rawFileName;
  }
  modalProject.textContent = projectTitle;

  modalPlayer.src = videoSrc;
  modalPlayer.muted = false; // Enabled sound in player modal
  modalPlayer.currentTime = 0;

  modal.showModal();
  modalPlayer.play().catch(() => {});
}

function openYouTubeModal(youtubeId, videoTitle, projectTitle) {
  if (!modal || !modalYouTubePlayer) return;

  // Set horizontal format
  modal.classList.remove('video-modal--vertical', 'video-modal--horizontal');
  modal.classList.add('video-modal--horizontal');

  // Pause & hide native video
  if (modalPlayer) {
    modalPlayer.pause();
    modalPlayer.removeAttribute('src');
  }
  if (modalNativeContainer) modalNativeContainer.style.display = 'none';

  // Show & setup YouTube iframe
  if (modalYouTubeContainer) modalYouTubeContainer.style.display = 'flex';
  modalYouTubePlayer.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  modalTitle.textContent = videoTitle;
  modalProject.textContent = projectTitle;

  modal.showModal();
}

function closeVideoModal() {
  if (!modal) return;

  if (modalPlayer) {
    modalPlayer.pause();
    modalPlayer.removeAttribute('src'); // Stop buffering
  }
  if (modalYouTubePlayer) {
    modalYouTubePlayer.removeAttribute('src'); // Stop YouTube playback
  }

  modal.close();
}

function initModalEvents() {
  if (!modal) return;

  modalCloseBtn?.addEventListener('click', closeVideoModal);

  // Close when clicking outside of modal content (backdrop click / light dismiss)
  modal.addEventListener('click', (event) => {
    const inner = modal.querySelector('.video-modal__inner');
    if (!inner) return;
    const rect = inner.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      closeVideoModal();
    }
  });

  // Native cancel (Escape key)
  modal.addEventListener('cancel', () => {
    closeVideoModal();
  });
}

// ─── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  initFilters();
  initVideoObserver();
  initModalEvents();
});
