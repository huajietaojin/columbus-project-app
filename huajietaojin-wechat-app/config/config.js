/*
* 公共配置
*/
const test_host = "https://gateway.intentplay.com";

const product_host = "https://api.huajietaojin.cn";

module.exports = {
  // 公共服务
  system_api_server: product_host + "/system-proxy",
  // 用户中心
  user_api_server: product_host + "/user-proxy",
  // 业务模块
  service_api_server: product_host + "/service-proxy",
  // 数据统计
  statistic_api_server: product_host + "/statistic-proxy",
}