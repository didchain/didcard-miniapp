import rules from '../rule/index.js';
function required(r, e, u, i, o) {
  const t = [],
    a = Array.isArray(e) ? 'array' : typeof e;
  rules.required(r, e, i, t, o, a), u(t);
}
export default required;
