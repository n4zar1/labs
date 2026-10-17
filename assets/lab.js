// Shared lab engine: catalog, progress (per-browser), answer checking.
const LABS = [
  {id: 'dominio-falso', ic: '🎣', title: 'Caza el dominio falso', desc: 'Ocho enlaces de un banco ficticio. Algunos son legítimos y otros son trampas de phishing. ¿Los distingues?', level: 'Fácil', lvl: 'easy', mins: 5, video: 'El detalle que delata una web falsa'},
  {id: 'metadatos', ic: '📍', title: 'Lo que dice tu foto', desc: 'Analiza los metadatos EXIF de una foto publicada y descubre dónde, cuándo y con qué se hizo.', level: 'Fácil', lvl: 'easy', mins: 8, video: 'Tu foto dice dónde vives'},
  {id: 'quien-ha-entrado', ic: '🪟', title: '¿Quién ha entrado en el PC?', desc: 'Investiga el registro de seguridad de un Windows comprometido: el ataque, la entrada y la puerta trasera.', level: 'Medio', lvl: 'mid', mins: 15, video: '¿Alguien ha entrado en tu PC?'},
  {id: 'relleno-credenciales', ic: '🔓', title: 'Relleno de credenciales', desc: 'El registro de accesos de una tienda online muestra un ataque automatizado. Descubre qué cuentas cayeron.', level: 'Medio', lvl: 'mid', mins: 15, video: 'Tu contraseña está a la venta'},
  {id: 'engana-la-ia', ic: '🤖', title: 'Engaña a la IA', desc: 'Consigue que la IA de compras de una empresa te adjudique un contrato con texto invisible. Después, caza las órdenes ocultas en cinco correos.', level: 'Medio', lvl: 'mid', mins: 15, video: 'Conseguí un contrato millonario engañando a su IA'},
  {id: 'red-gemela', ic: '🛜', title: 'Encuentra la red gemela', desc: 'Un Wi-Fi gratis de aeropuerto con trampa: encuentra la antena gemela, cuenta las contraseñas robadas por su portal falso y descubre qué tráfico vio el atacante.', level: 'Medio', lvl: 'mid', mins: 15, video: 'Este Wi-Fi gratis del aeropuerto lo creé yo'},
  {id: 'camara-vulnerable', ic: '📷', title: 'Encuentra la cámara vulnerable', desc: 'Un buscador de dispositivos tipo Shodan, el router de una familia y el registro de su cámara: encuentra la cámara abierta, el puerto que la expone y al intruso.', level: 'Medio', lvl: 'mid', mins: 15, video: 'Tu cámara puede salir en este buscador'},
  {id: 'app-espia', ic: '📱', title: 'Encuentra la app espía', desc: 'Un Android con una app espía oculta: revisa la actividad, las apps y los permisos especiales, encuentra cuándo y cómo la instalaron y qué debe hacer su dueña sin ponerse en riesgo.', level: 'Medio', lvl: 'mid', mins: 15, video: '¿Te espían el móvil?'},
  {id: 'kill-chain', ic: '⛓️', title: 'Ordena el ataque', desc: 'Nueve pistas desordenadas de un ataque de ransomware a una empresa ficticia: colócalas en las 7 fases de la Cyber Kill Chain y descubre dónde se podía haber cortado.', level: 'Fácil', lvl: 'easy', mins: 10, video: '¿Cómo se hackea una empresa?', pub: '2026-10-18T19:30:00+02:00'},
];

