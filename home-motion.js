(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Decorative stars have no focus targets and are hidden from assistive technology.
  const sky = document.createElement('div');
  sky.className = 'star-field'; sky.setAttribute('aria-hidden', 'true');
  const starLayers = [0.025, 0.05, 0.085].map((speed, layerIndex) => {
    const layer = document.createElement('div'); layer.className = 'star-layer';
    for (let i = 0; i < 14; i++) {
      const star = document.createElement('span');
      const sparkle = (i + layerIndex) % 4 === 0;
      star.className = sparkle ? 'sky-star sparkle' : 'sky-star';
      // Concentrate bright marks near the edges, away from the reading column.
      const edge = i % 3 !== 0;
      const x = edge ? (i % 2 ? 94 + ((i * 7 + layerIndex) % 5) : 1 + ((i * 3 + layerIndex) % 5)) : 15 + ((i * 31 + layerIndex * 17) % 70);
      star.style.left = `${x}%`;
      star.style.top = `${5 + ((i * 19 + layerIndex * 29) % 110)}%`;
      const size = sparkle ? 10 + layerIndex * 4 : 2 + layerIndex;
      star.style.width = star.style.height = `${size}px`;
      star.style.opacity = edge ? String(0.45 + layerIndex * 0.12) : '0.16';
      layer.append(star);
    }
    sky.append(layer); return {element: layer, speed};
  });
  document.body.prepend(sky);

  const toggle = document.createElement('button');
  toggle.type = 'button'; toggle.className = 'motion-toggle';
  let disabled = preference.matches;
  try { disabled = disabled || localStorage.getItem('reduce-motion') === 'true'; } catch {}
  function sync(){
    document.body.classList.toggle('motion-off', disabled);
    toggle.textContent = disabled ? 'Animations: off' : 'Animations: on';
    toggle.setAttribute('aria-pressed', String(!disabled));
    if (disabled) starLayers.forEach(layer => layer.element.style.transform = 'none');
  }
  toggle.addEventListener('click', () => {
    disabled = !disabled; sync();
    try { localStorage.setItem('reduce-motion', String(disabled)); } catch {}
  });
  document.querySelector('footer')?.append(toggle); sync();
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
    if (preference.matches || disabled) return;
    const travel = Math.min(900, scrollY);
    starLayers.forEach(layer => {
      layer.element.style.transform = `translate3d(0,${-travel * layer.speed}px,0)`;
    });
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
      disabled = true; sync();
      observer.disconnect();
      targets.forEach(element => element.classList.add('is-visible'));
    }
  });
  update();
})();
