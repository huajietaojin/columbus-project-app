// page/component/pay/result/result.js

let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;


const formatMoney = function(fen) {
  return fen / 100;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordUnid: '',
    loading: false,
    paySucess: false,
    originPrice: 0,
    finalPrice: 0,
    finalCut: 0,
    computeRecord: null,
    couponUsage: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log("付款结果页面", e)
    let recordUnid = e.recordUnid

    let couponUsage = wx.getStorageSync('TEMP-COUPON-USAGE')

    this.setData({
      recordUnid: recordUnid,
      couponUsage: couponUsage,
      originPrice: 0,
      finalPrice: 0,
      finalCut: 0,
      storeName: couponUsage.store_name,
      storeLogo: couponUsage.store_logo
    })

    this.getComputePriceRecord()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    weixinService.syncBrowseRecord({
      path: '/pay/result',
      type: 1
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (this.data.paySucess) {
      let record = this.data.computeRecord
      // weixinService.http(configUrl.system_api_server + '/wechat/messages/consumer-records',
      //   'POST',
      //   record)
    }
    wx.removeStorageSync('TEMP-DISCOUNT-COMPUTE-RECORD')
    wx.removeStorageSync('TEMP-COUPON')
    wx.removeStorageSync('TEMP-COUPON-USAGE')
    weixinService.syncBrowseRecord({
      path: '/pay/result',
      type: 2
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 获取消费记录
   */
  getComputePriceRecord: function() {
    let recordUnid = this.data.recordUnid
    let record = wx.getStorageSync('TEMP-DISCOUNT-COMPUTE-RECORD')
    if (record && recordUnid === record.unid) {
      this.setData({
        computeRecord: record,
        originPrice: formatMoney(record.origin_price_fen),
        finalPrice: formatMoney(record.final_price_fen),
        finalCut: formatMoney(record.final_cut_fen),
      })
      console.log('[DiscountComputeRecord结果11]', record)
      return
    }

    weixinService.http(configUrl.service_api_server + "/discount/compute/records/" + recordUnid)
      .then(res => {
        console.log('[DiscountComputeRecord结果]', res)
        this.setData({
          // couponItem: res,
          computeRecord: res,
          originPrice: formatMoney(res.origin_price_fen),
          finalPrice: formatMoney(res.final_price_fen),
          finalCut: formatMoney(res.final_cut_fen),
        })
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[DiscountComputeRecord错误]', err)
      })
  },

  // requestPayment: function () {
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // }
  requestPayment: function() {
    var self = this

    self.setData({
      loading: true
    })
    // 此处需要先调用wx.login方法获取code，然后在服务端调用微信接口使用code换取下单用户的openId
    // 具体文档参考https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html?t=20161230#wxloginobject
    let openid = wx.getStorageSync('WX-OPENID')
    let record = self.data.computeRecord
    let couponUsage = self.data.couponUsage
    let param = {
      openid: openid,
      trade_compute_unid: record.unid,
      body: couponUsage.store_name
    }
    weixinService.http(configUrl.service_api_server + '/trade/payment/unifiedorder/wechat/discount',
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
          success: function(res) {
            console.log('success', res)
            self.setData({
              paySucess: true
            })
            self.closeUsageState()
            wx.navigateBack({
              delta: 1
            })
          },
          fai: function(res) {
            console.log('fai', res)
          },
          complete: function(res) {
            console.log('complete', res)
            self.setData({
              loading: false
            })
          }
        })
      }).catch(errMsg => {
        console.log('unified order failed', errMsg)
        wx.showToast({
          title: '没点中',
          image: '/image/error_white.png'
        })
        self.setData({
          loading: false
        })
      })
  },

  closeUsageState: function() {
    let usageUnid = this.data.couponUsage.unid
    weixinService.http(configUrl.service_api_server + '/coupons/usages/' + usageUnid + '/state',
      'PUT',
      {}).catch(err2 => {
      console.log('confirm state error', err2)
    })
  }

})