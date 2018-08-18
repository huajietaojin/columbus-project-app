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
    videos: [],
    video: {},
    index: 0,
    hasMore: true,
    limit: 10,
    pageNo: 1,

    hasRemoteVideo: false, 
    hasMoreThanOne: false,
    hasReady: false,
    timer: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

    this.listStoreVideo();

    wx.showNavigationBarLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady');
    this.videoContext = wx.createVideoContext('myVideo')
    this.setData({
      hasReady: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    weixinService.syncBrowseRecord({ path: '/bootstrap/play', type: 1 });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.videoPause();
    weixinService.syncBrowseRecord({ path: '/bootstrap/play', type: 2 });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onPlayReady: function (e) {
    console.log('onPlayReady', e)
    this.setData({
      showPoster: false,
      isPlaying: true,
      isPlayOk: true,
    })
  },

  onPlayError: function (e) {
    console.log('onPlayError', e)
  },

  initFirstVideo: function () {
    if (this.data.hasInitFirstVideo) {
      return;
    }
    this.setVideoContent();
    if (this.data.timer) {
      clearTimeout(this.data.timer);
    }
    const that = this
    let timer = setTimeout(function () {
      that.doPlayOrPause();
    }, 500)
    this.setData({
      timer: timer,
      hasInitFirstVideo: true,
      hasRemoteVideo: this.data.videos.length > 0,
      hasMoreThanOne: this.data.videos.length > 1
    })

  },

  setVideoContent: function () {
    let video = this.data.videos[this.data.index];
    if (!video) {
      console.log('nonononono')
      this.setData({
        hasInitFirstVideo: true,
      })
      return;
    }
    console.log("video is", video);
    this.setData({
      video: video,
      video_url: video.video_url,
      cover_picture: video.cover_picture,
      store_name: video.store.name,
      store_logo: video.store.logo,
      hasInitFirstVideo: true,
    })
  },

  clickHandStop: function () {
    console.log('clickHandStop')
    this.doPlayOrPause();
  },
  clickCoverImage: function () {
    console.log("clickCoverImage")
    this.doPlayOrPause();
  },
  //点击事件
  clickVideo: function () {
    console.log('clickVideo')
    this.doPlayOrPause();
  },

  doPlayOrPause: function () {
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
    let timer = setTimeout(function () {
      that.videoPlay();
    }, 500)
    that.setData({
      timer: timer,
    })
  },

  videoPlay: function () {
    console.log("videoPlay run")
    if (!this.videoContext) {
      console.log("xxxxxxx");
      this.videoContext = wx.createVideoContext('myVideo')
    }
    this.videoContext.play()
  },
  videoPause: function () {
    console.log("videoPause run")
    this.videoContext.pause()
    this.setData({
      isPlaying: false
    })
  },

  playPrevious: function () {
    console.log("playPrevious")
    this.setData({
      showPoster: true,
    });
    this.videoPause();

    let index = this.data.index;
    let size = this.data.videos.length;
    if (index == 0) {
      console.log("already is first video, play list again");
      index = size - 1;
    } else {
      index--;
    }
    this.setData({
      index: index,
      showPoster: true,
    });


    this.setVideoContent();
    this.doDelayPlay();
  },

  playNext: function () {
    console.log("playNext")
    this.setData({
      showPoster: true,
    });
    this.videoPause();

    let index = this.data.index;
    let size = this.data.videos.length;
    if (index == (size - 1)) {
      console.log("already is last video, play list again");
      index = 0;
    } else {
      index++;
    }
    this.setData({
      index: index,
      showPoster: true,
    });

    
    this.setVideoContent();
    this.doDelayPlay();

    // 还剩3个，提取拉取
    if (index > (size - 4)) {
      this.listStoreVideo();
    }
  },

  listStoreVideo: function () {
    if (!this.data.hasMore) {
      console.log('no more!')
      return;
    }
    wx.showNavigationBarLoading();
    let limit = this.data.limit
    let offset = (this.data.pageNo - 1) * limit
    weixinService.http(configUrl.service_api_server + '/timeline/recommond/videos?$limit=' + limit + '&$offset=' + offset)
      .then(res => {
        console.log('[获取VIDEO结果]', res)
        this.setData({
          videos: this.data.videos.concat(res.list),
        })
        this.initFirstVideo();
        let pageNo = this.data.pageNo
        this.setData({
          pageNo: pageNo + 1,
          hasMore: res.list.length >= limit,
        })
        wx.hideNavigationBarLoading()
      })
      .catch(err => {
        wx.hideNavigationBarLoading()
        weixinService.showToast(err)
        console.log('[获取VIDEO错误]', err)
      })
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: '花街淘金，淘出美好生活',
      path: 'page/component/bootstrap/play/play',
      imageUrl: 'https://huajietaojin.oss-cn-hangzhou.aliyuncs.com/enterprise/pic/cover.png',
      success: function (res) {
        // 转发成功
        console.log("转发成功", res);
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败", res);
      }
    }
  },

  /*
  * 跳转页面
  */
  gotoStore: function () {
    console.log("gotoStore")
    if (!this.data.video) {
      console.log("gotoStore failed")
      return;
    }
    var storeId = this.data.video.store.id;
    wx.navigateTo({
      url: '../../store/main/main?storeId=' + storeId
    })
  },

  gotoSearch: function () {
    console.log("gotoSearch")
    wx.navigateTo({
      url: '../../search/search'
    })
  },

  gotoStreet: function () {
    console.log("gotoStreet")
    this.videoPause();
    wx.navigateTo({
      url: '../../coupon/index/index'
    })
  },

  gotoHome: function () {
    console.log("gotoHome")
    this.videoPause();
    wx.navigateTo({
      url: '../../home/index/index'
    })
  },

})