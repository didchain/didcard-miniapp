import * as util from '../util';
function whitespace(t, e, s, i, a) {
  (/^\s+$/.test(e) || '' === e) && i.push(util.format(a.messages.whitespace, t.fullField));
}
export default whitespace;
