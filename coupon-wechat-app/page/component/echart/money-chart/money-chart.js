import * as echarts from '../../../../ec-canvas/echarts';
const app = getApp();
const weixinService = app.globalData.weixinService;
const statisticService = app.globalData.statisticService;
const configUrl = app.globalData.configUrl;

function setOption(chart, option) {
  chart.setOption(option);
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      lazyLoad: true
    },
    option: {},
    firmId: 0,
  },

  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (e) {
    let firmId = e.firmId  // 必须参数
    this.setData({
      firmId: firmId
    })
  },

  onReady: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart');
    weixinService.http(configUrl.statistic_api_server + "/echarts/money/figures?firm_id=" + this.data.firmId)
      .then(res => {
        console.log('[销售额统计图表最后结果]', res)
        let chartData = {
          xAxisData: res.x_axis_data,
          legendData: res.legend_data || [],
          series: res.series || [],
        };
        this.init(chartData)
      })
      .catch(err => {
        // weixinService.showToast(err)
        console.log('[销售额统计图表有错误]', err)
      })
  },
  // 点击按钮后初始化图表
  init: function (raw) {
    console.log("this.ecComponent", this.ecComponent)
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, this.formatOption(raw));

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },

  // 格式化
  formatOption(raw) {
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      color: ["#32c5e9", "#003366"],
      legend: {
        data: ["ItemOne", "ItemTow"]
      },
      calculable: true,
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      yAxis: {
        type: "category",
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        },
        data: []
      },
      xAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      },
      series: [
        {
          name: "ItemOne",
          type: "bar",
          barGap: 0,
          data: []
        },
        {
          name: "ItemTow",
          type: "bar",
          data: []
        }
      ]
    };

    // 手机x改成y
    option.yAxis.data = raw.xAxisData || ["1", "2", "3", "4", "5"];
    option.legend.data = raw.legendData;

    let series = [];
    for (let obj of raw.series) {
      let item = {
        name: obj.name,
        type: "bar",
        label: {
          normal: {
            show: true,
            align: "left",
            verticalAlign: "middle",
            position: "inside"
          }
        },
        data: obj.data
      };
      series.push(item);
    }
    option.series = series;
    return option;
  }
});
