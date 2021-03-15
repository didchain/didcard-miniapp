import { LABELS } from '../../../config/app-cnst';
import QR from '../../../libs/qrcode/weqrcode';
import drawQrcode from '../../../libs/qrcode/weapp.qrcode.js';
import Log from '../../../libs/log/index';
const baseOpts = {
  canvas: null,
  canvasId: '',
  backgroud: '#ffffff',
  foreground: '#000000',
  text: '',
};

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
    var size = { w: 686, h: 686 };
    try {
      var res = wx.getSystemInfoSync();
      var scale = 375 / 686; //不同屏幕下canvas的适配比例；设计稿是750宽

      var width = 367 / scale;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
      Log.info('calc qr size:', width, res.windowWidth);
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
    // const size = this.setCanvasSize();
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
      // this.drawQrcode2D(jsonText);
      const size = this.setCanvasSize();
      QR.api.draw(jsonText, 'idcardQrcode', size.w, size.h, this, this.canvasToTempImage);
    }
  },
  drawQrcode2D: function (text) {
    const canvasId = 'didQr2D';
    const selector = '#' + canvasId;
    let opts = Object.assign({}, baseOpts, {
      text: text,
      width: 220,
      height: 220,
      canvasId: canvasId,
    });

    const query = wx.createSelectorQuery();
    // const cvas2d = query.select(selector);

    query
      .select(selector)
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        var canvas = res[0].node;
        opts.canvas = canvas;
        try {
          drawQrcode(
            {
              canvas: canvas,
              canvasId: canvasId,
              width: 200,
              padding: 20,
              background: '#ffffff',
              foreground: '#87d068',
              text: 'asdfsadfasdfdas',
            },
            true
          );
        } catch (err) {
          console.log('Qr>>>>>>>>>>>>>>>>>>>', err);
        }
      });
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
