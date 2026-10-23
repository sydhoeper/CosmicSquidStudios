document.querySelectorAll('[data-carousel]').forEach(gallery=>{
 const slides=[...gallery.querySelectorAll('[data-carousel-slide]')];
 const thumbs=gallery.querySelector('[data-carousel-thumbnails]');
 const status=gallery.querySelector('[data-carousel-status]');
 let index=0;
 const buttons=slides.map((slide,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0');b.setAttribute('aria-label',`Show slide ${i+1}`);b.addEventListener('click',()=>show(i));thumbs?.append(b);return b});
 function show(next){slides[index].querySelectorAll('video').forEach(v=>v.pause());slides[index].querySelectorAll('iframe').forEach(f=>{if(next!==index)f.src=f.src});index=(next+slides.length)%slides.length;slides.forEach((s,i)=>s.hidden=i!==index);buttons.forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));if(status)status.textContent=`Slide ${index+1} of ${slides.length}`;}
 gallery.querySelector('[data-carousel-previous]')?.addEventListener('click',()=>show(index-1));
 gallery.querySelector('[data-carousel-next]')?.addEventListener('click',()=>show(index+1));show(0);
});
const audioToggle=document.querySelector('[data-game-audio-toggle]');
if(audioToggle){const frame=document.querySelector('[data-game-frame]');const message=document.querySelector('[data-game-stopped-message]');const url=frame.src;let playing=true;audioToggle.addEventListener('click',()=>{playing=!playing;frame.src=playing?url:'about:blank';frame.hidden=!playing;message.hidden=playing;audioToggle.textContent=playing?'Stop music':'Restart deck';});}
