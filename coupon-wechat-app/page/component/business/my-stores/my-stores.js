let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log('my-stores页面', e)
    let firmId = e.firmId || 0  // 必须参数
    this.setData({
      firmId: firmId
    })
    this.getStoresList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/bussiness/my-stores', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/bussiness/my-stores', type: 2 })
  },
 
  /**
   * 获取收款记录
   */
  getStoresList: function () {
    weixinService.http(configUrl.service_api_server + '/stores?firm_id=' + this.data.firmId)
      .then(res => {
        console.log('[获取我的门店结果]', res)
        this.setData({
          list: res.list
        })
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取我的门店错误]', err)
      })
  }
})