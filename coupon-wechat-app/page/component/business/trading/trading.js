let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    hasMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let firmId = e.firmId || 0 // 必须参数
    this.setData({
      firmId: firmId
    })

    this.getTradingList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/bussiness/trading', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/bussiness/trading', type: 2 })
  },

  /**
   * 获取收款记录
   */
  getTradingList: function () {
    weixinService.http(configUrl.statistic_api_server + '/merchants/trades/records?firm_id=' + this.data.firmId)
      .then(res => {
        console.log('[获取收款记录结果]', res)
        this.setData({
          list: res.list
        })
        if (res.list.length <= 0) {
          this.setData({
            hasMore: false
          })
        }
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取收款记录记录错误]', err)
      })
  }

})