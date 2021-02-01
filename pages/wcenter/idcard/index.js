// pages/wcenter/idcard/index.js
import drawQrcode from '../../../libs/qrcode/weapp.qrcode.js';
const qrOpts = {
  width: 200,
  height: 200,
  canvasId: 'idcardQrcode',
  typeNumber: 8,
  callback(e) {
    console.log(e);
  },
  image: {
    imageResource: '../../../images/icons/logo_center.png',
    dx: 60,
    dy: 60,
    dWidth: 80,
    dHeight: 80,
  },
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    width: 200,
    height: 200,
    qrText: 'https://developers.weixin.qq.com',
  },
  /** Methods Begin */
  draw() {
    const options = Object.assign({}, qrOpts, { text: this.data.qrText });
    drawQrcode(options);
  },
  redraw() {
    drawQrcode(Object.assign({}, qrOpts, { text: this.data.qrText }));
  },
  download() {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      destHeight: 300,
      destWidth: 300,
      canvasId: 'idcardQrcode',
      fileType: 'png',
      success(res) {
        let tempPath = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: tempPath,
          success(res1) {
            console.log(res1);
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1500,
            });
          },
        });
      },
      fail(err) {
        console.log(err);
      },
    });
  },
  /** Methods End */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.draw();
  },

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
  onPullDownRefresh: function () {
    this.redraw();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
