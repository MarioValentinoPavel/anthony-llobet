/* A CLUB by Anthony Llobet — "Hair, fluently": palabras que se traducen solas, estilistas por idioma y guía de conversación que habla */
gsap.registerPlugin(ScrollTrigger, Flip);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const t2 = (en, es) => `<span class="en">${en}</span><span class="es">${es ?? en}</span>`;
const isMobile = () => innerWidth < 900;

/* ---------- reservas ---------- */
const BOOK = 'https://s-iq.co/BookingPortal/dist/?salonid=2d280cff-10cd-4363-a06f-c85c5cc7086e&tab=book&showSalons=1';
const BOOK_SOHO = 'https://s-iq.co/BookingPortal/dist/?salonid=1279da20-8231-44f4-ab2a-a63ebc19af49&tab=book';
$$('.book').forEach(a => a.href = BOOK);

/* ---------- idioma de la web ---------- */
let LANG = 'en';
try { LANG = localStorage.getItem('al-lang') || (/^(es|ca)/.test(navigator.language || '') ? 'es' : 'en'); } catch (e) {}
function setLang(l) {
  LANG = l;
  document.documentElement.lang = l;
  $$('.lang button').forEach(b => b.classList.toggle('is-on', b.dataset.l === l));
  try { localStorage.setItem('al-lang', l); } catch (e) {}
  ScrollTrigger.refresh();
}
$$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));
setLang(LANG);

/* ---------- motor de letras con fuente variable ---------- */
function build(el, txt) {
  el.innerHTML = txt.split(' ').map(w => '<span class="w">' + [...w].map(c => `<span class="l">${c}</span>`).join('') + '</span>').join(' ');
  return $$('.l', el);
}
function morph(el, txt, o = {}) {
  const W = o.w ?? 100, G = o.g ?? 800, LO = o.lo ?? 25;
  const old = $$('.l', el);
  const tl = gsap.timeline();
  if (old.length) tl.to(old, { '--w': LO, '--g': 100, opacity: 0, yPercent: -25, duration: o.out ?? .32, ease: 'power2.in', stagger: o.st ?? .02 });
  tl.add(() => {
    const n = build(el, txt);
    gsap.fromTo(n, { '--w': LO, '--g': 100, opacity: 0, yPercent: 30 }, { '--w': W, '--g': G, opacity: 1, yPercent: 0, duration: o.in ?? .7, ease: 'expo.out', stagger: o.st ?? .03 });
  });
  return tl;
}
function setWord(el, txt, w, g) { gsap.set(build(el, txt), { '--w': w, '--g': g }); }

const WORDS = [['hair', 'English', 'EN'], ['pelo', 'Español', 'ES'], ['cabell', 'Català', 'CA'], ['cheveux', 'Français', 'FR'], ['capelli', 'Italiano', 'IT'], ['Haare', 'Deutsch', 'DE'], ['vlasy', 'Čeština', 'CS'], ['cabelo', 'Português', 'PT'], ['haar', 'Nederlands', 'NL'], ['nywele', 'Kiswahili', 'SW']];

/* ---------- hero: la palabra "hair" se traduce en bucle ---------- */
const heroWord = $('#heroWord');
setWord(heroWord, 'HAIR', 130, 900);
let heroOn = true;
function heroLoop(i = 0) {
  gsap.delayedCall(2.3, () => {
    const n = (i + 1) % WORDS.length;
    if (heroOn) {
      morph(heroWord, WORDS[n][0].toUpperCase(), { w: 130, g: 900 });
      $('#heroLang').textContent = WORDS[n][2];
      heroWord.setAttribute('aria-label', WORDS[n][0]);
    }
    heroLoop(heroOn ? n : i);
  });
}
ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onToggle: s => heroOn = s.isActive });

function countUp() {
  $$('[data-count]').forEach(b => {
    const to = +b.dataset.count, from = to > 1000 ? 2026 : 0, st = { v: from };
    gsap.to(st, { v: to, duration: 1.8, ease: 'power3.out', delay: .5, onUpdate: () => b.textContent = Math.round(st.v) });
  });
}
// las líneas del titular también se parten en letras
$$('.hero__a > span, .hero__b > span').forEach(s => { s.classList.add('m'); setWord(s, s.textContent, 25, 850); });

/* ---------- las letras se ensanchan cerca del cursor ---------- */
(function swell() {
  if (matchMedia('(hover: none)').matches) return;
  const hero = $('.hero'), val = new WeakMap();
  let mx = -9999, my = -9999, on = false;
  hero.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; on = true; });
  hero.addEventListener('mouseleave', () => { on = false; });
  gsap.ticker.add(() => {
    if (!heroOn) return;
    $$('.hero__title .l').forEach(l => {
      let target = 0;
      if (on) {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(mx - (r.left + r.width / 2), (my - (r.top + r.height / 2)) * 1.4);
        target = Math.max(0, 1 - d / 260);
      }
      const cur = val.get(l) ?? 0, nv = cur + (target - cur) * .14;
      if (Math.abs(nv - cur) < .0005 && !target) return;
      val.set(l, nv);
      l.style.setProperty('--hw', (nv * 70).toFixed(1));
      l.style.setProperty('--hg', (nv * 120).toFixed(0));
    });
  });
})();

function heroIn() {
  gsap.from('.hero__lemma, .hero__a, .hero__word, .hero__b, .plate, .hero__foot, .stats li', { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .07, delay: .25, clearProps: 'transform,opacity' });
  countUp();
  heroLoop();
}

