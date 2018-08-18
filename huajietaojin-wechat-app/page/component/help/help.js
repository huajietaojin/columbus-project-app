let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;
let interval;
let varName;
let ctx = wx.createCanvasContext('canvasArcCir');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    couponId: 0,
    storeName: '',
    couponItem: {},
    couponUsage: {
      require_retweets: 1,
      retweets: 0
    },
    showModal: false,
    showCircle: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let couponId = e.couponId || 0
    this.setData({
      couponId: couponId,
    })
    wx.showShareMenu({
      withShareTicket: true,
    })

    this.getConponDetail()
    this.getCountUsage()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/help', type: 1 })

    //创建并返回绘图上下文context对象。
    var cxt_arc = wx.createCanvasContext('canvasCircle');
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#eaeaea');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    cxt_arc.arc(75, 75, 71, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.draw();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/help', type: 2 })
  },

  /**
   * 绘制圆形进度条
   */
  drawCircle: function () {
    clearInterval(varName);
    function drawArc(s, e) {
      ctx.setFillStyle('white');
      ctx.clearRect(0, 0, 150, 150);
      ctx.draw();
      var x = 75, y = 75, radius = 71;
      var gradient = ctx.createLinearGradient(2 * x, x, 0);
      gradient.addColorStop("0", "#2661DD");
      gradient.addColorStop("0.5", "#40ED94");
      gradient.addColorStop("1.0", "#5956CC");
      ctx.setLineWidth(5);
      ctx.setStrokeStyle(gradient);
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(x, y, radius, s, e, false);
      ctx.stroke()
      ctx.draw()
    }
    var step = 1, startAngle = 1.5 * Math.PI, endAngle = 0;
    var animation_interval = 300, n = this.data.couponUsage.require_retweets, m = this.data.couponUsage.retweets;
    var animation = function () {
      if (step <= m) {
        endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
        drawArc(startAngle, endAngle);
        step++;
      } else {
        clearInterval(varName);
      }
    };
    varName = setInterval(animation, animation_interval);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.getCountUsage(true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    console.log("onShareAppMessage", ops);
    let couponItem = this.data.couponItem
    // 转发携带的标记
    let usageUnid = this.data.couponUsage.unid
    return weixinService.buildCouponShare({ couponItem: couponItem, usageUnid: usageUnid })
  },

  /**
   * 获取现金券详情
   */
  getConponDetail() {
    let couponItem = wx.getStorageSync('TEMP-COUPON')
    if (couponItem && this.data.couponId == couponItem.id) {
      this.setData({
        couponItem: couponItem
      })
      console.log('couponItem有缓存', couponItem)
      return
    }
    weixinService.http(configUrl.service_api_server + "/coupons/" + this.data.couponId)
      .then(res => {
        console.log('[获取现金券详情最后结果]', res)
        this.setData({
          couponItem: res
        })
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取现金券详情有错误]', err)
      })
  },

  /**
   * 获取已经转发次数
   */
  getCountUsage(force = false) {
    console.log('getCountUsage force', force)
    let couponId = this.data.couponId
    if (!force) {
      let couponUsage = wx.getStorageSync('TEMP-COUPON-USAGE')
      if (couponUsage && couponId == couponUsage.coupon_id) {
        this.setData({
          couponUsage: couponUsage
        })
        this.drawCircle() // 圆形
        console.log('couponUsage有缓存')
        return
      }
    }
    let openid = wx.getStorageSync('WX-OPENID')
    weixinService.http(configUrl.service_api_server + '/wechat/users/' + openid + '/coupons/' + couponId + '/usages')
      .then(res => {
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.hideLoading()
        console.log('[CountUsage结果]', res)
        this.setData({
          couponUsage: res
        })
        this.drawCircle() // 圆形
        wx.setStorageSync('TEMP-COUPON-USAGE', res)
        this.showEnableTip()
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('CountUsage有错误]', err)
      })
  },

  showEnableTip: function () {
    let couponUsage = this.data.couponUsage
    if (couponUsage && couponUsage.retweets >= couponUsage.require_retweets) {
      wx.showToast({
        title: '现金券可用',
        icon: 'success',
        duration: 2000
      })
    }
  },

  /**
   * 打开弹窗
   */
  openModal() {
    this.setData({
      showModal: true,
      showCircle: false
    })
  },

  /**
   * 关闭弹窗
   */
  closeModal() {
    this.setData({
      showModal: false,
      showCircle: true
    })
  }
})