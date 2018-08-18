let app = getApp();
const weixinService = app.globalData.weixinService;

function toDate(number) {
  var date = new Date(number);
  var Y = date.getFullYear() + '/';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();;
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  return (Y + M + D + " " + h + ":" + m)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    firmInfo: {
      legal_name: '-',
      license_code: '-',
      legal_person: '-',
      legal_address: '-',
      license_picture: ''
    },
    updateAt: '-',
    hasFirmInfo: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log("企业设置页面", e)
    try {
      var firmInfo = wx.getStorageSync('BUSINESS-FIRM-INFO')
      if (firmInfo) {
        this.setData({
          hasFirmInfo: true,
          firmInfo: firmInfo,
          updateAt: toDate(firmInfo.update_at)
        })
      } else {
        this.setData({
          hasFirmInfo: false,
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/bussiness/setting', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('BUSINESS-FIRM-INFO')
    weixinService.syncBrowseRecord({ path: '/bussiness/setting', type: 2 })
  },

  /**
   * 退出商家登录
   */
  loginOutBusiness: function () {
    wx.removeStorageSync('BUSINESS-FIRM-INFO')
    wx.removeStorageSync('MERCHANT-USER-TOKEN');
    wx.removeStorageSync('MERCHANT-USER-UNID');
    wx.reLaunch({
      url: '../../coupon/index/index'
    })
  }

})