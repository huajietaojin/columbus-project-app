// page/component/bootstrap/play/play.js
let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover_picture: "https://huajietaojin.oss-cn-hangzhou.aliyuncs.com/app/wechat/huajietaojin_cover_picture.jpg",
    store_logo: "/image/logo.png",

    video_url: "https://huajietaojin.oss-cn-hangzhou.aliyuncs.com/app/wechat/huajietaojin_cover_video.mp4",
    videoHeight: '600px',

    isPlaying: false,
    isPlayOk: false,
    showPoster: true,

    hasInitFirstVideo: false,
    video: {},

    hasReady: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let sys = wx.getStorageSync('SYSTEM-INFO') || {}
    let windowHeight = sys.windowHeight
    if (!windowHeight) {
      windowHeight = '100%';
    } else {
      windowHeight = windowHeight + 'px'
    }
    this.setData({
      videoHeight: windowHeight,
      isPlaying: false,
      isPlayOk: false,
      hasReady: false,
      showPoster: true,
    });

    this.setVideoContent();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('onReady');
    this.videoContext = wx.createVideoContext('myVideo')
    this.setData({
      hasReady: true
    })

    this.doDelayPlay();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    weixinService.syncBrowseRecord({
      path: '/store/video',
      type: 1
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    weixinService.syncBrowseRecord({
      path: '/store/video',
      type: 2
    });
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

  onPlayReady: function(e) {
    console.log('onPlayReady', e)
    this.setData({
      showPoster: false,
      isPlaying: true,
      isPlayOk: true,
    })
  },

  onPlayError: function(e) {
    console.log('onPlayError', e)
  },

  initFirstVideo: function() {
    if (this.data.hasInitFirstVideo) {
      return;
    }
    this.setVideoContent();
    if (this.data.timer) {
      clearTimeout(this.data.timer);
    }
    const that = this
    let timer = setTimeout(function() {
      that.doPlayOrPause();
    }, 500)
    this.setData({
      timer: timer,
      hasInitFirstVideo: true
    })

  },

  setVideoContent: function() {
    let video = wx.getStorageSync('TEMP-VIDEO');
    console.log("video is", video);
    this.setData({
      video: video,
      video_url: video.video_url,
      cover_picture: video.cover_picture,
      hasInitFirstVideo: true,
    })
  },

  clickHandStop: function() {
    console.log('clickHandStop')
    this.doPlayOrPause();
  },
  clickCoverImage: function() {
    console.log("clickCoverImage")
    this.doPlayOrPause();
  },
  //点击事件
  clickVideo: function() {
    console.log('clickVideo')
    this.doPlayOrPause();
  },

  doPlayOrPause: function() {
    console.log("doPlayOrPause", this.data.isPlaying);
    if (this.data.isPlaying) {
      this.videoPause()
    } else {
      this.doDelayPlay();
    }
  },

  doDelayPlay: function() {
    const that = this
    if (that.data.timer) {
      clearTimeout(that.data.timer);
    }
    let timer = setTimeout(function() {
      that.videoPlay();
    }, 500)
    that.setData({
      timer: timer,
    })
  },

  videoPlay: function() {
    console.log("videoPlay run")
    if (!this.videoContext) {
      console.log("xxxxxxx");
      this.videoContext = wx.createVideoContext('myVideo')
    }
    this.videoContext.play()
  },
  videoPause: function() {
    console.log("videoPause run")
    this.videoContext.pause()
    this.setData({
      isPlaying: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '花街淘金，淘出美好生活',
      path: 'page/component/bootstrap/play/play',
      imageUrl: 'https://huajietaojin.oss-cn-hangzhou.aliyuncs.com/enterprise/pic/cover.png',
      success: function(res) {
        // 转发成功
        console.log("转发成功", res);
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败", res);
      }
    }
  },
})