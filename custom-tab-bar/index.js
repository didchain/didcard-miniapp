// pages/widgets/vtab-bar/cust-tabbar.js
import { sigEid4Verify } from './sig-util.js';
import Log from '../libs/log/index';
const app = getApp();

const BASE_URL = 'https://wechat.baschain.cn/api/';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabtype: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0, // 选中的
    color: 'rgba(12, 18, 61, 1)',
    selectedColor: '#F6C330',
    borderStyle: '#F0F1F3',
    backgroundColor: '#FFFFFF',
    list: [
      {
        key: 'home',
        pagePath: '/pages/home/index',
        iconPath: '/images/nav/home_off_icon@3x.png',
        selectedIconPath: '/images/nav/home_on_icon@3x.png',
        text: '首页',
      },
      {
        key: 'scaner',
        iconPath: '/images/nav/Qr_tab_icon@3x.png',
        selectedIconPath: '/images/nav/Qr_tab_icon@3x.png',
        text: '',
        tabtype: 'scanCode',
      },
      {
        key: 'about',
        pagePath: '/pages/wcenter/index/index',
        iconPath: '/images/nav/acc_off_icon@3x.png',
        selectedIconPath: '/images/nav/acc_on_icon@3x.png',
        text: '我的',
      },
    ],
    isIphoneX: app.globalData.isIphoneX, //适配IphoneX的屏幕底部横线
  },
  attached() {},

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const dataset = e.currentTarget.dataset;
      const path = dataset.path;
      const index = dataset.index;
      const tabtype = dataset.tabtype;

      if (!!tabtype) {
        const webox = wx.$webox;
        if (webox.hasOpened()) {
          let pk = webox.getKeypair().secretKey;
          const did = webox.getSafeWallet().did;
          wx.scanCode({
            onlyFromCamera: true,
            success: function (res) {
              const scantext = res.result;
              console.log('Scaner>>>>', scantext);
              let tip = '二维码信息不正确';
              let didOk = false;
              try {
                let dataObj = JSON.parse(scantext);
                if (typeof dataObj !== 'object' || !dataObj.auth_url || !dataObj.random_token) {
                  // did = keystore.did;
                  didOk = true;
                  throw new Error('miss property.');
                }
                const signedData = sigEid4Verify({ ...dataObj, did }, pk);
                console.log('>>>>>>>>>>', signedData);
                wx.request({
                  url: BASE_URL + 'verify',
                  data: signedData,
                  method: 'POST',
                  success: function (resp) {
                    const { statusCode, data } = resp;
                    console.log('Success>>>>', statusCode, data);
                    if (!!data && statusCode === 200) {
                      const bizCode = data.result_code; // 0 , 2
                      if (bizCode === 0) {
                        wx.showToast({
                          icon: 'success',
                          title: '校验成功',
                        });
                      } else if (bizCode === 2) {
                        wx.showToast({
                          icon: 'error',
                          title: '账号不存在',
                        });
                      } else {
                        wx.showToast({
                          icon: 'error',
                          title: '校验失败',
                        });
                      }
                    } else {
                      Log.error('API verify request fail', statusCode);
                      wx.showToast({
                        icon: 'error',
                        title: '验证服务忙.',
                      });
                    }
                  },
                  fail: function (err) {
                    // console.log('API fail', err);
                    Log.error('API verify fail', err);
                    wx.showToast({
                      icon: 'error',
                      title: '校验失败',
                    });
                  },
                });
              } catch (e) {
                console.log(e);
                wx.showToast({
                  icon: 'error',
                  title: '二维码不正确',
                });
              }
            },
            complete: function () {},
          });
        } else {
          wx.showToast({
            icon: 'error',
            title: '请先解锁',
          });
        }
      } else {
        wx.switchTab({
          url: path,
        });
        this.setData({ selected: index });
      }
    },
  },
});
