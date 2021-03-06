export default Behavior({
  behaviors: [],
  properties: {},
  data: { distance: 0 },
  attached() {
    this.offsetMargin();
  },
  methods: {
    offsetMargin() {
      const { windowHeight: t, screenHeight: e } = wx.getSystemInfoSync();
      this.setData({ distance: e - t });
    },
  },
});
