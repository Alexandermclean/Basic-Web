<template>
  <div class="sc-ds-map-wrap">
    <div style="width:100%;height:100%;" id="centerMap"></div>
  </div>
</template>
<script type="text/ecmascript-6">
import 'echarts/map/js/china.js'
import mapData from '~/data/mapCoordinate.json'
import {screenSizeObj} from '@/utils/index'
import localeDash from '~/locale/cn/dashboard/operate.json'
export default {
  data () {
    return {
      locale: {
        dash: localeDash
      },
      location: {
        city: null,
        province: null
      },
      centerMap: '',
      geoCoordMap: mapData,
      score: 0,
      fakerData: [
        [{province: '安徽省', city: '芜湖', value: 0}, {province: '新疆维吾尔自治区', city: '乌鲁木齐', value: 1}],
        [{province: '安徽省', city: '芜湖', value: 0}, {province: '北京市', city: '北京', value: 1}]
      ]
    }
  },
  methods: {
    getLocationPoint () { // 获取定位数据
      var self = this
      var locationData = []
      var locationTem = {}
      for (let i = 0; i < self.fakerData.length; i++) {
        var provinceAttackArr = self.geoCoordMap.filter(function (item) {
          return (item.name === self.fakerData[i][0]['province'])
        })
        if (provinceAttackArr.length > 0) {
          // 匹配上省
          let cityArr = provinceAttackArr[0].children.filter(function (item) {
            return (item.name === self.fakerData[i][0]['city'])
          })
          if (cityArr.length > 0) {
            // 匹配上城市
            locationTem.value = [parseFloat(cityArr[0].log), parseFloat(cityArr[0].lat), parseFloat(self.fakerData[i][0]['value'])]
            locationTem.name = self.fakerData[i][0]['city']
          }
          locationData.push(locationTem)
          provinceAttackArr = []
          locationTem = {}
        }

        var provinceUnderAttackArr = self.geoCoordMap.filter(function (item) {
          return (item.name === self.fakerData[i][1]['province'])
        })
        if (provinceUnderAttackArr.length > 0) {
          // 匹配上省
          let cityArr = provinceUnderAttackArr[0].children.filter(function (item) {
            return (item.name === self.fakerData[i][1]['city'])
          })
          if (cityArr.length > 0) {
            // 匹配上城市
            locationTem.value = [parseFloat(cityArr[0].log), parseFloat(cityArr[0].lat), parseFloat(self.fakerData[i][1]['value'])]
            locationTem.name = self.fakerData[i][1]['city']
          }
          locationData.push(locationTem)
          provinceUnderAttackArr = []
          locationTem = {}
        }
      }
      return locationData
    },
    getLineData () { // 获取运动曲线数据
      var dataTem = this.getLocationPoint()
      var lineData = []
      var lineTem = {}
      for (let i = 0; i < dataTem.length / 2; i++) {
        let j = i * 2
        lineTem.fromName = dataTem[j].name
        lineTem.toName = dataTem[j + 1].name
        dataTem[j].value.pop()
        dataTem[j + 1].value.pop()
        lineTem.coords = [dataTem[j].value, dataTem[j + 1].value]
        lineData.push(lineTem)
        lineTem = {}
      }
      return lineData
    },
    generateMap () {
      const self = this
      var fontsize = screenSizeObj.remToPx(1)
      this.centerMap = this.$echarts.init(document.getElementById('centerMap'))
      var point = this.getLocationPoint()
      var line = this.getLineData()
      var option = {
        title: {
          text: '全国设备分布图',
          subtext: 'data from H3C',
          left: 'center',
          textStyle: {
            color: 'black'
          }
        },
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          show: true,
          formatter: function (chart) {
            if (chart.seriesName === 'location') {
              if (chart.data.value[2] === 0) {
                return chart.marker + '攻击源<br/>' +
                  '城市名：' + chart.data.name
              } else {
                return chart.marker + '被攻击者<br/>' +
                  '城市名：' + chart.data.name
              }
            }
          }
        },
        visualMap: [
          {
            show: false,
            type: 'piecewise',
            left: '1%',
            bottom: '0%',
            splitNumber: 3,
            color: ['#228b22', '#48b', '#ff4500'],
            pieces: [
              {gte: 0, lte: 20, label: this.locale.dash.level_high_dangerous},
              {gte: 20, lte: 80, label: this.locale.dash.level_mid_dangerous},
              {gte: 80, lte: 100, label: this.locale.dash.level_healthy}
            ],
            itemWidth: screenSizeObj.remToPx(1.1),
            itemHeight: screenSizeObj.remToPx(0.6),
            showLabel: true,
            textStyle: {
              color: 'red',
              fontFamily: 'Microsoft YaHei',
              fontSize: fontsize
            }
          }
        ],
        geo: {
          map: 'china',
          label: {
            emphasis: {
              show: true
            }
          },
          center: [103.4551, 35.2539],
          zoom: 1.2,
          itemStyle: {
            normal: {
              areaColor: 'transparent', // '#bbb',
              borderColor: '#a3a3a3' // 地图轮廓颜色
            },
            emphasis: {
              areaColor: '#ee8262' // hover时地图底色
            }
          }
        },
        series: [
          {
            name: 'location',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            geoIndex: 0,
            effectType: 'ripple',
            showEffectOn: 'render',
            rippleEffect: {
              period: 3,
              scale: screenSizeObj.remToPx(0.1),
              brushType: 'stroke'
            },
            zlevel: 2,
            data: point,
            symbolSize: screenSizeObj.remToPx(0.5), // 设置气泡大小
            label: {
              normal: {
                position: 'bottom',
                show: true,
                formatter: '{b}',
                textStyle: {
                  color: '#9f000c',
                  fontSize: screenSizeObj.remToPx(0.7)
                }
              },
              emphasis: {
                position: 'bottom',
                show: false // 鼠标放上面显示文字
              }
            }
          },
          {
            name: '',
            type: 'lines',
            zlevel: 2,
            effect: {
              show: true,
              period: 3,
              contanstSpeed: 1800,
              trailLength: 0.1, // 白色路线 单次长度
              color: '#f00',
              symbol: 'arrow',
              symbolSize: screenSizeObj.remToPx(0.3)
            },
            lineStyle: {
              normal: {
                color: '#f00', // 路线的颜色
                width: 1,
                curveness: 0.1 // 路线的曲线
              }
            },
            data: line
          }
        ]
      }
      self.centerMap.setOption(option)
    }
  },
  created () {
    this.location.province = '安徽省'
    this.location.city = '芜湖'
    this.deviceName = 'yzh'
    this.type = 'AE86'
    this.ipAddress = '2.3.3.3'
  },
  mounted () {
    this.generateMap()
  },
  computed: {
    getPageContainerSizeChange () {
      return this.$store.getters.getPageContainerSizeChange
    }
  },
  watch: {
    getPageContainerSizeChange () {
      const self = this
      if (self.centerMap) {
        self.centerMap.resize()
      }
    }
  }
}
</script>
<style scoped>
div.sc-ds-map-wrap {
  width: 50rem;
  height: 30rem;
  margin: 0 auto;
}
</style>
