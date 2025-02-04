<script setup>

</script>

<template>
  <div class="basic-layout sre-monitor">
    <el-card class="flex-filter">
      <el-form
        ref="queryForm"
        :inline="true"
        class="queryForm "
        style="transform: translateY(4px)"
        :model="queryParams"
      >

        <el-form-item
          label="关联业务"
          prop="businessId"
          style="width: 300px"
        ><el-select
          v-model="queryParams.businessId"
          placeholder="请选择"
          clearable
          size="small"
          @change="selectBu"
        >
          <el-option
            v-for="dict in businessOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
        </el-form-item>
        <el-form-item
            label="关联客户"
            prop="customerId"
            style="width: 300px"
        ><el-select
            v-model="queryParams.customerId"
            placeholder="请选择"
            clearable
            size="small"
            @change="selectBu"
        >
          <el-option
              v-for="dict in customIdOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
        </el-form-item>
      </el-form>
      <div>
        <el-form :inline="true">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="timeRange"
              :picker-options="pickerOptions"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="至"
              clearable
            />
          </el-form-item>
          <el-form-item
            v-for="(item, index) in timeOptions"
            :key="index"
            label=""
          >
            <div
              class="text-btn"
              style="color:rgb(204, 204, 220)"
              :class="{active: item.value === currentTime}"
              @click="handleTimeChange(item)"
            >{{ item.name }}</div>
          </el-form-item>
          <el-form-item label="时间粒度">
            <el-select
              v-model="timeSetup"
              style="width: 90px"
            >
              <el-option
                label="1分钟"
                value="60"
              />
              <el-option
                label="2分钟"
                value="120"
              />
              <el-option
                label="5分钟"
                value="300"
              />
              <el-option
                label="1小时"
                value="3600"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="text-align: right">
            <a-button
              type="primary"
              icon="search"
              @click="getFlowCard"
            >搜索</a-button>
            <a-button
              style="margin-left: 10px"
              @click="resetQuery"
            ><a-icon type="sync" />重置</a-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <div style="padding-top:46px ;background-color: rgba(200,200,200,0.2);">


        <el-row :gutter="12">
          <el-col v-for="(row,index) in ispData" :span="8" class="monitor-card">
            <el-card shadow="always" :body-style="{ padding: '6px !important' }">
              <p style="margin-left: 10px;margin-top: 6px;margin-bottom: 0;">{{ row.name }}</p>
              <div
                :id="'isp-' + + (index + 1)"
                :key="index"
                style="height: 300px;width: 100%"
              />
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="8" class="monitor-card">
            <el-card shadow="always" :body-style="{ padding: '6px !important' }">
              <p style="margin-left: 10px;margin-top: 6px;margin-bottom: 0;">三网规划带宽</p>
              <div
                id="plan-bandwidth"
                style="height: 300px;width: 100%"
              />
            </el-card>
          </el-col>
          <el-col :span="16" class="monitor-card">
            <el-card shadow="always" :body-style="{ padding: '6px !important' }">
              <p style="margin-left: 10px;margin-top: 6px;margin-bottom: 0;">实时总汇聚</p>
              <div
                id="converge-bandwidth"
                style="height: 300px;width: 100%"
              />
            </el-card>

          </el-col>
        </el-row>
        <div
          v-infinite-scroll="loadMore"
          :infinite-scroll-disabled="isInfiniteScrollDisabled"
          infinite-scroll-distance="10"
        >
          <el-row :gutter="12">
            <a-spin :spinning="loading">

              <div v-if="monitorData.length == 0 ">
                <el-empty :image-size="200" description="暂无监控数据" />
              </div>
              <el-col v-for="(row,index) in monitorData" :span="8" class="monitor-card">
                <el-card shadow="always" :body-style="{ padding: '6px !important' }">

