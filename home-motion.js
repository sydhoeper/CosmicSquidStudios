(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const targets = [
    ...document.querySelectorAll('.process-intro, .process-steps li, .project, .studio-body, .contact, .section-label')
  ];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  targets.forEach(element => {
    element.dataset.reveal = element.matches('.project') ? 'project' : element.matches('.section-label') ? 'heading' : 'block';
    observer.observe(element);
  });
  document.querySelectorAll('.process-steps li').forEach((element, i) => {
    element.style.setProperty('--reveal-delay', `${i * 100}ms`);
  });
  document.body.classList.add('motion-ready');
  // Focused links remain visible even when reached without scrolling.
  document.addEventListener('focusin', event => {
    const target = event.target.closest('[data-reveal]');
    if (target) target.classList.add('is-visible');
  });
  const images = [...document.querySelectorAll('.project .visual>img')];
  let scheduled = false;
  function update() {
    scheduled = false;
    if (preference.matches) return;
    images.forEach(image => {
      const rect = image.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const offset = Math.max(-8, Math.min(8, (innerHeight / 2 - rect.top - rect.height / 2) * 0.025));
      image.style.setProperty('--image-drift', `${offset}px`);
    });
  }
  addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  preference.addEventListener('change', () => {
    if (preference.matches) {
      observer.disconnect();
      targets.forEach(element => element.classList.add('is-visible'));
    }
  });
  update();
})();
