// pages/home/index.js
import { APP_NAME } from '../../config/app-cnst';
import drawQrcode from '../../libs/qrcode/weapp.qrcode.js';
import QrCode from '../../libs/qrcode/weqrcode';
const qrOpts = {
  width: 200,
  height: 200,
  canvasId: 'signatureQrcode',
  typeNumber: 8,
  correctLevel: 3,
  callback(e) {
    // console.log(e);
  },
  image: {
    imageResource: '../../images/icons/logo_center.png',
    dx: 70,
    dy: 70,
    dWidth: 60,
    dHeight: 60,
  },
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    appTitle: APP_NAME,
    subtitle: '身份证号:',
    did: '',
    qrcodeTips: '身份证二维码被锁定请输入二维码解锁',
    opened: true,
    signJson: {
      did: '',
    },
  },
  /** Method Begin */
  draw(signText) {
    const text = signText || JSON.stringify(this.data.signJson);
    const options = Object.assign({}, qrOpts, { text: text });
    console.log('draw Qrcode');
    drawQrcode(options);
  },
  drawQr(signText) {
    let qrinst = new QrCode('signatureQrcode', Object.assign({}, qrOpts, { text: signText }));
    console.log(qrinst);
  },
  initPageData() {
    this.setData({ appTitle: APP_NAME });
    const safeWallet = wx.$webox.getSafeWallet();
    if (safeWallet) {
      this.setData({ did: safeWallet.did });
      const text = JSON.stringify(safeWallet.did);
      console.log('json', text);
      this.draw(text);
      // this.drawQr(text);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.initPageData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('Home show');
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
});
