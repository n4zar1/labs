// Shared lab engine: catalog, progress (per-browser), answer checking.
const LABS = [
  {id: 'dominio-falso', ic: '🎣', title: 'Caza el dominio falso', desc: 'Ocho enlaces de un banco ficticio. Algunos son legítimos y otros son trampas de phishing. ¿Los distingues?', level: 'Fácil', lvl: 'easy', mins: 5, video: 'El detalle que delata una web falsa', cat: 'phishing', pub: '2026-10-14T13:00:00+02:00'},
  {id: 'metadatos', ic: '📍', title: 'Lo que dice tu foto', desc: 'Analiza los metadatos EXIF de una foto publicada y descubre dónde, cuándo y con qué se hizo.', level: 'Fácil', lvl: 'easy', mins: 8, video: 'Tu foto dice dónde vives', cat: 'movil', pub: '2026-10-14T13:00:00+02:00'},
  {id: 'quien-ha-entrado', ic: '🪟', title: '¿Quién ha entrado en el PC?', desc: 'Investiga el registro de seguridad de un Windows comprometido: el ataque, la entrada y la puerta trasera.', level: 'Medio', lvl: 'mid', mins: 15, video: '¿Alguien ha entrado en tu PC?', cat: 'incidentes', pub: '2026-10-14T13:00:00+02:00'},
  {id: 'relleno-credenciales', ic: '🔓', title: 'Relleno de credenciales', desc: 'El registro de accesos de una tienda online muestra un ataque automatizado. Descubre qué cuentas cayeron.', level: 'Medio', lvl: 'mid', mins: 15, video: 'Tu contraseña está a la venta', cat: 'phishing', pub: '2026-10-14T13:00:00+02:00'},
  {id: 'engana-la-ia', ic: '🤖', title: 'Engaña a la IA', desc: 'Consigue que la IA de compras de una empresa te adjudique un contrato con texto invisible. Después, caza las órdenes ocultas en cinco correos.', level: 'Medio', lvl: 'mid', mins: 15, video: 'Conseguí un contrato millonario engañando a su IA', cat: 'ia', pub: '2026-10-14T21:00:00+02:00'},
  {id: 'red-gemela', ic: '🛜', title: 'Encuentra la red gemela', desc: 'Un Wi-Fi gratis de aeropuerto con trampa: encuentra la antena gemela, cuenta las contraseñas robadas por su portal falso y descubre qué tráfico vio el atacante.', level: 'Medio', lvl: 'mid', mins: 15, video: 'Este Wi-Fi gratis del aeropuerto lo creé yo', cat: 'redes', pub: '2026-10-15T19:30:00+02:00'},
  {id: 'camara-vulnerable', ic: '📷', title: 'Encuentra la cámara vulnerable', desc: 'Un buscador de dispositivos tipo Shodan, el router de una familia y el registro de su cámara: encuentra la cámara abierta, el puerto que la expone y al intruso.', level: 'Medio', lvl: 'mid', mins: 15, video: 'Tu cámara puede salir en este buscador', cat: 'redes', pub: '2026-10-16T19:30:00+02:00'},
  {id: 'app-espia', ic: '📱', title: 'Encuentra la app espía', desc: 'Un Android con una app espía oculta: revisa la actividad, las apps y los permisos especiales, encuentra cuándo y cómo la instalaron y qué debe hacer su dueña sin ponerse en riesgo.', level: 'Medio', lvl: 'mid', mins: 15, video: '¿Te espían el móvil?', cat: 'movil', pub: '2026-10-17T19:30:00+02:00'},
  {id: 'kill-chain', ic: '⛓️', title: 'Ordena el ataque', desc: 'Nueve pistas desordenadas de un ataque de ransomware a una empresa ficticia: colócalas en las 7 fases de la Cyber Kill Chain y descubre dónde se podía haber cortado.', level: 'Fácil', lvl: 'easy', mins: 10, video: '¿Cómo se hackea una empresa?', cat: 'incidentes', pub: '2026-10-18T19:30:00+02:00'},
  {id: 'arranque-oculto', ic: '🔁', title: 'Caza el arranque oculto', desc: 'Un portátil que vuelve a infectarse después de cada limpieza: revisa los programas de inicio, las tareas programadas y las firmas, y descubre qué lo resucita y cómo entró.', level: 'Medio', lvl: 'mid', mins: 15, video: '¿Qué se enciende con tu PC?', cat: 'incidentes', pub: '2026-10-19T19:30:00+02:00'},
  {id: 'ventilador-teclado', ic: '🌀', title: 'El ventilador que teclea solo', desc: 'Un ventilador USB regalado que Windows reconoce como teclado: revisa los dispositivos nuevos, los teclados, RunMRU y PowerShell, y descubre qué escribió y qué dejó instalado.', level: 'Medio', lvl: 'mid', mins: 15, video: 'El ventilador USB que teclea solo', cat: 'incidentes', pub: '2026-10-20T19:30:00+02:00'},
  {id: 'windows-sin-clave', ic: '🔐', title: 'El portátil sin contraseña', desc: 'Alguien entró en el portátil de Marta sin saber su contraseña: revisa el cifrado de los equipos, el registro de seguridad y los archivos abiertos, y descubre qué hizo.', level: 'Medio', lvl: 'mid', mins: 15, video: '¿Pueden entrar en tu Windows sin tu contraseña?', cat: 'incidentes', pub: '2026-10-21T19:30:00+02:00'},
  {id: 'garaje-comunidad', ic: '🐬', title: 'El garaje de la comunidad', desc: 'Entraron en el garaje sin mando y un vecino vio un aparatito naranja con un delfín: revisa el receptor, el lector del portal, la SD del Flipper y el coche, y descubre qué abrió de verdad.', level: 'Medio', lvl: 'mid', mins: 15, video: '¿Un Flipper Zero abre tu coche?', cat: 'redes', pub: '2026-10-22T19:30:00+02:00'},
  {id: 'captcha-ofuscado', ic: '🤖', title: 'El captcha de la clínica', desc: 'La recepcionista de una clínica siguió los pasos de un «No soy un robot» y esa noche entraron en el correo: revisa RunMRU, el evento 4104 y el router, y descubre qué pegó y adónde fueron los datos.', level: 'Medio', lvl: 'mid', mins: 15, video: 'Este «No soy un robot» te hackea', cat: 'incidentes', pub: '2026-10-23T19:30:00+02:00'},
  {id: 'libreta-dns', ic: '📒', title: 'La libreta que no se borra', desc: 'Lucía borró el historial y su portátil sigue raro: lee la caché DNS de Windows, cruza las conexiones abiertas y el historial de Edge, y descubre con quién habla su PC sin preguntarle.', level: 'Medio', lvl: 'mid', mins: 12, video: '¿A qué webs se ha conectado tu PC?', cat: 'incidentes', pub: '2026-10-24T19:30:00+02:00'},
  {id: 'pc-desbloqueado', ic: '🔓', title: '¿Quién usó el PC de Nuria?', desc: 'Mientras Nuria comía, alguien desbloqueó su PC y mandó las nóminas por correo: revisa los eventos 4624, 4800 y 107, los tornos de la planta y su Outlook, y descubre cuándo, cómo y quién.', level: 'Medio', lvl: 'mid', mins: 15, video: '¿Alguien ha usado tu PC mientras no estabas?', cat: 'incidentes', pub: '2026-10-25T19:30:00+01:00'},
  {id: 'foto-borrada', ic: '💾', title: 'La tarjeta formateada', desc: 'Álex formateó la SD de su cámara antes de venderla: abre sus bytes, busca la firma de las fotos y recupera lo que «había borrado», DNI incluido.', level: 'Fácil', lvl: 'easy', mins: 10, video: 'Lo formateaste… y tus fotos siguen ahí', cat: 'movil', pub: '2026-10-26T19:30:00+01:00'},
  {id: 'de-donde-vino', ic: '📥', title: '¿De dónde vino?', desc: 'Al antivirus le saltó una descarga y Pablo no sabe de dónde la bajó: lee la etiqueta oculta de sus seis descargas, cruza el aviso y su correo, y descubre de qué web salió.', level: 'Medio', lvl: 'mid', mins: 10, video: '¿De qué web salió este virus?', cat: 'incidentes', pub: '2026-10-27T19:30:00+01:00'},
  {id: 'proceso-impostor', ic: '🦠', title: '¿Cuál es el impostor?', desc: 'Un portátil lento y un antivirus que dice «Sin amenazas»: lee el árbol de procesos de Process Explorer, su ruta, su firma y VirusTotal, y descubre qué svchost.exe no es de Windows, quién lo lanzó y con quién habla.', level: 'Medio', lvl: 'mid', mins: 12, video: 'Este svchost no es de Windows', cat: 'incidentes', pub: '2026-10-28T19:30:00+01:00'},
  {id: 'comentario-trampa', ic: '💬', title: 'Caza el comentario trampa', desc: 'Un foro de recetas donde roban cuentas sin contraseña: encuentra el comentario que es un XSS, la regla del WAF que lo vio y por qué no lo paró, adónde fueron las cookies y qué arreglo cierra el agujero.', level: 'Medio', lvl: 'mid', mins: 12, video: 'Esto no es un comentario: es un programa (XSS)', cat: 'web', pub: '2026-11-02T19:30:00+01:00'},
  {id: 'cambia-un-numero', ic: '🧾', title: 'Cambia un número', desc: 'Una tienda online donde cambiando el número de la factura sale la de otra persona: encuentra quién enumeró las facturas, cuántas se llevó, qué comprobación falta en el código y qué arreglo lo cierra de verdad.', level: 'Medio', lvl: 'mid', mins: 12, video: 'Cambié un 4 por un 5… y vi la factura de otra persona (IDOR)', cat: 'web', pub: '2026-11-03T19:30:00+01:00'},
  {id: 'capa-invisible', ic: '🪟', title: 'La capa invisible', desc: 'Varios clientes de un banco hicieron una transferencia de 500 € sin querer tras pulsar «Ver vídeo» en una web de premios: encuentra la web cebo, quién cayó, la cabecera que faltaba y el arreglo que lo cierra.', level: 'Medio', lvl: 'mid', mins: 12, video: 'Pulsaste «Ver vídeo»… pero ese botón no era el que viste (clickjacking)', cat: 'web', pub: '2026-11-04T19:30:00+01:00'},
  {id: 'formulario-oculto', ic: '📨', title: 'El formulario oculto', desc: 'A varios clientes de un banco les cambiaron el correo mientras miraban una web de ofertas, sin pulsar nada: encuentra la web trampa, a cuántos afectó, por qué viajó la cookie y qué arreglo lo cierra.', level: 'Medio', lvl: 'mid', mins: 12, video: 'No has pulsado nada… y tu contraseña ya no es tuya (CSRF)', cat: 'web', pub: '2026-11-05T19:30:00+01:00'},
  {id: 'sube-una-carpeta', ic: '📂', title: 'Sube una carpeta', desc: 'Una web de descargas que sirve archivos por su nombre y alguien se llevó la contraseña de la base de datos: encuentra quién salió de la carpeta, cómo se saltó el filtro, qué archivo se llevó y qué arreglo lo cierra.', level: 'Medio', lvl: 'mid', mins: 12, video: 'Tres caracteres… y la web me dio sus contraseñas (path traversal)', cat: 'web', pub: '2026-11-06T19:30:00+01:00'},
  {id: 'enlace-del-banco', ic: '🔗', title: 'El enlace del banco', desc: 'Un correo de «TuBanco» con un enlace que empieza de verdad por el dominio del banco y acaba en un login falso: encuentra adónde llevaba, qué parámetro lo decidía, a cuántos clientes engañó, quién entró en sus cuentas y qué arreglo cierra la redirección abierta.', level: 'Medio', lvl: 'mid', mins: 12, video: 'El enlace era de tu banco… y aun así te robaron (redirección abierta)', cat: 'web', pub: '2026-11-07T19:30:00+01:00'},
  {id: 'frase-trampa', ic: '💬', title: 'La frase trampa', desc: 'Un servidor de Minecraft que se pone lentísimo después de dos mensajes raros en el chat (Log4Shell): encuentra la frase trampa, el disfraz que se saltó el filtro, adónde llamó el servidor, qué instaló el atacante y qué arreglo lo cierra.', level: 'Medio', lvl: 'mid', mins: 12, video: 'Una frase en un chat… y el servidor era suyo (Log4Shell)', cat: 'web', pub: '2026-11-08T19:30:00+01:00'},
  {id: 'cookie-robada', ic: '🍪', title: 'La cookie robada', desc: 'Entraron en la cuenta de Ana sin su contraseña ni su código y pidieron a un proveedor que pagara en otra cuenta: encuentra la web falsa, desde dónde se inició sesión de verdad, la sesión robada y su viaje imposible, la alerta que saltó y el arreglo que echa al atacante.', level: 'Medio', lvl: 'mid', mins: 12, video: 'No sabían tu contraseña. Ni tu código. Y entraron (robo de la cookie de sesión)', cat: 'web', pub: '2026-11-12T19:30:00+01:00'},
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

// Catalog: «Novedad» for the lab released today (Madrid time), then filters (search, category, level, status) kept in the URL hash.
const CATS = [
  {id: 'phishing', ic: '🎣', name: 'Phishing y contraseñas'},
  {id: 'movil', ic: '📱', name: 'Móvil y privacidad'},
  {id: 'redes', ic: '🛜', name: 'Redes y dispositivos'},
  {id: 'incidentes', ic: '🔎', name: 'Investigación de incidentes'},
  {id: 'ia', ic: '🤖', name: 'Inteligencia artificial'},
  {id: 'web', ic: '🌐', name: 'Webs y aplicaciones'},
];
const LEVELS = [['easy', 'Fácil'], ['mid', 'Medio'], ['hard', 'Difícil']];
const madridDay = ms => new Date(ms).toLocaleDateString('es-ES', {timeZone: 'Europe/Madrid'});
const isNew = l => l.pub && isLive(l) && madridDay(Date.parse(l.pub)) === madridDay(Date.now());
const catOf = l => CATS.find(c => c.id === l.cat) || {ic: '🧪', name: 'Otros'};

function readFilters() {
  const p = new URLSearchParams(location.hash.slice(1));
  return {q: p.get('q') || '', cat: p.get('cat') || '', lvl: p.get('nivel') || '', st: p.get('estado') || ''};
}
function writeFilters(f) {
  const p = new URLSearchParams();
  if (f.q) p.set('q', f.q); if (f.cat) p.set('cat', f.cat); if (f.lvl) p.set('nivel', f.lvl); if (f.st) p.set('estado', f.st);
  const h = p.toString();
  history.replaceState(null, '', h ? '#' + h : location.pathname + location.search);
}

function renderCatalog(el) {
  LABS.filter(l => !isLive(l)).forEach(l => wakeAt(l.pub, () => renderCatalog(el)));
  const labs = LIVE().sort((a, b) => isNew(b) - isNew(a) || Date.parse(b.pub || 0) - Date.parse(a.pub || 0));
  const done = l => !!store.get('done:' + l.id);
  const solved = labs.filter(done).length;
  document.getElementById('pcount').textContent = `${solved} de ${labs.length} resueltos`;
  document.getElementById('pbar').style.width = `${100 * solved / labs.length}%`;

  const box = document.getElementById('filters'), empty = document.getElementById('empty');
  let f = readFilters();
  const chip = (group, val, label, n, on) => `<button type="button" class="chip${on ? ' on' : ''}" data-g="${group}" data-v="${val}" aria-pressed="${on}">${label}${n === null ? '' : ` <span>${n}</span>`}</button>`;

  function draw() {
    const q = norm(f.q);
    const match = (l, skip) =>
      (skip === 'cat' || !f.cat || l.cat === f.cat) &&
      (skip === 'lvl' || !f.lvl || l.lvl === f.lvl) &&
      (!f.st || (f.st === 'hechos') === done(l)) &&
      (!q || norm([l.title, l.desc, l.video, catOf(l).name].join(' ')).includes(q));
    const levels = LEVELS.filter(([v]) => labs.some(l => l.lvl === v));
    box.querySelector('.cats').innerHTML = chip('cat', '', 'Todos', labs.filter(l => match(l, 'cat')).length, !f.cat) +
      CATS.filter(c => labs.some(l => l.cat === c.id)).map(c => chip('cat', c.id, c.name, labs.filter(l => l.cat === c.id && match(l, 'cat')).length, f.cat === c.id)).join('');
    box.querySelector('.more').innerHTML =
      chip('lvl', '', 'Cualquier nivel', null, !f.lvl) + levels.map(([v, n]) => chip('lvl', v, n, null, f.lvl === v)).join('') +
      '<span class="sep" aria-hidden="true"></span>' +
      chip('st', '', 'Cualquier estado', null, !f.st) + chip('st', 'pendientes', 'Pendientes', null, f.st === 'pendientes') + chip('st', 'hechos', 'Completados', null, f.st === 'hechos');
    const shown = labs.filter(l => match(l));
    const filtered = !!(f.q || f.cat || f.lvl || f.st);
    el.innerHTML = shown.map(l => {
      const c = catOf(l), nw = isNew(l);
      return `
    <a class="lab${nw ? ' nuevo' : ''}" href="${l.id}/index.html">
      <div>
        ${nw ? '<span class="nov">Nuevo hoy</span>' : ''}
        <h3>${esc(l.title)}${done(l) ? '<span class="hecho">Resuelto</span>' : ''}</h3>
        <p>${esc(l.desc)}</p>
      </div>
      <div class="meta"><b>${esc(c.name)}</b><span><span class="${l.lvl}">${l.level}</span> · ${l.mins} min</span><span>Vídeo: ${esc(l.video)}</span></div>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </a>`;
    }).join('');
    box.querySelector('.res').textContent = filtered ? `${shown.length} de ${labs.length} labs` : `${labs.length} labs`;
    box.querySelector('.clear').hidden = !filtered;
    empty.hidden = shown.length > 0;
    writeFilters(f);
  }

  if (!box.dataset.ready) {
    box.dataset.ready = 1;
    box.innerHTML = `
      <div class="frow"><input type="search" class="search" placeholder="Buscar: WhatsApp, Wi-Fi, contraseña…" aria-label="Buscar labs"><span class="res" aria-live="polite"></span><button type="button" class="clear" hidden>Quitar filtros</button></div>
      <div class="cats chips" role="group" aria-label="Categoría"></div>
      <div class="more chips" role="group" aria-label="Nivel y estado"></div>`;
    const s = box.querySelector('.search');
    s.addEventListener('input', () => { f.q = s.value; draw(); });
    box.addEventListener('click', e => {
      const b = e.target.closest('.chip');
      if (b) { f[b.dataset.g] = b.dataset.v; draw(); track('labs/filtro/' + b.dataset.g + '/' + (b.dataset.v || 'todos')); }
      if (e.target.closest('.clear')) { f = {q: '', cat: '', lvl: '', st: ''}; s.value = ''; draw(); }
    });
    empty.querySelector('button').addEventListener('click', () => box.querySelector('.clear').click());
    window.addEventListener('hashchange', () => { f = readFilters(); s.value = f.q; draw(); });
    s.value = f.q;
  }
  draw();
}

// tasks: [{q, type: 'text'|'choice', options?, accept: fn(normalizedAnswer) -> bool | array of answers, hint, explain}]
function runLab(id, tasks, flag) {
  const box = document.getElementById('tasks');
  const state = store.get('state:' + id) || {};
  track(`lab/${id}/abierto`, `Lab abierto: ${id}`);
  box.innerHTML = `
    <div class="tasks-hd"><h2>Preguntas</h2><div class="pasos" aria-hidden="true">${tasks.map(() => '<i></i>').join('')}</div><span class="cuenta" aria-live="polite"></span></div>
    <ol class="task-list">${tasks.map((t, i) => `
    <li class="task" id="t${i}">
      <span class="n" aria-hidden="true"><span>${i + 1}</span></span>
      <div class="q"><span class="vh">Pregunta ${i + 1}. </span>${t.q}</div>
      <form class="ans" data-i="${i}">
        ${t.type === 'choice'
          ? t.options.map((o, j) => `<label><input type="radio" name="c${i}" value="${j}"> <span>${o}</span></label>`).join('') + '<button class="btn">Comprobar</button>'
          : `<input name="a" autocomplete="off" spellcheck="false" placeholder="${esc(t.ph || 'Tu respuesta')}" aria-label="Respuesta ${i + 1}"><button class="btn">Comprobar</button>`}
      </form>
      <div class="fb" role="status"></div>
      ${t.hint ? `<details class="hint"><summary>Pista</summary>${t.hint}</details>` : ''}
      <div class="explain">${t.explain || ''}</div>
    </li>`).join('')}
    </ol>`;

  const items = [...box.querySelectorAll('.task')], marks = [...box.querySelectorAll('.pasos i')];
  const mark = (i, ok) => { items[i].classList.toggle('ok', ok); };
  // Progreso arriba (pegajoso) y la primera pregunta sin resolver resaltada: así se sigue el hilo.
  const progress = () => {
    const n = tasks.filter((_, i) => state[i]).length, cur = tasks.findIndex((_, i) => !state[i]);
    items.forEach((el, i) => el.classList.toggle('ahora', i === cur));
    marks.forEach((m, i) => { m.className = state[i] ? 'ok' : i === cur ? 'ahora' : ''; });
    box.querySelector('.cuenta').innerHTML = `<b>${n}</b> de ${tasks.length} resueltas`;
  };
  const next = () => {
    const cur = tasks.findIndex((_, i) => !state[i]);
    const to = cur < 0 ? document.getElementById('win') : items[cur];
    to.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
    const field = cur < 0 ? null : to.querySelector('input');
    if (field) setTimeout(() => field.focus({preventScroll: true}), 400);
  };
  const win = document.getElementById('win');
  prepareWin(win, flag);
  const check = () => {
    const all = tasks.every((_, i) => state[i]);
    progress();
    win.classList.toggle('on', all);
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

  box.addEventListener('click', e => { if (e.target.closest('.sig')) next(); });
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
    if (ok) {
      state[i] = true; state['v' + i] = raw; store.set('state:' + id, state); mark(i, true);
      const done = tasks.every((_, k) => state[k]);
      fb.className = 'fb good';
      fb.innerHTML = `✓ Correcto<button type="button" class="sig">${done ? 'Ver tu bandera ↓' : 'Siguiente pregunta ↓'}</button>`;
    }
    else { fb.textContent = t.wrong || '✗ No es eso. Revisa la evidencia (o abre la pista).'; fb.className = 'fb bad'; mark(i, false); }
    check();
  });
  document.getElementById('reset')?.addEventListener('click', () => {
    track(`lab/${id}/reinicio`, `Reto reiniciado: ${id}`);
    store.set('state:' + id, {}); store.set('done:' + id, false); location.reload();
  });
  check();
}

