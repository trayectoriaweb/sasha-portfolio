// ─── VIDEO CONFIG ───────────────────────────────────────────
// Raw GitHub URLs para los videos (se actualizan después de push)
const REPO_RAW = 'https://raw.githubusercontent.com/trayectoriaweb/sasha-portfolio/main';

const videos = [
  { file: 'cofitness_video/COFITNESS_REEL 1.mp4', orientation: 'horizontal' },
  { file: 'cofitness_video/COFITNESS_REEL 2.mp4', orientation: 'vertical' },
  { file: 'cofitness_video/COFITNESS_REEL 4.mp4', orientation: 'vertical' },
  { file: 'cofitness_video/COFITNESS_REEL 5.mp4', orientation: 'horizontal' },
  { file: 'cofitness_video/COFITNESS_REEL 6.mp4', orientation: 'vertical' },
  { file: 'cofitness_video/COFITNESS_REEL 7.mp4', orientation: 'horizontal' },
  { file: 'cofitness_video/COFITNESS_REEL 8.mp4', orientation: 'vertical' },
  { file: 'cofitness_video/COFITNESS_REEL 9.mp4', orientation: 'vertical' },
];

// ─── BUILD GRID ────────────────────────────────────────────
function buildGrid() {
  const grid = document.getElementById('cofitness-grid');
  if (!grid) return;

  videos.forEach(({ file, orientation }) => {
    const item = document.createElement('div');
    item.className = `video-item video-item--${orientation}`;

    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';

    // Use relative path when served locally, raw GitHub when deployed
    const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:';
    video.src = isLocal ? file : `${REPO_RAW}/${encodeURIComponent(file)}`;

    const overlay = document.createElement('div');
    overlay.className = 'video-item__overlay';
    overlay.innerHTML = '<div class="play-icon"></div>';

    item.appendChild(video);
    item.appendChild(overlay);
    grid.appendChild(item);
  });
}

// ─── LAZY LOAD + HOVER PLAY ────────────────────────────────
function initVideos() {
  const items = document.querySelectorAll('.video-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if (!video) return;

      if (entry.isIntersecting) {
        // Load video when near viewport
        if (video.preload === 'none') {
          video.preload = 'metadata';
          video.load();
          video.addEventListener('loadeddata', () => {
            video.classList.add('loaded');
          }, { once: true });
        }
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2, rootMargin: '200px' });

  items.forEach(item => {
    observer.observe(item);

    // Pause/play on hover (for desktop)
    item.addEventListener('mouseenter', () => {
      const video = item.querySelector('video');
      if (video) video.play().catch(() => {});
    });

    item.addEventListener('mouseleave', () => {
      const video = item.querySelector('video');
      if (video && !isInViewport(item)) video.pause();
    });
  });
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

// ─── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildGrid();
  initVideos();
});
