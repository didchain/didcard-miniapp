export default Behavior({
  behaviors: [],
  properties: {
    time: {
      type: Date,
      value: new Date().getTime() + 864e5,
      observer: function (t, e) {
        t && !e && this.getLatestTime();
      },
    },
    status: {
      type: Boolean,
      value: !0,
      observer: function (t) {
        t ? this.init() : t || clearInterval(this.data.timer);
      },
    },
    timeType: { type: String, value: 'datetime' },
    format: { type: String, value: '{%d}天{%h}时{%m}分{%s}秒' },
    isZeroPadd: { type: Boolean, value: !0 },
    countdownType: { type: String, value: 'normal' },
    isClearInterval: { type: Boolean, value: !0 },
  },
  data: { initAddTime: 0, timer: null, date: [] },
  ready: function () {
    this.getLatestTime();
  },
  detached: function () {
    this.data.isClearInterval && clearInterval(this.data.timer);
  },
  pageLifetimes: {
    hide() {
      this.data.isClearInterval && clearInterval(this.data.timer);
    },
    show() {
      this.data.isClearInterval && this.getLatestTime();
    },
  },
  methods: {
    zeroPadding: (t) => ((t = t.toString())[1] ? t : '0' + t),
    init() {
      clearInterval(this.data.timer);
      const t = setTimeout(() => {
        this.getLatestTime.call(this);
      }, 1e3);
      this.setData({ timer: t });
    },
    getLatestTime() {
      let { time: t, status: e, timeType: i, initAddTime: a, countdownType: n } = this.data,
        s = t;
      if ('normal' === n) {
        if (
          ('second' !== i &&
            ((s = 'string' == typeof t ? s.replace(/-/g, '/') : s),
            (s = Math.ceil((new Date(s).getTime() - new Date().getTime()) / 1e3))),
          s < 0 && 'second' !== i)
        )
          return this._getTimeValue(0), void this.CountdownEnd();
        s - a > 0
          ? this.getLatestForCountDown(s)
          : s - a < 0
          ? this.getLatestForAddTime(s)
          : s - a == 0 && (a <= 0 && this._getTimeValue(s), this.CountdownEnd()),
          e && s - a != 0 && this.init.call(this);
      } else
        'anniversary' === n
          ? 'second' === i
            ? console.error(`countdownType为${n}类型时，不可设置timeType值为second`)
            : ((s = 'string' == typeof t ? s.replace(/-/g, '/') : s),
              (s = Math.ceil((new Date().getTime() - new Date(s).getTime()) / 1e3)),
              s >= 0
                ? (this.getLatestForCountDown(s), this.init.call(this))
                : console.error('time传值错误'))
          : console.error('错误的countdownType类型');
    },
    getLatestForAddTime(t) {
      let { initAddTime: e } = this.data;
      e !== Math.abs(t) && (e++, this._getTimeValue(e), this.setData({ initAddTime: e }));
    },
    getLatestForCountDown(t) {
      this._getTimeValue(t),
        this.setData({ time: 'second' === this.data.timeType ? --t : this.data.time });
    },
    _getTimeValue(t) {
      const { format: e } = this.data,
        i = [],
        a = e.split(/(\{.*?\})/);
      let n = t;
      return (
        [
          { key: '{%d}', type: 'day', count: 86400 },
          { key: '{%h}', type: 'hour', count: 3600 },
          { key: '{%m}', type: 'minute', count: 60 },
          { key: '{%s}', type: 'second', count: 1 },
        ].forEach((t) => {
          const e = this._findTimeName(a, t.key);
          if (-1 === e) return;
          const s = a[e],
            o = { type: t.type, name: s, value: parseInt(n / t.count) };
          this.data.isZeroPadd && (o.value = this.zeroPadding(o.value)), (n %= t.count), i.push(o);
        }),
        this.setData({ date: i }),
        i
      );
    },
    _findTimeName(t, e) {
      const i = t.indexOf(e);
      return -1 === i ? -1 : i + 1;
    },
    CountdownEnd() {
      this.triggerEvent('linend', {});
    },
  },
});
