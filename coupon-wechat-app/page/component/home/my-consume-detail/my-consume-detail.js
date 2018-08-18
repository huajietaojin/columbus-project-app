let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

function toDate(number) {
  var date = new Date(number);
  var Y = date.getFullYear() + '年';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + '日';
  var h = date.getHours();
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  return (Y + M + D + " " + h + ":" + m)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    date:"",
    unid:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let isIndex = wx.getStorageSync('WX-INDEX')
    console.log('是否有INDEX', isIndex)

    let unid = e.unid  // 必须参数
    this.setData({
      unid: unid
    })
    this.getDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/mycoupon', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/mycoupon', type: 2 })
  },

  /**
   * 获取消费记录详情
   */
  getDetail: function () {
    let openid = wx.getStorageSync('WX-OPENID')
    weixinService.http(configUrl.statistic_api_server + '/consumers/trades/records/' + this.data.unid)
      .then(res => {
        console.log('[获取我的消费记录结果]', res)
        this.setData({
          detail: res,
          date: toDate(res.create_at)
        })
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取我的消费记录错误]', err)
      })
  },
})