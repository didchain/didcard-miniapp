class WxApi {
  constructor(wx) {
    this.wx = wx;
  }
}

function _promisify(func) {
  if (typeof func !== 'function') return fn;
  return (arg = {}) =>
    new Promise((resolve, reject) => {
      func(
        Object.assign(args, {
          success: resolve,
          fail: reject,
        })
      );
    });
}

export default WxApi;
