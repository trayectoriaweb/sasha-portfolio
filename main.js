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
      { file: 'instagram_videos/REEL DULCE DE LECHE.mp4' },
      { file: 'instagram_videos/DDfgYkTPG0Y.mp4' },
      { file: 'instagram_videos/DDxjW7YP2OA.mp4' },
      { file: 'instagram_videos/DD72ewYP0lr.mp4' },
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
      { file: 'videocasos publicitarios/PullVid.com - Modo Redirexionar - TaDa.mp4' },
      { file: 'videocasos publicitarios/Incidentes graciosos - CHOQUE - Sasha Goy y Mara Barbiani.mp4' },
      { file: 'videocasos publicitarios/Incidentes graciosos - Incendio - Sasha Goy y Mara Barbiani.mp4' },
      { file: 'videocasos publicitarios/Incidentes graciosos - ROBO - Sasha Goy y Mara Barbiani.mp4' },
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

    proj.videos.forEach((videoData) => {
      const item = document.createElement('div');
      item.className = 'video-item';

      if (videoData.youtubeId) {
        // YouTube video card with HD thumbnail
        item.classList.add('video-item--horizontal');

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
        // HTML5 local/LFS video card
        const file = videoData.file;
        const video = document.createElement('video');
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';

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

        item.addEventListener('click', () => {
          openVideoModal(video.src, file, proj.title);
        });
      }

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

// ─── VIDEO LIGHTBOX MODAL CONTROLLER ──────────────────────
const modal = document.getElementById('video-modal');
const modalPlayer = document.getElementById('modal-video-player');
const modalNativeContainer = document.getElementById('modal-native-container');
const modalYouTubeContainer = document.getElementById('modal-youtube-container');
const modalYouTubePlayer = document.getElementById('modal-youtube-player');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalTitle = document.getElementById('modal-video-title');
const modalProject = document.getElementById('modal-video-project');

function openVideoModal(videoSrc, filePath, projectTitle) {
  if (!modal || !modalPlayer) return;

  // Toggle containers
  if (modalYouTubeContainer) modalYouTubeContainer.style.display = 'none';
  if (modalYouTubePlayer) modalYouTubePlayer.removeAttribute('src');
  if (modalNativeContainer) modalNativeContainer.style.display = 'flex';

  // Derive a clean title from file name
  const rawFileName = filePath.split('/').pop().replace(/\.[^/.]+$/, '');
  const cleanTitle = rawFileName
    .replace(/^PullVid\.com - /, '')
    .replace(/^COFITNESS_/, '')
    .replace(/^Incidentes graciosos - /, '')
    .replace(/^REEL /, '')
    .replace(/ - Sasha Goy.*$/, '');

  modalTitle.textContent = cleanTitle || rawFileName;
  modalProject.textContent = projectTitle;

  modalPlayer.src = videoSrc;
  modalPlayer.muted = false; // Enabled sound in player modal
  modalPlayer.currentTime = 0;

  modal.showModal();
  modalPlayer.play().catch(() => {});
}

function openYouTubeModal(youtubeId, videoTitle, projectTitle) {
  if (!modal || !modalYouTubePlayer) return;

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
