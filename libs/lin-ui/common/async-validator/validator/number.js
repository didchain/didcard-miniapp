import rules from '../rule/index.js';
import { isEmptyValue } from '../util';
function number(e, r, u, i, t) {
  const l = [];
  if (e.required || (!e.required && i.hasOwnProperty(e.field))) {
    if (isEmptyValue(r) && !e.required) return u();
    rules.required(e, r, i, l, t),
      void 0 !== r && (rules.type(e, r, i, l, t), rules.range(e, r, i, l, t));
  }
  u(l);
}
export default number;
