// pages/scan/scan.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false,
    scaned: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.scanHandle();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('>>>>>>>>>>>>>>', typeof this.getTabBar);
    this.getTabBar();
    // this.scanHandle();
  },
  scanHandle: async function () {
    if (this.data.scaned) {
      return;
    }
    getApp().globalData.tmpScanData = '';
    const that = this;
    setTimeout(() => {
      wx.scanCode({
        onlyFromCamera: true,
        success: function (res) {
          console.log('Scan res:', res);
          that.setData({ scaned: true });
          getApp().globalData.tmpScanData = res.result;
          wx.navigateTo({
            url: '/pages/scan/scanok/index',
          });
          that.onHide();
        },
        fail: function () {},
        complete: function () {
          that.setData({ scaned: true });
        },
      });
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ scaned: false });
  },

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