<!--                  <p style="margin-left: 10px;margin-top: 6px;margin-bottom: 0;">{{ row.remark }}</p>-->
                  <div slot="header" class="clearfix">
                    <span>{{ row.remark }}</span>
                    <el-button style="float: right; padding: 3px 0;color: rgb(204, 204, 220);" type="text" @click="showHostCmdb(row)">查看主机</el-button>
                  </div>
                  <div
                    :id="'monitor-' + + (index + 1)"
                    :key="index"
                    style="height: 300px;width: 100%"
                  />

                  <div style="padding: 4px">
                    <a-row v-if="row.monitorData && row.monitorData.transmit && row.monitorData.transmit.compute" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
                      <a-col class="gutter-row" :span="6" style="text-align: left">
                        <div class="chart-row-collect">
                          Max:<span class="chart-row-span">{{ conversion(row.monitorData.transmit.compute.max) }}</span>
                        </div>
                      </a-col>
                      <a-col class="gutter-row" :span="6" style="text-align: left">
                        <div class="chart-row-collect">
                          Min:<span class="chart-row-span">{{ conversion(row.monitorData.transmit.compute.min) }}</span>
                        </div>
                      </a-col>
                      <a-col class="gutter-row" :span="6" style="text-align: left">
                        <div class="chart-row-collect">
                          Avg:<span class="chart-row-span">{{ conversion(row.monitorData.transmit.compute.avg) }}</span>
                        </div>
                      </a-col>
                      <a-col class="gutter-row" :span="6" style="text-align: left">
                        <div class="chart-row-collect">
                          95:<span class="chart-row-span">{{ conversion(row.monitorData.transmit.compute.percent) }}</span>
                        </div>
                      </a-col>
                    </a-row>

                    <a-row v-if="row.monitorData && row.monitorData.receive && row.monitorData.receive.compute" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
                      <a-col class="gutter-row" :span="6" style="text-align: left">
                        <div class="chart-row-collect">
                          Max:<span class="chart-row-span">{{ conversion(row.monitorData.receive.compute.max) }}</span>
                        </div>
                      </a-col>
                      <a-col class="gutter-row" :span="6" style="text-align: left">
                        <div class="chart-row-collect">
                          Min:<span class="chart-row-span">{{ conversion(row.monitorData.receive.compute.min) }}</span>
                        </div>
                      </a-col>
                      <a-col class="gutter-row" :span="6" style="text-align: left">
                        <div class="chart-row-collect">
                          Avg:<span class="chart-row-span">{{ conversion(row.monitorData.receive.compute.avg) }}</span>
                        </div>
                      </a-col>
                      <a-col class="gutter-row" :span="6" style="text-align: left">
                        <div class="chart-row-collect">
                          95:<span class="chart-row-span">{{ conversion(row.monitorData.receive.compute.percent) }}</span>
                        </div>
                      </a-col>
                    </a-row>
                    <a-row v-if="row.monitorData && row.monitorData.province_out && row.monitorData.province_out.compute" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
                      <a-col class="gutter-row" :span="6" style="text-align: left">
                        <div class="chart-row-collect">
                          Max:<span class="chart-row-span">{{ conversion(row.monitorData.province_out.compute.max) }}</span>
                        </div>
                      </a-col>
                      <a-col class="gutter-row" :span="6" style="text-align: left">
                        <div class="chart-row-collect">
                          Min:<span class="chart-row-span">{{ conversion(row.monitorData.province_out.compute.min) }}</span>
                        </div>
                      </a-col>
                      <a-col class="gutter-row" :span="6" style="text-align: left">
                        <div class="chart-row-collect">
                          Avg:<span class="chart-row-span">{{ conversion(row.monitorData.province_out.compute.avg) }}</span>
                        </div>
                      </a-col>
                      <a-col class="gutter-row" :span="6" style="text-align: left">
                        <div class="chart-row-collect">
                          95:<span class="chart-row-span">{{ conversion(row.monitorData.province_out.compute.percent) }}</span>
                        </div>
                      </a-col>

                    </a-row>

                  </div>
                </el-card>
              </el-col>
            </a-spin>
          </el-row>

        </div>

    </div>

  </div>

</template>

<script>

import { listRsBusiness } from '@/api/cmdb/rc-business'

