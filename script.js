
const whitePanel = document.querySelector('.white-panel');
const revealSection = document.querySelector('.reveal-section');

window.addEventListener('scroll', () => {
  const rect = revealSection.getBoundingClientRect();
  const start = window.innerHeight;
  const end = -rect.height / 2;
  const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
  whitePanel.style.transform = `translateY(${100 - progress * 100}%)`;
});


const people = document.querySelectorAll('.person');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });

people.forEach(p => observer.observe(p));


const STEPS = [
  `<p><strong>Hei!</strong></p>
   <p>Vi er en gruppe på fem elever som studerer Informasjonsteknologi på Oslomet, og ønsker å bli en del av teamet deres til Bachelorprosjektet vårt.</p>
   <p>Vi alle har ulike erfaringer som dere kan se nærmere på …</p>`,

  `<p>Vi ønsker å jobbe med noe betydelig og mener at prosjektet deres passer dette ønsket og våre interesser.</p>
   <p>Vi har lært masse gjennom to år med Informasjonsteknologi, samt ulike arbeidserfaringer og akademiske bakgrunner som vi mener kan være til nytte for prosjektet.</p>
   <p>Vi har blant annet erfaring innenfor markedsføring, psykologi, kundeservice og entreprenørskap.</p>
   <p>Etter å ha lest prosjektbeskrivelsen deres er vi sikre på at vi kan dekke deres behov. Når vi har kommet oss i rutiner, jobber vi jevnt og effektivt. Vi er nøye, pliktoppfyllende og ansvarlige.</p>
   <p>Vi har hatt tidligere gruppearbeid med forskjellige mennesker og trives veldig godt med samarbeid. Dette har lært oss å kommunisere med mennesker med ulike bakgrunner. Disse egenskapene vil vi ta med videre til dere.</p>`,

  `<p>Vi ser virkelig frem til muligheten for å bidra positivt til deres team og mener at vår erfaring og personlighet vil gjøre oss til en verdifull ressurs for dere.</p>
   <p>Takk for at dere tok dere tid til å lese søknaden – vi ser frem til muligheten for å bidra positivt til teamet deres.</p>`
];

const hero  = document.getElementById('blue-intro');
const stage = hero.querySelector('.story');

let stepsEls = [];
let heroTop = 0, heroHeight = 0, maxScroll = 1;
let ticking = false;
let active = false;

/* Mount all steps once */
(function mountSteps(){
  stage.setAttribute('data-steps', STEPS.length);
  const frag = document.createDocumentFragment();
  STEPS.forEach((html, i) => {
    const el = document.createElement('div');
    el.className = 'story__step';
    el.dataset.index = i;
    el.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    el.innerHTML = html;
    frag.appendChild(el);
    stepsEls.push(el);
  });
  stage.appendChild(frag);
})();

/* Cache geometry */
function measure(){
  const r = hero.getBoundingClientRect();
  heroTop = window.scrollY + r.top;
  heroHeight = r.height;
  maxScroll = Math.max(heroHeight - window.innerHeight, 1);
}

/* rAF update */
function update(){
  ticking = false;
  if (!active) return;

  const y = window.scrollY;
  const start = heroTop;
  const end   = heroTop + maxScroll;
  const p = Math.min(Math.max((y - start) / (end - start), 0), 1);

  const raw = p * (STEPS.length - 1);
  const i = Math.floor(raw);
  const t = raw - i;

  stepsEls.forEach((el, idx) => {
    if (idx === i || idx === i + 1) {
      el.style.opacity = (idx === i) ? (1 - t) : t;
      el.style.transform = `translateY(${(idx === i ? -12 * t : 18 * (1 - t))}px)`;
      el.setAttribute('aria-hidden', 'false');
    } else {
      el.style.opacity = 0;
      el.style.transform = 'translateY(18px)';
      el.setAttribute('aria-hidden', 'true');
    }
  });
}

function onScroll(){
  if (!ticking){
    ticking = true;
    requestAnimationFrame(update);
  }
}


const io = new IntersectionObserver(([e]) => {
  active = e.isIntersecting;
  if (active) onScroll();
}, { rootMargin: '200px 0px' });

measure();
io.observe(hero);
window.addEventListener('scroll', onScroll, { passive:true });
window.addEventListener('resize', () => { measure(); onScroll(); });
window.addEventListener('orientationchange', () => { measure(); onScroll(); });

