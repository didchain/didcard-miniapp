// pages/widgets/vbtn-bar/comp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    label: {
      type: 'String',
      value: '',
    },
    vtype: {
      type: 'String',
      value: 'navigateTo',
    },
    vurl: {
      type: 'String',
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    tapaction: function (e) {
      const { vUrl, vType } = e.currentTarget.dataset;
      if (vUrl && wx[vType]) {
        wx[vType]({ url: vUrl });
      }
    },
  },
});
