import * as util from '../util';
function range(e, l, n, m, t) {
  const u = 'number' == typeof e.len,
    r = 'number' == typeof e.min,
    a = 'number' == typeof e.max,
    i = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  let s = l,
    f = null;
  const o = 'number' == typeof l,
    g = 'string' == typeof l,
    p = Array.isArray(l);
  if ((o ? (f = 'number') : g ? (f = 'string') : p && (f = 'array'), !f)) return !1;
  p && (s = l.length),
    g && (s = l.replace(i, '_').length),
    u
      ? s !== e.len && m.push(util.format(t.messages[f].len, e.fullField, e.len))
      : r && !a && s < e.min
      ? m.push(util.format(t.messages[f].min, e.fullField, e.min))
      : a && !r && s > e.max
      ? m.push(util.format(t.messages[f].max, e.fullField, e.max))
      : r &&
        a &&
        (s < e.min || s > e.max) &&
        m.push(util.format(t.messages[f].range, e.fullField, e.min, e.max));
}
export default range;
