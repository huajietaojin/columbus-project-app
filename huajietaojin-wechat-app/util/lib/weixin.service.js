/*
 * weixin相关api的promise封装
 *  
 * @version 1.1
 * @date 20180321
 */
const config = require('../../config/config.js');
const statisticService = require('./statistic.service.js');

const API_SERVER = config.user_api_server;

const PARSE_OPENID = "/wechat/tokens/openid/parse";
const BROWSE_RECORD = "/browse/records";

const HOUR_12 = 12 * 60 * 60 * 1000
const HOUR_2 = 2 * 60 * 60 * 1000

class WeixinService {

	/** 
   * 发起网络请求 
   * 
   * 约定：
   * then里已过滤掉返回值外层，只返回response.data
   * catch捕捉非200网络错误和code非0的业务错误
   * 
   * @param {string} url   
   * @param {object} params  
   * @return {Promise}  
   */
  static http(url, method = "GET", params) {
    return new Promise((resolve, reject) => {
      let header = {
        'Content-Type': 'application/json;charset=utf-8',
        'Authentication': wx.getStorageSync('WX-HTTP-AUTH') || '1@x@x',
        'X-From-Terminal': 'hjtj-wechat-app'
      }
      let data = Object.assign({}, params)
      console.log("[HTTP " + method + "]", url, data);
      wx.request({
        url: url,
        data: data,
        method: method,
        header: header,
        success: function (res) {
          if (res.data.code === 0) {
            resolve(res.data.data)
          }
          else if (res.data.code == 1001) {
            console.log('token过期', res)
            WeixinService.init()
            reject("噢，要再试一次")
          } else {
            console.log('1.HTTP的错误', res)
            reject(res.data.message)
          }
        },
        fail: function (err) {
          console.log('2.HTTP的错误', err)
          reject(err.errMsg)
        }
      });
    });
  };

  /**
 * 业务初始化，解析openid并获取token
 */
  static init() {
    let now = new Date().getTime()
    // let loginAt = wx.getStorageSync('LOGIN-AT-LAST') || 0
    // let isTimeOk = (now - loginAt) < HOUR_2
    // let tokenData = wx.getStorageSync('WX-TOKEN-DATA')
    // let isTokenOk = tokenData && (tokenData.expire_at > now)
    // if (isTimeOk && isTokenOk) {
    //   console.log('初始化跳过')
    //   return
    // }
    this.loginFromWeichat()
      .then(this.parseOpenidFromServer)
      .then(this.storeAfterParseOpenid)
      .then(res => {
        //console.log('[最后结果]', res)
        wx.setStorageSync('LOGIN-AT-LAST', now)
      })
      .catch(err => {
        console.log('[有错误]', err)
      })
  }

	/** 
   * 登陆微信 
   * @return {Promise}  
   */
  static loginFromWeichat() {
    console.log('[开始微信登陆]')
    return new Promise((resolve, reject) =>
      wx.login({ success: resolve, fail: reject })
    );
  };

  /** 
   * 向服务器请求解析OPENID
   * @param {object} res 原始信息
   * @return {Promise}  
   */
  static parseOpenidFromServer(res) {
    //console.log('[开始向服务器请求解析OPENID]', res)
    let url = API_SERVER + PARSE_OPENID + '?js_code=' + res.code
    return WeixinService.http(url, "GET")
  }

  /** 
   * 处理解析OPENID完成后的数据
   * @param {object} data 解析信息
   * @return {Promise}  
   */
  static storeAfterParseOpenid(data) {
    //console.log('[解析OPENID完成]', data)
    let openid = data.openid
    wx.setStorageSync('WX-OPENID', data.openid)
    wx.setStorageSync('WX-TOKEN-DATA', data)
    wx.setStorageSync('WX-HTTP-AUTH', '1@' + data.openid + '@' + data.token)
    return Promise.resolve(data)
  }

  /** 
   * 公用Toast
   * @param title提示语
   */
  static showToast(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    })
  }

  /**
   * coupon分享内容固定格式
   * @param {object} data 参数 {couponItem, usageUnid}
   * @return {Promise}
   */
  static buildCouponShare(data) {
    let couponItem = data.couponItem
    let couponId = couponItem.id
    let usageUnid = data.usageUnid

    // 转发统计
    statisticService.syncCouponRetweet({ couponId: couponId, usageUnid: usageUnid, type: 1 })

    return {
      title: couponItem.retweet_title,
      path: 'page/component/coupon/detail/detail?couponId=' + couponId + '&usageUnid=' + usageUnid,
      imageUrl: couponItem.picture,
      success: function (res) {
        // 转发成功
        console.log("转发成功", res);
        // let isGroup = res.shareTickets != null
        // if (isGroup) {
        //   // 发到群里就有shareTickets，可以解析出群id
        //   wx.getShareInfo({
        //     shareTicket: res.shareTickets[0],
        //     success: function (res) { console.log('getShareInfo,success', res) },
        //     fail: function (res) { console.log('getShareInfo,fail', res) },
        //     complete: function (res) { console.log('getShareInfo,complete', res) }
        //   })
        // }
        // // 转发统计
        // let shareType = isGroup ? 2 : 1
        // statisticService.syncCouponRetweet({ couponId: couponId, usageUnid: usageUnid, type: shareType })
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败", res);
      }
    }
  }

  /**
   * 从wechat拉取用户信息并同步到服务器
   * 成功返回 res {UserInfo}
   * @return {Promise} 
   */
  static syncWechatUserInfo() {
    let user = wx.getStorageSync('WX-USER')
    let now = new Date().getTime()
    if (user && (now - user.update_at < HOUR_12)) {
      //12小时内无需更新
      console.log('User更新跳过')
      return Promise.resolve(user)
    }
    let openid = wx.getStorageSync('WX-OPENID')
    if (!openid) {
      return Promise.reject('openid null')
    }
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        lang: 'zh_CN',
        success: function (rawData) {
          WeixinService.http(
            API_SERVER + "/wechat/users/" + openid,
            "PUT",
            rawData.userInfo
          ).then((res) => {
            console.log('同步成功', res)
            wx.setStorageSync('WX-USER', res)
            resolve(res)
          }).catch((err) => {
            console.log('同步失败', err)
            reject(err)
          })
        },
        fail: function (error) {
          console.log('从微信获取失败', error)
          reject(error)
        }
      })
    })
  }

  /** 
   * 统计应用进入退出记录
   * @param {object} data 参数: {path, type}
   * @return {Promise}  
   */
  static syncBrowseRecord(data) {
    statisticService.syncBrowseRecordBatch(data)
  }
}

module.exports = WeixinService; 
