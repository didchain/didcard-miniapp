// pages/home/index.js
import { promisifyAll, promisify } from 'miniprogram-api-promise';
import { APP_NAME, storeCnsts } from '../../config/app-cnst';
const { buildSignData, appendSignature } = require('../../utils/util');
//see https://github.com/demi520/wxapp-qrcode
const QR = require('../../libs/qrcode/weqrcode');
const canvasId = 'mycanvas';
const app = getApp();
const wxp = {};
promisifyAll(wx, wxp);
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
    authError: '需要位置授权',
    hasLocationPermission: false,
    modalHide: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const that = this;
    const hasLocation = await this.checkLocationPermission.call(this);
    this.setData({ hasLocationPermission: hasLocation });
    this.setData({ did: app.globalData[storeCnsts.DID_SKEY] || '' });
  },
  checkLocationPermission: async () => {
    try {
      const setDataRes = await wxp.getSetting({});
      return Boolean(setDataRes.authSetting['scope.userLocation']);
    } catch (e) {
      console.log('checkLocationPermission fail', e);
      return false;
    }
  },

  initPageData: () => {
    const keypair = app.globalData[storeCnsts.KEYPAIR_OKEY];
    console.log('key', keypair);
    // if (!!keypair) {
    //   this.setData({ opened: true });
    //   const locationData = this.getLocation();
    //   console.log('locationData>>>>>', locationData);
    //   //TODO create qrcode
    //   // this.createNewQrcode(keypair);
    // }
    // const locationData = this.getLocation();
    // console.log('locationData>>>>>', locationData);
    // this.createNewQrcode(keypair);
    // let size = this.setCanvasSize();
    // const safeWallet = wx.$webox.getSafeWallet();
    // // console.log('>>>>>>>', size, safeWallet);
    // if (safeWallet) {
    //   this.setData({ opened: true });
    //   this.setData({ did: safeWallet.did });
    //   const jsonContent = JSON.stringify(safeWallet) || '';
    //   this.createQrCode(jsonContent, size.w, size.h);
    // }
  },
  checkAuth: async (next) => {
    const settingData = await wxp.getSetting({});
    if (!settingData.authSetting || !settingData.authSetting['scope.userLocation']) {
      const that = this;
      wx.authorize({
        scope: 'scope.userLocation',
        success: () => {
          if (typeof next === 'function') {
            next.call(that);
          }
        },
      });
    }
  },
  getLocation: async () => {
    console.log('setData>>>>>', setData);

    return await promisify(wx.getLocation)({
      type: 'gcj02',
      altitude: false,
    });
  },
  createNewQrcode: async function (keypair) {
    const safeWallet = app.globalData[storeCnsts.WALLET_V3_OKEY];
    const did = app.globalData[storeCnsts.DID_SKEY];

    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: (res) => {
        console.log('locations>>>>', res);
        const latitude = res.latitude;
        const longitude = res.longitude;
      },
      fail: (e) => {
        console.log('location fail:', e);
      },
    });
    const signData = buildSignData(did, latitude, longitude);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    this.setData({ did: app.globalData[storeCnsts.DID_SKEY] || '' });
    // console.log(this.setData({ opened: true }));
    //check wallet Open
    const globalData = app.globalData;
    if (globalData[storeCnsts.WALLET_V3_OKEY] && globalData[storeCnsts.KEYPAIR_OKEY]) {
      console.log(this.setData);
      this.setData({ opened: true });
      //TODO qrcode
    } else {
      this.setData({ opened: false });
    }
  },

  validOpen() {},
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
  openWalletHandle: () => {
    console.log('OpenWallet Handle>>>>');
  },
  showModalHandle() {
    this.setData({ modalHide: false });
  },
  hideModalHandle() {
    console.log('>>>>>>>>>>>>>hideModalHandle>');
    this.setData({ modalHide: true });
  },
});
