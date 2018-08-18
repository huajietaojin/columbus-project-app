/*
 * 数据统计相关api的promise封装
 * 采集埋点
 * 
 * @version 1.0
 * @date 201800407
 */
const config = require('../../config/config.js');

const API_SERVER = config.statistic_api_server;

const BROWSE_RECORD_BATCH = "/browse/records/batch"; // 应用进入退出

const COUPON_RETWEET = "/coupons/retweets"; // 转发
const COUPON_RECEIVE = "/coupons/receives"; // 接收
const COUPON_BROWSE_BATCH = "/coupons/browses/batch"; // 浏览

const STORE_RETWEET = "/stores/retweets"; // 转发
const STORE_RECEIVE = "/stores/receives"; // 接收
const STORE_BROWSE_BATCH = "/stores/browses/batch"; // 浏览

const PRODUCT_BROWSE_BATCH = "/products/browses/batch"; // 浏览

/**
 * 数据统计服务api
 */
class StatisticService {
  /** 
   * 发起网络请求 
   * @param {string} url   
   * @param {object} params  
   * @return {Promise}  
   */
  static http(url, method = "GET", params) {
    return new Promise((resolve, reject) => {
      let header = {
        'Content-Type': 'application/json',
        'Authentication': wx.getStorageSync('WX-HTTP-AUTH') || '1@x@x',
        'X-From-Terminal': 'hjtj-wechat-app'
      }
      let data = Object.assign({}, params)
      console.log("[STATISTIC HTTP]", url, data);
      wx.request({
        url: url,
        data: data,
        method: method,
        header: header,
        success: function (res) {
          if (res.data.code === 0) {
            resolve(res.data.data)
          } else {
            console.log('1.STATISTIC HTTP的错误', res)
            reject(res.data.message)
          }
        },
        fail: function (err) {
          console.log('2.STATISTIC HTTP的错误', err)
          reject(err)
        }
      });
    });
  };

  /** 
   * 浏览记录，满18条发送
   * @param {object} data 参数: {path, type}
   * @return {Promise}  
   */
  static syncBrowseRecordBatch(data) {
    let openid = wx.getStorageSync('WX-OPENID')
    if (!openid) {
      return Promise.resolve({ total: 0 })
    }
    let now = new Date().getTime()
    let scene = wx.getStorageSync('WX-SCENE')
    let params = {
      openid: openid,
      scene: scene,
      path: data.path,
      type: data.type,
      happen_at: now
    }
    let browseRecords = wx.getStorageSync('TEMP-BROWSE-RECORD-TRACE') || []
    browseRecords.push(params)
    wx.setStorageSync('TEMP-BROWSE-RECORD-TRACE', browseRecords)
    let size = browseRecords.length
    if (size < 18) {
      return Promise.resolve({ total: 1 })
    }

    return StatisticService.sendBrowseRecordDirect()
  }

  /**
   * 立即发送
   */
  static sendBrowseRecordDirect() {
    let browseRecords = wx.getStorageSync('TEMP-BROWSE-RECORD-TRACE') || []
    let size = browseRecords.length
    if (size < 1) {
      return Promise.resolve({ total: 0 })
    }
    wx.setStorageSync('TEMP-BROWSE-RECORD-TRACE', [])
    return new Promise((resolve, reject) => {
      StatisticService.http(API_SERVER + BROWSE_RECORD_BATCH, "POST", { list: browseRecords })
        .then(res => {
          console.log('批量保存成功', res)
          resolve(res)
        })
        .catch(err => {
          console.log('批量保存失败', err)
          wx.setStorageSync('TEMP-BROWSE-RECORD-TRACE', browseRecords)
          reject(err)
        })
    })
  }

  /*
  *Coupon
  */

