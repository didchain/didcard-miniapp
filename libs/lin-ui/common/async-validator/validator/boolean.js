import { isEmptyValue } from '../util';
import rules from '../rule/index.js';
function boolean(e, r, i, u, o) {
  const t = [];
  if (e.required || (!e.required && u.hasOwnProperty(e.field))) {
    if (isEmptyValue(r) && !e.required) return i();
    rules.required(e, r, u, t, o), void 0 !== r && rules.type(e, r, u, t, o);
  }
  i(t);
}
export default boolean;
