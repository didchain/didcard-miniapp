const isObj = (e) => {
    const t = typeof e;
    return null !== e && ('object' === t || 'function' === t);
  },
  getClassNames = (e) => ({
    enter: `l-${e}-enter l-${e}-enter-active l-enter-class l-enter-active-class`,
    'enter-to': `l-${e}-enter-to l-${e}-enter-active l-enter-to-class l-enter-active-class`,
    leave: `l-${e}-leave l-${e}-leave-active l-leave-class l-leave-active-class`,
    'leave-to': `l-${e}-leave-to l-${e}-leave-active l-leave-to-class l-leave-active-class`,
  }),
  nextTick = () => new Promise((e) => setTimeout(e, 1e3 / 30));
export default (e) =>
  Behavior({
    properties: {
      customStyle: String,
      show: { type: Boolean, value: e, observer: 'observeShow' },
      duration: { type: null, value: 300, observer: 'observeDuration' },
      name: { type: String, value: 'fade' },
    },
    data: { type: '', inited: !1, display: !1 },
    attached() {
      this.data.show && this.enter();
    },
    methods: {
      observeShow(e) {
        e ? this.enter() : this.leave();
      },
      enter() {
        const { duration: e, name: t } = this.data,
          s = getClassNames(t),
          a = isObj(e) ? e.enter : e;
        (this.status = 'enter'),
          this.triggerEvent('linbeforeenter'),
          Promise.resolve()
            .then(nextTick)
            .then(() => {
              this.checkStatus('enter'),
                this.triggerEvent('linenter'),
                this.setData({ inited: !0, display: !0, classes: s.enter, currentDuration: a });
            })
            .then(nextTick)
            .then(() => {
              this.checkStatus('enter'),
                (this.transitionEnded = !1),
                this.setData({ classes: s['enter-to'] });
            })
            .catch(() => {});
      },
      leave() {
        if (!this.data.display) return;
        const { duration: e, name: t } = this.data,
          s = getClassNames(t),
          a = isObj(e) ? e.leave : e;
        (this.status = 'leave'),
          this.triggerEvent('linbeforeleave'),
          Promise.resolve()
            .then(nextTick)
            .then(() => {
              this.checkStatus('leave'),
                this.triggerEvent('linleave'),
                this.setData({ classes: s.leave, currentDuration: a });
            })
            .then(nextTick)
            .then(() => {
              this.checkStatus('leave'),
                (this.transitionEnded = !1),
                setTimeout(() => this.onTransitionEnd(), a),
                this.setData({ classes: s['leave-to'] });
            })
            .catch(() => {});
      },
      checkStatus(e) {
        if (e !== this.status) throw new Error('incongruent status: ' + e);
      },
      onTransitionEnd() {
        if (this.transitionEnded) return;
        (this.transitionEnded = !0), this.triggerEvent('linafter' + this.status);
        const { show: e, display: t } = this.data;
        !e && t && this.setData({ display: !1 });
      },
    },
  });
