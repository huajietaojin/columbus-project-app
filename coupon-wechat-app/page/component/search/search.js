let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxSearchData: "",
    stores: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  wxSearchInput: function(e) {
    let inputValue = e.detail.value;
    console.log('inputValue', inputValue)
    let old = this.data.wxSearchData
    console.log('old', old)
    this.setData({
      wxSearchData: inputValue
    });
  },

  // 清空输入
  wxSearchClear: function() {
    console.log("wxSearchClear");
    this.setData({
      wxSearchData: '',
      stores: []
    });
  },

  // 确任或者回车
  wxSearchConfirm: function(e) {
    console.log("wxSearchConfirm");
    var key = e.target.dataset.key;
    if (key == 'back') {
      wx.navigateBack({
        delta: 1
      })
    } else {
      this.doSearch(this.data.wxSearchData);
    }
  },

  doSearch: function(wxSearchData) {
    console.log("doSearch", wxSearchData);
    if (wxSearchData && wxSearchData.length > 0) {
      let keyWord = encodeURIComponent(wxSearchData);
      console.log("keyWord", keyWord);
      // 获取列表
      weixinService.http(
        configUrl.service_api_server + "/stores/search/like_name?name=" + keyWord
        ).then(res => {
          console.log('[获取列表最后结果]', res)
          this.setData({
            stores: res.list
          })
        })
        .catch(err => {
          wx.hideLoading()
          console.log('[获取列表有错误]', err)
        })
    }
  },

  /**
   * 点击进入商店页面
   */
  intoStore: function(e) {
    var storeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../store/main/main?storeId=' + storeId
    })
  },
})