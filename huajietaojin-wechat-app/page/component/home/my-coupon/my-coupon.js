let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showHomeBtn: false,
    curIndex: 0,
    store_id:0,
    store:{},
    cards1:[],
    num1:0,
    noCards1:false,
    cards2: [],
    num2: 0,
    noCards2: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let isIndex = wx.getStorageSync('WX-INDEX')
    console.log('是否有INDEX', isIndex)
    if (isIndex !== true) {
      this.setData({
        showHomeBtn: true
      })
    }
    this.getMyConpons(1) // 1为未使用，2未已经使用
    this.getMyConpons(2)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/home/mycoupon', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/home/mycoupon', type: 2 })
  },

  /**
 * 获取我的现金券
 */
  getMyConpons: function (state) {
    let openid = wx.getStorageSync('WX-OPENID')
    weixinService.http(configUrl.service_api_server + '/coupons/usages?openid=' + openid + '&state=' + state)
      .then(res => {
        console.log('[获取我的现金券结果]', res)
        var data = res.list
        if (state == 1) {
          this.setData({
            cards1: data,
            num1: data.length
          })
          if(data.length <= 0) {
            this.setData({
              noCards1: true
            })
          }
        } else {
          this.setData({
            cards2: data,
            num2: data.length
          })
          if (data.length <= 0) {
            this.setData({
              noCards2: true
            })
          }
        }
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取我的现金券错误]', err)
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    let store = that.data.store;
    return {
      title: store.title,
      path: 'page/component/store/main/main?storeId={{store_id}}',
      imageUrl: store.picture,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
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
   * 主页按钮
   */
  onHomeBtn: function () {
    var itemList = ['返回主页']
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#343434",
      success: function (res) {
        console.log(res)
        if (!res.cancel) {
          console.log(itemList[res.tapIndex])
          if (0 === res.tapIndex) {
            wx.reLaunch({
              url: '../../coupon/index/index'
            })
            return
          }
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})