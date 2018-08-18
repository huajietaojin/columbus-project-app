let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponId: 0,
    couponItem: {},
    couponUsage: {},
    storeName: '门店',
    originPrice: null,
    finalPrice: 0,
    disabled: true,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log("付款计算页面", e)
    let couponId = e.couponId || 0 // 必需参数

    this.setData({
      couponId: couponId
    })

    this.getConponDetail()
    this.getCountUsage()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/pay/index', type: 1 });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/pay/index', type: 2 });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
  },

  /**
   * 获取现金券详情
   */
  getConponDetail() {
    let couponId = this.data.couponId

    let couponItem = wx.getStorageSync('TEMP-COUPON')
    if (couponItem && couponId == couponItem.id) {
      this.setData({
        couponItem: couponItem,
        storeName: couponItem.store_name
      })
      console.log('getConponDetail缓存', couponItem)
      return
    }

    weixinService.http(configUrl.service_api_server + "/coupons/" + couponId)
      .then(res => {
        console.log('[ConponDetail结果]', res)
        this.setData({
          couponItem: res,
          storeName: res.store_name
        })
        wx.setStorageSync('TEMP-COUPON', res)
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[ConponDetail错误]', err)
      })
  },

  /**
   * 获取CountUsage
   */
  getCountUsage() {
    let couponId = this.data.couponId
    let couponUsage = wx.getStorageSync('TEMP-COUPON-USAGE')
    if (couponUsage && couponId == couponUsage.coupon_id) {
      this.setData({
        retweets: couponUsage.retweets,
        couponUsage: couponUsage
      })
      console.log('getCountUsage缓存')
      return
    }

    let openid = wx.getStorageSync('WX-OPENID')
    weixinService.http(configUrl.service_api_server + '/wechat/users/' + openid + '/coupons/' + couponId + '/usages')
      .then(res => {
        console.log('[CountUsage结果]', res)
        this.setData({
          retweets: res.retweets,
          couponUsage: res
        })
        wx.setStorageSync('TEMP-COUPON-USAGE', res)
      })
      .catch(err => {
        console.log('CountUsage有错误]', err)
        wx.removeStorageSync('TEMP-COUPON-USAGE')
        weixinService.showToast(err)
      })
  },

  /**
   * 输入金额实时计算优惠金额
   */
  bindInputMoney: function (e) {
    this.setData({
      originPrice: e.detail.value
    })
  },

  /**
   * 计算优惠
   */
  onPay: function (e) {
    //console.log('点击计算优惠', e);
    let originPrice = e.detail.value.originPrice
    let formId = e.detail.formId
    this.submitPay(originPrice, formId)
  },


  submitPay(originPriceVal, formId) {
    console.log('提交计算优惠', originPriceVal, formId);
    let originPrice = originPriceVal
    if (!originPrice || originPrice == null || originPrice < 0.01) {
      weixinService.showToast('请输入消费金额')
      return;
    }
    let couponItem = this.data.couponItem
    let requireMoney = parseFloat(couponItem.base_price)
    //console.log('计算条件', requireMoney, originPrice);
    if (requireMoney > originPrice) {
      weixinService.showToast('消费金额不足' + requireMoney + '元，无法使用减免优惠')
      return;
    }
    this.submitToServer(originPriceVal, formId);
  },

  /**
 * 向服务端请求确认消费优惠券
 */
  submitToServer(originPriceVal, formId) {
    this.setData({
      loading: true
    })
    let originPrice = parseInt(Math.round(originPriceVal * 100)) // 转成分
    console.log('转成分', originPriceVal, originPrice);
    let couponItem = this.data.couponItem
    let couponUsage = this.data.couponUsage
    let userInfo = wx.getStorageSync('WX-USER')
    let params = {
      openid: userInfo.openid,
      mobile: userInfo.mobile,
      coupon_id: couponItem.id,
      store_id: couponItem.store_id,
      usage_unid: couponUsage.unid,
      origin_price_fen: originPrice,
      form_id: formId
    }
    const that = this
    weixinService.http(configUrl.service_api_server + "/trade/compute/price/records",
      "POST",
      params
    ).then(res => {
      console.log('[计算结果]', res)
      wx.setStorageSync('TEMP-DISCOUNT-COMPUTE-RECORD', res)
      that.setData({
        loading: false
      })
      wx.redirectTo({
        url: '../result/result?recordUnid=' + res.unid
      })
    })
      .catch(err => {
        console.log('[有错误]', err)
        wx.removeStorageSync('TEMP-COUPON-USAGE')
        weixinService.showToast(err)
        that.setData({
          loading: false
        })
      })
  }
  /**
   * 监听输入
   */
  // bindinputMoney(e) {
  //   console.log('监听输入', e.detail)
  //   let money = e.detail.value
  //   this.setData({
  //     'originPrice': money
  //   })
  // },
})