import {
  HostConvergeMonitor,
  HostQueryIspMonitor,
  HostQueryMonitor,
  HostQueryPlanBandWidthMonitor
} from '@/api/grafana'
import dayjs from 'dayjs'
import echarts from 'echarts'
import {listRsCustom} from "@/api/custom";
require('echarts/theme/dark');
export default {
  name: 'RsHost',
  data() {
    return {
      isInfiniteScrollDisabled: false,
      currentTime: '24',
      timeSetup: '300',
      timeOptions: [
        { name: '近24小时', value: '24' },
        { name: '昨天', value: '1' },
        { name: '近3天', value: '3' },
        { name: '近7天', value: '7' },
        { name: '近14天', value: '14' },
        { name: '近30天', value: '30' }
      ],
      timeRange: this.getTimeRangeBy24(),
      loading: false,
      queryParams: {
        pageIndex: 1,
        pageSize: 6
      },
      customIdOptions:[],
      businessOptions: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      total: 0,
      clearArray: false,
      monitorData: [],
      ispData: []
    }
  },
  watch: {
    id(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getFlowCard()
      }
    },
    timeSetup(newVal, oldVal) {
      this.getFlowCard()
    },
    timeRange(newVal, oldVal) {
      this.getFlowCard()
    }
  },
  created() {
    listRsBusiness({ pageSize: -1 }).then(response => {
      this.businessOptions = this.toDictData(response.data.list, 'name', 'id')
    })

    listRsCustom({ pageSize: -1 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    if (this.$route.query.businessId) {
      this.queryParams.businessId = this.$route.query.businessId
    }
    if (this.$route.query.customerId) {
      this.queryParams.customerId = this.$route.query.customerId
    }
    this.getFlowCard()
  },
  methods: {
    showHostCmdb(row){

      this.$router.push({ path: '/cmdb/rs-host', query: { hostId: row.id }})
    },
    selectBu() {
      // console.log("selectBu",this.queryParams.businessId)
      this.clearArray = true
      this.queryParams.pageIndex = 1
      this.$forceUpdate()
    },
    loadMore() {
      setTimeout(() => {
        console.log('loadMore', this.monitorData.length, this.total)
        if (this.monitorData.length === 0) {
          this.isInfiniteScrollDisabled = true
          return
        }
        if (this.monitorData.length >= this.total) {
          this.isInfiniteScrollDisabled = true
          return
        }
        this.queryParams.pageIndex++
        this.getFlowCard()
      }, 1000)
    },
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.$nextTick(() => {
        this.queryParams.businessId = undefined
        this.queryParams.pageIndex = 1
        this.getFlowCard()
      })
    },
    handleTimeChange(item) {
      this.currentTime = item.value
      const value = parseInt(item.value)
      const now = dayjs()
      if (value === 24) {
        this.timeRange = this.getTimeRangeBy24()
      } else if (value === 1) {
        this.timeRange = [
          dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          dayjs().subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')
        ]
      } else {
        this.timeRange = [
          dayjs().subtract(value, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          now.format('YYYY-MM-DD HH:mm:ss')
        ]
      }
    },
    getTimeRangeBy24() {
      const now = dayjs()
      const past24Hours = now.subtract(24, 'hour')
      return [
        past24Hours.format('YYYY-MM-DD HH:mm:ss'),
        now.format('YYYY-MM-DD HH:mm:ss')
      ]
    },
    // 格式化查询参数
    formatQueryParams() {
      const obj = { ...this.queryParams }
      Object.keys(obj).forEach(key => {
        if (obj[key] instanceof Array) {
          obj[key] = [...new Set(obj[key].flat())].join(',')
        }
      })
      return obj
    },

    getIspData(queryParams) {
      HostQueryIspMonitor(queryParams).then(response => {
        this.ispData = response.data

        this.$nextTick(() => {
          for (const index in this.ispData) {
            const row = this.ispData[index]

            const addIndex = parseInt(index) + 1
            const idName = 'isp-' + addIndex

            if (row && row.data) {
              const monitorData = row.data

              this.initIspChart(monitorData.transmit, monitorData.receive, idName)
            }
          }
        })
      })
    },

    getConverge(queryParams) {
      HostConvergeMonitor(queryParams).then(response => {
        // console.log('getConverge ！！！', response)
        const monitorData = response.data
        this.initConvergeChart(monitorData.transmit, monitorData.receive, 'converge-bandwidth')
        // converge-bandwidth
      })
    },
    initConvergeChart(transmit, receive, idName) {
      const chartDom = echarts.init(document.getElementById(idName),'dark')

      const legendData = ['上行', '下行']
      const seriesData = [
        {
          name: '上行',
          type: 'line',
          smooth: true,
          symbol: 'none',
          symbolSize: 1,
          lineStyle: {
            color: 'rgb(67, 214, 76)',
            width: 1
          },
          itemStyle: {
            color: 'rgb(67, 214, 76)',
            borderColor: '#fff',
            borderWidth: 0.5,
            shadowColor: 'rgba(0, 0, 0, .3)'
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(67, 214, 76)'
              }, {
                offset: 1,
                color: 'rgb(67, 214, 76)'
              }])
            }
          },
          data: transmit.data.map(e => e[1])
        },
        {
          name: '下行',
          type: 'line',
          smooth: true,
          symbol: 'none',
          symbolSize: 8,
          itemStyle: {
            color: 'rgb(129, 147, 196)',
            borderColor: '#fff',
            borderWidth: 1
          },
          lineStyle: {
            width: 1
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(129, 147, 196)'
              }, {
                offset: 1,
                color: 'rgb(129, 147, 196)'
              }])
            }
          },
          data: receive.data.map(e => e[1])
        }
      ]

      const optionCnf = {
        // backgroundColor: '#fff',
        title: {
          text: '',
          top: 10,
          left: 15,
          textStyle: {
            color: '#35598d',
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(rows) {
            if (rows === null) {
              return ''
            }
            let res = rows[0].axisValueLabel + '<br/>'
            for (let i = 0; i < rows.length; i++) {
              const value = rows[i].value
              let n = ''
              if (Number(value) > 999999999) {
                n = Number((value / 1000000000)).toFixed(2) + ' G'
              } else if (Number(value) > 999999) {
                n = (Number(value / 1000000)).toFixed(2) + ' M'
              } else if (Number(value) > 999) {
                n = (Number(value / 1000)).toFixed(2) + ' K'
              } else {
                n = Number(value).toFixed(2) + ' b'
              }
              res += rows[i].marker + rows[i].seriesName + '：' +
                n + '<br/>'
              // console.log("res",rows[i])
            }
            return res
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '3%',
          top: 30,
          containLabel: true
        },
        legend: {
          icon: 'rect',
          right: '4%',
          top: 13,
          itemWidth: 30,
          itemHeight: 3,
          data: legendData,
          textStyle: {
            color: '#555'
          }
        },
        xAxis: {
          type: 'category',
          data: transmit.data.map(e => `${e[0].slice(5, 10)} ${e[0].slice(11, 16)}`),
          axisLabel: { // 坐标轴字体颜色
            textStyle: {
              // color: '#303133'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e5e5e5'
            }
          },
          axisTick: { // y轴刻度线
            show: false
          },
          splitLine: { // 网格
            show: false
          },
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          axisLabel: { // 坐标轴字体颜色
            textStyle: {
              // color: '#303133'

            },
            formatter: function(value) {
              if (value == null) {
                return ''
              } else {
                if (Number(value) > 999999999) {
                  return Number((value / 1000000000)).toFixed(2) + ' G'
                } else if (Number(value) > 999999) {
                  return (Number(value / 1000000)).toFixed(2) + ' M'
                } else if (Number(value) > 999) {
                  return (Number(value / 1000)).toFixed(2) + ' K'
                } else {
                  return Number(value).toFixed(2) + ' b'
                }
              }
            }
          },
          axisLine: {
            show: false
          },
          axisTick: { // y轴刻度线
            show: false
          },
          splitLine: { // 网格
            show: false,
            lineStyle: {
              color: '#dadde4',
              type: 'dashed'
            }
          }
        },
        series: seriesData
      }
      chartDom.setOption(optionCnf)
    },
    getFlowHost(queryParams) {
      HostQueryMonitor(queryParams).then(response => {
        this.total = response.data.total

        if (this.clearArray) {
          this.monitorData = []
        }
        for (const index in response.data.data) {
          this.monitorData.push(response.data.data[index])
        }

        // this.monitorData = cacheData
        this.loading = false
        this.clearArray = false
        this.$nextTick(() => {
          for (const index in this.monitorData) {
            const data = this.monitorData[index]

            const addIndex = parseInt(index) + 1
            const idName = 'monitor-' + addIndex
            // console.log('Data!!', data, idName)
            if (data && data.monitorData) {
              const monitorData = data.monitorData

              this.initChart(monitorData.transmit, monitorData.receive, monitorData.province_out, idName)
            }
          }
        })
        this.$forceUpdate()
      })
    },
    /** 查询参数列表 */
    getFlowCard() {
      this.loading = true

      const queryParams = this.formatQueryParams()
      queryParams.start = dayjs(this.timeRange[0]).valueOf() / 1000
      queryParams.end = dayjs(this.timeRange[1]).valueOf() / 1000
      queryParams.setup = this.timeSetup
      // 查询三运营商 上下行带宽
      this.getIspData(queryParams)
      // 查询三网规划带宽
      this.initConvergeData(queryParams)
      // 查询主机监控
      this.getFlowHost(queryParams)

      // 查询汇聚数据
      this.getConverge(queryParams)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    conversion(value) {
      if (Number(value) > 999999999) {
        return Number(value / 1000000000).toFixed(2) + 'Gbps'
      } else if (Number(value) > 999999 && Number(value) < 999999999) {
        return Number(value / 1000000).toFixed(2) + 'Mbps'
      } else if (Number(value) > 999 && Number(value) < 999999) {
        return Number(value / 1000).toFixed(2) + 'Kbps'
      } else {
        return Number(value).toFixed(2) + 'bps'
      }
    },
    initConvergeData(queryParams) {
      HostQueryPlanBandWidthMonitor(queryParams).then(response => {
        // console.log('HostQueryPlanBandWidthMonitor data',response)
        const yAxis = []
        const data = []
        for (const index in response.data) {
          const row = response.data[index]
          yAxis.push(row.name)
          data.push(row.index)
        }
        this.initPlanConvergeChart(yAxis, data, 'plan-bandwidth')
      })
    },
    initPlanConvergeChart(yAxis, data, idName) {
      const chartDom = echarts.init(document.getElementById(idName),'dark')
      const option = {
        xAxis: {
          show: false,
          max: 'dataMax'
        },
        grid: {
          left: '2%',
          // right: '2%',
          // bottom: '3%',
          top: 30,
          containLabel: true
        },
        yAxis: {
          type: 'category',
          data: yAxis,
          inverse: true,
          max: 2 // only the largest 3 bars will be displayed
        },
        series: [
          {
            realtimeSort: true,
            // name: 'X',
            type: 'bar',
            data: data,
            label: {
              show: true,
              position: 'right',
              formatter: (params) => params.value + 'G', // 图上数值显示格式
              valueAnimation: true
            },
            itemStyle: {
              // 设置柱子的颜色
              color: '#1fb848'
            }
          }
        ],
        legend: {
          show: false
        }
      }

      chartDom.setOption(option)
    },
    initIspChart(transmit, receive, idName) {
      const chartDom = echarts.init(document.getElementById(idName),'dark')

      const legendData = ['上行', '下行']
      const seriesData = [
        {
          name: '上行',
          type: 'line',
          smooth: true,
          symbol: 'none',
          symbolSize: 1,
          lineStyle: {
            color: 'rgb(67, 214, 76)',
            width: 1
          },
          itemStyle: {
            color: 'rgb(67, 214, 76)',
            borderColor: '#fff',
            borderWidth: 0.5,
            shadowColor: 'rgba(0, 0, 0, .3)'
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(67, 214, 76)'
              }, {
                offset: 1,
                color: 'rgb(67, 214, 76)'
              }])
            }
          },
          data: transmit.data.map(e => e[1])
        },
        {
          name: '下行',
          type: 'line',
          smooth: true,
          symbol: 'none',
          symbolSize: 8,
          itemStyle: {
            color: 'rgb(129, 147, 196)',
            borderColor: '#fff',
            borderWidth: 1
          },
          lineStyle: {
            width: 1
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(129, 147, 196)'
              }, {
                offset: 1,
                color: 'rgb(129, 147, 196)'
              }])
            }
          },
          data: receive.data.map(e => e[1])
        }
      ]

      const optionCnf = {

        title: {
          text: '',
          top: 10,
          left: 15,
          textStyle: {
            color: '#35598d',
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(rows) {
            if (rows === null) {
              return ''
            }
            let res = rows[0].axisValueLabel + '<br/>'
            for (let i = 0; i < rows.length; i++) {
              const value = rows[i].value
              let n = ''
              if (Number(value) > 999999999) {
                n = Number((value / 1000000000)).toFixed(2) + ' G'
              } else if (Number(value) > 999999) {
                n = (Number(value / 1000000)).toFixed(2) + ' M'
              } else if (Number(value) > 999) {
                n = (Number(value / 1000)).toFixed(2) + ' K'
              } else {
                n = Number(value).toFixed(2) + ' b'
              }
              res += rows[i].marker + rows[i].seriesName + '：' +
                n + '<br/>'
              // console.log("res",rows[i])
            }
            return res
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '3%',
          top: 30,
          containLabel: true
        },
        legend: {
          icon: 'rect',
          right: '4%',
          top: 13,
          itemWidth: 30,
          itemHeight: 3,
          data: legendData,
          textStyle: {
            color: '#555'
          }
        },
        xAxis: {
          type: 'category',
          data: transmit.data.map(e => `${e[0].slice(5, 10)} ${e[0].slice(11, 16)}`),
          axisLabel: { // 坐标轴字体颜色
            textStyle: {
              // color: '#303133'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#e5e5e5'
            }
          },
          axisTick: { // y轴刻度线
            show: false
          },
          splitLine: { // 网格
            show: false
          },
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          axisLabel: { // 坐标轴字体颜色
            textStyle: {
              // color: '#303133'

            },
            formatter: function(value) {
              if (value == null) {
                return ''
              } else {
                if (Number(value) > 999999999) {
                  return Number((value / 1000000000)).toFixed(2) + ' G'
                } else if (Number(value) > 999999) {
                  return (Number(value / 1000000)).toFixed(2) + ' M'
                } else if (Number(value) > 999) {
                  return (Number(value / 1000)).toFixed(2) + ' K'
                } else {
                  return Number(value).toFixed(2) + ' b'
                }
              }
            }
          },
          axisLine: {
            show: false
          },
          axisTick: { // y轴刻度线
            show: false
          },
          splitLine: { // 网格
            show: false,
            lineStyle: {
              color: '#dadde4',
              type: 'dashed'
            }
          }
        },
        series: seriesData
      }
      chartDom.setOption(optionCnf)
    },
    initChart(transmit, receive, province_out = null, idName) {
      const chartDom = echarts.init(document.getElementById(idName),'dark')

      const legendData = ['上行', '下行']
      const seriesData = [
        {
          name: '上行',
          type: 'line',
          smooth: true,
          symbol: 'none',
          symbolSize: 1,
          lineStyle: {
            color: 'rgb(67, 214, 76)',
            width: 1
          },
          itemStyle: {
            color: 'rgb(67, 214, 76)',
            borderColor: '#fff',
            borderWidth: 0.5,
            shadowColor: 'rgba(0, 0, 0, .3)'
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(67, 214, 76)'
              }, {
                offset: 1,
                color: 'rgb(67, 214, 76)'
              }])
            }
          },
          data: transmit.data.map(e => e[1]),
          markLine: {
            data: [
              {
                yAxis: transmit.compute.percent, // 在 Y 轴为 100 的位置绘制标注线
                label: {
                  formatter: '95线', // 标注线上的文本
                  position: 'middle' // 文本的位置
                }
              }
            ],
            symbol: 'none',
            lineStyle: {
              color: 'red', // 标注线的颜色
              type: 'dash' // 标注线的样式（虚线）
            },
            emphasis: {
              lineStyle: {
                width: 1, // 使悬停时线条的宽度保持不变
                color: 'red', // 保持线条颜色不变
                type: 'dash' // 保持线条样式不变
              }
            }
          }
        },
        {
          name: '下行',
          type: 'line',
          smooth: true,
          symbol: 'none',
          symbolSize: 8,
          itemStyle: {
            color: 'rgb(129, 147, 196)',
            borderColor: '#fff',
            borderWidth: 1
          },
          lineStyle: {
            width: 1
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(129, 147, 196)'
              }, {
                offset: 1,
                color: 'rgb(129, 147, 196)'
              }])
            }
          },
          data: receive.data.map(e => e[1])
        }
      ]
      if (province_out) {
        legendData.push('跨省')
        seriesData.push(
          {
            name: '跨省',
            type: 'line',

            itemStyle: {
              color: 'rgb(255, 120, 10)',
              borderColor: '#fff',
              borderWidth: 1
            },
            data: province_out.data.length ? province_out.data.map(e => e[1]) : []
          }
        )
      }
      const optionCnf = {
        // backgroundColor: '#fff',
        title: {
          text: '',
          top: 10,
          left: 15,
          textStyle: {
            color: '#35598d',
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(rows) {
            if (rows === null) {
              return ''
            }
            let res = rows[0].axisValueLabel + '<br/>'
            for (let i = 0; i < rows.length; i++) {
              const value = rows[i].value
              let n = ''
              if (Number(value) > 999999999) {
                n = Number((value / 1000000000)).toFixed(2) + ' G'
              } else if (Number(value) > 999999) {
                n = (Number(value / 1000000)).toFixed(2) + ' M'
              } else if (Number(value) > 999) {
                n = (Number(value / 1000)).toFixed(2) + ' K'
              } else {
                n = Number(value).toFixed(2) + ' b'
              }
              res += rows[i].marker + rows[i].seriesName + '：' +
                n + '<br/>'
              // console.log("res",rows[i])
            }
            return res
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '3%',
          top: 30,
          containLabel: true
        },
        legend: {
          icon: 'rect',
          right: '4%',
          top: 13,
          itemWidth: 30,
          itemHeight: 3,
          data: legendData,
          textStyle: {
            color: '#555'
          }
        },
        xAxis: {
          type: 'category',
          data: transmit.data.map(e => `${e[0].slice(5, 10)} ${e[0].slice(11, 16)}`),
          axisLabel: { // 坐标轴字体颜色
            textStyle: {
              // color: '#303133'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#303133'
            }
          },
          axisTick: { // y轴刻度线
            show: false
          },
          splitLine: { // 网格
            show: false
          },
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          axisLabel: { // 坐标轴字体颜色
            textStyle: {
              // color: '#9eaaba'
            },
            formatter: function(value) {
              if (value == null) {
                return ''
              } else {
                if (Number(value) > 999999999) {
                  return Number((value / 1000000000)).toFixed(2) + ' G'
                } else if (Number(value) > 999999) {
                  return (Number(value / 1000000)).toFixed(2) + ' M'
                } else if (Number(value) > 999) {
                  return (Number(value / 1000)).toFixed(2) + ' K'
                } else {
                  return Number(value).toFixed(2) + ' b'
                }
              }
            }
          },
          axisLine: {
            show: false
          },
          axisTick: { // y轴刻度线
            show: false
          },
          splitLine: { // 网格
            show: false,
            lineStyle: {
              color: '#dadde4',
              type: 'dashed'
            }
          }
        },
        series: seriesData
      }

      chartDom.setOption(optionCnf)
    }
  }
}
</script>
<style scoped>
/deep/ .el-card {
  background-color: #303133 !important;
  color: rgb(204, 204, 220);
  border: 1px solid rgba(204, 204, 220, 0.12);
}
/deep/ .el-form-item__label{
  color: rgb(204, 204, 220);
}
</style>
<style scoped lang="scss">