/* ---------- intro: diez idiomas y "A CLUB" ---------- */
(function intro() {
  const box = $('#intro'), w = $('#introWord');
  document.documentElement.style.overflow = 'hidden';
  setWord(w, WORDS[0][0], 110, 800);
  gsap.from($$('.l', w), { opacity: 0, yPercent: 40, stagger: .04, duration: .6, ease: 'expo.out' });
  let i = 0, done = false;
  const step = () => {
    if (done) return;
    i++;
    if (i < WORDS.length) {
      $('#introN').textContent = String(i + 1).padStart(2, '0');
      $('#introL').textContent = WORDS[i][1];
      morph(w, WORDS[i][0], { w: 110, g: 800, out: .11, in: .26, st: .01 });
      gsap.delayedCall(.27, step);
    } else {
      $('#introL').textContent = 'Barcelona';
      morph(w, 'A CLUB', { w: 110, g: 950, out: .14, in: .5, st: .02 });
      gsap.delayedCall(.75, finish);
    }
  };
  function finish() {
    if (done) return;
    done = true;
    gsap.to(box, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut', onComplete: () => { box.remove(); document.documentElement.style.overflow = ''; ScrollTrigger.refresh(); } });
    heroIn();
  }
  // si ya la vio en esta visita, entra directo
  let seen = false;
  try { seen = !!sessionStorage.getItem('al-intro'); sessionStorage.setItem('al-intro', '1'); } catch (e) {}
  if (seen) { gsap.set(box, { autoAlpha: 0 }); finish(); } else gsap.delayedCall(.5, step);
  $('#introSkip').addEventListener('click', finish);
})();

/* ---------- nav ---------- */
ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => $('#nav').classList.toggle('is-scrolled', s.scroll() > 40) });

