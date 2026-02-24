/* ========================================
   AWS 기초 강의자료 - 공통 JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
  initSidebarHighlight();
  initAnchorSmoothScroll();
});

/* 코드 블록 복사 버튼 */
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.code-block');
      const code = codeBlock ? codeBlock.querySelector('code') : null;
      if (code && navigator.clipboard) {
        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.textContent = '복사됨!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = '복사';
            btn.classList.remove('copied');
          }, 2000);
        });
      }
    });
  });
}

/* 사이드바 스크롤 하이라이트 */
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

/* 앵커 링크 스무스 스크롤 */
function initAnchorSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
