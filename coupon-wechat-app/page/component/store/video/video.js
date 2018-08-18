//index.js
let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

Page({
  data: {
    videoUrl: "",
    videoHeight: '600px',
    isPlaying: false,
    isPlayOk: false,
  },

  onLoad: function(e) {
    console.log('video page', e)

    let url = wx.getStorageSync('TEMP-VIDEO-URL');
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    let sys = wx.getStorageSync('SYSTEM-INFO') || {}
    let windowHeight = sys.windowHeight
    if (!windowHeight) {
      windowHeight = '100%';
    } else {
      windowHeight = windowHeight + 'px'
    }
    this.setData({
      videoHeight: windowHeight,
      videoUrl: url
    })
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function() {
    this.initVideo();
    weixinService.syncBrowseRecord({
      path: '/store/video/video',
      type: 1
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.videoPause();
    this.videoContext = null;
    weixinService.syncBrowseRecord({
      path: '/store/video/video',
      type: 2
    });
  },

  initVideo: function() {
    console.log('initVideo')
    this.videoPlay()
    let that = this
    setTimeout(function() {
      wx.hideLoading();
    }, 200);
  },

  handleplay: function(e) {
    console.log('handleplay', e)
    this.setData({
      isPlayOk: true,
    })
  },

  videoPlay: function() {
    this.videoContext.play()
    this.setData({
      isPlaying: true
    })
  },
  videoPause: function() {
    this.videoContext.pause()
    this.setData({
      isPlaying: false
    })
  },

  videoErrorCallback: function(e) {
    console.log('视频错误信息:', e)
  },

  //点击事件
  handletap: function(event) {
    console.log('handletap', event)
    this.setData({
      hasChange: false
    })
    if (this.data.isPlaying) {
      console.log('pause')
      this.videoPause()
    } else {
      console.log('play')
      this.videoPlay()
    }
  },

})