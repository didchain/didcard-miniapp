import rules from '../rule/index.js';
import { isEmptyValue } from '../util';
function integer(e, r, i, u, t) {
  const l = [];
  if (e.required || (!e.required && u.hasOwnProperty(e.field))) {
    if (isEmptyValue(r) && !e.required) return i();
    rules.required(e, r, u, l, t),
      void 0 !== r && (rules.type(e, r, u, l, t), rules.range(e, r, u, l, t));
  }
  i(l);
}
export default integer;
