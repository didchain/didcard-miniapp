// pages/widgets/vtab-bar/cust-tabbar.js
const app = getApp();
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
        wx.scanCode({
          onlyFromCamera: true,
          success: function (res) {
            // console.log('Scaner>>>>', res);
            // wx.navigateTo({
            //   url: path,
            // });
            const scantext = res.result;
            let did = '二维码中ID信息不正确';
            let didOk = false;
            try {
              const keystore = JSON.parse(scantext);
              if (typeof keystore === 'object' && keystore.did) {
                did = keystore.did;
                didOk = true;
              }
            } catch (e) {}

            wx.showModal({
              cancelColor: '#F5C95C',
              cancelText: '取消',
              confirmText: '开锁',
              title: '',
              content: did,
              success: function (res) {
                if (res.cancel) {
                } else if (res.confirm) {
                  if (!didOk) {
                    wx.showToast({
                      icon: 'error',
                      title: '二维码不正确',
                    });
                  }
                }
              },
            });
          },
          complete: function () {},
        });
      } else {
        wx.switchTab({
          url: path,
        });
        this.setData({ selected: index });
      }
    },
  },
});
