import { format, complementError, asyncMap, warning, deepMerge } from './util.js';
import validators from './validator/index.js';
import { messages as defaultMessages, newMessages } from './messages.js';
function Schema(e) {
  (this.rules = null), (this._messages = defaultMessages), this.define(e);
}
(Schema.prototype = {
  messages(e) {
    return e && (this._messages = deepMerge(newMessages(), e)), this._messages;
  },
  define(e) {
    if (!e) throw new Error('Cannot configure a schema with no rules');
    if ('object' != typeof e || Array.isArray(e)) throw new Error('Rules must be an object');
    let t, s;
    for (t in ((this.rules = {}), e))
      e.hasOwnProperty(t) && ((s = e[t]), (this.rules[t] = Array.isArray(s) ? s : [s]));
  },
  validate(e, t = {}, s) {
    let r,
      a,
      o = e,
      i = t,
      n = s;
    if (
      ('function' == typeof i && ((n = i), (i = {})),
      !this.rules || 0 === Object.keys(this.rules).length)
    )
      return void (n && n());
    if (i.messages) {
      let e = this.messages();
      e === defaultMessages && (e = newMessages()), deepMerge(e, i.messages), (i.messages = e);
    } else i.messages = this.messages();
    const l = {};
    (i.keys || Object.keys(this.rules)).forEach((t) => {
      (r = this.rules[t]),
        (a = o[t]),
        r.forEach((s) => {
          let r = s;
          'function' == typeof r.transform &&
            (o === e && (o = { ...o }), (a = o[t] = r.transform(a))),
            (r = 'function' == typeof r ? { validator: r } : { ...r }),
            (r.validator = this.getValidationMethod(r)),
            (r.field = t),
            (r.fullField = r.fullField || t),
            (r.type = this.getType(r)),
            r.validator &&
              ((l[t] = l[t] || []), l[t].push({ rule: r, value: a, source: o, field: t }));
        });
    });
    const f = {};
    asyncMap(
      l,
      i,
      (e, t) => {
        const s = e.rule;
        let r = !(
          ('object' !== s.type && 'array' !== s.type) ||
          ('object' != typeof s.fields && 'object' != typeof s.defaultField)
        );
        function a(e, t) {
          return { ...t, fullField: `${s.fullField}.${e}` };
        }
        function o(o = []) {
          let n = o;
          if (
            (Array.isArray(n) || (n = [n]),
            n.length && warning('async-validator:', n),
            n.length && s.message && (n = [].concat(s.message)),
            (n = n.map(complementError(s))),
            i.first && n.length)
          )
            return (f[s.field] = 1), t(n);
          if (r) {
            if (s.required && !e.value)
              return (
                (n = s.message
                  ? [].concat(s.message).map(complementError(s))
                  : i.error
                  ? [i.error(s, format(i.messages.required, s.field))]
                  : []),
                t(n)
              );
            let r = {};
            if (s.defaultField)
              for (const t in e.value) e.value.hasOwnProperty(t) && (r[t] = s.defaultField);
            r = { ...r, ...e.rule.fields };
            for (const e in r)
              if (r.hasOwnProperty(e)) {
                const t = Array.isArray(r[e]) ? r[e] : [r[e]];
                r[e] = t.map(a.bind(null, e));
              }
            const o = new Schema(r);
            o.messages(i.messages),
              e.rule.options &&
                ((e.rule.options.messages = i.messages), (e.rule.options.error = i.error)),
              o.validate(e.value, e.rule.options || i, (e) => {
                t(e && e.length ? n.concat(e) : e);
              });
          } else t(n);
        }
        (r = r && (s.required || (!s.required && e.value))), (s.field = e.field);
        const n = s.validator(s, e.value, o, e.source, i);
        n &&
          n.then &&
          n.then(
            () => o(),
            (e) => o(e)
          );
      },
      (e) => {
        !(function (e) {
          let t,
            s,
            r = [],
            a = {};
          for (t = 0; t < e.length; t++)
            (o = e[t]), Array.isArray(o) ? (r = r.concat.apply(r, o)) : r.push(o);
          var o;
          if (r.length)
            for (t = 0; t < r.length; t++) (s = r[t].field), (a[s] = a[s] || []), a[s].push(r[t]);
          else (r = null), (a = null);
          n(r, a);
        })(e);
      }
    );
  },
  getType(e) {
    if (
      (void 0 === e.type && e.pattern instanceof RegExp && (e.type = 'pattern'),
      'function' != typeof e.validator && e.type && !validators.hasOwnProperty(e.type))
    )
      throw new Error(format('Unknown rule type %s', e.type));
    return e.type || 'string';
  },
  getValidationMethod(e) {
    if ('function' == typeof e.validator) return e.validator;
    const t = Object.keys(e),
      s = t.indexOf('message');
    return (
      -1 !== s && t.splice(s, 1),
      1 === t.length && 'required' === t[0]
        ? validators.required
        : validators[this.getType(e)] || !1
    );
  },
}),
  (Schema.register = function (e, t) {
    if ('function' != typeof t)
      throw new Error('Cannot register a validator by type, validator is not a function');
    validators[e] = t;
  }),
  (Schema.messages = defaultMessages);
export default Schema;
