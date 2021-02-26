// pages/home/index.js
import { promisifyAll, promisify } from 'miniprogram-api-promise';
import { APP_NAME, storeCnsts } from '../../config/app-cnst';
import { helper, tools } from '@wecrpto/weaccount';
const { buildSignData, appendSignature } = require('../../utils/util');
//see https://github.com/demi520/wxapp-qrcode
const QR = require('../../libs/qrcode/weqrcode');
const canvasId = 'mycanvas';
const app = getApp();
const wxp = {};
promisifyAll(wx, wxp);
const ERR_CODES = {
  NO_WALLET: 'Did账号不存在',
  PWD_INCORRECT: '密码不正确',
  NEED_LOC_AUTH: '需要位置授权',
  SIGN_FAIL: '签名失败',
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    precheckLocationed: false,
    appTitle: APP_NAME,
    subtitle: '身份证号:',
    did: '',
    qrcodeTips: '身份证二维码被锁定请输入二维码解锁',
    opened: false,
    auth: '',
    imagePath: '',
    maskHidden: true,
    signJson: {},
    authError: '需要位置授权',
    hasLocationPermission: false,
    modalHide: true,
    openBtnDisabled: false,
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // const hasLocation = await this.checkLocationPermission.call(this);
    // this.setData({ hasLocationPermission: hasLocation });
    this.setData({ did: app.globalData[storeCnsts.DID_SKEY] || '' });
    const initQrcodeWhenOpen = async function (res) {
      console.log('Callback>>>>', this, res);
    };
    this.precheckLocation(initQrcodeWhenOpen);

    // 检查size
    const size = this.setCanvasSize();
    this.setData({ size: size });
  },
  /**
   * 加载时检查
   * @param {*} cb
   */
  precheckLocation(cb) {
    const that = this;
    if (!this.data.precheckLocationed) {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userLocation'] === undefined) {
            wx.authorize({
              scope: 'scope.userLocation',
              complete: function () {
                typeof cb === 'function' && cb.call(that, {});
              },
            });
          }
        },
      });
    } else {
      typeof cb === 'function' && cb.call(that, {});
    }
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
        success: (resLoc) => {
          if (typeof next === 'function') {
            next.call(that);
          }
        },
      });
    }
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
    console.log('>>>>>', globalData);
    if (globalData[storeCnsts.WALLET_V3_OKEY] && globalData[storeCnsts.KEYPAIR_OKEY]) {
      console.log(this.setData);
      // this.setData({ opened: true });
      // this.setData({modalHide:true})
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
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh>>>>>>>>>>' + new Date());
  },

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

  showQrcode: async function (did, keypair) {
    try {
      const locationData = await this.getLocation();

      const latitude = locationData.latitude;
      const longitude = locationData.longitude;

      const signData = buildSignData(did, latitude, longitude);
      const content = JSON.stringify(signData);
      const sig = helper.signMessage(content, keypair.secretKey);
      // const signature =
      const signedResult = appendSignature(signData, sig);
      console.log('Location>>>>', signData, sig, signedResult);

      this.setData({ opened: true });
    } catch (err) {
      // wx.lo
      this.setData({ opened: false });
      console.error('err', err);
    }
  },
  checkLocationAuth: async function () {
    const settings = await promisify(wx.getSetting)();
    console.log('>>>settings>>>>>>', settings.authSetting);
    let hasLocation = settings.authSetting['scope.userLocation'];
    // if (!settings.authSetting['scope.userInfo']) {
    //   const resd = await promisify(wx.getUserInfo)({});
    //   console.log('>>>>>>resd>>>>>>>>>', resd);
    // }
    // if (!hasLocation) {
    //   const res = await promisify(wx.openSetting)({ withSubscriptions: false });
    //   hasLocation = res.authSetting['scope.userLocation'];
    // }

    if (!hasLocation) {
      const locationData = await this.getLocation();
    }
    return hasLocation;
  },
  getUserInfoCallback: function (data) {
    console.log('getUserInfoCallback>>>', data);
  },
  getUserInfo: async function () {
    const settings = await promisify(wx.getSetting)();
  },
  checkUserAuth: function () {
    wx.getSetting({
      success: async (res) => {
        if (res.authSetting['scope.userInfo']) {
          try {
            const uRes = await wxp.getUserInfo({
              lang: 'en',
            });
            console.log('>>>>>>>>>>>>>>>', uRes);
            app.globalData.userInfo = uRes.userInfo;
          } catch (error) {
            wx.showToast({
              icon: 'error',
              title: '您取消了用户授权',
            });
          }
        }
      },
      fail: (e) => {},
    });
  },
  getLocation: async function () {
    try {
      return await promisify(wx.getLocation)({
        type: 'gcj02',
        altitude: false,
      });
    } catch (error) {
      throw new Error('Location auth fail');
    }
  },
  showModalHandle: async function () {
    try {
      const hasLocation = await this.checkLocationAuth();
      this.setData({ modalHide: !hasLocation });
    } catch (e) {
      console.log('ShowToast:', e);
    }
  },
  hideModalHandle() {
    console.log('>>>>>>>>>>>>>hideModalHandle>');
    this.setData({ modalHide: true });
  },
  setAuth(e) {
    this.data.auth = e.detail.value;
  },
  /**
   *
   * @param {*} e
   */
  openWalletHandle: async function (e) {
    try {
      const auth = this.data.auth;
      const latitude = this.data.latitude;
      const longitude = this.data.longitude;
      const qrcodeText = await this.builddrawQrcodeText(latitude, longitude, auth);
      // TODO Draw QRcode
      console.log('W>>>>>>>>', qrcodeText);
    } catch (e) {
      console.log('openWalletHandle>>>>>>>', e);
      // throw err;
      if (e && e.errCode) {
        wx.showToast({
          icon: 'error',
          title: ERR_CODES[e.errCode],
        });
      }
    }

    // try {
    //   const auth = this.data.auth;
    //   // console.log('OpenWallet Handle>>>>', e, auth);
    //   if (auth !== undefined && auth.trim().length > 0) {
    //     const wallet = wx.$webox.open(auth);
    //     app.globalData[storeCnsts.keypair] = wx.$webox.getKeypair();
    //     // const signData =
    //     console.log('Wallet>>>', wallet); //
    //     await this.showQrcode(wallet.did, wallet.key);
    //     //TODO creat Qrcode

    //     this.setData({ modalHide: true });
    //   }
    // } catch (e) {
    //   console.log('>>>>El>>>>', e.message);
    //   let msg = '密码不正确';
    //   if (e && e.message.startsWith('Location auth fail')) {
    //     msg = '需要位置授权';
    //   }
    //   wx.showToast({
    //     icon: 'error',
    //     title: msg,
    //   });
    // }
  },
  /**
   * catch Error
   */
  builddrawQrcodeText: async function (latitude, longitude, auth) {
    try {
      const webox = wx.$webox;
      const wallet = webox.open(auth);
      const did = wallet.did;
      this.setData({ did: did });

      const pk = wallet.key.secretKey;

      //build SignData
      const signData = buildSignData(did, latitude, longitude);

      const plaintext = JSON.stringify(signData);
      const signature = helper.signMessage(plaintext, pk);

      const qrcodeData = appendSignature(signData, signature);

      return JSON.stringify(qrcodeData);
    } catch (e) {
      console.log('builddrawQrcode>>>>', e);
      throw { errCode: 'PWD_INCORRECT' };
    }
  },
});
