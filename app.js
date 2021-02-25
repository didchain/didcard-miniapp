// app.js
import { promisifyAll } from 'miniprogram-api-promise';
const { storeCnsts } = require('./config/app-cnst');
const { Buffer } = require('buffer/index');
const { randomBytes } = require('./utils/util');
let nacl = require('@wecrpto/nacl');
nacl.setPRNG(randomBytes); //make sure random key
// nacl.util = require('@wecrpto/nacl-util');
import { init as weaccInit, helper, tools, importKeyStore } from '@wecrpto/weaccount';

const wxp = {};
promisifyAll(wx, wxp);
App({
  onLaunch() {
    // bind wx
    this.bindHelper();
    const cfg = { idPrefix: 'Did', remembered: true, useSigned: true };
    wx.$webox = weaccInit(cfg);

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

    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || [];
    // logs.unshift(Date.now());
    // wx.setStorageSync('logs', logs);
    // 登录
    // wx.login({
    //   success: (res) => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   },
    // });

    // 获取用户信息
    this.checkUserAuth();
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

  globalData: {
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