  /** 
   * Coupon转发
   * @param {object} data 参数: {couponId, usageUnid, type}
   * @return {Promise}  
   */
  static syncCouponRetweet(data) {
    let openid = wx.getStorageSync('WX-OPENID')
    if (!openid) {
      return Promise.reject("OPENID NULL")
    }
    let params = {
      sender_openid: openid,
      usage_unid: data.usageUnid,
      type: data.type,
      coupon_id: data.couponId
    }
    return StatisticService.http(API_SERVER + COUPON_RETWEET, "POST", params)
  }

  /** 
   * Coupon接收
   * @param {object} data 参数: {usageUnid}
   * @return {Promise}  
   */
  static syncCouponReceive(data) {
    let openid = wx.getStorageSync('WX-OPENID')
    if (!openid) {
      return Promise.reject("OPENID NULL")
    }
    if (!data.usageUnid) {
      // 不是转发进来的，不需要统计
      return Promise.resolve("usageUnid NULL")
    }
    let scene = wx.getStorageSync('WX-SCENE')
    let params = {
      receiver_openid: openid,
      usage_unid: data.usageUnid,
      scene: scene
    }
    return StatisticService.http(API_SERVER + COUPON_RECEIVE, "POST", params)
  }

  /** 
   * Coupon浏览记录，满3条发送
   * @param {string} data 参数: {couponId}
   * @return {Promise}  
   */
  static syncCouponBrowse(data) {
    let openid = wx.getStorageSync('WX-OPENID')
    if (!openid) {
      return Promise.reject("OPENID NULL")
    }
    let now = new Date().getTime()
    let params = {
      openid: openid,
      coupon_id: data.couponId,
      happen_at: now
    }
    let browseRecords = wx.getStorageSync('TEMP-COUPON-BROWSE-TRACE') || []
    browseRecords.push(params)
    wx.setStorageSync('TEMP-COUPON-BROWSE-TRACE', browseRecords)
    let size = browseRecords.length
    if (size < 3) {
      return Promise.resolve({ total: 1 })
    }

    return StatisticService.sendCouponBrowseRecordDirect()
  }

  static sendCouponBrowseRecordDirect() {
    let browseRecords = wx.getStorageSync('TEMP-COUPON-BROWSE-TRACE') || []
    let size = browseRecords.length
    if (size < 1) {
      return Promise.resolve({ total: 0 })
    }
    wx.setStorageSync('TEMP-COUPON-BROWSE-TRACE', [])
    return new Promise((resolve, reject) => {
      StatisticService.http(API_SERVER + COUPON_BROWSE_BATCH, "POST", { list: browseRecords })
        .then(res => {
          console.log('批量保存成功', res)
          resolve(res)
        })
        .catch(err => {
          console.log('批量保存失败', err)
          wx.setStorageSync('TEMP-COUPON-BROWSE-TRACE', browseRecords)
          reject(err)
        })
    })
  }

  /*
  *Store
  */

  /**
   * 获取转发标记
   * @param {string}
   */
  static getStoreTag(storeId) {
    let now = new Date().getTime()
    let openid = wx.getStorageSync('WX-OPENID')
    return openid + '-' + now + '-' + storeId
  }

  /** 
   * Store转发
   * @param {object} data 参数: {storeId,tag}
   * @return {Promise}  
   */
  static syncStoreRetweet(data) {
    let openid = wx.getStorageSync('WX-OPENID')
    if (!openid) {
      return Promise.reject("OPENID NULL")
    }
    let params = {
      openid: openid,
      tag: data.tag,
      store_id: data.storeId,
    }
    return StatisticService.http(API_SERVER + STORE_RETWEET, "POST", params)
  }

  /** 
   * Store接收
   * @param {object} data 参数: {couponId, tag}
   * @return {Promise}  
   */
  static syncStoreReceive(data) {
    let openid = wx.getStorageSync('WX-OPENID')
    if (!openid) {
      return Promise.reject("OPENID NULL")
    }
    if (!data.tag) {
      // 不是转发进来的，不需要统计
      return Promise.resolve("tag NULL")
    }
    let scene = wx.getStorageSync('WX-SCENE')
    let params = {
      receiver_openid: openid,
      store_id: data.storeId,
      tag: data.tag,
      scene: scene
    }
    return StatisticService.http(API_SERVER + STORE_RECEIVE, "POST", params)
  }

