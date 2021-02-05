// pages/webview/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    basurl: 'https://wechat.baschain.cn/index.html',
    wxurl: 'https://mp.weixin.qq.com/',
  },
  /** Methods Begin */
  innerLoad(e) {},
  innerError(e) {},
  postMessage(e) {},
  /** Methods End */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const url = app.globalData.externalUrl;
    console.log('webViewUrl>>>>>>>>>>>>>>>>>>>>>>>>>>>>', options.webViewUrl, url);
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
