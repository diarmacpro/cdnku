function sha256(dt, c) {
  if (typeof dt === 'object') { dt = JSON.stringify(dt); }
  const dtBf = new TextEncoder().encode(dt);
  crypto.subtle.digest('SHA-256', dtBf)
    .then(hBf => {
      const h = Array.from(new Uint8Array(hBf));
      const r = h.map(b => b.toString(16).padStart(2, '0')).join('');
      c(null, r);
    })
    .catch(e => {
      c(e, null);
    });
}


const stm = (f = '') => {
  const now = new Date();
  const opt = {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  const fDt = now.toLocaleString('sv-SE', opt).replace(/[/]/g, '-').replace(',', '');

  const ms = now.getMilliseconds().toString().padStart(3, '0');

  if (f === 't') {
    return fDt.split(' ')[0];
  } else if (f === 'w') {
    return fDt.split(' ')[1];
  } else if (f === 'w2') {
    const r = fDt.split(' ')[1].split(':');
    return `${r[0]}:${r[1]}`;
  } else if (f === 'tms') {
    return `${fDt}.${ms}`;
  } else {
    return fDt;
  }
};

function pR(apiUrl, payload = {}, callback) {
  axios.post(apiUrl, payload)
  .then(response => {
    const result = {
      data: response.data,
      time: new Date().toISOString()
    };
    callback(null, result);
  })
  .catch(error => {
    const err = {
      error: error.message || 'Unknown error',
      time: new Date().toISOString()
    };
    callback(err, null);
  });
}

function rld(u){
  window.location.replace(u);
}

function gtQrl(p) {
  const q = new URLSearchParams(window.location.search);
  if (!p) return Object.fromEntries(q.entries());
  if (Array.isArray(p)) return p.reduce((a, x) => ({ ...a, [x]: q.get(x) }), {});
  return q.get(p);
}

function stQrl(p, v) {
  const u = new URL(window.location.href);
  if (!p) {
    u.search = '';
  } else if (Array.isArray(p)) {
    p.forEach(([k, val]) => u.searchParams.set(k, val));
  } else {
    u.searchParams.set(p, v);
  }
  window.history.pushState({}, '', u);
}

function dlQrl(k) {
  const u = new URL(window.location.href);
  if (!k) {
    u.search = '';
  } else if (Array.isArray(k)) {
    k.forEach((x) => u.searchParams.delete(x));
  } else {
    u.searchParams.delete(k);
  }
  window.history.replaceState({}, '', u);
}

function aQrl() {
  const query = new URLSearchParams(window.location.search);
  return query.toString() !== '';
}
