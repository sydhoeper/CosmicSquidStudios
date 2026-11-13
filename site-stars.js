(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let seed = [...location.pathname.replace(/\/$/, '/index.html')].reduce((n, c) => Math.imul(n ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
  function random(){seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;return seed / 4294967296;}
  document.body.classList.add('has-starfield');
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
      const x = edge ? (i % 2 ? 94 + random() * 4 : 1 + random() * 4) : 15 + random() * 70;
      star.style.left = `${x}%`;
      star.style.top = `${5 + random() * 110}%`;
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
    const effectiveOff = disabled || preference.matches;
    document.body.classList.toggle('motion-off', effectiveOff);
    toggle.textContent = effectiveOff ? 'Animations: off' : 'Animations: on';
    toggle.setAttribute('aria-label', 'Animations');
    toggle.setAttribute('aria-pressed', String(!effectiveOff));
    if (disabled) starLayers.forEach(layer => layer.element.style.transform = 'none');
  }
  toggle.addEventListener('click', () => {
    disabled = preference.matches ? true : !disabled; sync();
    try { localStorage.setItem('reduce-motion', String(disabled)); } catch {}
  });
  (document.querySelector('footer') || document.querySelector('main')).append(toggle); sync();

  let scheduled = false;
  function update(){
    scheduled = false;
    if(disabled || preference.matches) return;
    const travel = Math.min(900, scrollY);
    starLayers.forEach(layer => layer.element.style.transform = `translate3d(0,${-travel * layer.speed}px,0)`);
  }
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}}, {passive:true});
  preference.addEventListener('change',()=>{if(preference.matches){disabled=true;sync();}});
  update();
})();
