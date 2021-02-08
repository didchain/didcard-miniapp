// pages/test/nacl/generator.js
let nacl = require('@wecrpto/nacl');
nacl.util = require('@wecrpto/nacl-util');
// nacl.setPRNG(function (x, arr) {
//   for (var i = 0, len = arr.length; i < len; i++) {
//     x[i] = Math.floor(Math.random() * 256);
//   }
//   return x;
// });
const ed2curve = require('@wecrpto/ed2curve');
// const { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } = require('tweetnacl-util');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    privateKey: null,
    publicKey: null,
    msg: '',
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
    var signPair = nacl.sign.keyPair();
    console.log('hellp>>>>>>>>>>>>>>>', signPair, ed2curve.convertKeyPair);
    const ed2curveKeypair = ed2curve.convertKeyPair(signPair);

    console.log('ed2curveKeypair>>>>>>>>>>>>>>>', ed2curveKeypair);
  },
});
