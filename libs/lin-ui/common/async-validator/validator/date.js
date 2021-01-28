import rules from '../rule/index.js';
import { isEmptyValue } from '../util';
function date(e, r, t, i, u) {
  const l = [];
  if (e.required || (!e.required && i.hasOwnProperty(e.field))) {
    if (isEmptyValue(r) && !e.required) return t();
    if ((rules.required(e, r, i, l, u), !isEmptyValue(r))) {
      let t;
      (t = 'number' == typeof r ? new Date(r) : r),
        rules.type(e, t, i, l, u),
        t && rules.range(e, t.getTime(), i, l, u);
    }
  }
  t(l);
}
export default date;
