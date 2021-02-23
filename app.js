// app.js
const { storeCnsts } = require('./config/app-cnst');

const { randomBytes } = require('./utils/util');
let nacl = require('@wecrpto/nacl');
nacl.setPRNG(randomBytes); //make sure random key
nacl.util = require('@wecrpto/nacl-util');
import { init as weaccInit, helper, tools, importKeyStore } from '@wecrpto/weaccount';

App({
  onLaunch() {
    // bind wx
    this.bindHelper();
    const cfg = { idPrefix: 'Did', remembered: true, useSigned: true };
    wx.$webox = weaccInit(cfg);

    //has initialized verify
    console.log('App launch>>>shortJson>>', wx.getStorageSync(storeCnsts.WALLET_V3_OKEY));
    if (wx.getStorageSync(storeCnsts.WALLET_V3_OKEY)) {
      console.log('has account>>>>', wx.getStorageSync(storeCnsts.INITIALIZED_BKEY));
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
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    });
    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            },
          });
        }
      },
    });
  },
  globalData: {
    keypair: null,
    userInfo: null,
    externalUrl: 'https://wechat.baschain.cn/test.html',
  },
  /** private methods */
  bindHelper() {
    wx.$nacl = nacl;
    helper && (wx.helper = helper);
    tools && (wx.tools = tools);
    tools && tools.enc && (wx.Enc = tools.enc);
  },
});
