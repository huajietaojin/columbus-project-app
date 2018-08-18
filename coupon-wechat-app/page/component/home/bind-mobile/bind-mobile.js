var app = getApp();
const weixinService = app.globalData.weixinService;
const configUrl = app.globalData.configUrl;

Page({
  data: {
    bindMobile: {
      mobile: '',
      code: ''
    },
    btnText: '获取验证码',
    codeTimeOut: true,
    currentTime: 60,
    codeClass:'get-code',
    loading: false
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad() {

  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    weixinService.syncBrowseRecord({ path: '/home/bind-mobile', type: 1 })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    weixinService.syncBrowseRecord({ path: '/home/bind-mobile', type: 2 })
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
    if (!this.data.codeTimeOut) {
      return;
    }

    let params = {
      mobile: this.data.bindMobile.mobile
    }
    // 发送短信
    weixinService.http(
      configUrl.system_api_server + "/aliyun/sms/codes",
      "POST",
      params
    ).then(res => {
      console.log('[短信发送最后结果]', res)
      this.setData({
        codeTimeOut: false,
        codeClass:'get-code timeout'
      })
      this.getTimeOut()
      weixinService.showToast('短信发送成功!')
    })
      .catch(err => {
        weixinService.showToast(err)
        console.log('[短信发送有错误]', err)
      })
  },

  getTimeOut() {
    var that = this;
    var currentTime = that.data.currentTime
    var interval = setInterval(function () {
      currentTime--;
      that.setData({
        btnText: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
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
    let that = this
    that.setData({
      loading: true
    })
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
      wx.setStorageSync('WX-USER', res)
      that.setData({
        loading: false
      })
      // 返回上一个页面
      wx.navigateBack({
        delta: 1
      })
    })
      .catch(err => {
        weixinService.showToast(err)
        that.setData({
          loading: false
        })
        console.log('[绑定手机号码有错误]', err)
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