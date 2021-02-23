// pages/test/nacl/generator.js

import { helper, tools, enc } from '@wecrpto/weaccount';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pwd: 'abc3&$_',
    privateKey: null,
    publicKey: null,
    did: '',
    msg: '你萨达符合',
    signature: '',
    verified: '',
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

  /** Methods begin */
  generateWallet() {
    this.makesureKeypair();
    const webox = wx.$webox;
    this.setData({ verified: '' });
    this.setData({ did: webox.wallet.did });
    const pubbase64 = helper.uint8ArrayToBase64(webox.keypair.publicKey);
    this.setData({ publicKey: pubbase64 });
    const pribase64 = helper.uint8ArrayToBase64(webox.keypair.secretKey);
    this.setData({ privateKey: pribase64 });
  },
  signMessage() {
    const webox = wx.$webox;
    const message = this.data.msg;
    if (!webox.hasWallet()) {
      throw new Error('no wallet.');
    }
    this.setData({ verified: '' });
    const signature = helper.signMessage(message, webox.getKeypair().secretKey);
    console.log('>>>>', signature);
    this.setData({ signature: signature });
  },
  verifyMessage() {
    const signBase64 = this.data.signature;
    const webox = wx.$webox;
    if (!signBase64) {
      console.warn('no signature message.');
      return;
    }

    if (!webox.hasWallet()) throw new Error('no wallet.');
    console.log('verify>>>>>>>>>>>>>>>>', signBase64, this.data.msg);

    try {
      const pubkey = webox.getKeypair().publicKey;
      const verified = helper.verifyMessage(signBase64, this.data.msg, pubkey);
      console.log('verified>>>>', verified);
      this.setData({ verified: verified ? 'passed' : 'fail' });
    } catch (e) {
      console.log('verify fail>>>>>>', e);
      this.setData({ verified: e.message });
    }
  },
  /** ============= Methods ================ */
  makesureKeypair() {
    console.log('Check Wallet >>>>', wx.$webox.hasWallet());
    !wx.$webox.hasWallet() && wx.$webox.generate(this.data.pwd);
  },
});
