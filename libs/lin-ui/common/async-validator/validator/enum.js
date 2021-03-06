import rules from '../rule/index.js';
import { isEmptyValue } from '../util';
const ENUM = 'enum';
function enumerable(e, r, u, i, t) {
  const l = [];
  if (e.required || (!e.required && i.hasOwnProperty(e.field))) {
    if (isEmptyValue(r) && !e.required) return u();
    rules.required(e, r, i, l, t), r && rules.enum(e, r, i, l, t);
  }
  u(l);
}
export default enumerable;