/* ---------- datos: salones y equipo ---------- */
const DAYS = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], es: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'] };
const SALONS = [
  { k: 'gracia', name: 'Gràcia', ph: '/ˈɡɾa.si.ə/', xy: [124.8, 68], addr: 'Carrer de Ros de Olano, 19 · 08012', tel: ['93 218 04 49', '678 81 40 61'], h: [null, [11, 21], [11, 21], [11, 21], [11, 21], [11, 21], [10, 19]], g: [4.6, 505], img: 'assets/web/Gracia-img.jpg',
    txt: ['Where it all began in 1998. The salon with the biggest team, home base of our founder Anthony, right across the street from The Academy. Near Plaça del Sol, just below Park Güell.', 'Donde empezó todo en 1998. El salón con más equipo, base de nuestro fundador Anthony, justo enfrente de The Academy. Cerca de Plaça del Sol, a los pies del Park Güell.'],
    metro: ['Fontana (L3) 5 min · Diagonal (L3, L5) and Joanic (L4) 10 min', 'Fontana (L3) a 5 min · Diagonal (L3, L5) y Joanic (L4) a 10 min'] },
  { k: 'eixample', name: 'Eixample', ph: '/əˈʃam.plə/', xy: [201.6, 139.6], addr: 'Carrer de Roger de Llúria, 93 · 08009', tel: ['93 222 57 22', '687 25 44 44'], h: [null, [11, 20], [11, 20], [11, 20], [11, 20], [10, 20], [10, 20]], g: [4.6, 315], img: 'assets/web/Eixample-img.jpg',
    txt: ['Our most private salon: a cosy residential corner two blocks from Passeig de Gràcia and its flagship stores, five minutes from Casa Batlló and La Pedrera.', 'Nuestro salón más privado: un rincón residencial y acogedor a dos manzanas de Passeig de Gràcia y sus grandes firmas, a cinco minutos de la Casa Batlló y La Pedrera.'],
    metro: ['Passeig de Gràcia (L2, L3, L4) · Girona (L4) · Verdaguer (L4, L5)', 'Passeig de Gràcia (L2, L3, L4) · Girona (L4) · Verdaguer (L4, L5)'] },
  { k: 'born', name: 'Born', ph: '/ˈboɾn/', xy: [317.6, 233], addr: 'Carrer dels Carders, 34 · 08003', tel: ['93 295 48 71', '666 74 94 46'], h: [null, [11, 21], [11, 21], [11, 21], [11, 21], [11, 21], [10, 20]], g: [4.6, 370], img: 'assets/web/Born-img.jpg',
    txt: ['Between Carrer de la Princesa and Santa Caterina market, a stroll from the Picasso Museum and Parc de la Ciutadella. The place where locals and travellers mingle.', 'Entre Carrer de la Princesa y el mercado de Santa Caterina, a un paseo del Museo Picasso y del Parc de la Ciutadella. Donde vecinos y viajeros se mezclan.'],
    metro: ['Jaume I (L4) 5 min · Arc de Triomf (L1) 10 min', 'Jaume I (L4) a 5 min · Arc de Triomf (L1) a 10 min'] },
  { k: 'gotic', name: 'Gòtic', ph: '/ˈɡɔ.tik/', xy: [294.4, 287.8], addr: "Carrer d'Avinyó, 34 · 08002", tel: ['93 301 45 13', '627 60 68 51'], h: [null, [11, 21], [11, 21], [11, 21], [11, 21], [11, 21], [11, 20]], g: [4.5, 413], img: 'assets/web/Gotic-img.jpg',
    txt: ['In the heart of old Barcelona, just below Plaça Sant Jaume and five minutes from La Rambla. One of our biggest teams, and home base of owner & art director Antoine.', 'En el corazón de la Barcelona antigua, justo debajo de Plaça Sant Jaume y a cinco minutos de La Rambla. Uno de nuestros equipos más grandes y base del socio y director artístico Antoine.'],
    metro: ['Jaume I (L4) · Liceu (L3) · Drassanes (L3)', 'Jaume I (L4) · Liceu (L3) · Drassanes (L3)'] },
  { k: 'parallel', name: 'Paral·lel', ph: '/pə.ɾəlˈlɛl/', xy: [204, 333.7], addr: 'Ronda de Sant Pau, 17 · 08015', tel: ['93 115 35 35', '673 35 62 65'], h: [null, [10, 20], [10, 20], [10, 20], [10, 21], [10, 21], [11, 22]], g: [4.8, 339], img: 'assets/web/Parallel-img.jpg',
    txt: ['A young, creative and dynamic team on Ronda de Sant Pau, between Sant Antoni and the Raval. Our best-rated salon, and open until 22:00 on Saturdays.', 'Un equipo joven, creativo y dinámico en la Ronda de Sant Pau, entre Sant Antoni y el Raval. Nuestro salón mejor valorado, y los sábados abre hasta las 22:00.'],
    metro: ['Paral·lel (L2, L3) · Sant Antoni (L2)', 'Paral·lel (L2, L3) · Sant Antoni (L2)'] },
  { k: 'soho', name: 'Soho House', ph: 'Pool House Barcelona', badge: ['Members & guests', 'Socios e invitados'], img: 'assets/web/Anthony-Llobet-Home-5.jpg', book: BOOK_SOHO,
    txt: ['Since January 2026 our team runs the salon inside the spa of the new Soho House – Pool House Barcelona. We have been caring for the House community since 2016.', 'Desde enero de 2026 nuestro equipo lleva el salón del spa del nuevo Soho House – Pool House Barcelona. Cuidamos de la comunidad de la House desde 2016.'] },
  { k: 'academy', name: 'The Academy', ph: '/əˈkædəmi/', xy: [140, 50], badge: ['Courses', 'Cursos'], img: 'assets/web/academy-bg.jpg', tel: ['93 218 04 49'], addr: 'Gràcia · 08012',
    txt: ['Our in-house school in Gràcia, across the street from the salon. Start a career, change careers or keep growing next to Anthony, Jessica and the team.', 'Nuestra escuela propia en Gràcia, enfrente del salón. Empieza una carrera, cambia de profesión o sigue creciendo junto a Anthony, Jessica y el equipo.'] }
];
const SN = Object.fromEntries(SALONS.map(s => [s.k, s.name]));
const TEAM = [
  ['Anthony', 'anthony', 'Founder', 'gracia', 'en es nl'], ['Antoine', 'antoine', 'Owner & Art Director', 'gotic', 'en es fr it'], ['Kevin', 'kevin', 'Owner & General Manager', 'parallel', 'en es fr'],
  ['Miquel', 'miquel', 'Manager', 'gracia', 'en es fr'], ['Jessica', 'jessica', 'Academy Manager', 'gracia', 'en es'], ['Adam', 'adam', 'Hair stylist', 'gracia', 'en es cs'],
  ['Ana', 'ana', 'Hair stylist', 'gracia', 'en es'], ['Mychell', 'mychell', 'Hair stylist', 'gracia', 'en es pt'], ['Ondra', 'ondra', 'Manager', 'eixample', 'en es cs'],
  ['Ebrin', 'ebrin', 'Director', 'eixample', 'en es sw'], ['Stu', 'stu', 'Hair stylist', 'eixample', 'en es'], ['Alfonso', 'alfonso', 'Manager', 'born', 'en es it'],
  ['Antonio', 'antonio', 'Assistant Manager', 'born', 'en es it'], ['Boris', 'boris', 'Hair stylist', 'born', 'en es'], ['Greg', 'greg', 'Hair stylist', 'born', 'en es de'],
  ['Niki', 'nikki', 'HR & Events Manager', 'gotic', 'en es fr'], ['Max', 'max', 'Assistant Manager', 'gotic', 'en es fr'], ['Nico', 'nico', 'Hair stylist', 'gotic', 'en es'],
  ['Maelys', 'maelys', 'Hair stylist', 'parallel', 'en es fr'], ['Marcos', 'marcos', 'Hair stylist', 'parallel', 'en es']
].map(([name, f, role, salon, l]) => ({ name, f, role, salon, langs: l.split(' ') }));
const LN = { en: ['English', 'Hello!'], es: ['Español', '¡Hola!'], fr: ['Français', 'Bonjour !'], it: ['Italiano', 'Ciao!'], de: ['Deutsch', 'Hallo!'], cs: ['Čeština', 'Ahoj!'], pt: ['Português', 'Olá!'], nl: ['Nederlands', 'Hoi!'], sw: ['Kiswahili', 'Jambo!'] };

