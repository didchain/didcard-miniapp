import * as util from '../util';
const ENUM = 'enum';
function enumerable(e, u, n, m, r) {
  (e.enum = Array.isArray(e.enum) ? e.enum : []),
    -1 === e.enum.indexOf(u) &&
      m.push(util.format(r.messages.enum, e.fullField, e.enum.join(', ')));
}
export default enumerable;
