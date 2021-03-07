import { LABELS, STORAGE_KEYS } from '../../../config/app-cnst';
import QR from '../../../libs/qrcode/weqrcode';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    did: '',
    imagePath: '',
    didLabel: LABELS.DID_LABEL,
  },
  setCanvasSize: function () {
    var size = { w: 215, h: 215 };
    try {
      var res = wx.getSystemInfoSync();
      var scale = 375 / 686; //不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log('获取设备信息失败' + e);
    }
    return size;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const size = this.setCanvasSize();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const safeWallet = wx.$webox.hasWallet() ? wx.$webox.getSafeWallet() : null;
    if (safeWallet) {
      this.setData({ did: safeWallet.did });
      const jsonText = wx.$webox.keyStoreJsonfy();
      const size = this.setCanvasSize();
      QR.api.draw(jsonText, 'idcardQrcode', size.w, size.h, this, this.canvasToTempImage);
    }
  },
  canvasToTempImage: function (canvasId) {
    const that = this;
    wx.canvasToTempFilePath(
      {
        canvasId: 'idcardQrcode',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({ imagePath: tempFilePath });
        },
        fail: function (e) {
          console.log(e);
        },
      },
      that
    );
  },

  previewImg: function (e) {
    const img = this.data.imagePath;
    wx.previewImage({
      current: img,
      urls: [img],
    });
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
  saveQrcodeHandle: function () {
    const that = this;
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: function (res) {
        console.log('res', res);
        const didKeystore = 'didKeystore';
        wx.saveImageToPhotosAlbum({
          filePath: that.data.imagePath,
          success: function () {
            wx.showToast({
              title: '保存成功',
            });
          },
        });
      },
      fail: function (e) {
        // console.log(e);
        wx.showToast({
          icon: 'error',
          title: '请前往设置授权',
        });
      },
    });
  },
});