/* ---------- 01 · buscador de estilistas por idioma ---------- */
(function finder() {
  const team = $('#team');
  team.innerHTML = TEAM.map(p => `<article class="card" data-langs="${p.langs.join(' ')}" data-salon="${p.salon}">
    <div class="card__img"><img src="assets/team/${p.f}.jpg" alt="${p.name}, ${p.role}" loading="lazy"><span class="bubble">${LN[p.langs[0]][1]}</span></div>
    <div class="card__body"><h3 class="card__name">${p.name}</h3><p class="card__role">${p.role}</p>
    <p class="card__meta"><span class="card__salon">${SN[p.salon]}</span>${p.langs.map(l => `<i data-l="${l}">${l}</i>`).join('')}</p>
    <a class="card__book" href="${BOOK}" target="_blank" rel="noopener">${t2('Book with ' + p.name + ' →', 'Reservar con ' + p.name + ' →')}</a></div></article>`).join('');
  const cards = $$('.card', team);
  let fl = null, fs = null;
  const count = l => TEAM.filter(p => p.langs.includes(l)).length;
  $('#langChips').innerHTML = `<button class="chip is-on" type="button" data-v="">${t2('All languages', 'Todos los idiomas')}</button>` +
    Object.keys(LN).map(l => `<button class="chip" type="button" data-v="${l}">${LN[l][0]} <small>${count(l)}</small></button>`).join('');
  $('#salonChips').innerHTML = `<button class="chip is-on" type="button" data-v="">${t2('All salons', 'Todos los salones')}</button>` +
    SALONS.slice(0, 5).map(s => `<button class="chip" type="button" data-v="${s.k}">${s.name}</button>`).join('');

  function result() {
    const hits = TEAM.filter(p => (!fl || p.langs.includes(fl)) && (!fs || p.salon === fs));
    const sal = new Set(hits.map(p => p.salon)).size, n = hits.length;
    let en, es;
    if (!fl && !fs) { en = `<b>20 stylists</b>, 9 languages. Pick yours.`; es = `<b>20 estilistas</b>, 9 idiomas. Elige el tuyo.`; }
    else if (!n) {
      const alt = TEAM.filter(p => p.langs.includes(fl));
      en = `Nobody at ${SN[fs]} speaks ${LN[fl][0]} yet. Try ${alt.map(p => `${p.name} (${SN[p.salon]})`).join(', ')}.`;
      es = `En ${SN[fs]} aún nadie habla ${LN[fl][0]}. Prueba con ${alt.map(p => `${p.name} (${SN[p.salon]})`).join(', ')}.`;
    } else if (fl && !fs) { en = `<b>${n} ${n > 1 ? 'stylists speak' : 'stylist speaks'}</b> ${LN[fl][0]}, in ${sal} ${sal > 1 ? 'salons' : 'salon'}.`; es = `<b>${n} ${n > 1 ? 'estilistas hablan' : 'estilista habla'}</b> ${LN[fl][0]}, en ${sal} ${sal > 1 ? 'salones' : 'salón'}.`; }
    else if (!fl) { en = `<b>${n} stylists</b> at ${SN[fs]}.`; es = `<b>${n} estilistas</b> en ${SN[fs]}.`; }
    else { en = `<b>${n} ${n > 1 ? 'stylists speak' : 'stylist speaks'}</b> ${LN[fl][0]} at ${SN[fs]}.`; es = `<b>${n} ${n > 1 ? 'estilistas hablan' : 'estilista habla'}</b> ${LN[fl][0]} en ${SN[fs]}.`; }
    $('#result').innerHTML = t2(en, es);
  }
  function apply() {
    const state = Flip.getState(cards), h0 = team.offsetHeight;
    cards.forEach(c => {
      const ok = (!fl || c.dataset.langs.split(' ').includes(fl)) && (!fs || c.dataset.salon === fs);
      c.style.display = ok ? '' : 'none';
      $$('.card__meta i', c).forEach(i => i.classList.toggle('is-hit', i.dataset.l === fl));
      if (fl && ok) $('.bubble', c).textContent = LN[fl][1];
    });
    Flip.from(state, { duration: .7, ease: 'power3.inOut', absolute: true, scale: true, stagger: .015,
      onEnter: e => gsap.fromTo(e, { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .5, delay: .15 }),
      onLeave: e => gsap.to(e, { opacity: 0, scale: .85, duration: .35 }),
      onComplete: () => ScrollTrigger.refresh() });
    // la rejilla crece o encoge suave, sin que salte la sección de abajo
    const h1 = team.offsetHeight;
    gsap.fromTo(team, { height: h0 }, { height: h1, duration: .7, ease: 'power3.inOut', clearProps: 'height' });
    result();
  }
  const bind = (box, set) => box.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip', box).forEach(x => x.classList.toggle('is-on', x === b));
    set(b.dataset.v || null); apply();
  });
  bind($('#langChips'), v => fl = v);
  bind($('#salonChips'), v => fs = v);
  result();

  // saludo en sus idiomas al pasar por encima
  cards.forEach((c, i) => {
    const p = TEAM[i], bub = $('.bubble', c);
    let k = 0, timer = null;
    c.addEventListener('mouseenter', () => {
      const ls = fl ? [fl, ...p.langs.filter(l => l !== fl)] : p.langs;
      k = 0; bub.textContent = LN[ls[0]][1];
      timer = setInterval(() => { k = (k + 1) % ls.length; bub.textContent = LN[ls[k]][1]; }, 850);
    });
    c.addEventListener('mouseleave', () => clearInterval(timer));
  });
})();

