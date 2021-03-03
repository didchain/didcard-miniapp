// pages/midoprator/index.js
import drawQrcode from '../../libs/qrcode/weapp.qrcode.js';
// import bls from '../../libs/bls/bls.js';
const qrOpts = {
  width: 260,
  height: 260,
  canvasId: 'idcardQrcode',
  typeNumber: 8,
  callback(e) {
    // console.log(e);
  },
  image: {
    imageResource: '../../images/icons/logo_center.png',
    dx: 90,
    dy: 90,
    dWidth: 80,
    dHeight: 80,
  },
};
const xqs = ['XXX小区', '明天末日小区', '天上人小区', '富力城C区', '东方A区'];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    qrText: '福利是的撒旦发送到发斯蒂芬',
    index: 0,
    xqs,
  },
  /** Methods Begin */
  draw() {
    const options = Object.assign({}, qrOpts, { text: this.data.xqs[this.data.index] });
    drawQrcode(options);
  },
  redraw() {
    const options = Object.assign({}, qrOpts, {
      text: this.data.xqs[this.data.index] + new Date().getTime(),
    });
    drawQrcode(options);
  },
  download() {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 260,
      height: 260,
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
  changeArea(e) {
    const { detail } = e;
    console.log(detail);
    const idx = detail.value ? parseInt(detail.value) : 0;
    this.setData({ index: idx });
    this.redraw();
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
