// 全局定义
const weixinService = require('./util/lib/weixin.service.js');
const statisticService = require('./util/lib/statistic.service.js');
const configUrl = require('./config/config.js');
const INDEX = "page/component/coupon/index/index";
App({
  onLaunch: function (options) {
    console.log('App Launch', options)
    wx.setStorageSync('WX-SCENE', options.scene)

    wx.getSystemInfo({
      success: function (res) {
        // that.setData({
        //   videoHeight: parseInt(res.windowWidth * 0.75)
        // });
        console.log('xxxxx', res)
        wx.setStorageSync('SYSTEM-INFO', res)
        wx.setStorageSync('statusBarHeight', res.statusBarHeight)
      },
      fail: function (res) { }
    });
  },
  onShow: function (options) {
    console.log('App Show', options)
    wx.setStorage({
      key: 'WX-INDEX',
      data: false,
    })

    weixinService.init() // TODO 暂时移到onShow中，发布后移动onLaunch
    weixinService.syncBrowseRecord({ path: 'app', type: 1 })
  },
  onHide: function () {
    console.log('App Hide')
    weixinService.syncBrowseRecord({ path: 'app', type: 2 })
    statisticService.syncAll()
  },
  globalData: {
    hasLogin: false,
    weixinService: weixinService,
    statisticService: statisticService,
    configUrl: configUrl,
  }
})