/* ---------- 02 · guía de conversación que habla ---------- */
(function phrasebook() {
  const PL = [['en', 'English', 'en-GB'], ['es', 'Español', 'es-ES'], ['ca', 'Català', 'ca-ES'], ['fr', 'Français', 'fr-FR'], ['it', 'Italiano', 'it-IT'], ['de', 'Deutsch', 'de-DE'], ['cs', 'Čeština', 'cs-CZ'], ['pt', 'Português', 'pt-PT'], ['nl', 'Nederlands', 'nl-NL']];
  const PH = [
    { en: 'Just a trim, please.', es: 'Solo las puntas, por favor.', ca: 'Només les puntes, si us plau.', fr: 'Juste les pointes, s’il vous plaît.', it: 'Solo le punte, per favore.', de: 'Nur die Spitzen, bitte.', cs: 'Jen zastřihnout konečky, prosím.', pt: 'Só as pontas, por favor.', nl: 'Alleen de puntjes, alstublieft.' },
    { en: 'Not too short!', es: '¡No muy corto!', ca: 'No gaire curt!', fr: 'Pas trop court !', it: 'Non troppo corti!', de: 'Nicht zu kurz!', cs: 'Ne moc nakrátko!', pt: 'Não muito curto!', nl: 'Niet te kort!' },
    { en: 'Same as last time.', es: 'Como la última vez.', ca: 'Com l’última vegada.', fr: 'Comme la dernière fois.', it: 'Come l’ultima volta.', de: 'Wie beim letzten Mal.', cs: 'Stejně jako minule.', pt: 'Igual à última vez.', nl: 'Hetzelfde als de vorige keer.' },
    { en: 'Surprise me.', es: 'Sorpréndeme.', ca: 'Sorprèn-me.', fr: 'Surprenez-moi.', it: 'Sorprendimi.', de: 'Überrasch mich.', cs: 'Překvapte mě.', pt: 'Surpreenda-me.', nl: 'Verras me.' }
  ];
  let pi = 0, li = 0, auto = true;
  const text = $('#phraseText'), tag = $('#phraseTag'), note = $('#phraseNote');
  $('#phraseList').innerHTML = PH.map((p, i) => `<li><button type="button" data-i="${i}"${i ? '' : ' class="is-on"'}>${t2(p.en, p.es)}</button></li>`).join('');
  $('#phraseLangs').innerHTML = PL.map((l, i) => `<button type="button" data-i="${i}"${i ? '' : ' class="is-on"'}>${l[0].toUpperCase()}</button>`).join('');
  const show = (first) => {
    const [code, name] = PL[li];
    tag.textContent = `${code.toUpperCase()} · ${name}`;
    $$('#phraseLangs button').forEach((b, i) => b.classList.toggle('is-on', i === li));
    $$('#phraseList button').forEach((b, i) => b.classList.toggle('is-on', i === pi));
    note.textContent = '';
    if (first) setWord(text, PH[pi][code], 70, 700); else morph(text, PH[pi][code], { w: 70, g: 700, out: .25, in: .55, st: .012 });
  };
  show(true);
  const stop = () => { auto = false; };
  $('#phraseList').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; stop(); pi = +b.dataset.i; show(); });
  $('#phraseLangs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; stop(); li = +b.dataset.i; show(); speak(); });
  // avance automático de idiomas mientras está a la vista
  let inView = false;
  ScrollTrigger.create({ trigger: '.phrase', start: 'top 70%', end: 'bottom 30%', onToggle: s => inView = s.isActive });
  (function tick() { gsap.delayedCall(2.6, () => { if (auto && inView) { li = (li + 1) % PL.length; if (!li) pi = (pi + 1) % PH.length; show(); } tick(); }); })();
  // voz
  const synth = window.speechSynthesis;
  let voices = [];
  const load = () => { voices = synth ? synth.getVoices() : []; };
  if (synth) { load(); synth.onvoiceschanged = load; }
  function speak() {
    const [code, name, bcp] = PL[li];
    if (!synth) { note.innerHTML = t2('Your browser can’t speak, but our stylists can.', 'Tu navegador no habla, pero nuestros estilistas sí.'); return; }
    const v = voices.find(v => v.lang.replace('_', '-').toLowerCase() === bcp.toLowerCase()) || voices.find(v => v.lang.toLowerCase().startsWith(code));
    if (!v) { note.innerHTML = t2(`No ${name} voice on this device, but we speak it in the salon.`, `Este dispositivo no tiene voz en ${name}, pero en el salón lo hablamos.`); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(PH[pi][code]);
    u.voice = v; u.lang = v.lang; u.rate = .92;
    const btn = $('#phrasePlay');
    u.onstart = () => btn.classList.add('is-talking');
    u.onend = u.onerror = () => btn.classList.remove('is-talking');
    synth.speak(u);
  }
  $('#phrasePlay').addEventListener('click', () => { stop(); speak(); });
})();

