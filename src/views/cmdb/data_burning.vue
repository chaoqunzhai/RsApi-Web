<template>
  <div class="basic-layout sre-monitor">
    <el-row :gutter="12">
      <el-col :span="12" class="monitor-card">
        <el-card shadow="always" :body-style="{ padding: '6px !important' }">
          <p style="margin-left: 10px;margin-top: 6px;margin-bottom: 0;">在线主机</p>
          <div
            id="burning-online"
            style="height: 300px;width: 100%"
          />
        </el-card>
      </el-col>
      <el-col :span="12" class="monitor-card">

        <el-card shadow="always" :body-style="{ padding: '6px !important' }">
          <p style="margin-left: 10px;margin-top: 6px;margin-bottom: 0;">离线主机</p>
          <div
            id="burning-offline"
            style="height: 300px;width: 100%"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col class="monitor-card">

        <el-card shadow="always" :body-style="{ padding: '6px !important' }">
          <p style="margin-left: 10px;margin-top: 6px;margin-bottom: 0;">在线带宽</p>
          <div
            id="burning-bandwidth"
            style="height: 300px;width: 100%"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { dataBurning } from '@/api/cmdb/rs-host'
import echarts from 'echarts'

export default {
  name: 'DataBurning',
  data() {
    return {

    }
  },
  created() {
    this.initDataList()
  },
  methods: {
    initDataList() {
      dataBurning().then(resp => {
        const data = resp.data
        this.initOnlineChart(data.online.x, data.online.y, 'burning-online', '在线数量')
        this.initOfflineChart(data.offline.x, data.offline.y, 'burning-offline', '离线数量')
        this.initBandwidthChart(data.total_bandwidth.x,
          data.total_bandwidth.y, 'burning-bandwidth', '总带宽')
      })
    },
    initOnlineChart(xAxis, series, idName, name) {
      const chartDom = echarts.init(document.getElementById(idName))
      const option = {
        xAxis: {
          type: 'category',
          data: xAxis,
          axisLabel: { // 坐标轴字体颜色
            textStyle: {
              color: '#303133'
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis', // 触发类型：坐标轴触发
          axisPointer: {
            type: 'cross' // 指示器类型：十字准线
          },
          formatter: function(rows) {
            if (rows === null) {
              return ''
            }
            let res = rows[0].axisValueLabel + '<br/>'
            for (let i = 0; i < rows.length; i++) {
              const value = rows[i].value

              res += rows[i].marker + rows[i].seriesName + '：' +
                  value + '<br/>'
              // console.log("res",rows[i])
            }
            return res
          }
        },
        series: [
          {
            name: name,
            data: series,
            type: 'line',
            symbolSize: 1,
            lineStyle: {
              color: 'rgb(85 210 93)',
              width: 3
            },
            itemStyle: {
              color: 'rgb(85 210 93)',
              borderColor: '#fff',
              borderWidth: 0.5,
              shadowColor: 'rgba(0, 0, 0, .3)'
            },
            label: {
              show: true // 显示数据标签
            }
          }
        ]
      }
      chartDom.setOption(option)
    },
    initOfflineChart(xAxis, series, idName, name) {
      const chartDom = echarts.init(document.getElementById(idName))
      const option = {
        xAxis: {
          type: 'category',
          data: xAxis,
          axisLabel: { // 坐标轴字体颜色
            textStyle: {
              color: '#303133'
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis', // 触发类型：坐标轴触发
          axisPointer: {
            type: 'cross' // 指示器类型：十字准线
          },
          formatter: function(rows) {
            if (rows === null) {
              return ''
            }
            let res = rows[0].axisValueLabel + '<br/>'
            for (let i = 0; i < rows.length; i++) {
              const value = rows[i].value

              res += rows[i].marker + rows[i].seriesName + '：' +
                  value + '<br/>'
              // console.log("res",rows[i])
            }
            return res
          }
        },
        series: [
          {
            name: name,
            data: series,
            type: 'line',
            lineStyle: {
              color: 'rgb(255, 120, 10)',
              width: 3
            },
            itemStyle: {
              color: 'rgb(255, 120, 10)',
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              show: true // 显示数据标签
            }
          }
        ]
      }
      chartDom.setOption(option)
    },
    initBandwidthChart(xAxis, series, idName, name) {
      const chartDom = echarts.init(document.getElementById(idName))
      const option = {
        xAxis: {
          type: 'category',
          data: xAxis,
          axisLabel: { // 坐标轴字体颜色
            textStyle: {
              color: '#303133'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: { // 坐标轴字体颜色
            textStyle: {
              // color: '#9eaaba'
            },
            formatter: function(value) {
              return value + ' G'
            }
          }
        },
        tooltip: {
          trigger: 'axis', // 触发类型：坐标轴触发
          axisPointer: {
            type: 'cross' // 指示器类型：十字准线
          },
          formatter: function(rows) {
            if (rows === null) {
              return ''
            }

            let res = rows[0].axisValueLabel + '<br/>'
            for (let i = 0; i < rows.length; i++) {
              const value = rows[i].value

              res += rows[i].marker + rows[i].seriesName + '：' +
                  value + '<br/>'
              // console.log("res",rows[i])
            }
            return res
          }
        },
        series: [
          {
            name: name,
            data: series,
            type: 'line',
            symbolSize: 2,
            lineStyle: {
              color: 'rgb(129, 147, 196)',
              width: 3
            },
            itemStyle: {
              color: 'rgb(129, 147, 196)',
              borderColor: '#fff',
              borderWidth: 0.5,
              shadowColor: 'rgba(0, 0, 0, .3)'
            },
            label: {
              show: true // 显示数据标签
            }
          }
        ]
      }
      chartDom.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
