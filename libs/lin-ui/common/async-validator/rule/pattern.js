import * as util from '../util';
function pattern(t, e, a, p, n) {
  if (t.pattern)
    if (t.pattern instanceof RegExp)
      (t.pattern.lastIndex = 0),
        t.pattern.test(e) ||
          p.push(util.format(n.messages.pattern.mismatch, t.fullField, e, t.pattern));
    else if ('string' == typeof t.pattern) {
      new RegExp(t.pattern.replace(/^\/|\/$/g, '')).test(e) ||
        p.push(util.format(n.messages.pattern.mismatch, t.fullField, e, t.pattern));
    }
}
export default pattern;
