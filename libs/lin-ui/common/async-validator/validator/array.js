import rules from '../rule/index.js';
import { isEmptyValue } from '../util';
function array(r, e, a, u, i) {
  const t = [];
  if (r.required || (!r.required && u.hasOwnProperty(r.field))) {
    if (isEmptyValue(e, 'array') && !r.required) return a();
    rules.required(r, e, u, t, i, 'array'),
      isEmptyValue(e, 'array') || (rules.type(r, e, u, t, i), rules.range(r, e, u, t, i));
  }
  a(t);
}
export default array;
