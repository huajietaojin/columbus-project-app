const chinaService = require('../../../../util/lib/china-service.js');
let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

const provinces = chinaService.allProvince()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stores: [],
    coupons: [],
    actionSheetHidden: true,
    actionSheetItems: [{ 'bindtap': 'Nearby', 'txt': '附近的优惠' }, { 'bindtap': 'Share', 'txt': '分享给朋友' }],
    isloading: false,
    hasMore: true,
    pageNo: 1,
    limit: 10,
    index: 0,
    selectCityName: "福州市",
    selectCityNo: 350100,
    selectProvinceNo: 350000,
    selectCitys: [],
    districts: [],
    statusBarHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorage({
      key: 'WX-INDEX',
      data: true,
    });

    this.setDefaultCity();

    this.resetList();
    this.listCoupon();

    this.setData({
      statusBarHeight: wx.getStorageSync('statusBarHeight')
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function () {
    // 浏览统计
    weixinService.syncBrowseRecord({ path: '/coupon/index', type: 1 })

    // 获取用户信息
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/coupon/index', type: 2 })
  },

  /** 
 * 获取用户信息, 从从缓存，再远程
 */
  getUserInfo() {
    weixinService.syncWechatUserInfo().then((res) => {
      console.log('获取用户信息ok')
    }).catch((err) => {
      console.log('获取用户信息失败', err)
    })
  },

  setDefaultCity: function () {
    let city = wx.getStorageSync('SELECT_CITY') || { no: 350100, m: "福州市", pno: 350000 }
    let fujian = chinaService.listCity(city.pno)
    this.setData({
      selectCityName: city.m,
      selectCityNo: city.no,
      selectProvinceNo: city.pno,
      selectCitys: fujian,
      districts: [provinces, fujian]
    })
  },

  bindMultiPickerChange: function (e) {
    // console.log('bindMultiPickerChange', e);
    let id = e.detail.value[1] || 0
    let city = this.data.selectCitys[id]
    wx.setStorageSync('SELECT_CITY', city)
    console.log('final select city', city)

    let oldCityNo = this.data.selectCityNo
    this.setData({
      selectCityName: city.m,
      selectCityNo: city.no,
      selectProvinceNo: city.pno,
    })

    // 城市改变，重新查询
    this.resetList();
    this.listCoupon();
  },

  bindMultiPickerColumnChange: function (e) {
    // console.log('bindMultiPickerColumnChange', e);
    if (e.detail.column === 0) {
      let id = e.detail.value || 0
      let provinceNO = provinces[id].no
      console.log('provinceNO', provinceNO);
      let citys = chinaService.listCity(provinceNO);
      this.setData({
        selectProvinceNo: provinceNO,
        selectCitys: citys,
        districts: [provinces, citys]
      })
    }
    if (e.detail.column === 1) {
      let id = e.detail.value || 0
      let city = this.data.selectCitys[id]
      console.log('select city', city)

      //name 最后再设置
      this.setData({
        // selectCityName: city.m,
        selectCityNo: city.no,
        selectProvinceNo: city.pno,
      })
    }
  },

  resetList: function () {
    this.setData({
      hasMore: true,
      pageNo: 1,
      stores: []
    })
  },

  /**
   * 获取现金券
   */
  listCoupon: function () {
    this.setData({
      isloading: true
    })
    let limit = this.data.limit
    let offset = (this.data.pageNo - 1) * limit
    let cityNo = this.data.selectCityNo
    // 获取现金券列表
    weixinService.http(
      configUrl.service_api_server + "/store-coupons?$limit=" + limit + "&$offset=" + offset + '&city_no=' + cityNo
    ).then(res => {
      console.log('[获取现金券列表最后结果]', res)
      wx.stopPullDownRefresh() //停止下拉刷新
      this.setData({
        stores: this.data.stores.concat(res.list)
      })
      if (res.list.length < limit) {
        this.setData({
          hasMore: false
        })
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 300)
      this.setData({
        isloading: false
      })
    })
      .catch(err => {
        wx.hideLoading()
        wx.stopPullDownRefresh() //停止下拉刷新
        console.log('[获取现金券列表有错误]', err)
      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    this.resetList();
    this.listCoupon();
    wx.showLoading({
      title: '加载中',
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉")
    if (this.data.isloading) return;  // 如果正在加载，停止请求
    if (!this.data.hasMore) return;
    wx.showLoading({
      title: '加载中',
    })
    let pageNo = this.data.pageNo
    this.setData({
      pageNo: pageNo + 1
    })
    this.listCoupon();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },

  toSearchPage: function () {
    wx.navigateTo({
      url: '../../search/search'
    })
  },

  onOpenScan: function () {
    // console.log('扫一扫')
    // wx.scanCode({
    //   success: function (res) {
    //     var scanValue = res.result
    //     console.log(scanValue)
    //     if (scanValue == null || scanValue.indexOf('http://m.intentplay.com') == -1) {
    //       wx.showModal({
    //         title: '非平台的码',
    //         content: '扫码内容：' + scanValue,
    //         showCancel: false
    //       })
    //       return
    //     }
    //     scanValue = encodeURIComponent(scanValue)
    //     console.log(scanValue)
    //     wx.navigateTo({
    //       url: '../../show/show?q=' + scanValue
    //     })
    //   },
    //   fail: function (res) {
    //   }
    // })
  },
  /**
   * 用户点击右上角更多弹出弹幕
   */
  onActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    return false;
    var itemList = ['附近的优惠', '分享给朋友']
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#343434",
      success: function (res) {
        console.log(res)
        if (!res.cancel) {
          console.log(itemList[res.tapIndex])
          if (0 === res.tapIndex) {
            wx.navigateTo({
              url: '../../map/map'
            })
            return
          }
          if (1 === res.tapIndex) {

          }
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 获取现金券
   */
  getCouponCards: function (e) {
    var storeId = e.currentTarget.dataset.id;
    weixinService.http(configUrl.service_api_server + "/coupons?enable=true&store_id=" + storeId)
      .then(res => {
        console.log('[获取现金券最后结果]', res)
        this.setData({
          coupons: res.list,
          actionSheetHidden: !this.data.actionSheetHidden
        })
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取现金券有错误]', err)
      })
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
   * 点击进入商店页面
   */
  intoStore: function (e) {
    var storeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../store/main/main?storeId=' + storeId
    })
  },
  /**
   * 附近的优惠
   */
  // bindNearby:function() {
  //   this.actionSheetChange();
  //   console.log("点击附近的优惠")
  //   wx.navigateTo({
  //     url: '../../map/map'
  //   })
  // },
  /**
   * 分享给朋友
   */
  bindShare: function () {
    console.log("分享给朋友")
    this.actionSheetChange();
  },

  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})