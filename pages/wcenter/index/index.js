// pages/wcenter/index/index.js
import { LABELS, FEATURES_CTRL } from '../../../config/app-cnst';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    didLabel: LABELS.DID_LABEL,
    nickname: '',
    did: '',
    checked: false,
    fingerSupport: false,
    facialSupport: false,
    noSecret: false,
    maskShow: false,
    needAuthorized: true,
    authPassword: '',
    showHelpBtn: FEATURES_CTRL.SETT_HELP,
  },
  /** Methods begin */
  gotoInternalUrl(event) {
    // const { currentTarget = {} } = event;
    // const url = currentTarget.dataset?.url || '';
    // if (url) {
    //   wx.navigateTo({
    //     url,
    //     fail: (err) => console.log(err),
    //   });
    // }
  },
  toggleFinger() {
    const nextState = !this.data.checked;
    this.setData({
      checked: nextState,
    });
  },
  gotoIDManager() {
    wx.navigateTo({
      url: '/pages/manager/index',
      fail: (err) => console.log(err),
    });
  },
  checkoutSoter() {
    wx.checkIsSupportSoterAuthentication({
      success: (result) => {
        // console.log('>>>>>>', result);
      },
      fail: (err) => {
        console.log('err', err);
      },
    });
  },
  /** Methods end */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkoutSoter();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ authorize: '' });
    let aeskey = getApp().getAeskey();
    // console.log('aeskey>>>>', aeskey);
    this.setData({ noSecret: !!aeskey });
    this.showCustTabbar(2);
    const that = this;
    wx.getUserInfo({
      lang: 'zh_CN',
      success: function (res) {
        const userInfo = res.userInfo;
        getApp().globalData.userInfo = userInfo;
        that.setData({ needAuthorized: false });
        that.setData({ nickname: userInfo.nickName });
      },
      fail: function (e) {
        that.setData({ needAuthorized: true });
      },
    });
    if (wx.$webox.hasWallet()) {
      this.setData({ did: wx.$webox.getSafeWallet().did });
    }
  },
  authorizeUserInfo: function () {
    wx.authorize({
      scope: 'scope.userInfo',
      success: function (res) {
        let userInfo = res.userInfo;
        that.setData({ needAuthorized: false });
        that.setData({ nickname: userInfo.nickName });
      },
      fail: function (e) {
        that.setData({ needAuthorized: true });
      },
    });
  },
  userInfoCallback: function (res) {
    // console.log('settingCallBackHandle>>>>>>', res);
  },
  showCustTabbar: function (idx = 0) {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: idx,
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
  openSettingHandle: function () {
    wx.navigateTo({
      url: '/pages/sett/index/index',
    });
  },
  authPasswordInputHandle: function (e) {
    this.setData({ authPassword: e.detail.value });
  },
  maskHideHandle: function () {
    this.setData({ maskShow: false });
    this.setData({ noSecret: false });
  },
  needAuthChangedHandle: function (e) {
    if (e.detail.value === true) {
      this.setData({ maskShow: true });
    } else {
      this.setData({ maskShow: false });
      getApp().cleanAeskey();
    }
  },
  saveAeskeyHandle: function () {
    const authPassword = this.data.authPassword;
    const webox = wx.$webox;
    if (!authPassword || !authPassword.length) {
      wx.showToast({
        icon: 'error',
        title: '请输入密码.',
      });
      return;
    }
    try {
      if (!webox.hasWallet()) throw { errCode: 'NO_WALLET' };
      const wallet = webox.open(authPassword);
      const aeskey = wallet.key.lockedKey;
      getApp().setAeskey(aeskey);
      this.setData({ maskShow: false });
    } catch (e) {
      wx.showToast({
        icon: 'error',
        title: '密码不正确请重试.',
      });
    }
  },
});
