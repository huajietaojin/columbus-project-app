let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

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
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log('my-coupon页面', e)
    let firmId = e.firmId || 0  // 必须参数
    this.setData({
      firmId: firmId
    })
    this.getCouponList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/bussiness/my-coupon', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/bussiness/my-coupon', type: 2 })
  },
 
  /**
   * 获取收款记录
   */
  getCouponList: function () {
    weixinService.http(configUrl.service_api_server + '/coupons?firm_id=' + this.data.firmId)
      .then(res => {
        console.log('[获取我的现金券结果]', res)
        let list = res.list, i = 0, len = list.length;
        if (len > 0) {
          for(;i < len; i++) {
            list[i].start_at = toDate(list[i].start_at);
            list[i].expire_at = toDate(list[i].expire_at)
          }
        }
        this.setData({
          list: list
        })
        console.log('[获取我的现金券结果111]', this.data.list)
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取我的现金券错误]', err)
      })
  }
})