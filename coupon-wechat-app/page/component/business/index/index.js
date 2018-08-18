let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    trading: {
      total: 0,
      amount: 0
    },
    firm: {},
    firmId: 0,
    statisticArray: ['现金券转发统计数据', '商家转发统计数据'],
    statisticIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

    this.getFirmInfo() //获取企业信息

    this.getTradingInfo() // 获取今日交易笔数
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/business/index', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/business/index', type: 2 })
  },

  /**
   * 获取今日交易笔数
   */
  getTradingInfo: function () {
    let userUnid = wx.getStorageSync('MERCHANT-USER-UNID')
    weixinService.http(configUrl.statistic_api_server + '/merchants/trades/records/today-amount/users/' + userUnid)
      .then(res => {
        console.log('[获取今日交易笔数最后结果]', res)
        this.setData({
          'trading.total': res.total,
          'trading.amount': res.amount
        })
      })
      .catch(err => {
        console.log('[获取今日交易笔数有错误]', err)
      })
  },


  /**
   * 选择统计类
   */
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let statisticIndex = e.detail.value
    this.setData({
      statisticIndex: statisticIndex
    })
    if (statisticIndex == 0) {
      this.intoCouponChart()
    } else {
      this.intoStoreChart()
    }
  },

  /**
   * 点击进入经营报表
   */
  intoReport: function () {
    if (this.checkFirmInfo() == false) {
      return
    }
    wx.navigateTo({
      url: '../../echart/money-chart/money-chart?firmId=' + this.data.firmId
    })
  },

  /**
   * 点击进入现金券转发统计数据
   */
  intoCouponChart: function () {
    if (this.checkFirmInfo() == false) {
      return
    }
    wx.navigateTo({
      url: '../../echart/coupon-chart/coupon-chart?firmId=' + this.data.firmId
    })
  },

  /**
   * 点击进入商家转发统计数据
   */
  intoStoreChart: function () {
    if (this.checkFirmInfo() == false) {
      return
    }
    wx.navigateTo({
      url: '../../echart/store-chart/store-chart?firmId=' + this.data.firmId
    })
  },

  /**
   * 点击进入我的门店
   */
  intoMyStores: function () {
    if (this.checkFirmInfo() == false) {
      return
    }
    wx.navigateTo({
      url: '../my-stores/my-stores?firmId=' + this.data.firmId
    })
  },

  /**
   * 点击进入我的现金券
   */
  intoMyCoupon: function () {
    if (this.checkFirmInfo() == false) {
      return
    }
    wx.navigateTo({
      url: '../my-coupon/my-coupon?firmId=' + this.data.firmId
    })
  },

  /**
   * 点击进入收款记录页面
   */
  intoTrading: function () {
    if (this.checkFirmInfo() == false) {
      return
    }
    wx.navigateTo({
      url: '../trading/trading?firmId=' + this.data.firmId
    })
  },

  /**
   * 点击进入企业设置
   */
  intoSetting: function () {
    // if (this.checkFirmInfo() == false) {
    //   return
    // }
    wx.navigateTo({
      url: '../setting/setting'
    })
  },

  /**
   * 显示没有企业提示
   */
  checkFirmInfo: function () {
    let firm = this.data.firm
    if (!firm || !firm.license_code || firm.license_code == '') {
      wx.showToast({
        'title': '您还未登记企业信息',
        'mask': true,
        'icon': 'none',
        'duration': 2000,
      })
      return false
    }
    return true
  },

  /**
   * 获取企业信息 
   */
  getFirmInfo: function () {
    let userUnid = wx.getStorageSync('MERCHANT-USER-UNID')
    weixinService.http(configUrl.service_api_server + '/firms/users/' + userUnid)
      .then(res => {
        console.log('[获取企业信息结果]', res)
        this.setData({
          'firm': res,
          'firmId': res.id,
        })

        wx.setStorageSync('BUSINESS-FIRM-INFO', res)

        // 设置企业名称
        if (res.legal_name && res.legal_name !== '') {
          wx.setNavigationBarTitle({
            title: res.legal_name
          })
        }
      })
      .catch(err => {
        console.log('[获取企业信息有错误]', err)
      })
  }
})