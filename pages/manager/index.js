// pages/manager/index.js
import { importKeyStore } from '@wecrpto/weaccount';
import { promisify } from 'miniprogram-api-promise';
import { checkKeystore } from '../../utils/util';
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
  /**
   *
   */
  importHandler: function () {
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
      const webox = wx.$webox;
      const keyparams = webox.getSafeKeyparams();
      const weaccConfig = {
        weaked: webox.weaked,
        idPrefix: keyparams.idPrefix,
        useSigned: keyparams.useSigned,
        round: keyparams.round,
      };

      const _modal = importKeyStore(JSON.stringify(keystore), auth, weaccConfig);
      const safeWallet = _modal.getSafeWallet();
      wx.$webox = _modal;
      getApp().saveSafeWalletToStore(safeWallet);
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
    const webox = wx.$webox;
    try {
      webox.reset();
      const modal = webox.generate(auth);
      const newSafeWallet = modal.getSafeWallet();
      getApp().saveSafeWalletToStore(newSafeWallet);

      //TODO removal
      Log.info('create new did', modal.keyStoreJsonfy());
      wx.showToast({
        title: '创建成功',
        success: function () {
          that.maskHideHandle();
        },
      });
    } catch (e) {
      console.error(e);
      Log.error('create fail', e);
      wx.$webox.setSafeWallet(backSafeWallet);
    }
  },
});
