//index.js
let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

Page({
  data: {
    curr_id: 1,
    play_id: 1,
    showBottomBar: false,
    videos: [],
    videoHeight: '600px',
    isPlaying: false,
    isPlayOk: false,
    isMoving: false,
    lastX: 0,     //滑动开始x轴位置
    lastY: 0,     //滑动开始y轴位置
    text: "没有滑动",
    currentGesture: 0, //标识手势,
    showChange: false,
    timer: null,
    topPx: 0,
    interval: null,
    moveDistance: 0,
    contextArray: [],
    goTop: false,
    previousMargin: '0px',
    nextMargin: '0px',
    hasChange: false,
    hasInitFirstVideo: false,
    hasMore: true,
    limit: 10,
    pageNo: 1
  },

  onLoad: function (e) {
    console.log('video page', e)
    this.setData({
      hasInitFirstVideo: false
    })

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
      videoHeight: windowHeight
    })

    this.listStoreVideo()
  },

  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onShow: function () {
    weixinService.syncBrowseRecord({ path: '/bootstrap/play', type: 1 });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onHide: function () {
    this.videoPause();
    weixinService.syncBrowseRecord({ path: '/bootstrap/play', type: 2 });
  },

  initFirstVideo: function () {
    if (this.data.hasInitFirstVideo === true) {
      return
    }
    let firstVideo = this.data.videos[0]
    console.log('firstVideo', firstVideo)
    this.videoContext = this.createVideoContext(firstVideo.id)
    this.videoContext.pause()
    let that = this
    setTimeout(function () {
      that.videoPlay()
    }, 200)
    setTimeout(function () {
      wx.hideLoading();
    }, 1000)
    this.setData({
      curr_id: firstVideo.id,
      showBottomBar: true,
      hasInitFirstVideo: true
    })
  },

  listStoreVideo: function () {
    if (!this.data.hasMore) {
      console.log('no more!')
      return;
    }
    let limit = this.data.limit
    let offset = (this.data.pageNo - 1) * limit
    weixinService.http(configUrl.service_api_server + '/store-videos/extra?$limit=' + limit + '&$offset=' + offset)
      .then(res => {
        console.log('[获取视频结果]', res)
        this.setData({
          videos: this.data.videos.concat(res.list),
        })
        this.initFirstVideo();
        let pageNo = this.data.pageNo
        this.setData({
          pageNo: pageNo + 1,
          hasMore: res.list.length >= limit
        })
      })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[获取视频错误]', err)
      })
  },

  handleplay: function (e) {
    console.log('handleplay', e)
    this.setData({
      isPlayOk: true,
      play_id: this.data.curr_id
    })
  },

  videoPlay: function () {
    this.videoContext.play()
    this.setData({
      isPlaying: true
    })
  },
  videoPause: function () {
    this.videoContext.pause()
    this.setData({
      isPlaying: false
    })
  },
  handlebindchange: function (e) {
    let oldId = this.data.curr_id
    let id = e.detail.currentItemId;
    console.log('handlebindchange', id)

    this.videoContext.pause()
    this.videoContext = this.createVideoContext(id)
    this.videoContext.pause()
    this.setData({
      isPlayOk: false,
      hasChange: oldId !== id,
      curr_id: id
    })
  },

  handanimationfinish: function (e) {
    let id = e.detail.currentItemId;
    console.log('handanimationfinish', id)
    if (this.data.timer) {
      clearTimeout(this.data.timer);
    }
    this.setData({
      goTop: true,
      isMoving: false,
    })
    if (this.data.hasChange) {
      this.videoPlay()
    }
    let that = this
    let timer = setTimeout(function () {
      that.setData({
        goTop: false,
      })
    }, 100)
    this.setData({
      timer: timer
    })

    let index = e.detail.current;
    let length = this.data.videos.length
    if ((length - index) < 3) {
      console.log('重新拉取，at', index, 'length', length)
      this.listStoreVideo()
    }
  },

  createVideoContext: function (id) {
    let contextArray = this.data.contextArray
    let videoContext = null
    for (let obj of contextArray) {
      if (obj.id === id) {
        console.log('videoContext find it', id)
        obj.videoContext.seek(0.1)
        return obj.videoContext
      }
    }
    videoContext = wx.createVideoContext('myVideo' + id)
    console.log('videoContext create', videoContext)
    contextArray.push({ id: id, videoContext: videoContext })
    this.setData({
      contextArray: contextArray
    })
    return videoContext
  },

  videoErrorCallback: function (e) {
    console.log('视频错误信息:', e)
  },

  //点击事件
  handletap: function (event) {
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
  //滑动移动事件
  handletouchmove: function (event) {
    //console.log('滑动移动事件', event)
    var currentX = event.touches[0].pageX
    var currentY = event.touches[0].pageY
    var tx = currentX - this.data.lastX
    var ty = currentY - this.data.lastY
    var text = ""
    //左右方向滑动
    if (Math.abs(tx) > Math.abs(ty)) {
      if (tx < 0)
        text = "向左滑动"
      else if (tx > 0)
        text = "向右滑动"
    }
    //上下方向滑动
    else {
      if (ty < 0) {
        text = "向上滑动"
        //console.log('向上滑动', ty)
        this.setData({
          nextMargin: '30px',
        })
      }
      else {
        text = "向下滑动"
        //console.log('向下滑动', ty)
      }
    }

    //将当前坐标进行保存以进行下一次计算
    // this.data.lastX = currentX
    // this.data.lastY = currentY
    this.setData({
      text: text,
      topPx: ty
    });
  },

  //滑动开始事件
  handletouchtart: function (event) {
    console.log('滑动开始事件', event)
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
    this.setData({
      isMoving: true,
    });
  },
  //滑动结束事件
  handletouchend: function (event) {
    console.log('滑动结束事件', event)
    // this.data.currentGesture = 0;
    this.setData({
      text: "没有滑动",
      topPx: 0
    });
  },

  toCouponPage: function () {
    this.videoPause();
    wx.navigateTo({
      url: '../../coupon/index/index'
    })
  },

  toHomePage: function () {
    this.videoPause();
    wx.navigateTo({
      url: '../../home/index/index'
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

  /**
   * 点击进入商店页面
   */
  intoStore: function (e) {
    var storeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../store/main/main?storeId=' + storeId
    })
  },

  toSearchPage: function(e) {
    wx.navigateTo({
      url: '../../search/search'
    })
  }

})
