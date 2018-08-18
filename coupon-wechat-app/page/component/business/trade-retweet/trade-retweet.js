let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: 0,
    storeId:0,
    store:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log('trade-retweet页面', e)
    let storeId = e.storeId || 0 // 必须参数
    this.setData({
      storeId: storeId
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/business/tradeRetweets', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/business/tradeRetweets', type: 1 })
  },

  /**
   * tab切换
   */
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  /**
   * 主页按钮
   */
  onHomeBtn: function () {
    var itemList = ['返回主页']
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#343434",
      success: function (res) {
        console.log(res)
        if (!res.cancel) {
          console.log(itemList[res.tapIndex])
          if (0 === res.tapIndex) {
            wx.reLaunch({
              url: '../../coupon/index/index'
            })
            return
          }
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})