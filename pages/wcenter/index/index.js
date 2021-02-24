// pages/wcenter/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    fingerSupport: false,
    facialSupport: false,
  },
  /** Methods begin */
  gotoInternalUrl(event) {
    const { currentTarget = {} } = event;
    const url = currentTarget.dataset?.url || '';
    if (url) {
      wx.navigateTo({
        url,
        fail: (err) => console.log(err),
      });
    }
  },
  toggleFinger() {
    const nextState = !this.data.checked;
    this.setData({
      checked: nextState,
    });
  },
  gotoIDManager() {
    wx.navigateTo({
      url: '/pages/manager/index',
      fail: (err) => console.log(err),
    });
  },
  checkoutSoter() {
    wx.checkIsSupportSoterAuthentication({
      success: (result) => {
        console.log('>>>>>>', result);
      },
      fail: (err) => {
        console.log('err', err);
      },
    });
  },
  /** Methods end */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkoutSoter();
  },

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
