var app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    hasBindPhone: true,
    showModal: false,
    bindMobile: {
      mobile: '',
      code: ''
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad() {
    let user = wx.getStorageSync('WX-USER')
    if (!user) {
      this.setData({
        hasUserInfo: false,
        hasBindPhone: false,
      })
    } else {
      this.setData({
        userInfo: user,
        hasUserInfo: true
      })
      // 判断是否绑定手机，空为未绑定
      let mobile = user.mobile
      let hasBindPhone = (mobile != null && mobile.length > 6)
      this.setData({
        hasBindPhone: hasBindPhone
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function () {
    // 浏览统计
    weixinService.syncBrowseRecord({ path: '/home/index', type: 1 })

    // 获取用户信息
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/home/index', type: 2 })
  },

  /** 
   * 获取用户信息, 从从缓存，再远程
   */
  getUserInfo() {
    weixinService.syncWechatUserInfo().then((res) => {
      this.setData({
        userInfo: res,
        hasUserInfo: true
      })
      // 判断是否绑定手机，空为未绑定
      let mobile = res.mobile
      let hasBindPhone = (mobile != null && mobile.length > 6)
      this.setData({
        hasBindPhone: hasBindPhone
      })
    }).catch((err) => {
      //weixinService.showToast(err)
      this.setData({
        hasUserInfo: false
      })
      console.log('获取用户信息失败sssss', err)
    })
  },

  /**
   * 点击头像
   */
  updateUser() {
    wx.removeStorageSync('WX-USER')
    this.getUserInfo()
  },

  /**
   * 绑定手机
   */
  bindPhone() {
    wx.navigateTo({
      url: '../bind-mobile/bind-mobile'
    })
  },

  /**
   * 关闭弹窗
   */
  closeModal() {
    this.setData({
      showModal: false,
      'bindMobile.mobile': '',
      'bindMobile.code': ''
    })
  },

  /**
   * 获取验证码
   */
  getCode() {
    // 判断电话号码
    if (this.data.bindMobile.mobile == '') {
      weixinService.showToast('请输入手机号')
      return;
    }
    if (!this.validatePhone(this.data.bindMobile.mobile)) {
      weixinService.showToast('请输入正确的手机号')
      return;
    }

    let params = {
      mobile: this.data.bindMobile.mobile
    }
    // 发送短信
    weixinService.http(
      configUrl.system_api_server + "/sms/verify/common/defaultusage",
      "POST",
      params
    ).then(res => {
      console.log('[短信发送最后结果]', res)
      weixinService.showToast('短信发送成功!')
    })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[短信发送有错误]', err)
      })
  },

  /**
   * 确定按钮绑定手机号
   */
  bindMobile() {
    // 判断电话号码
    if (this.data.bindMobile.mobile == '') {
      weixinService.showToast('请输入手机号')
      return;
    }
    if (!this.validatePhone(this.data.bindMobile.mobile)) {
      weixinService.showToast('请输入正确的手机号')
      return;
    }
    // 判断验证码
    if (this.data.bindMobile.code == '') {
      weixinService.showToast('请输入验证码')
      return;
    }
    let openid = wx.getStorageSync('WX-OPENID')
    let params = {
      mobile: this.data.bindMobile.mobile,
      code: this.data.bindMobile.code
    }
    // 绑定手机号
    weixinService.http(
      configUrl.user_api_server + "/wechat/users/" + openid + "/mobile",
      "PUT",
      params
    ).then(res => {
      console.log('[绑定手机号码最后结果]', res)
      wx.setStorageSync('WX-USER', res)
      this.setData({
        userInfo: res,
        hasUserInfo: true,
        hasBindPhone: true
      })
      this.closeModal()
    })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[绑定手机号码有错误]', err)
      })
  },

  /**
   * 判断商家是否登录了
   */
  intoBusiness() {
    let dev = true
    if (dev) {
      // wx.showToast({
      //   title: '正在维护中',
      // })
      wx.showModal({
        title: '提示',
        content: '请搜索<花街淘金商家版>小程序',
        showCancel: false,
      })
      return
    }
    let unid = wx.getStorageSync('MERCHANT-USER-UNID')
    if (!unid) {
      wx.navigateTo({
        url: '../../business/login/login'
      })
      return
    }
    // 发送验证
    let token = wx.getStorageSync('MERCHANT-USER-TOKEN')
    weixinService.http(
      configUrl.user_api_server + "/merchant/tokens/" + unid + "/expire?token=" + token,
    ).then(res => {
      console.log('[商家登录验证最后结果]', res)
      if (res.effective) {
        wx.navigateTo({
          url: '../../business/index/index'
        })
      } else {
        wx.navigateTo({
          url: '../../business/login/login'
        })
      }
    })
      .catch(err => {
        console.log('[商家登录验证有错误]', err)
      })
  },


  bindInputMobile(e) {
    this.setData({
      'bindMobile.mobile': e.detail.value.replace(/\s+/g, '')
    })
  },

  bindInputCode(e) {
    this.setData({
      'bindMobile.code': e.detail.value.replace(/\s+/g, '')
    })
  },

  /**
   * 校验电话号码
   */
  validatePhone(textval) {
    let phoneRegex = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    return phoneRegex.test(textval)
  },

})