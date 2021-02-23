// pages/creator/generator/index.js
const { storeCnsts } = require('../../../config/app-cnst');
const { pwdRules } = require('../../../config/validator-rules');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    password: null,
    confirm: null,
    passwordRules: pwdRules,
    confirmRules: [...pwdRules],
  },
  /** Cust methods begin */
  generateSubmit(event) {
    const webox = wx.$webox;
    console.log('>>>>>>>>>>>>>>', webox, wx.Enc);
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
      const inst = webox.generate(password);

      const safeWallet = inst.getSafeWallet();
      if(!safeWallet){
        throw new Error('Generate Account Error');
      }
      wx.setStorageSync(storeCnsts.WALLET_V3_OKEY, safeWallet)
      // wx.setStorageSync(storeCnsts.SHORT_SECRET_OKEY, {
      //   enshort: this.data.password,
      //   entype: 'base64',
      // });
      // wx.setStorageSync(storeCnsts.INITIALIZED_BKEY, true);
      // wx.setStorageSync(storeCnsts.WALLET_ADDR_SKEY, '0x232BD76e2adcff8825C');
      wx.lin.showMessage({
        type: 'success',
        content: '创建成功',
        duration: 1000,
        success() {
          // wx.switchTab({
          //   url: '/pages/home/index',
          // });
          wx.navigateTo({
            url: '/pages/creator/backup/backup',
          });
        },
      });
    } catch (err) {
      console.log(err);
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
