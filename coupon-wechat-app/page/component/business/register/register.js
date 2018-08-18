let app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    register: {
      mobile: '',
      email: '',
      code: '',
      password: ''
    },
    interval: null,
    btnText: '获取验证码',
    codeTimeOut: true,
    currentTime: 60,
    codeClass: 'get-code',
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    console.log('注册页面', e)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    weixinService.syncBrowseRecord({ path: '/business/register', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/business/register', type: 2 })
  },

  bindRegisterMobile(e) {
    this.setData({
      'register.mobile': e.detail.value.replace(/\s+/g, '')
    })
  },
  bindRegisterEmail(e) {
    this.setData({
      'register.email': e.detail.value.replace(/\s+/g, '')
    })
  },
  bindRegisterCode(e) {
    this.setData({
      'register.code': e.detail.value.replace(/\s+/g, '')
    })
  },
  bindRegisterPassword(e) {
    this.setData({
      'register.password': e.detail.value.replace(/\s+/g, '')
    })
  },
  /**
   * 注册
   */
  register() {
    // 判断电话号码
    if (this.data.register.mobile == '') {
      weixinService.showToast('请输入手机号')
      return;
    }
    if (!this.validatePhone(this.data.register.mobile)) {
      weixinService.showToast('请输入正确的手机号')
      return;
    }
    // 判断邮箱
    if (this.data.register.email == '') {
      weixinService.showToast('请输入邮箱')
      return;
    }
    if (!this.validateEmail(this.data.register.email)) {
      weixinService.showToast('请输入正确的邮箱')
      return;
    }
    // 判断验证码
    if (this.data.register.code == '') {
      weixinService.showToast('请输入验证码')
      return;
    }
    // 判断密码
    if (this.data.register.password == '') {
      weixinService.showToast('请输入密码')
      return;
    }
    if (this.data.register.password.length < 5) {
      weixinService.showToast('密码不能小于5位')
      return;
    }
    // 商家注册
    let params = {
      mobile: this.data.register.mobile,
      email: this.data.register.email,
      code: this.data.register.code,
      password: this.data.register.password
    }
    let that = this
    that.disabled = true
    weixinService.http(
      configUrl.user_api_server + "/merchant/users",
      "POST",
      params
    ).then(res => {
      console.log('[商家注册最后结果]', res)
      wx.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 1500
      })
      setTimeout(function () {
        that.disabled = false
        that.backToLogin()
      }, 1500)
    })
      .catch(err => {
        that.disabled = false
        weixinService.showToast(err)
        console.log('[商家注册有错误]', err)
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
   * 获取短信验证码
   */
  getCode: function () {
    // 判断电话号码
    if (this.data.register.mobile == '') {
      weixinService.showToast('请输入手机号')
      return;
    }
    if (!this.validatePhone(this.data.register.mobile)) {
      weixinService.showToast('请输入正确的手机号')
      return;
    }

    if (!this.data.codeTimeOut) {
      return;
    }

    let params = {
      mobile: this.data.register.mobile
    }
    // 获取短信验证码
    weixinService.http(
      configUrl.system_api_server + "/aliyun/sms/codes",
      "POST",
      params
    ).then(res => {
      console.log('[短信发送最后结果]', res)
      this.setData({
        codeTimeOut: false,
        codeClass: 'get-code timeout'
      })
      this.getTimeOut(false)
      weixinService.showToast('短信发送成功!')
    })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[短信发送有错误]', err)
      })
  },

  /**
   * 倒计时
   */
  getTimeOut(clear) {
    var that = this;
    if (clear) {
      clearInterval(this.data.interval)
      that.setData({
        codeTimeOut: true,
        codeClass: 'get-code',
        btnText: '获取验证码',
        currentTime: 60
      })
      return
    }
    var currentTime = that.data.currentTime
    this.data.interval = setInterval(function () {
      currentTime--;
      that.setData({
        btnText: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(that.data.interval)
        that.setData({
          codeTimeOut: true,
          codeClass: 'get-code',
          btnText: '重新发送',
          currentTime: 60
        })
      }
    }, 1000)
  },

  /**
   * tab切换
   */
  backToLogin() {
    this.getTimeOut(true)
    this.clearRegisterInput()
    wx.navigateBack({
      delta: 1
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
  /**
   * 清空注册输入框
   */
  clearRegisterInput() {
    this.setData({
      'register.mobile': '',
      'register.email': '',
      'register.code': '',
      'register.password': ''
    })
  }
})