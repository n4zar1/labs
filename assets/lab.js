// Shared lab engine: catalog, progress (per-browser), answer checking.
const LABS = [
  {id: 'dominio-falso', ic: '🎣', title: 'Caza el dominio falso', desc: 'Ocho enlaces de un banco ficticio. Algunos son legítimos y otros son trampas de phishing. ¿Los distingues?', level: 'Fácil', lvl: 'easy', mins: 5, video: 'El detalle que delata una web falsa'},
  {id: 'metadatos', ic: '📍', title: 'Lo que dice tu foto', desc: 'Analiza los metadatos EXIF de una foto publicada y descubre dónde, cuándo y con qué se hizo.', level: 'Fácil', lvl: 'easy', mins: 8, video: 'Tu foto dice dónde vives'},
  {id: 'quien-ha-entrado', ic: '🪟', title: '¿Quién ha entrado en el PC?', desc: 'Investiga el registro de seguridad de un Windows comprometido: el ataque, la entrada y la puerta trasera.', level: 'Medio', lvl: 'mid', mins: 15, video: '¿Alguien ha entrado en tu PC?'},
  {id: 'relleno-credenciales', ic: '🔓', title: 'Relleno de credenciales', desc: 'El registro de accesos de una tienda online muestra un ataque automatizado. Descubre qué cuentas cayeron.', level: 'Medio', lvl: 'mid', mins: 15, video: 'Tu contraseña está a la venta'},
];

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem('n4labs:' + k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem('n4labs:' + k, JSON.stringify(v)); } catch (e) {} },
};
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[“”"'`]/g, '').replace(/\s+/g, ' ').trim();
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function renderCatalog(el) {
  const solved = LABS.filter(l => store.get('done:' + l.id)).length;
  document.getElementById('pcount').textContent = `${solved} de ${LABS.length} completados`;
  document.getElementById('pbar').style.width = `${100 * solved / LABS.length}%`;
  el.innerHTML = LABS.map(l => `
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
    if (all) { store.set('done:' + id, true); document.getElementById('flag').textContent = flag; }
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
    if (ok) { state[i] = true; state['v' + i] = raw; store.set('state:' + id, state); fb.textContent = '✓ Correcto'; fb.className = 'fb good'; mark(i, true); }
    else { fb.textContent = t.wrong || '✗ No es eso. Revisa la evidencia (o abre la pista).'; fb.className = 'fb bad'; mark(i, false); }
    check();
  });
  document.getElementById('reset')?.addEventListener('click', () => {
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
