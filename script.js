
const hero = document.getElementById('blue-intro');      
const overlay = document.querySelector('.white-overlay'); 
const stage = hero ? hero.querySelector('.story') : null; 


const STEPS = [
  `<p><strong>Hei!</strong></p>
   <p>Vi er en gruppe på fem elever som studerer Informasjonsteknologi på Oslomet.</p>`,
  `<p>Vi legger vekt på å utvikle løsninger som kombinerer godt design, høy ytelse og god brukeropplevelse.</p>`,
  `<p>Scroll videre for å møte oss ↓</p>`
];

if (hero && overlay) {
  
  const stepsEls = [];
  if (stage && STEPS.length) {
    stage.setAttribute('data-steps', STEPS.length);
    const frag = document.createDocumentFragment();
    STEPS.forEach((html, i) => {
      const el = document.createElement('div');
      el.className = 'story__step';
      el.dataset.index = i;
      el.style.opacity = i === 0 ? 1 : 0;
      el.innerHTML = html;
      frag.appendChild(el);
      stepsEls.push(el);
    });
    stage.appendChild(frag);
  }

  
  let heroTop = 0, heroHeight = 0, maxScroll = 1;
  function measure() {
    const r = hero.getBoundingClientRect();
    heroTop = window.scrollY + r.top;
    heroHeight = r.height;
    maxScroll = Math.max(heroHeight - window.innerHeight, 1);
  }

  
  let ticking = false, active = false;
  function update() {
    ticking = false;
    if (!active) return;

    const y = window.scrollY;
    const start = heroTop;
    const end = heroTop + maxScroll;

    
    const p = Math.min(Math.max((y - start) / (end - start), 0), 1);

    
    overlay.style.transform = `translateY(${100 - p * 100}%)`;

    
    if (stepsEls.length) {
      const raw = p * (STEPS.length - 1);
      const i = Math.floor(raw);
      const t = raw - i;
      stepsEls.forEach((el, idx) => {
        if (idx === i || idx === i + 1) {
          el.style.opacity = (idx === i) ? (1 - t) : t;
          el.style.transform = `translateY(${(idx === i ? -12 * t : 18 * (1 - t))}px)`;
        } else {
          el.style.opacity = 0;
          el.style.transform = 'translateY(18px)';
        }
      });
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  
  const io = new IntersectionObserver(([e]) => {
    active = e.isIntersecting;
    if (active) onScroll();
  }, { rootMargin: '200px 0px' });

  measure();
  io.observe(hero);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); onScroll(); });
  window.addEventListener('orientationchange', () => { measure(); onScroll(); });

  
  const people = document.querySelectorAll('.person');
  if (people.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.2 });
    people.forEach(p => observer.observe(p));
  }
}
