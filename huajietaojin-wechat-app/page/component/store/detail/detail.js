let app = getApp();
const weixinService = app.globalData.weixinService;
const statisticService = app.globalData.statisticService;
const configUrl = app.globalData.configUrl;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    product: {
      name: '·',
      intro: '·',
    },
    hasMore: true,
    showHomeBtn: true,
    actionSheetHidden: true,
    actionSheetItems: [{ 'bindtap': 'none', 'txt': '分享给好友' }, { 'bindtap': 'backHome', 'txt': '返回首页' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log("产品详情页面", e)

    // 设置id
    let id = e.id || 0
    this.setData({
      id: id
    })

    this.getProductDetail()
  },

  /**
   * 获取产品列表
   */
  getProductDetail() {
    weixinService.http(configUrl.service_api_server + "/products/" + this.data.id + '/extra')
      .then(res => {
        this.setData({
          product: res
        })
        if (res.show_pictures.length <= 0) {
          this.setData({
            hasMore: false
          })
        }
        console.log('[获取产品最后结果]', res)
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取产品有错误]', err)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 浏览统计
    statisticService.syncProductBrowse({ productId: this.data.id })
    weixinService.syncBrowseRecord({ path: '/product/detail', type: 1 });
  },

  /**
     * 生命周期函数--监听页面卸载
     */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/product/detail', type: 2 });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    let product = that.data.product;
    let productId = product.id

    return {
      title: product.name,
      path: 'page/component/store/detail/detail?id=' + productId,
      imageUrl: product.cover_picture,
      success: function (res) {
        // 转发成功
        console.log("转发成功", res);
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败", res);
      }
    }
  },

  /**
   * 返回主页
   */
  backHome: function () {
    wx.reLaunch({
      url: '../../coupon/index/index'
    })
  },

  /**
   * 主页显示按钮
   */
  onHomeBtnShow: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
    return
  },
  /**
   * 弹幕隐藏显示
   */
  actionSheetChange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  }

})