// Bandera: cada lab trae «Bandera: <code id=flag>» y un párrafo tipo «Lo que haría X: a; b; c».
// Aquí se le da forma: caja con la bandera y botón de copiar, y la lección como título y lista.
function prepareWin(win, flag) {
  if (!win || win.dataset.ready) return;
  win.dataset.ready = 1;
  const code = win.querySelector('#flag'), pFlag = code && code.closest('p');
  if (pFlag) {
    const caja = document.createElement('div');
    caja.className = 'bandera';
    caja.innerHTML = '<span class="et">Tu bandera</span>';
    caja.append(code);
    const copy = document.createElement('button');
    copy.type = 'button'; copy.className = 'btn ghost'; copy.textContent = 'Copiar';
    copy.addEventListener('click', () => {
      (navigator.clipboard ? navigator.clipboard.writeText(flag) : Promise.reject()).then(() => {
        copy.textContent = 'Copiada'; setTimeout(() => { copy.textContent = 'Copiar'; }, 1800);
      }).catch(() => { const r = document.createRange(); r.selectNodeContents(code); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); });
    });
    caja.append(copy);
    pFlag.replaceWith(caja);
    const h = win.querySelector('h2');
    if (h) {
      h.textContent = 'Reto resuelto';
      const sub = document.createElement('p'); sub.className = 'sub-win';
      sub.textContent = 'Has acertado todas las preguntas. Esta es la bandera del reto:';
      h.after(sub);
    }
  }
  // Divide un HTML por un separador sin cortar dentro de etiquetas (<code>, <b>…).
  const split = (html, re) => {
    const out = []; let depth = 0, cur = '', i = 0;
    while (i < html.length) {
      if (html[i] === '<') {
        const j = html.indexOf('>', i), tag = html.slice(i, j + 1);
        depth += tag[1] === '/' ? -1 : /\/>$/.test(tag) ? 0 : 1; cur += tag; i = j + 1; continue;
      }
      const m = depth === 0 ? html.slice(i).match(re) : null;
      if (m) { out.push(cur); cur = ''; i += m[0].length; continue; }
      cur += html[i++];
    }
    out.push(cur);
    return out.map(x => x.trim()).filter(Boolean);
  };
  const cap = x => x.charAt(0).toUpperCase() + x.slice(1);
  win.querySelectorAll(':scope > p:not(.sub-win)').forEach(p => {
    const html = p.innerHTML.trim();
    const m = html.match(/^([^<:]{3,48}):\s+/);
    const body = m ? html.slice(m[0].length) : html;
    let parts = split(body, /^;\s+/);
    if (parts.length < 3) parts = split(body, /^\.\s+(?=[A-ZÁÉÍÓÚÑ¿])/).map((x, k, a) => (k < a.length - 1 ? x + '.' : x));
    if (!m && parts.length < 3) return;
    const sec = document.createElement('div');
    sec.className = 'leccion';
    sec.innerHTML = (m ? `<h3>${cap(m[1])}</h3>` : '') +
      (parts.length > 1 ? '<ul>' + parts.map(x => `<li>${cap(x.replace(/^y\s+/, ''))}</li>`).join('') + '</ul>' : `<p>${body}</p>`);
    p.replaceWith(sec);
  });
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
