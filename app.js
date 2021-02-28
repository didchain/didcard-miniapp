// app.js
import { promisifyAll } from 'miniprogram-api-promise';
const { storeCnsts } = require('./config/app-cnst');
const { Buffer } = require('buffer/index');
const { randomBytes } = require('./utils/util');
let nacl = require('@wecrpto/nacl');
nacl.setPRNG(randomBytes); //make sure random key
// nacl.util = require('@wecrpto/nacl-util');
import { init as weaccInit, helper, tools } from '@wecrpto/weaccount';

const wxp = {};
promisifyAll(wx, wxp);
// const logger = wx.getLogManager({
//   level: 0,
// })
App({
  onLaunch() {
    // bind wx
    this.bindHelper();
    const webox = this.checkAndInitWebox();

    // //has initialized verify

    const safeWallet = wx.getStorageSync(storeCnsts.WALLET_V3_OKEY);
    // // console.log('App launch>>>shortJson>>', wx.getStorageSync(storeCnsts.WALLET_V3_OKEY));
    if (safeWallet) {
      wx.$webox.loadSafeWallet(safeWallet);
      this.globalData[storeCnsts.WALLET_V3_OKEY] = safeWallet;
      this.globalData[storeCnsts.DID_SKEY] = safeWallet.did;
    } else {
      console.log('Wallet not initialization.');

      wx.navigateTo({
        url: 'pages/creator/index/index',
      });
    }
  },
  getUserInfo: function (cb) {
    const that = this;
    if (this.globalData.userInfo) {
      typeof cb == 'function' && cb(this.globalData.userInfo);
    } else {
      wx.login({
        success: function () {
          wx.getUserInfo({
            lang: 'en',
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb === 'function' && cb(that.globalData.userInfo);
            },
          });
        },
      });
    }
  },
  // precheckLocation(cb) {
  //   const that = this;
  //   if (!this.globalData.scopeULocAuthed) {
  //     typeof cb === 'function' && cb(true);
  //   } else {
  //     wx.getSetting({
  //       withSubscriptions: false,
  //       success: function (res) {
  //         if (!res.authSetting['scope.userLocation']) {
  //           wx.authorize({
  //             scope: 'scope.userLocation',
  //             success: function (res) {
  //               that.globalData.scopeULocAuthed = true;
  //               typeof cb === 'function' && cb(true);
  //             },
  //           });
  //         }
  //       },
  //     });
  //   }
  // },
  /**
   * 初始化 webox
   * @param {*} cb
   */
  checkAndInitWebox: function (cb) {
    const cfg = { idPrefix: 'Did', remembered: true, useSigned: true };
    wx.$webox = weaccInit(cfg);
  },
  checkUserAuth: () => {
    wx.getSetting({
      success: async (res) => {
        if (res.authSetting['scope.userInfo']) {
          try {
            const uRes = await wxp.getUserInfo({
              lang: 'en',
            });
            console.log('>>>>>>>>>>>>>>>', uRes);
            this.globalData.userInfo = uRes.userInfo;
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

  /**
   *
   */
  globalData: {
    scopeULocAuthed: false,
    [storeCnsts.KEYPAIR_OKEY]: null, //keypair
    [storeCnsts.WALLET_V3_OKEY]: null, //safWallet
    userInfo: null,
    externalUrl: 'https://wechat.baschain.cn/test.html',
  },
  /** private methods */
  bindHelper() {
    wx.Buffer = Buffer;
    // console.log('Buffer>>>>', Buffer);
    wx.$nacl = nacl;
    helper && (wx.helper = helper);
    tools && (wx.tools = tools);
    tools && tools.enc && (wx.Enc = tools.enc);
  },
});
