import rules from '../rule/index.js';
import { isEmptyValue } from '../util';
function type(e, r, t, i, u) {
  const p = e.type,
    l = [];
  if (e.required || (!e.required && i.hasOwnProperty(e.field))) {
    if (isEmptyValue(r, p) && !e.required) return t();
    rules.required(e, r, i, l, u, p), isEmptyValue(r, p) || rules.type(e, r, i, l, u);
  }
  t(l);
}
export default type;
