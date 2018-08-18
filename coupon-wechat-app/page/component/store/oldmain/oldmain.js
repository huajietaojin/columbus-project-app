let app = getApp();
const weixinService = app.globalData.weixinService;
const statisticService = app.globalData.statisticService;
const configUrl = app.globalData.configUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: 0,
    curIndex: 0,
    storeId: 0,
    store: {
      name: '·',
      address: '·',
      contact: '·',
      show_product: false
    },
    coupons: {},
    // 轮播
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 10000,
    duration: 1000,
    showHomeBtn: true,
    actionSheetHidden: true,
    actionSheetItems: [{ 'bindtap': 'none', 'txt': '分享给好友' }, { 'bindtap': 'backHome', 'txt': '返回首页' }],

    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showGetUserModal: false, // LJQ：这里为true的时候强制弹窗modal，要获取用户信息的提示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log("门店主页面", e)
    // let isIndex = wx.getStorageSync('WX-INDEX')
    // console.log('是否有INDEX', isIndex)
    // if (isIndex !== true) {
    //   this.setData({
    //     showHomeBtn: true
    //   })
    // }

    let storeId = e.storeId
    if (!storeId) {
      let scan = e.q
      if (scan) {
        scan = decodeURIComponent(scan)
        console.log('scan content', scan)
        let len = scan.length
        let at = scan.indexOf("=")
        storeId = scan.substring(at + 1, len)
        console.log('scan storeId', storeId)
      } else {
        storeId = 0
      }
    }

    // 设置store_id
    this.setData({
      storeId: storeId,
      statusBarHeight: wx.getStorageSync('statusBarHeight')
    })

    this.getStoreDetail()
    this.getCouponData()

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

    // 统计接收情况
    statisticService.syncStoreReceive({ storeId: storeId, tag: e.tag })
  },

  /**
   * 获取StoreDetail
   */
  getStoreDetail() {
    weixinService.http(configUrl.service_api_server + "/stores/" + this.data.storeId + "/extra")
      .then(res => {
        console.log('[StoreDetail结果]', res)
        this.setData({
          store: res
        })
        this.setData({
          imgUrls: res.show_pictures
        })
        // 设置头部门店
        wx.setNavigationBarTitle({
          title: res.name
        })
      })
      .catch(err => {
        weixinService.showToast(data.message)
        console.log('[StoreDetail错误]', err)
      })
  },

  /**
   * 获取其它现金券
   */
  getCouponData() {
    weixinService.http(configUrl.service_api_server + "/coupons?enable=true&store_id=" + this.data.storeId)
      .then(res => {
        console.log('[获取其它现金券最后结果]', res)
        this.setData({
          coupons: res.list
        })
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取其它现金券有错误]', err)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 浏览统计
    statisticService.syncStoreBrowse({ storeId: this.data.storeId })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    let store = that.data.store;
    let storeId = store.id
    // 转发携带的标记
    let tag = statisticService.getStoreTag(storeId)

    // 转发统计
    statisticService.syncStoreRetweet({ storeId: storeId, tag: tag })

    return {
      title: store.cover_title,
      path: 'page/component/store/main/main?storeId=' + storeId + '&tag=' + tag,
      imageUrl: store.cover_picture,
      success: function (res) {
        // // 转发统计
        // statisticService.syncStoreRetweet({ storeId: storeId, tag: tag })
        // 转发成功
        console.log("转发成功", res);
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败", res);
      }
    }
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
   * 返回主页
   */
  backHome: function () {
    wx.reLaunch({
      url: '../../coupon/index/index'
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
 * 获取用户信息, 从从缓存，再远程
 */
  getUserInfo: function () {
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

  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})