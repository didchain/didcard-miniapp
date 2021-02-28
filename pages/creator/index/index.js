// pages/creator/index/index.js
import { importKeyStore } from '@wecrpto/weaccount';
const { storeCnsts } = require('../../../config/app-cnst');

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
          console.log('keystore>>>>', keystore);
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
    // TODO set
    const cfg = { idPrefix: 'Did', remembered: true, useSigned: true };
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
      console.log('pwd', this.data.password, this.data.scanKeystore);
      const modal = importKeyStore(JSON.stringify(keystore), pwd, cfg);

      const wallet = modal.wallet;
      wx.$webox.setWallet(wallet);
      const safeWallet = wx.$webox.getSafeWallet();

      wx.setStorageSync(storeCnsts.WALLET_V3_OKEY, safeWallet);
      getApp().globalData[storeCnsts.KEYPAIR_OKEY] = modal.getKeypair();
      getApp().globalData[storeCnsts.WALLET_V3_OKEY] = safeWallet;
      getApp().globalData[storeCnsts.DID_SKEY] = safeWallet.did;

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
      // wx.lin.showMessage({
      //   type: 'success',
      //   content: '创建成功',
      //   duration: 1000,
      //   success() {
      //     // wx.switchTab({
      //     //   url: '/pages/home/index',
      //     // });
      //   },
      // });
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
  onShow: function () {},

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
