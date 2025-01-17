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


function chk(str, chunkSize) {
  const result = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    result.push(str.slice(i, i + chunkSize));
  }
  return result;
}

function sKyEnc(v){
  const dtX = v.split('.');
  const dtY = JSON.parse(atob(dtX[1]));
  return btoa(`${dtY.ref}!${dtY.iat}${dtY.exp}!${dtX[2]}`).replace(/=/g, '')
}

function sKyDec(uB) {
  const uC = atob(uB).split('!');
  const uD = chk(uC[1], 10);
  const aA = { "alg": "HS256", "typ": "JWT" };
  const aB = { "iss": "supabase", "ref": uC[0], "role": "anon", "iat": parseInt(uD[0]), "exp": parseInt(uD[1]) };
  const bA = btoa(JSON.stringify(aA)).replace(/=/g, '');
  const bB = btoa(JSON.stringify(aB)).replace(/=/g, '');
  const bC = `${bA}.${bB}.${uC[2]}`;
  const bD = `https://${uC[0]}.supabase.co`;
  const bE = [bD, bC];

  return bE;
}
