<template>
  <div class="container">
    <div class="card-box">
      <div class="title">
        收益概况
      </div>
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="card-container">
            <div class="card-title">昨日收益（元）</div>
            <div class="card-value">715,600.00</div>
            <div class="card-desc">
              <span class="card-desc-text">同比上月</span>
              <span class="card-desc-value">+15%<a-icon type="arrow-up" /></span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card-container">
            <div class="card-title">昨日收益（元）</div>
            <div class="card-value">715,600.00</div>
            <div class="card-desc">
              <span class="card-desc-text">同比上月</span>
              <span class="card-desc-value">+15%<a-icon type="arrow-down" /></span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card-container">
            <div class="card-title">昨日收益（元）</div>
            <div class="card-value">715,600.00</div>
            <div class="card-desc">
              <span class="card-desc-text">同比上月</span>
              <span class="card-desc-value">+15%</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card-container">
            <div class="card-title">昨日收益（元）</div>
            <div class="card-value">715,600.00</div>
            <div class="card-desc">
              <span class="card-desc-text">同比上月</span>
              <span class="card-desc-value">+15%</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="card-box">
      <div class="title">
        收益趋势
      </div>
      <div class="radio-check">
        <div class="left-box">
          <a-radio-group
            v-model="current"
            @change="chartChange"
          >
            <a-radio-button value="qushi">
              总趋势
            </a-radio-button>
            <a-radio-button value="shouyi">
              收益
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class="center-box">
          <el-select
            v-model="queryParams.idcId"
            style="width: 140px"
            filterable
            placeholder="全部机房"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in idcIdOptions"
              :key="dict.value"
              :class="[dict.value === 'empty' ? 'empty' : '']"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
          <el-select
            v-model="queryParams.customId"
            style="width: 140px"
            placeholder="全部客户"
            clearable
            filterable
            size="small"
          >
            <el-option
              v-for="dict in customIdOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
          <el-cascader
            v-model="queryParams.region"
            filterable
            size="small"
            :options="regionOptions"
            :props="regionProps"
            :style="{width: '140px'}"
            placeholder="全部地区"
            clearable
          />
          <el-select
            v-model="queryParams.businessId"
            style="width: 140px"
            multiple
            collapse-tags
            placeholder="全部业务"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in [{label: '(空业务)', value: 'empty'}].concat(businessOptions)"
              :key="dict.value"
              :class="[dict.value === 'empty' ? 'empty' : '']"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
          <el-select
            v-model="queryParams.isp"
            style="width: 140px"
            placeholder="运营商"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in ispOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
          <el-select
            v-model="queryParams.isp"
            style="width: 140px"
            placeholder="运营商"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in ispOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </div>
        <div class="right-box">
          <a-radio-group v-model="currentTime">
            <a-radio-button
              value="7"
              @click="changeTime(7)"
            >
              近7天
            </a-radio-button>
            <a-radio-button
              value="本月"
              @click="changeTime('本月')"
            >
              本月
            </a-radio-button>
            <a-radio-button
              value="上月"
              @click="changeTime('上月')"
            >
              上月
            </a-radio-button>
          </a-radio-group>
          <el-date-picker
            v-model="timeRange"
            style="position: absolute; width: 240px;right: 0; top: 40px;z-index: 99"
            size="small"
            :picker-options="pickerOptions"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至"
            clearable
          />
        </div>
      </div>
      <div style="width: 100%">
        <div
          id="my-chart1"
          style="height: 390px;width: 100%"
        />
        <!--        <div-->
        <!--          v-show="current === 'shouyi'"-->
        <!--          id="my-chart2"-->
        <!--          style="height: 390px;width: 100%"-->
        <!--        />-->
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
import dayjs from 'dayjs'
import { listRsBusiness } from '@/api/cmdb/rc-business'
import { listRsCustom } from '@/api/custom'
import { listRsIdc } from '@/api/cmdb/rc-idc'
import { graphIncome } from '@/api/income'

