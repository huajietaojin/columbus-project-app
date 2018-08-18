// page/component/pay/result/result.js
// var paymentUrl = 'https://apiwechat.huajietaojin.cn/system-proxy/wechat/pay/trade/unifiedorder'
let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordUnid: '',
    loading: false,
    paySucess: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log("付款结果页面", e)
    let recordUnid = e.recordUnid

    this.setData({
      recordUnid: recordUnid,
      consumerRecord: {},
      originPrice: 0,
      finalPrice: 0,
      finalCut: 0,
      storeName: '门店',
      storeLogo: ''
    })

    this.getConsumerRecord()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/pay/result', type: 1 });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.paySucess) {
      let record = this.data.consumerRecord
      weixinService.http(configUrl.system_api_server + '/wechat/messages/consumer-records',
        'POST',
        record)
    }
    wx.removeStorageSync('TEMP-CONSUMER-RECORD')
    wx.removeStorageSync('TEMP-COUPON')
    wx.removeStorageSync('TEMP-COUPON-USAGE')
    weixinService.syncBrowseRecord({ path: '/pay/result', type: 2 });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取消费记录
   */
  getConsumerRecord: function () {
    let recordUnid = this.data.recordUnid
    let consumerRecord = wx.getStorageSync('TEMP-CONSUMER-RECORD')
    if (consumerRecord && recordUnid === consumerRecord.unid) {
      this.setData({
        consumerRecord: consumerRecord,
        originPrice: consumerRecord.origin_price,
        finalPrice: consumerRecord.final_price,
        finalCut: consumerRecord.final_cut,
        storeName: consumerRecord.store_name,
        storeLogo: consumerRecord.store_logo
      })
      console.log('[ConsumerRecord结果11]', consumerRecord)
      return
    }

    weixinService.http(configUrl.statistic_api_server + '/consumers/trades/records' + recordUnid)
      .then(res => {
        console.log('[ConsumerRecord结果]', res)
        this.setData({
          // couponItem: res,
          originPrice: res.origin_price,
          finalPrice: res.final_price,
          finalCut: res.final_cut,
          storeName: res.store_name,
          storeLogo: res.store_logo
        })
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[ConsumerRecord错误]', err)
      })
  },

  // requestPayment: function () {
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // }
  requestPayment: function () {
    var self = this

    self.setData({
      loading: true
    })
    // 此处需要先调用wx.login方法获取code，然后在服务端调用微信接口使用code换取下单用户的openId
    // 具体文档参考https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html?t=20161230#wxloginobject
    let openid = wx.getStorageSync('WX-OPENID')
    let record = self.data.consumerRecord
    let param = {
      openid: openid,
      total_fee: record.final_price * 100,
      body: record.store_name,
      trade_record_unid: record.unid,
      usage_unid: record.usage_unid,
      firm_id: record.firm_id,
      store_id: record.store_id,
      coupon_id: record.coupon_id
    }
    weixinService.http(configUrl.system_api_server + '/wechat/pay/trade/unifiedorder',
      'POST',
      param)
      .then(payargs => {
        console.log('unified order success, response is:', payargs)
        wx.requestPayment({
          timeStamp: payargs.time_stamp,
          nonceStr: payargs.nonce_str,
          package: payargs.package_value,
          signType: payargs.sign_type,
          paySign: payargs.pay_sign,
          success: function (res) {
            console.log('success', res)
            self.setData({
              paySucess: true
            })
            weixinService.http(configUrl.statistic_api_server + '/consumers/trades/records/' + record.unid + '/state',
              'PUT',
              record).catch(err2 => {
                console.log('confirm state error', err2)
              })
            wx.navigateBack({
              delta: 1
            })
          },
          fai: function (res) {
            console.log('fai', res)
          },
          complete: function (res) {
            console.log('complete', res)
            self.setData({
              loading: false
            })
          }
        })
      }).catch(errMsg => {
        console.log('unified order failed', errMsg)
        wx.showToast({
          title: '暂时无法支付',
        })
        self.setData({
          loading: false
        })
      })
  }
})