let app = getApp();
const weixinService = app.globalData.weixinService;
const statisticService = app.globalData.statisticService;
const configUrl = app.globalData.configUrl;

function toDate(number) {
  var date = new Date(number);
  var Y = date.getFullYear() + '/';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  // var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();;
  // var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  // return (Y + M + D + " " + h + ":" + m)
  return (Y + M + D)
}

Page({

  /**
   */
  data: {
    // shareNum: 0,
    couponItem: {
      force_share: true,
      usage_count: 0
    },
    startAt: '',
    expireAt: '',
    retweets: 0,
    curIndex: 0,
    show: false,
    couponId: 0,
    couponUsage: {
      require_retweets: 1,
      retweets: 0
    },
    actionSheetHidden: true,
    actionSheetItems: [{ 'bindtap': 'none', 'txt': '分享给好友' }, { 'bindtap': 'backHome', 'txt': '返回首页' }],
    enableUseCoupon: false,
    isFirstTimeUsed: false,
    showModal: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showGetUserModal: false, // LJQ：这里为true的时候强制弹窗modal，要获取用户信息的提示
    statusBarHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log("现金券详细页面", e)
    let couponId = e.couponId  // 必须参数
    let usageUnid = e.usageUnid // 可选参数

    if (!couponId) {
      let scan = e.q
      if (scan) {
        scan = decodeURIComponent(scan)
        console.log('scan content', scan)
        let len = scan.length
        let at = scan.indexOf("=")
        couponId = scan.substring(at + 1, len)
        console.log('scan couponId', couponId)
      } else {
        couponId = 0
      }
    }
    wx.removeStorageSync('TEMP-COUPON-USAGE')
    //统计接收情况
    statisticService.syncCouponReceive({ couponId: couponId, usageUnid: usageUnid })

    this.setData({
      couponId: couponId,
      statusBarHeight: wx.getStorageSync('statusBarHeight')
    })

    wx.showShareMenu({
      withShareTicket: true,
    })

    this.isWechatFirstTimeUsed()
    this.getConponDetailExtra()
    weixinService.syncWechatUserInfo().then(res => {
      console.log('syncWechatUserInfo res', res)
      this.setData({
        showGetUserModal: false
      })
    }).catch(err => {
      console.log('syncWechatUserInfo error', err)
      this.setData({
        showGetUserModal: true
      })
    })

    this.isEnableUseCoupon();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    statisticService.syncCouponBrowse({ couponId: this.data.couponId })
    weixinService.syncBrowseRecord({ path: '/coupon/detail', type: 1 });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCountUsage(false)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('TEMP-COUPON-USAGE')
    weixinService.syncBrowseRecord({ path: '/coupon/detail', type: 2 });
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

  closeModal: function () {
    this.setData({
      showModal: false,
      showUseModal: false,
      showStoreModal: false
    })
  },

  openUseModal: function () {
    this.setData({
      showModal: true,
      showUseModal: true
    })
  },
  openStoreModal: function () {
    this.setData({
      showModal: true,
      showStoreModal: true
    })
  },

  /** 
 * 获取用户信息, 从从缓存，再远程
 */
  getUserInfo() {
    weixinService.syncWechatUserInfo().then((res) => {
      this.setData({
        showGetUserModal: false
      })
    }).catch((err) => {
      this.setData({
        showGetUserModal: true
      })
      console.log('获取用户信息失败sssss', err)
    })
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
   * 用户是否第一次使用
   */
  isWechatFirstTimeUsed: function () {
    let user = wx.getStorageSync('WX-USER')
    // 没有用户信息或还没绑定手机定义为第一次使用
    let isFirstTimeUsed = (user == null) || (user.mobile == null || user.mobile == '')
    console.log('isFirstTimeUsed', isFirstTimeUsed)
    this.setData({
      isFirstTimeUsed: isFirstTimeUsed
    })
    return isFirstTimeUsed
  },

  /**
   * 获取现金券详情
   */
  getConponDetailExtra: function () {
    let couponId = this.data.couponId
    weixinService.http(configUrl.service_api_server + '/coupons/' + couponId + '/extra')
      .then(res => {
        console.log('[获取现金券详情最后结果]', res)
        this.setData({
          couponItem: res,
          startAt: toDate(res.start_at),
          expireAt: toDate(res.expire_at)
        })
        wx.setStorageSync('TEMP-COUPON', res)
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取现金券详情有错误]', err)
      })
  },

  /**
   * 获取已经转发次数
   */
  getCountUsage: function (force = false) {
    console.log('getCountUsage force', force)
    let couponId = this.data.couponId
    if (!force) {
      let couponUsage = wx.getStorageSync('TEMP-COUPON-USAGE')
      if (couponUsage && couponId == couponUsage.coupon_id) {
        this.setData({
          retweets: couponUsage.retweets,
          couponUsage: couponUsage
        })
        console.log('getCountUsage有缓存')
        return
      }
    }
    let openid = wx.getStorageSync('WX-OPENID')
    weixinService.http(configUrl.service_api_server + '/wechat/users/' + openid + '/coupons/' + couponId + '/usages')
      .then(res => {
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.hideLoading()
        console.log('[转发次数最后结果]', res)
        wx.setStorageSync('TEMP-COUPON-USAGE', res)
        this.setData({
          retweets: res.retweets,
          couponUsage: res
        })
        this.isEnableUseCoupon();
      })
      .catch(err => {
        this.isEnableUseCoupon();
        weixinService.showToast(err)
        console.log('[转发次数有错误]', err)
      })
  },

  /**
   * 点击使用按钮
   */
  useCoupon: function () {
    console.log('点击使用按钮');
    this.isEnableUseCoupon();
    let user = wx.getStorageSync('WX-USER')
    //console.log("检查用户", user)
    if (!user) {
      console.log("本次点击无效")
      weixinService.syncWechatUserInfo()
      return
    }
    // 判断是否绑定手机，空为未绑定
    let hasMobile = user != null && user.mobile != null && user.mobile.length > 6
    if (!hasMobile) {
      console.log("为未绑定手机")
      wx.navigateTo({
        url: '../../home/bind-mobile/bind-mobile'
      })
      return
    }

    // 满足用户登录且绑定手机
    this.ableUsePay()
  },

  isEnableUseCoupon: function () {
    let couponItem = this.data.couponItem
    let couponUsage = this.data.couponUsage

    let idDirectUsed = !couponItem.force_share
    let isFirstTimeUsed = this.data.isFirstTimeUsed
    let isRetweetsOk = couponUsage.retweets >= couponUsage.require_retweets
    // 使用条件，转发数不满足但是第一次使用，或转发数目满足
    let ableUse = idDirectUsed || isFirstTimeUsed || isRetweetsOk
    console.log('判断是否满足使用优惠券', idDirectUsed, isFirstTimeUsed, isRetweetsOk);

    this.setData({
      enableUseCoupon: ableUse
    })
    return ableUse;
  },
  /** 
   * 用户登录后在判断是否可以支付
   */
  ableUsePay: function () {
    let couponItem = this.data.couponItem
    let couponUsage = this.data.couponUsage

    let ableUse = this.isEnableUseCoupon()

    if (ableUse) {
      wx.navigateTo({
        url: '../../pay/index/index?couponId=' + couponItem.id
      })
    } else {
      wx.navigateTo({
        url: '../../help/help?couponId=' + couponItem.id
      })
    }
  },


  bindTap: function (e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },

  backHome: function () {
    wx.reLaunch({
      url: '../../bootstrap/play/play'
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
  },

  /**
   * 点击进入
   */
  toStorePage: function () {
    let storeId = this.data.couponItem.store_id
    console.log("进入门店主页", storeId);
    wx.navigateTo({
      url: '../../store/main/main?storeId=' + storeId
    })
  }
})