// pages/creator/index/index.js
import { importKeyStore } from '@wecrpto/weaccount';

import { STORAGE_KEYS } from '../../../config/app-cnst';

import Log from '../../../libs/log/index.js';

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    scanKeystore: null,
  },
  /** Method begin */
  gotoGenerator() {
    wx.navigateTo({
      url: '/pages/creator/generator/index',
    });
  },
  gotoHome() {
    wx.switchTab({
      url: '/pages/home/index',
    });
  },
  scanHandle() {
    const _that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['barCode', 'qrCode'],
      success(res) {
        try {
          const keystore = JSON.parse(res.result);
          if (typeof keystore !== 'object' || !keystore.did || !keystore.cipher_txt) {
            wx.showToast({
              icon: 'error',
              title: '易ID账户格式不对',
              duration: 3000,
            });
          } else {
            _that.setData({ scanKeystore: keystore });
          }
        } catch (err) {
          wx.showToast({
            title: '二维码格式不正确',
            duration: 3000,
          });
        }
      },
    });
  },

  importHandle() {
    const cfg = wx.$webox.getCurrentConfig();
    const pwd = this.data.password;
    if (!pwd) {
      wx.showToast({
        icon: 'error',
        title: '请输入密码',
        duration: 3000,
      });
      return;
    }

    try {
      const keystore = this.data.scanKeystore;
      const modal = importKeyStore(JSON.stringify(keystore), pwd, cfg);

      wx.$webox = modal;
      const safeWallet = modal.getSafeWallet();
      getApp().saveSafeWalletToStore(safeWallet);

      wx.showToast({
        icon: 'success',
        title: '导入成功',
        success: function () {
          wx.switchTab({
            url: '/pages/home/index',
          });
        },
        duration: 2000,
      });
    } catch (err) {
      console.log('parse Error:', err);
      wx.showToast({
        icon: 'error',
        title: '密码不正确.',
        duration: 3000,
      });
    }
  },
  showErrorMsg(msg = '', duration = 2500) {
    wx.lin.showMessage({
      type: 'error',
      content: msg,
      duration: duration,
    });
  },
  /** Method End */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    Log.info('Creator Index.');
    if (!wx.$webox.hasWallet()) {
      wx.hideTabBar({
        success: (res) => {
          Log.info('Hide nav bar goback.', res);
        },
      });
    }
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
