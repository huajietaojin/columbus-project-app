// page/component/store/main/main.js
// const weixinService = require('../../../../util/lib/weixin.service.js');
var app = getApp();
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
    console.log('coupon-retweet页面', e)
    let storeId = e.storeId || 0 // 必须参数
    this.setData({
      storeId: storeId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: 'couponRetweet', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: 'couponRetweet', type: 1 })
  },

  /**
   * tab切换
   */
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
})