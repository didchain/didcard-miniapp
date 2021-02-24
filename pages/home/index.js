// pages/home/index.js
import { APP_NAME } from '../../config/app-cnst';
//see https://github.com/demi520/wxapp-qrcode
const QR = require('../../libs/qrcode/weqrcode');
const canvasId = 'mycanvas';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    appTitle: APP_NAME,
    subtitle: '身份证号:',
    did: '',
    qrcodeTips: '身份证二维码被锁定请输入二维码解锁',
    opened: false,
    imagePath: '',
    maskHidden: true,
    signJson: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
    // this.setData({ appTitle: APP_NAME });

    this.initPageData();

    // this.initPageData();
  },

  initPageData: function () {
    let size = this.setCanvasSize();
    const safeWallet = wx.$webox.getSafeWallet();
    console.log('>>>>>>>', size, safeWallet);
    if (safeWallet) {
      this.setData({ opened: true });
      this.setData({ did: safeWallet.did });
      const jsonContent = JSON.stringify(safeWallet) || '';
      this.createQrCode(jsonContent, size.w, size.h);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initPageData();
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
  /** Method Begin */
  //自适应屏幕
  setCanvasSize() {
    var size = {
      w: 488,
      h: 488,
    };
    try {
      var res = wx.getSystemInfoSync();
      var scale = 375 / 343; //不同屏幕下canvas的适配比例；设计稿是750宽
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
  createQrCode: function (content, w, h) {
    // console.log('>>>>>>>content>>>>>>>', content);
    QR.api.draw(content, 'mycanvas', w, h, this, this.canvasToTempImage);
  },
  canvasToTempImage: function () {
    const that = this;
    // console.log('canvasToTempImage', that);

    wx.canvasToTempFilePath(
      {
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          // console.log(tempFilePath);
          that.setData({ imagePath: tempFilePath });
        },
        fail: function (res) {
          console.log('fail', res);
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
});
