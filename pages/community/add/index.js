// pages/community/add/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    commText: '',
  },

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
  onShow: function () {
    this.setData({ commText: '' });
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
  commTextInputHandle: function (e) {
    this.setData({ commText: e.detail.value });
  },
  addCommuntyHandle: function () {
    const text = this.data.commText;
    console.log('....', text);
    if (!text || !text.length) {
      wx.showToast({
        title: '请输入小区名称',
      });
      return;
    }
    const res = getApp().addCommunity(text);
    if (res) {
      wx.showToast({
        title: '添加成功',
        success: function () {
          wx.navigateBack({
            delta: res,
          });
        },
      });
    }
  },
});