export default {
  name: 'Profit',
  components: {},
  mixins: [resize],
  data() {
    return {
      chart: null,
      current: 'qushi',
      currentTime: '7',
      timeRange: this.getTimeRangeBy24(),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      // 查询参数
      queryParams: {
        isp: undefined,
        idcId: undefined,
        region: undefined,
        businessId: undefined,
        customId: undefined
      },
      ispOptions: [],
      businessOptions: [],
      idcIdOptions: [],
      customIdOptions: [],
      regionOptions: [],
      regionProps: {
        'multiple': true,
        'checkStrictly': true,
        'label': 'name',
        'value': 'code',
        'children': 'children'
      }
    }
  },
  created() {
    this.$nextTick(() => this.initChart())
    this.regionOptions = this.$store.getters.region
    listRsBusiness({ pageSize: -1 }).then(response => {
      this.businessOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    listRsCustom({ pageSize: -1 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    this.getDicts('isp').then(response => {
      this.ispOptions = response.data
    })
    listRsIdc({ pageSize: -1 }).then(response => {
      this.idcIdOptions = response.data.list.map((item) => { return { label: item.number + item['name'], value: item['id'] + '' } })
    })
    this.getGraphIncome()
    // setTimeout(() => {
    //   this.initChart()
    // }, 1000)
    // this.initChart()
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  },
  methods: {
    changeTime(value) {
      const now = dayjs()
      if (value === '本月') {
        this.timeRange = [
          now.startOf('month').format('YYYY-MM-DD HH:mm:ss'),
          now.format('YYYY-MM-DD HH:mm:ss')
        ]
      } else if (value === '上月') {
        this.timeRange = [
          now.subtract(1, 'month').startOf('month').format('YYYY-MM-DD HH:mm:ss'),
          now.subtract(1, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss')
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
      return [
        dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        now.format('YYYY-MM-DD HH:mm:ss')
      ]
    },
    chartChange(e) {
      console.log(e)
      if (e.target.value === 'qushi') {
        this.$nextTick(() => this.initChart())
        // setTimeout(()=>{
        //   this.initChart()
        // }, 2000)
      }
      if (e.target.value === 'shouyi') {
        this.$nextTick(() => this.initChart2())
        // setTimeout(()=>{
        //   this.initChart2()
        // }, 2000)
      }
      // this.current = e.target.value
      // this.chart.setOption(this.option)
    },
    getGraphIncome() {
      graphIncome(this.addDateRange(this.formatQueryParams(this.queryParams), this.dateRange)).then(response => {
        console.log(response.data.list)
      })
    },
    formatQueryParams() {
      const obj = { ...this.queryParams }
      Object.keys(obj).forEach(key => {
        if (obj[key] instanceof Array) {
          obj[key] = [...new Set(obj[key].flat())].join(',')
        }
      })
      return obj
    },
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById('my-chart1'))
      }
      this.option = {
        backgroundColor: '#ffffff',
        name: 'a',
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            lineStyle: {
              color: 'none'
            }
          },
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          textStyle: {
            align: 'left',
            fontSize: 12,
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2)' // 添加阴影
        },
        color: ['#0580f2', '#faa732', '#e1575d'],
        grid: {
          left: '5%',
          right: '6%',
          top: '14%',
          bottom: '6%',
          containLabel: true
        },
        legend: {
          show: true,
          icon: 'rect',
          right: 20,
          bottom: -5,
          textStyle: {
            fontSize: 12,
            color: '#333333'
          },
          itemWidth: 30,
          itemHeight: 2,
          data: ['发明专利', '外观专利', '实用新型']
        },
        xAxis: {
          show: true,
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#eeeeee'
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: 14,
              color: '#999999'
            }
          },
          data: ['2010', '2011', '2012', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023']
        },
        yAxis: {
          show: true,
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#f2f3f7'
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: '#999999'
            }
          }
        },
        series: [
          {
            name: '发明专利',
            type: 'line',
            symbol: 'circle',
            itemStyle: {
              emphasis: {
                symbol: 'circle'
              }
            },
            symbolSize: [8, 8],
            data: [1, 0, 1, 4, 10, 8, 5, 2, 3, 2, 1, 9]
          },
          {
            name: '外观专利',
            type: 'line',
            symbol: 'circle',
            symbolSize: [8, 8],
            data: [2, 1, 3, 3, 5, 6, 7, 8, 9, 10, 11, 88]
          },
          {
            name: '实用新型',
            type: 'line',
            symbol: 'circle',
            symbolSize: [8, 8],
            data: [4, 4, 4, 50, 15, 3, 4, 5, 6, 7, 88, 54]
          }
        ]
      }
      this.chart.setOption(this.option)
    },
    initChart2() {
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById('my-chart2'))
      }
      const data = [{
        name: '周一',
        value: [120, 220, 344]
      }, {
        name: '周二',
        value: [132, 182, 32]
      }, {
        name: '周三',
        value: [101, 191, 65]
      }, {
        name: '周四',
        value: [1134, 234, 211]
      }, {
        name: '周五',
        value: [90, 290, 234]
      }, {
        name: '周六',
        value: [230, 330, 123]
      }, {
        name: '周七',
        value: [210, 310, 190]
      }]
      const legendData = ['付费', '免费', '未知']
      const seriesData = []
      legendData.forEach(legend => {
        seriesData.push([])
      })
      const xData = []
      data.forEach(({
        name,
        value
      }) => {
        xData.push(name)
        value.forEach((v, idx) => {
          seriesData[idx].push(v)
        })
      })
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        backgroundColor: '#fff',
        legend: {
          right: 0,
          data: legendData
        },
        grid: {
          left: 10,
          right: 10,
          bottom: '3%',
          containLabel: true
        },
        color: ['#1890FF', '#FF5614', '#00C49F'],
        xAxis: [{
          type: 'category',
          data: xData,
          axisLine: {
            show: true,
            lineStyle: {
              width: 2,
              color: '#D9D9D9'
            }
          },
          axisLabel: {
            margin: 16,
            textStyle: {
              fontSize: '14',
              color: '#333'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              fontSize: '14',
              color: '#333'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#E8E8E8'
            }
          }
        }],
        series: seriesData.map((data, idx) => ({
          name: legendData[idx],
          type: 'bar',
          stack: '数量',
          barWidth: 20,
          data
        }))
      }
      this.chart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  background: #f2f3f5;
  padding: 10px;
  overflow-y: scroll;
}
.radio-check {

}
.card-box {
  padding: 20px 18px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 4px 10px 0px rgba(78, 89, 105, 0.06);
  .title {
    color: rgb(29, 33, 41);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .card-container {
    border-radius: 4px;
    padding: 16px 20px;
    .card-title {
      color: rgb(29, 37, 47);
      font-size: 16px;
      font-weight: 500;
    }
    .card-value {
      color: rgb(29, 33, 41);
      font-size: 24px;
      padding-top: 20px;
      padding-bottom: 4px;
      line-height: 26px;
      font-weight: 720;
    }
    .card-desc-text {
      color: rgb(78, 89, 105);
      font-size: 12px;
      font-weight: 400;
    }
    .card-desc-value {
      color: rgb(245, 63, 63);
      font-family: Byte Number;
      font-size: 14px;
      font-weight: 720;
      margin-left: 10px;
    }
  }
  .el-col {
    &:nth-child(1) {
      .card-container {
        background: linear-gradient(180.00deg, rgb(242, 249, 254),rgb(230, 244, 254) 100%);
      }
    }
    &:nth-child(2) {
      .card-container {
        background: linear-gradient(180.00deg, rgb(245, 254, 242),rgb(230, 254, 238) 100%);
      }
    }
    &:nth-child(3) {
      .card-container {
        background: linear-gradient(180.00deg, rgb(242, 249, 254),rgb(230, 244, 254) 100%);
      }
    }
    &:nth-child(4) {
      .card-container {
        background: linear-gradient(180.00deg, rgb(247, 247, 255),rgb(236, 236, 255) 100%);
      }
    }
  }
  .radio-check {
    display: flex;
    justify-content: space-between;
    .center-box {
      flex: 1;
      display: flex;
      flex: 1;
      justify-content: space-evenly;
    }
  }
  .right-box {
    position: relative;
  }
}
</style>
