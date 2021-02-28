// pages/creator/backup/backup.js
const QR = require('../../../libs/qrcode/weqrcode');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imagePath: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /** Methods begin */
  backupHandle() {
    const that = this;

    this.fillCanvas();
    wx.getSetting({
      withSubscriptions: false,
      success: function (res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function () {
              that.saveQrTempImageAction();
            },
            fail: function () {
              wx.openSetting({
                withSubscriptions: false,
                success: function (res) {
                  console.log('Res>>>>>>>>>>>>>>>>>>>>>>>>>', res);
                },
              });
            },
          });
        } else {
          that.saveQrTempImageAction();
        }
      },
    });

    //todo save
    // wx.lin.showMessage({
    //   show: true,
    //   content: '保存成功',
    //   type: 'success',
    //   duration: 1000,
    //   mask: true,
    //   success: () => {
    //     wx.switchTab({
    //       url: '/pages/home/index',
    //     });
    //   },
    // });
  },
  saveQrTempImageAction: function () {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath,
      success: function () {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
          complete: function () {
            wx.switchTab({
              url: '/pages/home/index',
            });
          },
        });
      },
    });
  },
  navtoHome() {
    wx.switchTab({
      url: '/pages/home/index',
    });
  },
  /** Methods end */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.fillCanvas();
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
  fillCanvas: function () {
    const that = this;
    const webox = wx.$webox;
    if (webox.hasWallet()) {
      const jsonText = webox.keyStoreJsonfy();
      QR.api.draw(jsonText, 'expDidCanvas', 500, 500, that, that.canvasToTempImage);
    } else {
      throw { errCode: 'GET_WALLET_FAIL' };
    }
  },
  canvasToTempImage: function () {
    const that = this;
    wx.canvasToTempFilePath({
      canvasId: 'expDidCanvas',
      success: function (res) {
        that.setData({ imagePath: res.tempFilePath });
      },
      fail: function (res) {
        console.log('fail', res);
      },
    });
  },
});
