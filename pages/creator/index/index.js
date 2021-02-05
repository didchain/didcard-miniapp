// pages/creator/index/index.js
const { storeCnsts } = require('../../../config/app-cnst');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    scanKeystore: null,
  },
  /** Method begin */
  gotoGenerator() {
    wx.navigateTo({
      url: '/pages/creator/generator/index',
    });
  },
  gotoHome() {
    wx.switchTab({
      url: '/pages/home/index',
    });
  },
  scanHandle() {
    const _that = this;
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode', 'qrCode'],
      success(res) {
        try {
          console.log('>>>>>>>>>>>>>>', res.result);
          const keystore = JSON.parse(res.result);
          _that.setData({ scanKeystore: keystore });
        } catch (err) {
          wx.showToast({
            title: '二维码格式不正确',
            duration: 3000,
          });
        }
      },
    });
  },
  importHandle() {
    // TODO set
    try {
      wx.setStorageSync(storeCnsts.SHORT_SECRET_OKEY, {
        enshort: this.data.password,
        entype: 'base64',
      });
      wx.setStorageSync(storeCnsts.INITIALIZED_BKEY, true);
      wx.setStorageSync(storeCnsts.WALLET_ADDR_SKEY, '0x232BD76e2adcff8825C');
      wx.lin.showMessage({
        type: 'success',
        content: '创建成功',
        duration: 1000,
        success() {
          wx.switchTab({
            url: '/pages/home/index',
          });
        },
      });
    } catch (err) {
      console.log(err);
      this.showErrorMsg('创建失败', 3000);
    }
  },
  showErrorMsg(msg = '', duration = 2500) {
    wx.lin.showMessage({
      type: 'error',
      content: msg,
      duration: duration,
    });
  },
  /** Method End */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
