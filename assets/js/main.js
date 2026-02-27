import { initAnnotations } from './annotations.js';

document.addEventListener('DOMContentLoaded', async () => {
  initCopyButtons();
  initSidebarHighlight();
  await initAnnotations();
});

function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.closest('.code-block').querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = '복사됨!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '복사';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
}

function initSidebarHighlight() {
  const sections = document.querySelectorAll('.content-section[id]');
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.sidebar-nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px' });

  sections.forEach(section => observer.observe(section));
}