// A lab with `pub` (ISO date) stays hidden until its video goes live; the page unlocks itself at that moment.
const isLive = l => !l.pub || Date.now() >= Date.parse(l.pub);
const LIVE = () => LABS.filter(isLive);
function wakeAt(pub, fn) { const ms = Date.parse(pub) - Date.now(); if (ms > 0 && ms < 864e5) setTimeout(fn, ms + 1000); }
// Opening an unpublished lab by its URL behaves as if it did not exist yet: back to the catalog.
(() => {
  const lab = LABS.find(l => location.pathname.includes('/' + l.id + '/'));
  if (lab && !isLive(lab)) { document.documentElement.style.display = 'none'; location.replace('../index.html'); }
})();

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem('n4labs:' + k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem('n4labs:' + k, JSON.stringify(v)); } catch (e) {} },
};
// Anonymous, cookie-free events (GoatCounter). The script loads async, so retry briefly.
function track(path, title) {
  let n = 0;
  const send = () => {
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({path, title: title || path, event: true});
    else if (n++ < 20) setTimeout(send, 500);
  };
  send();
}
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[“”"'`]/g, '').replace(/\s+/g, ' ').trim();
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function renderCatalog(el) {
  LABS.filter(l => !isLive(l)).forEach(l => wakeAt(l.pub, () => renderCatalog(el)));
  const labs = LIVE();
  const solved = labs.filter(l => store.get('done:' + l.id)).length;
  document.getElementById('pcount').textContent = `${solved} de ${labs.length} completados`;
  document.getElementById('pbar').style.width = `${100 * solved / labs.length}%`;
  el.innerHTML = labs.map(l => `
    <a class="card" href="${l.id}/index.html">
      ${store.get('done:' + l.id) ? '<span class="done">✓ HECHO</span>' : ''}
      <span class="ic" aria-hidden="true">${l.ic}</span>
      <h3>${esc(l.title)}</h3>
      <p>${esc(l.desc)}</p>
      <div class="meta"><span class="pill ${l.lvl}">${l.level}</span><span class="pill">~${l.mins} min</span><span class="pill">🎬 ${esc(l.video)}</span></div>
    </a>`).join('');
}

// tasks: [{q, type: 'text'|'choice', options?, accept: fn(normalizedAnswer) -> bool | array of answers, hint, explain}]
function runLab(id, tasks, flag) {
  const box = document.getElementById('tasks');
  const state = store.get('state:' + id) || {};
  track(`lab/${id}/abierto`, `Lab abierto: ${id}`);
  box.innerHTML = tasks.map((t, i) => `
    <div class="task" id="t${i}">
      <div class="q"><span class="n">${String(i + 1).padStart(2, '0')}</span><span>${t.q}</span></div>
      <form class="ans" data-i="${i}">
        ${t.type === 'choice'
          ? t.options.map((o, j) => `<label><input type="radio" name="c${i}" value="${j}"> <span>${o}</span></label>`).join('') + '<button class="btn">Comprobar</button>'
          : `<input name="a" autocomplete="off" spellcheck="false" placeholder="${esc(t.ph || 'Tu respuesta')}" aria-label="Respuesta ${i + 1}"><button class="btn">Comprobar</button>`}
      </form>
      <div class="fb" role="status"></div>
      ${t.hint ? `<details class="hint"><summary>Pista</summary>${t.hint}</details>` : ''}
      <div class="explain">${t.explain || ''}</div>
    </div>`).join('');

  const mark = (i, ok) => { document.getElementById('t' + i).classList.toggle('ok', ok); };
  const check = () => {
    const all = tasks.every((_, i) => state[i]);
    document.getElementById('win').classList.toggle('on', all);
    if (all) {
      if (!store.get('done:' + id)) track(`lab/${id}/bandera`, `Bandera conseguida: ${id}`);
      store.set('done:' + id, true); document.getElementById('flag').textContent = flag;
    }
  };
  tasks.forEach((t, i) => { if (state[i]) { mark(i, true); fillSolved(i); } });

  function fillSolved(i) {
    const f = box.querySelector(`form[data-i="${i}"]`);
    if (tasks[i].type === 'choice') { const r = f.querySelector(`input[value="${tasks[i].correct}"]`); if (r) r.checked = true; }
    else f.a.value = state['v' + i] || '';
    f.nextElementSibling.textContent = '✓ Correcto'; f.nextElementSibling.className = 'fb good';
  }

  box.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, i = +f.dataset.i, t = tasks[i], fb = f.nextElementSibling;
    let ok = false, raw = '';
    if (t.type === 'choice') {
      const sel = f.querySelector('input:checked');
      if (!sel) { fb.textContent = 'Elige una opción.'; fb.className = 'fb bad'; return; }
      ok = +sel.value === t.correct;
    } else {
      raw = f.a.value; const a = norm(raw);
      if (!a) { fb.textContent = 'Escribe una respuesta.'; fb.className = 'fb bad'; return; }
      ok = typeof t.accept === 'function' ? t.accept(a) : t.accept.map(norm).includes(a);
    }
    if (ok && !state[i]) track(`lab/${id}/pregunta-${i + 1}`, `Pregunta ${i + 1} acertada: ${id}`);
    if (!ok) track(`lab/${id}/fallo-${i + 1}`, `Fallo en la pregunta ${i + 1}: ${id}`);
    if (ok) { state[i] = true; state['v' + i] = raw; store.set('state:' + id, state); fb.textContent = '✓ Correcto'; fb.className = 'fb good'; mark(i, true); }
    else { fb.textContent = t.wrong || '✗ No es eso. Revisa la evidencia (o abre la pista).'; fb.className = 'fb bad'; mark(i, false); }
    check();
  });
  document.getElementById('reset')?.addEventListener('click', () => {
    track(`lab/${id}/reinicio`, `Reto reiniciado: ${id}`);
    store.set('state:' + id, {}); store.set('done:' + id, false); location.reload();
  });
  check();
}

// simple table filter: rows = array of arrays; cls(row) -> row class
function makeTable({el, cols, rows, cls, filters}) {
  const tbody = el.querySelector('tbody'), count = el.querySelector('.count');
  el.querySelector('thead').innerHTML = '<tr>' + cols.map(c => `<th>${c}</th>`).join('') + '</tr>';
  const draw = () => {
    const vals = filters.map(f => f.el.value);
    const shown = rows.filter(r => filters.every((f, k) => f.test(r, vals[k])));
    tbody.innerHTML = shown.map(r => `<tr class="${cls ? cls(r) : ''}">${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('');
    count.textContent = `${shown.length} de ${rows.length} filas`;
  };
  filters.forEach(f => f.el.addEventListener('input', draw));
  draw();
}
