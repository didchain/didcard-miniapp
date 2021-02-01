import * as util from '../util';
import required from './required';
const pattern = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    url: new RegExp(
      '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
      'i'
    ),
    hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,
  },
  types = {
    integer: (e) => types.number(e) && parseInt(e, 10) === e,
    float: (e) => types.number(e) && !types.integer(e),
    array: (e) => Array.isArray(e),
    regexp(e) {
      if (e instanceof RegExp) return !0;
      try {
        return !!new RegExp(e);
      } catch (e) {
        return !1;
      }
    },
    date: (e) => 'function' == typeof e.getTime && 'function' == typeof e.getMonth && 'function' == typeof e.getYear,
    number: (e) => !isNaN(e) && '' !== e,
    object: (e) => 'object' == typeof e && !types.array(e),
    method: (e) => 'function' == typeof e,
    email: (e) => 'string' == typeof e && !!e.match(pattern.email) && e.length < 255,
    url: (e) => 'string' == typeof e && !!e.match(pattern.url),
    hex: (e) => 'string' == typeof e && !!e.match(pattern.hex),
  };
function type(e, t, r, a, f) {
  if (e.required && void 0 === t) return void required(e, t, r, a, f);
  const p = e.type;
  ['integer', 'float', 'array', 'regexp', 'object', 'method', 'email', 'number', 'date', 'url', 'hex'].indexOf(p) > -1
    ? types[p](t) || a.push(util.format(f.messages.types[p], e.fullField, e.type))
    : p && typeof t !== e.type && a.push(util.format(f.messages.types[p], e.fullField, e.type));
}
export default type;
