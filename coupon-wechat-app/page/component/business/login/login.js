let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    login: {
      mobile: '',
      password: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log('登录页面', e)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/business/lgoin', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/business/lgoin', type: 2 })
  },

  bindLoginMobile(e) {
    this.setData({
      'login.mobile': e.detail.value.replace(/\s+/g, '')
    })
  },
  bindLoginPassword(e) {
    this.setData({
      'login.password': e.detail.value.replace(/\s+/g, '')
    })
  },
  /**
   * 登录按钮
   */
  login() {
    // 判断电话号码
    if (this.data.login.mobile == '') {
      weixinService.showToast('请输入手机号')
      return;
    }
    if (!this.validatePhone(this.data.login.mobile)) {
      weixinService.showToast('请输入正确的手机号')
      return;
    }
    // 判断密码
    if (this.data.login.password == '') {
      weixinService.showToast('请输入密码')
      return;
    }
    if (this.data.login.password.length < 5) {
      weixinService.showToast('密码不能小于5位')
      return;
    }
    // 商家登录
    let params = {
      mobile: this.data.login.mobile,
      password: this.data.login.password
    }
    weixinService.http(
      configUrl.user_api_server + "/merchant/tokens",
      "POST",
      params
    ).then(res => {
      console.log('[商家登录最后结果]', res)
      wx.setStorageSync('MERCHANT-USER-TOKEN', res.token)
      wx.setStorageSync('MERCHANT-USER-UNID', res.unid)
      wx.redirectTo({
        url: '../index/index'
      })
    })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[商家登录有错误]', err)
      })
  },

  /**
   * 校验电话号码
   */
  validatePhone(textval) {
    let phoneRegex = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    return phoneRegex.test(textval)
  },
  /**
   * 校验邮箱
   */
  validateEmail(textval) {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegex.test(textval)
  },

  /**
   * 跳转到注册页面
   */
  toRegisterPage() {
    this.clearLoginInput()
    wx.navigateTo({
      url: '../register/register'
    })
  },
  /**
   * 清空登录输入框
   */
  clearLoginInput() {
    this.setData({
      'login.mobile': '',
      'login.password': ''
    })
  },
})