/* ---------- 03 · salones: mapa, horarios en directo ---------- */
function madridNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t).value;
  return { d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), h: +get('hour'), m: +get('minute'), hhmm: `${get('hour')}:${get('minute')}` };
}
const hh = h => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? '30' : '00'}`;
function status(s, now) {
  if (!s.h) return null;
  const t = now.h + now.m / 60, today = s.h[now.d];
  if (today && t >= today[0] && t < today[1]) return { open: true, html: t2(`Open · until ${hh(today[1])}`, `Abierto · hasta las ${hh(today[1])}`) };
  for (let k = 0; k < 8; k++) {
    const d = (now.d + k) % 7, x = s.h[d];
    if (!x || (k === 0 && t >= x[0])) continue;
    const dayEn = k === 0 ? 'today' : k === 1 ? 'tomorrow' : DAYS.en[d], dayEs = k === 0 ? 'hoy' : k === 1 ? 'mañana' : 'el ' + DAYS.es[d];
    return { open: false, html: t2(`Closed · opens ${dayEn} ${hh(x[0])}`, `Cerrado · abre ${dayEs} a las ${hh(x[0])}`) };
  }
  return { open: false, html: t2('Closed', 'Cerrado') };
}
function hoursHTML(s, lang) {
  const order = [1, 2, 3, 4, 5, 6, 0], out = [];
  let i = 0;
  while (i < order.length) {
    let j = i;
    while (j + 1 < order.length && JSON.stringify(s.h[order[j + 1]]) === JSON.stringify(s.h[order[i]])) j++;
    const a = DAYS[lang][order[i]], b = DAYS[lang][order[j]], x = s.h[order[i]];
    out.push(`${a}${j > i ? '–' + b : ''} ${x ? hh(x[0]) + '–' + hh(x[1]) : (lang === 'en' ? 'closed' : 'cerrado')}`);
    i = j + 1;
  }
  return out.join('<br>');
}
(function salons() {
  const list = $('#salonList'), pins = $('#pins'), svg = $('#map');
  const maps = s => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Anthony Llobet ' + (s.addr || s.name) + ' Barcelona');
  list.innerHTML = SALONS.map((s, i) => {
    const faces = TEAM.filter(p => p.salon === s.k);
    return `<article class="salon" id="s-${s.k}" data-i="${i}">
      <div class="salon__top"><span class="salon__n">N° ${String(i + 1).padStart(2, '0')}</span><span class="badge" data-badge="${s.k}"></span></div>
      <h3 class="salon__name">${s.name}</h3>
      <p class="salon__ph">${s.ph}${s.g ? ` · ${String(s.g[0]).replace('.', ',')}★ Google (${s.g[1]})` : ''}</p>
      <div class="salon__txt"><p>${t2(s.txt[0], s.txt[1])}</p>
        <dl class="salon__dl">
          ${s.addr ? `<dt>${t2('Where', 'Dónde')}</dt><dd><a href="${maps(s)}" target="_blank" rel="noopener">${s.addr}</a></dd>` : ''}
          ${s.h ? `<dt>${t2('Hours', 'Horario')}</dt><dd>${t2(hoursHTML(s, 'en'), hoursHTML(s, 'es'))}</dd>` : ''}
          ${s.metro ? `<dt>Metro</dt><dd>${t2(s.metro[0], s.metro[1])}</dd>` : ''}
          ${s.tel ? `<dt>${t2('Call', 'Llama')}</dt><dd>${s.tel.map(t => `<a href="tel:+34${t.replace(/\s/g, '')}">${t}</a>`).join(' · ')}</dd>` : ''}
        </dl>
        ${faces.length ? `<div class="faces">${faces.map(p => `<img src="assets/team/${p.f}.jpg" alt="${p.name}" title="${p.name}" loading="lazy">`).join('')}<span>${faces.map(p => p.name).join(', ')}</span></div>` : ''}
        <div class="salon__btns">
          ${s.k === 'academy' ? `<a class="btn" href="tel:+34932180449">${t2('Ask about courses', 'Pregunta por los cursos')}</a>` : `<a class="btn" href="${s.book || BOOK}" target="_blank" rel="noopener">${t2('Book here', 'Reservar aquí')}</a>`}
          ${s.addr ? `<a class="btn btn--ghost" href="${maps(s)}" target="_blank" rel="noopener">${t2('Directions', 'Cómo llegar')}</a>` : ''}
        </div>
      </div>
      <figure class="salon__img"><img src="${s.img}" alt="${s.name}" loading="lazy"></figure>
    </article>`;
  }).join('');

  // pines
  const NS = 'http://www.w3.org/2000/svg';
  SALONS.forEach((s, i) => {
    if (!s.xy) return;
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'pin'); g.dataset.i = i;
    g.innerHTML = `<circle class="ring" cx="${s.xy[0]}" cy="${s.xy[1]}" r="12"/><circle class="dot" cx="${s.xy[0]}" cy="${s.xy[1]}" r="9"/><text x="${s.xy[0]}" y="${s.xy[1]}">${i + 1}</text><text class="lab" x="${s.xy[0] + 16}" y="${s.xy[1] + 3}">${s.name.toUpperCase()}</text>`;
    pins.appendChild(g);
  });
  pins.addEventListener('click', e => {
    const g = e.target.closest('.pin'); if (!g) return;
    const el = $('#s-' + SALONS[+g.dataset.i].k);
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - 90, behavior: 'smooth' });
  });

  // activo según el scroll
  let cur = -1;
  function activate(i) {
    if (i === cur) return; cur = i;
    $$('.salon', list).forEach((a, k) => a.classList.toggle('is-on', k === i));
    $$('.pin', pins).forEach(g => g.classList.toggle('is-on', +g.dataset.i === i));
    if (isMobile()) return;
    const s = SALONS[i];
    let vb = '0 0 420 380';
    if (s.xy) {
      const w = 250, h = 250 * 380 / 420;
      const x = Math.max(0, Math.min(420 - w, s.xy[0] - w / 2)), y = Math.max(0, Math.min(380 - h, s.xy[1] - h / 2));
      vb = `${x.toFixed(1)} ${y.toFixed(1)} ${w} ${h.toFixed(1)}`;
    }
    gsap.to(svg, { attr: { viewBox: vb }, duration: 1.1, ease: 'power3.inOut' });
  }
  $$('.salon', list).forEach((a, i) => ScrollTrigger.create({ trigger: a, start: 'top 62%', end: 'bottom 62%', onToggle: s => s.isActive && activate(i) }));
  activate(0);

  // horarios en directo
  function live() {
    const now = madridNow();
    let open = 0;
    SALONS.forEach(s => {
      const b = $(`[data-badge="${s.k}"]`);
      if (!s.h) { b.innerHTML = t2(s.badge[0], s.badge[1]); b.classList.remove('is-open'); return; }
      const st = status(s, now);
      if (st.open) open++;
      b.innerHTML = st.html; b.classList.toggle('is-open', st.open);
    });
    const line = $('#nowLine');
    line.classList.toggle('is-closed', !open);
    line.innerHTML = t2(`Barcelona, ${now.hhmm} · ${open ? `${open} of 5 salons open right now` : 'all salons closed right now. Book online anytime'}`,
      `Barcelona, ${now.hhmm} · ${open ? `ahora mismo hay ${open} de 5 salones abiertos` : 'ahora mismo está todo cerrado. Reserva online cuando quieras'}`);
  }
  live(); setInterval(live, 60000);

  // valoraciones y footer
  const real = SALONS.slice(0, 5);
  $('#ratings').innerHTML = real.map(s => `<li><strong>${s.name}</strong><b>${String(s.g[0]).replace('.', ',')}★</b><span>${t2(s.g[1] + ' Google reviews', s.g[1] + ' reseñas en Google')}</span></li>`).join('');
  $('#footSalons').innerHTML = real.map(s => `<div><h4>${s.name}</h4><p>${s.addr}<br>${s.tel.map(t => `<a href="tel:+34${t.replace(/\s/g, '')}">${t}</a>`).join('<br>')}</p></div>`).join('');
})();

/* ---------- 04 · carta ---------- */
(function menu() {
  const Q = ['on quote', 'a presupuesto'];
  const M = [
    { t: ['Women', 'Mujer'], img: 'assets/ig/born/born-05.jpg', cap: ['Balayage at the Born salon', 'Balayage en el salón del Born'], items: [
      [['Wash & style', 'Lavar y peinar'], '22€'], [['Deep treatment', 'Tratamiento profundo'], '11€'], [['Cut & natural dry', 'Corte y secado natural'], '37€'], [['Cut & style', 'Corte y peinado'], '44€'],
      [['Permanent / semi-permanent colour', 'Tinte permanente / semipermanente'], '51€', 1], [['Highlights', 'Mechas'], '60€', 1], [['Toning', 'Matiz'], '30€', 1], [['Keratin treatments', 'Tratamientos de keratina'], Q]] },
    { t: ['Men', 'Hombre'], img: 'assets/ig/eixample/eixample-03.jpg', cap: ['Textured crop at Eixample', 'Crop texturizado en Eixample'], items: [
      [['Beard trim', 'Arreglo de barba'], '14€'], [['Clipper cut only', 'Solo máquina'], '14€', 0, ['no fade or scissors', 'sin degradado ni tijera']], [['Scissor & clipper cut', 'Corte con tijera y máquina'], '24€'], [['Haircut + beard trim', 'Corte + barba'], '35€']] },
    { t: ['Kids', 'Peques'], img: 'assets/web/Parallel-img.jpg', cap: ['Clean lines, any age', 'Líneas limpias, a cualquier edad'], items: [
      [['Baby', 'Bebé'], '12€'], [['Boy’s haircut', 'Corte niño'], '17€', 0, ['ages 2–15', 'de 2 a 15 años']], [['Girl’s haircut', 'Corte niña'], ['18.5€', '18,5€'], 0, ['ages 4–9', 'de 4 a 9 años']], [['Girl’s haircut', 'Corte niña'], ['26.5€', '26,5€'], 0, ['ages 10–15', 'de 10 a 15 años']]] },
    { t: ['Special', 'Especial'], img: 'assets/ig/aclub/aclub-03.jpg', cap: ['Updos from our workshop', 'Recogidos de nuestro taller'], items: [
      [['Weddings', 'Bodas'], '89€', 1], [['Extensions', 'Extensiones'], '290€', 1], [['Hen & stag parties', 'Despedidas de soltero/a'], Q], [['Events, hotels & shoots', 'Eventos, hoteles y sesiones de fotos'], Q]] }
  ];
  const tabs = $('#menuTabs'), list = $('#menuList'), img = $('#menuImg'), cap = $('#menuCap');
  tabs.innerHTML = M.map((m, i) => `<button type="button" role="tab" data-i="${i}"${i ? '' : ' class="is-on"'}>${t2(m.t[0], m.t[1])}</button>`).join('');
  const price = (p, from) => {
    const [a, b] = Array.isArray(p) ? p : [p, p];
    return from ? t2(`<small>from</small>${a}`, `<small>desde</small>${b}`) : t2(a, b);
  };
  function render(i, anim) {
    const m = M[i];
    list.innerHTML = m.items.map(([n, p, from, sub]) => `<div><dt>${t2(n[0], n[1])}${sub ? `<small>${t2(sub[0], sub[1])}</small>` : ''}</dt><dd>${price(p, from)}</dd></div>`).join('');
    cap.innerHTML = t2(m.cap[0], m.cap[1]);
    if (anim) {
      gsap.from(list.children, { y: 24, opacity: 0, duration: .6, ease: 'expo.out', stagger: .05 });
      gsap.fromTo(img, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'expo.inOut', onStart: () => { img.src = m.img; img.alt = m.cap[0]; } });
    } else { img.src = m.img; img.alt = m.cap[0]; }
  }
  tabs.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', tabs).forEach(x => x.classList.toggle('is-on', x === b));
    render(+b.dataset.i, true);
  });
  render(0);
})();

/* ---------- 05 · muestrario en abanico ---------- */
(function fan() {
  const N = [['Pineapple', 'Piña'], ['Pink gold', 'Oro rosa'], ['Sea mist', 'Bruma'], ['Mahogany', 'Caoba'], ['Clover', 'Trébol'], ['Garden party', 'Fiesta en el jardín'], ['Lavender', 'Lavanda'], ['Copper', 'Cobre'], ['Coastline', 'Costa'], ['Tartan', 'Tartán'], ['Campfire', 'Hoguera'], ['Suitcase', 'Maleta']];
  const deck = $('#deck');
  deck.insertAdjacentHTML('afterbegin', N.map((n, i) => `<figure class="swatch" style="z-index:${i + 1}"><img src="assets/ig/lookbook/lookbook-${String(i + 1).padStart(2, '0')}.jpg" alt="RE·BORN ${n[0]}" loading="lazy"><p><b>RB·${String(i + 1).padStart(2, '0')}</b><span>${t2(n[0], n[1])}</span></p></figure>`).join(''));
  const cards = $$('.swatch', deck), n = cards.length;
  const spread = () => isMobile() ? 8.5 : 12.5;
  const rest = cards.map(() => (Math.random() * 6 - 3).toFixed(1));
  gsap.set(cards, { '--r': i => rest[i] + 'deg', '--y': '70vh' });
  gsap.timeline({ scrollTrigger: { trigger: '.fan__pin', start: 'top top', end: '+=170%', scrub: 1, pin: true, invalidateOnRefresh: true } })
    .to(cards, { '--y': '0vh', duration: .35, ease: 'power3.out', stagger: .02 })
    .to(cards, { '--r': i => ((i - (n - 1) / 2) * spread()).toFixed(1) + 'deg', duration: 1, ease: 'power2.inOut' }, '>-.05')
    .to('.fan__hint', { opacity: 0, duration: .2 }, '<');
})();

/* ---------- carrusel de trabajos (se acelera con el scroll) ---------- */
(function work() {
  const r1 = ['born/born-01', 'eixample/eixample-01', 'born/born-02', 'eixample/eixample-06', 'born/born-05', 'gotic/gotic-12', 'born/born-06', 'eixample/eixample-12', 'born/born-08', 'gotic/gotic-03', 'born/born-10', 'born/born-12'];
  const r2 = ['eixample/eixample-02', 'gotic/gotic-01', 'eixample/eixample-03', 'eixample/eixample-05', 'gotic/gotic-02', 'eixample/eixample-08', 'born/born-04', 'eixample/eixample-09', 'eixample/eixample-10', 'born/born-07', 'eixample/eixample-11', 'born/born-11'];
  const fill = (el, arr) => { const h = arr.map(p => `<img src="assets/ig/${p}.jpg" alt="" loading="lazy">`).join(''); el.innerHTML = h + h; };
  fill($('#row1'), r1); fill($('#row2'), r2);
  const hi = Object.entries(LN).map(([k, v]) => `<span>${v[1].replace(/[!¡ ]/g, '')}<sup>${k.toUpperCase()}</sup></span><i>✳</i>`).join('');
  $('#band').innerHTML = hi.repeat(4);
  const bd = gsap.to('#band', { xPercent: -50, ease: 'none', duration: 34, repeat: -1 });
  const a = gsap.to('#row1', { xPercent: -50, ease: 'none', duration: 70, repeat: -1 });
  const b = gsap.fromTo('#row2', { xPercent: -50 }, { xPercent: 0, ease: 'none', duration: 70, repeat: -1 });
  $('#press').innerHTML = ['vogue', 'gq', 'forbes', 'esquire', 'icon', 'sports', 'hf'].map(l => `<img src="assets/web/${l}-logo.png" alt="${l}">`).join('').repeat(4);
  const p = gsap.to('#press', { xPercent: -50, ease: 'none', duration: 40, repeat: -1 });
  let boost = 1;
  ScrollTrigger.create({ onUpdate: s => { boost = 1 + Math.min(8, Math.abs(s.getVelocity()) / 250); } });
  gsap.ticker.add(() => { boost += (1 - boost) * .06; a.timeScale(boost); b.timeScale(boost); p.timeScale(boost); bd.timeScale(boost); });
})();

/* ---------- 06 · calor: la palabra ondula como el aire caliente ---------- */
(function heat() {
  const map = $('#heatMap'), noise = $('#heatNoise');
  let on = false, t = 0;
  ScrollTrigger.create({ trigger: '.hot', start: 'top bottom', end: 'bottom top', onToggle: s => on = s.isActive });
  gsap.fromTo(map, { attr: { scale: 0 } }, { attr: { scale: 16 }, ease: 'none', scrollTrigger: { trigger: '.hot__title', start: 'top 85%', end: 'center 45%', scrub: true } });
  gsap.ticker.add(() => { if (!on) return; t += .03; noise.setAttribute('baseFrequency', `0.008 ${(0.07 + Math.sin(t) * 0.025).toFixed(4)}`); });
})();

/* ---------- 10 · "book now" en todos los idiomas ---------- */
(function book() {
  const W = [['Book now', 'EN'], ['Reserva', 'ES'], ['Réservez', 'FR'], ['Prenota', 'IT'], ['Buchen', 'DE'], ['Rezervovat', 'CS'], ['Marcar', 'PT'], ['Boeken', 'NL']];
  const el = $('#bookWord');
  setWord(el, W[0][0], 60, 900);
  let i = 0, on = false;
  ScrollTrigger.create({ trigger: '.final', start: 'top 80%', end: 'bottom top', onToggle: s => on = s.isActive });
  (function loop() { gsap.delayedCall(1.9, () => { if (on) { i = (i + 1) % W.length; morph(el, W[i][0], { w: 60, g: 900 }); $('#bookLang').textContent = W[i][1]; } loop(); }); })();
})();

/* ---------- apariciones ---------- */
$$('.sec .entry, .big, .filters, .phrase__wrap, .phrase__punch, .menu__tabs, .menu__wrap, .work__label, .hot__title, .hot__grid p, .members__wrap > *, .press, .academy__banner, .events article, .quotes blockquote, .ratings li, .final > *, .foot__grid > div, .map')
  .forEach(n => gsap.from(n, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: n, start: 'top 88%', once: true } }));