.sre-monitor{
  background-color: #303133 !important;
  font-weight: 500;
  font-size: 0.8rem;
}
.text-btn {
  cursor: pointer;
  color: #333;
  padding: 0 2px;
  transition: all 0.3s;
}
.text-btn:hover {
  color: #1890ff;
}
.active {
  color: #1890ff;
}
.monitor-card{
  margin-bottom: 20px;

}
.chart-row-collect{

  font-weight: 400;
  line-height: 1.57143;
  font-size: 12px;
}

//.chart-row-collect {
//  display: inline-block;
//  //width: 14%;
//  margin-left: 3px;
//  text-align: left;
//  .chart-row-span{
//    color: #f52929;
//    font-size: 12px;
//    margin-left: 4px;
//  }
//}
//.chart-todo{
//  text-align: center;
//  font-size: 12px;
//}
//
//.chart-todo {
//  display: flex;
//  justify-content: space-between; /* 让div之间有均匀的空间，如果不需要间距可以用center */
//  align-items: center; /* 垂直居中 */
//  width: 100%; /* 让容器占满整个宽度 */
//  height: 100vh; /* 让容器占满整个视口高度，可以根据需要调整 */
//  box-sizing: border-box;
//  padding: 3px; /* 给容器一些内边距 */
//}
//
//.chart-row-collect {
//  flex: 1; /* 均分容器宽度 */
//  text-align: center; /* 内容居中 */
//  border: 1px solid #ccc; /* 可选：给div加边框方便查看效果 */
//  box-sizing: border-box; /* 包括内边距和边框在内计算宽度 */
//  padding: 20px; /* 可选：给div一些内边距 */
//}

.el-main{
  padding: 6px !important;
}
.basic-layout {
  padding:10px !important;
}

</style>
<style>
.app-main{
  overflow: auto !important;
}
</style>
