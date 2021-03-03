export const tabbar = {
  color: '#FFF',
  selectedColor: '',
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
};
