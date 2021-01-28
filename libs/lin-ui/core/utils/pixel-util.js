class PixelUtil {
  constructor(t) {
    this.systemInfo = t;
  }
  px2rpx(t) {
    return (750 / this.systemInfo.screenWidth) * t;
  }
  rpx2px(t) {
    return (t / 750) * this.systemInfo.screenWidth;
  }
}
const pixelUtil = new PixelUtil(wx.getSystemInfoSync());
export default pixelUtil;
