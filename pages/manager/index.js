// pages/manager/index.js
import { importKeyStore } from '@wecrpto/weaccount';
import { promisify } from 'miniprogram-api-promise';
import { checkKeystore } from '../../utils/util';
import { weaccConfig } from '../../config/app-cnst';
import Log from '../../libs/log/index.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    maskShow: false,
    maskNewShow: false,
    showToast: false,
    toastTitle: '易身份导入成功',
    toastImage: '/images/import_success.png',
    authPassword: '',
    keystore: null,
  },

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
    this.setData({ keystore: null });
    this.setData({ authPassword: '' });
    Log.setFilterMsg('didcreator');
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
  /** 导入 */
  impQRHandle: async function () {
    const that = this;
    const webox = wx.$webox;
    try {
      const scanRes = await promisify(wx.scanCode)({ onlyFromCamera: false, scanType: ['qrCode'] });
      const jsonText = scanRes.result;
      const keystore = checkKeystore(jsonText);
      this.setData({ keystore: keystore });
      this.setData({ maskShow: true });
    } catch (e) {
      if (e.errMsg && e.errMsg.startsWith('scanCode:fail')) {
        wx.showToast({
          icon: 'error',
          title: '读取二维码错误',
        });
      } else if (e.errCode && e.errCode == 'KEYSTORE_FORMAT_INCORRECT') {
        wx.showToast({
          icon: 'error',
          title: e.errMsg,
          duration: 4000,
        });
      } else {
        wx.showToast({
          icon: 'error',
          title: '错误',
        });
      }
    }
  },

  authPasswordInputHandle: function (e) {
    this.setData({ authPassword: e.detail.value });
  },
  maskHideHandle: function (type) {
    this.setData({ maskShow: false });
    this.setData({ maskNewShow: false });
    this.setData({ authPassword: '' });
  },
  openWalletHandle: function () {
    const keystore = this.data.keystore;
    const auth = this.data.authPassword;
    if (!auth) {
      wx.showToast({
        icon: 'error',
        title: '请输入密码',
      });
      return;
    }
    const that = this;
    try {
      const _modal = importKeyStore(JSON.stringify(keystore), auth, weaccConfig);
      const wallet = _modal.wallet;
      wx.$webox.setWallet(wallet);
      getApp().saveKeyStore(wx.$webox.getSafeWallet());
      wx.showToast({
        title: '导入成功',
        success: function () {
          that.setData({ authPassword: '' });
          that.setData({ maskShow: false });
        },
      });
    } catch (e) {
      wx.showToast({
        icon: 'error',
        title: '密码错误',
      });
    }
  },
  openCreateMaskModal: function () {
    this.setData({ authPassword: '' });
    this.setData({ maskNewShow: true });
  },
  createNewWeaccount: function () {
    const auth = this.data.authPassword;
    if (!auth) {
      wx.showToast({
        icon: 'error',
        title: '请输入密码',
      });
      return;
    }

    const backSafeWallet = wx.$webox.getSafeWallet();
    const that = this;
    try {
      wx.$webox.reset();
      const modal = wx.$webox.generate(auth);
      getApp().saveKeyStore(wx.$webox.getSafeWallet());
      Log.info('create new did', modal.keyStoreJsonfy(), new Date());
      wx.showToast({
        title: '创建成功',
        success: function () {
          that.maskHideHandle();
        },
      });
    } catch (e) {
      console.error(e);
      Log.error('create fail', e, new Date());
      wx.$webox.loadSafeWallet(backSafeWallet);
    }
  },
});
