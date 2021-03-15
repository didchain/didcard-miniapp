// pages/home/index.js
import { promisifyAll, promisify } from 'miniprogram-api-promise';
import { APP_NAME, STORAGE_KEYS } from '../../config/app-cnst';
import { helper, tools } from '@wecrpto/weaccount';
import { tabbar } from '../../utils/tabbar';
import Log from '../../libs/log/index.js';
const { buildSignData, appendSignature } = require('../../utils/util');
//see https://github.com/demi520/wxapp-qrcode
const QR = require('../../libs/qrcode/weqrcode');
const canvasId = 'mycanvas';
const app = getApp();
const wxp = {};
promisifyAll(wx, wxp);
const ERR_CODES = {
  NO_WALLET: 'Did账号不存在',
  WALLET_CLOSED: '账号已锁定',
  PWD_INCORRECT: '密码不正确',
  NEED_LOC_AUTH: '需要位置授权',
  ERR_OPEN_SETTINGS: '打开setting',
  SIGN_FAIL: '签名失败',
};

const Tips = {
  unlock: '点击解锁',
  locationAuth: '点击授权获取位置',
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: false,
    tabbar,
    precheckLocationed: false,
    appTitle: APP_NAME,
    subtitle: 'DID号:',
    lockedTips: '点击解锁',
    noLocationAuthTips: '点击授权获取位置',
    did: '',
    qrcodeTips: '点击刷新开锁二维码',
    hasLocationPermission: false,
    opened: false,
    opentips: Tips.unlock,
    auth: '',
    imagePath: '',
    maskHidden: true,
    signJson: {},
    authError: '需要位置授权',
    modalHide: true,
    openBtnDisabled: false,
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    Log.info('Index Home loaded', wx.$webox.getSafeWallet());
    const id = wx.$webox.getSafeWallet() ? wx.$webox.getSafeWallet().did : '';
    this.setData({ did: id || app.globalData[STORAGE_KEYS.DID_SKEY] || '' });
    this.setData({ isIphoneX: app.globalData.isIphoneX || false });

    await this.preCheckSetting();
    // 检查size
    const size = this.setCanvasSize();
    this.setData({ size: size });
  },
  preCheckSetting: async function () {
    try {
      const resp = await promisify(wx.getSetting)({
        withSubscriptions: false,
      });
      const { authSetting } = resp;
      if (typeof authSetting['scope.userLocation'] === 'undefined') {
        const localResp = await promisify(wx.getLocation)({ type: 'wgs84' });
        // console.log('localResp>>>>>>>', localResp);
      }
    } catch (e) {
      this.setData({ hasLocationPermission: false });
      // console.log('localResp>>>>>>>', e);
    }
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
              success: function (res) {
                that.setData({ hasLocationPermission: true });
              },
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
      // console.log('checkLocationPermission fail', e);
      return false;
    }
  },

  settingCallback: function (e) {
    const that = this;
    const { authSetting } = e.detail;
    console.log('settingCallback', e.detail);
    if (!!authSetting['scope.userLocation']) {
      that.setData({ hasLocationPermission: true });
      that.reDrawQrcodeHandle.call(that);
    } else {
      that.setData({ hasLocationPermission: false });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    this.showCustTabbar(0);
    const that = this;
    if (!wx.$webox.hasWallet()) {
      wx.navigateTo({
        url: '/pages/creator/index/index',
      });
    }
    that.initPageData();
  },
  showCustTabbar: function (idx = 0) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: idx,
      });
    }
  },
  initPageData: async function () {
    const webox = wx.$webox;
    const that = this;
    try {
      if (!webox.hasWallet()) throw { errCode: 'NO_WALLET' };
      const id = webox.getSafeWallet().did;
      this.setData({ did: id });
      const locationData = await this.checkLocationAuth();

      if (!webox.hasOpened()) {
        throw { errCode: 'WALLET_CLOSED' };
      }
      const pk = webox.getKeypair().secretKey;
      const qrcodeText = await that.builddrawQrcodeTextByPk(id, locationData, pk);

      //draw QRcode
      const size = this.setCanvasSize();
      // console.log('W>>>>>>>>', qrcodeText);
      this.setData({ opened: true });
      QR.api.draw(qrcodeText, 'mycanvas', size.w, size.h, that, that.canvasToTempImage);
    } catch (err) {
      // console.log('initial fail', err);
      if (err && err.errCode === 'NO_WALLET') {
        // wx.navigateTo({
        //   url: '',
        // })
      } else if (err && err.errCode === 'WALLET_CLOSED') {
        this.setData({ opened: false });
        this.setData({ opentips: Tips.unlock });
      } else if (err && err.errCode === 'ERR_OPEN_SETTINGS') {
        that.setData({ opened: false }); //
        that.setData({ opentips: Tips.locationAuth });
      } else {
        const msg = err.errCode ? ERR_CODES[err.errCode] : err.message || '错误';
        wx.showToast({
          icon: 'error',
          title: msg,
          duration: 3000,
        });
      }
    }
  },
  redrawQRcode: async function () {
    const webox = wx.$webox;
    const that = this;
    try {
      if (!webox.hasWallet()) throw { errCode: 'NO_WALLET' };
      const id = webox.getSafeWallet().did;
      this.setData({ did: id });
      const locationData = await this.checkLocationAuth();

      if (!webox.hasOpened()) {
        throw { errCode: 'WALLET_CLOSED' };
      }
      const pk = webox.getKeypair().secretKey;
      const qrcodeText = await that.builddrawQrcodeTextByPk(id, locationData, pk);

      //draw QRcode
      const size = this.setCanvasSize();
      this.setData({ opened: true });
      QR.api.draw(qrcodeText, 'mycanvas', size.w, size.h, that, that.canvasToTempImage);
    } catch (err) {
      console.log('initial fail', err);
      if (err && err.errCode === 'NO_WALLET') {
        // wx.navigateTo({
        //   url: '',
        // })
      } else if (err && err.errCode === 'WALLET_CLOSED') {
        this.setData({ opened: false });
        this.setData({ opentips: Tips.unlock });
      } else if (err && err.errCode === 'ERR_OPEN_SETTINGS') {
        that.setData({ opened: false }); //
        that.setData({ opentips: Tips.locationAuth });
      } else {
        const msg = err.errCode ? ERR_CODES[err.errCode] : err.message || '错误';
        wx.showToast({
          icon: 'error',
          title: msg,
          duration: 3000,
        });
      }
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
    // console.log('onPullDownRefresh>>>>>>>>>>' + new Date());
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

  /**
   *
   */
  checkLocationAuth: async function () {
    try {
      const settings = await promisify(wx.getSetting)();
      let hasLocation = settings.authSetting['scope.userLocation'];
      if (!hasLocation) throw new Error('no location auth.');
      const locationData = await this.getLocation();
      if (!locationData || !locationData.latitude || !locationData.longitude) {
        throw new Error('un get location data.');
      }
      this.setData({ hasLocationPermission: true });
      return locationData;
    } catch (err) {
      this.setData({ hasLocationPermission: false });
      throw { errCode: 'ERR_OPEN_SETTINGS' };
    }
  },
  checkUserAuth: function () {
    wx.getSetting({
      success: async (res) => {
        if (res.authSetting['scope.userInfo']) {
          try {
            const uRes = await wxp.getUserInfo({
              lang: 'en',
            });
            // console.log('>>>>>>>>>>>>>>>', uRes);
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
      throw { errCode: 'NEED_LOC_AUTH' };
    }
  },
  showModalHandle: async function () {
    const that = this;
    try {
      const locationData = await this.checkLocationAuth();
      this.setData({ modalHide: false }); //show dialog
    } catch (e) {
      wx.openSetting({
        withSubscriptions: false,
        success: function (res) {
          const authSetting = res.authSetting;
          const hasLocation = Boolean(authSetting['scope.userLocation']);
          if (!!hasLocation) that.setData({ modalHide: true });
        },
      });
    }
  },
  hideModalHandle() {
    this.setData({ modalHide: true });
  },
  setAuth(e) {
    this.setData({ auth: e.detail.value });
  },
  /**
   *
   * @param {*} e
   */
  openWalletHandle: async function (e) {
    try {
      const auth = this.data.auth;
      const locationData = await this.getLocation();
      const latitude = locationData.latitude;
      const longitude = locationData.longitude;
      const qrcodeText = await this.builddrawQrcodeText(latitude, longitude, auth);
      // TODO Draw QRcode
      const size = this.setCanvasSize();
      // console.log('W>>>>>>>>', qrcodeText, size);
      QR.api.draw(qrcodeText, 'mycanvas', size.w, size.h, this, this.canvasToTempImage);

      this.setData({ opened: true });
      this.setData({ modalHide: true });

      // this.
    } catch (e) {
      // console.log('openWalletHandle>>>>>>>', e);
      // throw err;
      if (e && e.errCode) {
        wx.showToast({
          icon: 'error',
          title: ERR_CODES[e.errCode],
        });
      }
    }
  },
  reDrawQrcodeHandle: async function () {
    const webox = wx.$webox;
    const that = this;
    if (!this.data.hasLocationPermission) {
      return;
    }

    if (!webox.hasWallet() || !webox.hasOpened()) {
      return;
    }
    try {
      const locationData = await this.getLocation();
      const pk = webox.getKeypair().secretKey;
      const id = webox.getSafeWallet().did;
      const qrcodeText = await that.builddrawQrcodeTextByPk(id, locationData, pk);
      const size = this.setCanvasSize();
      // console.log('W>>>>>>>>', qrcodeText);
      this.setData({ opened: true });
      QR.api.draw(qrcodeText, 'mycanvas', size.w, size.h, that, that.canvasToTempImage);
    } catch (err) {
      // console.log('reDrawQrcodeHandle>>>>>>>', err);
      this.setData({ opened: false });
      wx.showToast({
        title: '密码失效,请重试',
      });
    }
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
      // console.log('builddrawQrcode>>>>', e);
      throw { errCode: 'PWD_INCORRECT' };
    }
  },

  /**
   *
   * @param {string} did
   * @param {Object} locationData
   * @param {Uint8Array} pk
   */
  builddrawQrcodeTextByPk: async function (did, locationData, pk) {
    try {
      const latitude = locationData.latitude;
      const longitude = locationData.longitude;
      //build SignData
      const signData = buildSignData(did, latitude, longitude);

      const plaintext = JSON.stringify(signData);
      const signature = helper.signMessage(plaintext, pk);

      const qrcodeData = appendSignature(signData, signature);
      // console.log('signature>>>>', signature);

      return JSON.stringify(qrcodeData);
    } catch (err) {
      throw { errCode: 'PWD_INCORRECT' };
    }
  },

  testNavHandle: function () {
    // wx.navigateTo({
    //   url: '/pages/creator/backup/backup',
    // });
  },
  nav2Page: function (e) {
    console.log(e);
    const dataset = e.currentTarget.dataset;
    if (dataset.path) {
      wx.navigateTo({
        url: dataset.path,
      });
    }
  },
});
