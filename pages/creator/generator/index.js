// pages/creator/generator/index.js
import { STORAGE_KEYS } from '../../../config/app-cnst';
const { pwdRules } = require('../../../config/validator-rules');
import Log from '../../../libs/log/index.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    password: null,
    confirm: null,
    passwordRules: pwdRules,
    confirmRules: [...pwdRules],
    loading: false,
  },
  /** Cust methods begin */
  pwdInputHandle: function (e) {
    const value = e.detail.value;
    this.setData({ password: value });
  },
  confirmInputHandle: function (e) {
    const value = e.detail.value;
    this.setData({ confirm: value });
  },
  generateSubmit: async function (event) {
    const webox = wx.$webox;

    const password = this.data.password;
    if (!password || !this.data.confirm) {
      this.showErrorMsg('请输入密码');
      return;
    }
    if (password !== this.data.confirm) {
      this.showErrorMsg('俩次密码不一致');
      return;
    }
    const _this = this;
    try {
      Log.info('Create start....');
      _this.setData({ loading: true });

      if (webox.hasWallet()) {
        webox.reset();
      }
      const inst = webox.generate(password);
      const safeWallet = inst.getSafeWallet();
      if (!safeWallet) {
        throw new Error('Generate Account Error');
      }
      Log.info('account create success', !!safeWallet);
      const jsonWallet = getApp().saveSafeWalletToStore(safeWallet);
      _this.setData({ loading: false });
      // TODO removal
      Log.debug('create did success', jsonWallet);
      wx.lin.showMessage({
        type: 'success',
        content: '创建成功',
        duration: 1000,
        success() {
          wx.navigateTo({
            url: '/pages/creator/backup/backup',
          });
        },
      });
    } catch (err) {
      console.log(err);
      Log.error('Created>>>', err);
      _this.setData({ loading: false });
      this.showErrorMsg('创建失败', 3000);
    }
  },
  showErrorMsg(msg = '', duration = 2500) {
    wx.lin.showMessage({
      type: 'error',
      content: msg,
      duration: duration,
    });
  },
  /** Cust methods end */

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
    Log.setFilterMsg('didcreator');
    // Log.info('Debug IOS can not created.');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    Log.setFilterMsg('didcreator');
  },

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