  /** 
   * Store浏览，满7条发送
   * @param {string} data 参数: {storeId}
   * @return {Promise}  
   */
  static syncStoreBrowse(data) {
    let openid = wx.getStorageSync('WX-OPENID')
    if (!openid) {
      return Promise.reject("OPENID NULL")
    }
    let now = new Date().getTime()
    let params = {
      openid: openid,
      store_id: data.storeId,
      happen_at: now
    }
    let browseRecords = wx.getStorageSync('TEMP-STORE-BROWSE-TRACE') || []
    browseRecords.push(params)
    wx.setStorageSync('TEMP-STORE-BROWSE-TRACE', browseRecords)
    let size = browseRecords.length
    if (size < 7) {
      return Promise.resolve({ total: 1 })
    }

    return StatisticService.sendStoreBrowseRecordDirect()
  }

  static sendStoreBrowseRecordDirect() {
    let browseRecords = wx.getStorageSync('TEMP-STORE-BROWSE-TRACE') || []
    let size = browseRecords.length
    if (size < 1) {
      return Promise.resolve({ total: 0 })
    }
    wx.setStorageSync('TEMP-STORE-BROWSE-TRACE', [])
    return new Promise((resolve, reject) => {
      StatisticService.http(API_SERVER + STORE_BROWSE_BATCH, "POST", { list: browseRecords })
        .then(res => {
          console.log('批量保存成功', res)
          resolve(res)
        })
        .catch(err => {
          console.log('批量保存失败', err)
          wx.setStorageSync('TEMP-STORE-BROWSE-TRACE', browseRecords)
          reject(err)
        })
    })
  }

  /**
   * product
   */
  /** 
   * product浏览记录，满5条发送
   * @param {string} data 参数: {productId}
   * @return {Promise}  
   */
  static syncProductBrowse(data) {
    let openid = wx.getStorageSync('WX-OPENID')
    if (!openid) {
      return Promise.reject("OPENID NULL")
    }
    let now = new Date().getTime()
    let params = {
      openid: openid,
      product_id: data.productId,
      happen_at: now
    }
    let browseRecords = wx.getStorageSync('TEMP-PRODUCT-BROWSE-TRACE') || []
    browseRecords.push(params)
    wx.setStorageSync('TEMP-PRODUCT-BROWSE-TRACE', browseRecords)
    let size = browseRecords.length
    if (size < 5) {
      return Promise.resolve({ total: 1 })
    }

    return StatisticService.sendProductBrowseRecordDirect()
  }

  static sendProductBrowseRecordDirect() {
    let browseRecords = wx.getStorageSync('TEMP-PRODUCT-BROWSE-TRACE') || []
    let size = browseRecords.length
    if (size < 1) {
      return Promise.resolve({ total: 0 })
    }
    wx.setStorageSync('TEMP-PRODUCT-BROWSE-TRACE', [])
    return new Promise((resolve, reject) => {
      StatisticService.http(API_SERVER + PRODUCT_BROWSE_BATCH, "POST", { list: browseRecords })
        .then(res => {
          console.log('批量保存成功', res)
          resolve(res)
        })
        .catch(err => {
          console.log('批量保存失败', err)
          wx.setStorageSync('TEMP-PRODUCT-BROWSE-TRACE', browseRecords)
          reject(err)
        })
    })
  }

  /**
   * 同步所有
   */
  static syncAll() {
    StatisticService.sendBrowseRecordDirect()
    StatisticService.sendCouponBrowseRecordDirect()
    StatisticService.sendStoreBrowseRecordDirect()
    StatisticService.sendProductBrowseRecordDirect()
  }
}

module.exports = StatisticService; 