import rules from '../rule/index.js';
import { isEmptyValue } from '../util';
function pattern(r, e, t, i, u) {
  const n = [];
  if (r.required || (!r.required && i.hasOwnProperty(r.field))) {
    if (isEmptyValue(e, 'string') && !r.required) return t();
    rules.required(r, e, i, n, u), isEmptyValue(e, 'string') || rules.pattern(r, e, i, n, u);
  }
  t(n);
}
export default pattern;
