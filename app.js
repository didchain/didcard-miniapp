// app.js
import { promisifyAll } from 'miniprogram-api-promise';
import { STORAGE_KEYS } from './config/app-cnst';
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
    this.initSystemInfo();
    const webox = this.checkAndInitWebox();

    // //has initialized verify
    this.getUserInfo((userInfo) => {
      console.log('UserInfo', userInfo);
    });
    const safeWallet = wx.getStorageSync(STORAGE_KEYS.WALLET_V3_OKEY);
    if (safeWallet) {
      wx.$webox.loadSafeWallet(safeWallet);
      try {
        const aeskey = this.getAeskey();
        if (aeskey) {
          let _wallet = wx.$webox.openByAeskey(new Uint8Array(aeskey));
          wx.$webox.setWallet(_wallet);
        }
      } catch (error) {
        this.cleanAeskey();
      }

      this.globalData[STORAGE_KEYS.WALLET_V3_OKEY] = safeWallet;
      this.globalData[STORAGE_KEYS.DID_SKEY] = safeWallet.did;
    } else {
      // console.log('Wallet not initialization.');
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
  initSystemInfo: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (e) {
        var a = e.model;
        if (a.indexOf('iPhone') != -1 && a.indexOf('X') != -1) {
          //是不是包含iphoneX
          that.globalData.isIphoneX = true;
        } else {
          that.globalData.isIphoneX = false;
        }
      },
    });
  },
  getAeskey: function () {
    const aeskeybase = wx.getStorageSync(STORAGE_KEYS.AESKEY_HKEY);
    if (!aeskeybase) return false;
    try {
      return wx.base64ToArrayBuffer(aeskeybase);
    } catch (e) {
      return false;
    }
  },
  cleanAeskey: function () {
    wx.setStorageSync(STORAGE_KEYS.AESKEY_HKEY, '');
  },
  setAeskey: function (keybuf) {
    const aeskeybase = wx.arrayBufferToBase64(keybuf);
    wx.setStorageSync(STORAGE_KEYS.AESKEY_HKEY, aeskeybase);
  },
  saveKeyStore: function (safeWallet) {
    wx.setStorageSync(STORAGE_KEYS.WALLET_V3_OKEY, safeWallet);
    if (safeWallet) {
      this.globalData[STORAGE_KEYS.WALLET_V3_OKEY] = safeWallet;
      this.globalData[STORAGE_KEYS.DID_SKEY] = safeWallet.did;
    }
  },
  getCommunity: function () {
    let coms = wx.getStorageSync(STORAGE_KEYS.COMUNITY_AKRY);
    !coms && (coms = []);
    return coms;
  },
  addCommunity: function (text) {
    let coms = wx.getStorageSync(STORAGE_KEYS.COMUNITY_AKRY);
    !coms && (coms = []);
    const key = wx.str2base64(text);
    const idx = coms.findIndex((c) => c.key === key);
    if (idx >= 0) {
      coms.splice(idx, 1, { key, text });
    } else {
      coms.push({ key, text });
    }
    wx.setStorageSync(STORAGE_KEYS.COMUNITY_AKRY, coms);
    return coms;
  },
  delCommunity: function (key) {
    let coms = wx.getStorageSync(STORAGE_KEYS.COMUNITY_AKRY);
    !coms && (coms = []);
    // const key = wx.str2base64(text);
    const idx = coms.findIndex((c) => c.key === key);
    if (idx >= 0) {
      coms.splice(idx, 1);
      wx.setStorageSync(STORAGE_KEYS.COMUNITY_AKRY, coms);
    }

    return coms;
  },
  cleanCommunity: function () {
    wx.setStorageSync(STORAGE_KEYS.COMUNITY_AKRY, []);
  },

  /**
   *
   */
  globalData: {
    isIphoneX: false,
    scopeULocAuthed: false,
    [STORAGE_KEYS.KEYPAIR_OKEY]: null, //keypair
    [STORAGE_KEYS.WALLET_V3_OKEY]: null, //safWallet
    userInfo: null,
    externalUrl: 'https://wechat.baschain.cn/test.html',
    tmpScanData: '',
  },
  /** private methods */
  bindHelper() {
    wx.Buffer = Buffer;
    // console.log('Buffer>>>>', Buffer);
    wx.$nacl = nacl;
    helper && (wx.helper = helper);
    tools && (wx.tools = tools);
    tools &&
      tools.enc &&
      (wx.Enc = tools.enc) &&
      (wx.str2base64 = (text) => tools.enc.Utf8.parse(text).toString(tools.enc.Base64));
  },
});
