const formatRegExp = /%[sdj%]/g;
export let warning = () => {};
export function format(...t) {
  let e = 1;
  const r = t[0],
    n = t.length;
  if ('function' == typeof r) return r.apply(null, t.slice(1));
  if ('string' == typeof r) {
    let i = String(r).replace(formatRegExp, (r) => {
      if ('%%' === r) return '%';
      if (e >= n) return r;
      switch (r) {
        case '%s':
          return String(t[e++]);
        case '%d':
          return Number(t[e++]);
        case '%j':
          try {
            return JSON.stringify(t[e++]);
          } catch (t) {
            return '[Circular]';
          }
        default:
          return r;
      }
    });
    for (let r = t[e]; e < n; r = t[++e]) i += ' ' + r;
    return i;
  }
  return r;
}
function isNativeStringType(t) {
  return 'string' === t || 'url' === t || 'hex' === t || 'email' === t || 'pattern' === t;
}
export function isEmptyValue(t, e) {
  return (
    null == t ||
    !('array' !== e || !Array.isArray(t) || t.length) ||
    !(!isNativeStringType(e) || 'string' != typeof t || t)
  );
}
export function isEmptyObject(t) {
  return 0 === Object.keys(t).length;
}
function asyncParallelArray(t, e, r) {
  const n = [];
  let i = 0;
  const l = t.length;
  function a(t) {
    n.push.apply(n, t), i++, i === l && r(n);
  }
  t.forEach((t) => {
    e(t, a);
  });
}
function asyncSerialArray(t, e, r) {
  let n = 0;
  const i = t.length;
  !(function l(a) {
    if (a && a.length) return void r(a);
    const c = n;
    (n += 1), c < i ? e(t[c], l) : r([]);
  })([]);
}
function flattenObjArr(t) {
  const e = [];
  return (
    Object.keys(t).forEach((r) => {
      e.push.apply(e, t[r]);
    }),
    e
  );
}
export function asyncMap(t, e, r, n) {
  if (e.first) {
    return asyncSerialArray(flattenObjArr(t), r, n);
  }
  let i = e.firstFields || [];
  !0 === i && (i = Object.keys(t));
  const l = Object.keys(t),
    a = l.length;
  let c = 0;
  const o = [],
    s = (t) => {
      o.push.apply(o, t), c++, c === a && n(o);
    };
  l.forEach((e) => {
    const n = t[e];
    -1 !== i.indexOf(e) ? asyncSerialArray(n, r, s) : asyncParallelArray(n, r, s);
  });
}
export function complementError(t) {
  return (e) =>
    e && e.message
      ? ((e.field = e.field || t.fullField), e)
      : { message: e, field: e.field || t.fullField };
}
export function deepMerge(t, e) {
  if (e)
    for (const r in e)
      if (e.hasOwnProperty(r)) {
        const n = e[r];
        'object' == typeof n && 'object' == typeof t[r] ? (t[r] = { ...t[r], ...n }) : (t[r] = n);
      }
  return t;
}
