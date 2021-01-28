// pages/wcenter/ceator/index.js
const { storeCnsts } = require('../../../config/app-cnst');
const { pwdRules } = require('../../../config/validator-rules');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    password: null,
    confirm: null,
    passwordRules: pwdRules,
    confirmRules: [...pwdRules],
  },
  /** page methods begin */
  createSubmit(event) {
    if (!this.data.password || !this.data.confirm) {
      this.showErrorMsg('请输入密码');
      return;
    }
    if (this.data.password !== this.data.confirm) {
      this.showErrorMsg('俩次密码不一致');
      return;
    }

    const _this = this;
  },
  showErrorMsg(msg = '', duration = 2500) {
    wx.lin.showMessage({
      type: 'error',
      content: msg,
      duration: duration,
    });
  },
  feildInputed(evt) {
    const { currentTarget, detail } = evt;
    // console.log('input>>>>>', currentTarget, detail);
    const { id, dataset = {} } = currentTarget;
    if (typeof id === 'undefined') {
      return;
    }
    const key = dataset.model ? `${dataset.model}.${id}` : id;
    const val = detail.value || '';
    this.setData(
      {
        [key]: val,
      },
      () => {}
    );
  },
  /** page methods end */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.lin.initValidateForm(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!wx.getStorageSync(storeCnsts.INITIALIZED_BKEY)) {
      wx.hideHomeButton({
        success: (res) => {},
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
