let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    hasConsume:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let isIndex = wx.getStorageSync('WX-INDEX')
    console.log('是否有INDEX', isIndex)

    this.getConsumerRecord()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/home/consume', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/home/consume', type: 2 })
  },

  /**
   * 获取我的消费记录
   */
  getConsumerRecord: function () {
    let openid = wx.getStorageSync('WX-OPENID')
    weixinService.http(configUrl.statistic_api_server + '/consumers/trades/records?openid=' + openid)
      .then(res => {
        console.log('[获取我的消费记录结果]', res)
        this.setData({
          list: res.list
        })
        if (res.list.length <= 0) {
          this.setData({
            hasConsume: false
          })
        }
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取我的消费记录错误]', err)
      })
  },

})