let app = getApp();
const weixinService = app.globalData.weixinService;
const statisticService = app.globalData.statisticService;
const configUrl = app.globalData.configUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: 0,
    products: {},
    hasMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log("产品列表页面", e)
    // 统计接收情况
    statisticService.syncStoreReceive({ storeId: e.storeId, tag: e.tag })

    // 设置storeId
    this.setData({
      storeId: e.storeId
    })

    this.getProducts()
  },

  /**
   * 获取产品列表
   */
  getProducts() {
    weixinService.http(configUrl.service_api_server + "/products?enable=true&store_id=" + this.data.storeId)
      .then(res => {
        this.setData({
          products: res.list
        })
        if (res.list.length <= 0) {
          this.setData({
            hasMore: false
          })
        }
        console.log('[获取产品列表最后结果]', res)
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取产品列表有错误]', err)
      })
  },

  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    // 浏览统计
    weixinService.syncBrowseRecord({ path: '/product/list', type: 1 });
  },

  /**
     * 生命周期函数--监听页面卸载
     */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/product/list', type: 2 });
  }

})