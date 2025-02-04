<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        size="mini"
      >
        <el-row class="custom-detail">
          <el-col :span="8">
            <el-form-item
              label="主机名："
              prop="hostName"
            >
              {{ form.hostname }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="sn："
              prop="sn"
            >
              {{ form.sn }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
                label="是否计费："
                prop="transProvince"
            >
              <el-link v-if="form.suspend_billing === true" type="success">计费中</el-link>
              <el-link v-else type="danger">暂停计费</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="总带宽："
              prop="balance"
            >
              {{ form.balance }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="机器归属："
              prop="belong"
            >
              {{ selectDictLabel(belongOptions, form.belong) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="Remark:"
              prop="remark"
            >
              {{ form.remark }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="运营商："
              prop="isp"
            >
              {{ selectDictLabel(ispOptions, form.isp) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="主机状态："
              prop="status"
            >
              {{ selectDictLabel(statusOptions, form.status) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="是否跨省："
              prop="transProvince"
            >
              {{ selectDictLabel(transProvinceOptions, form.transProvince) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="线路类型："
              prop="lineType"
            >
              {{ selectDictLabel(lineTypeOptions, form.lineType) || '未知' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="所在地区："
              prop="region"
            >
              {{ form.idcInfo && getNamesFromCodes(form.idcInfo.region, regionOptions) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="网络类型："
              prop="networkType"
            >
              {{ selectDictLabel(networkTypeOptions, form.networkType) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="客户端版本："
              prop="version"
            >
              {{ form.version }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="首次创建："
              prop="createdAt"
            >
              {{ parseTime(form.createdAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="更新人："
              prop="updateBy"
            >
              {{ form.updatedUser }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="更新时间："
              prop="updatedAt"
            >
              {{ parseTime(form.updatedAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="备注："

            >
              <div v-if="form.desc">{{ form.desc.desc }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
                label="计费备注："

            >
              <div v-if="form.desc">{{ form.desc.suspend_billing }}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <a-divider
        dashed
        style="margin-bottom: 0"
      />
      <a-tabs
        :active-key="activeKey"
        @change="tabChange"
      >
        <a-tab-pane
          key="1"
          tab="流量"
          force-render
        >
          <div style="padding:10px 20px 0 20px">
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
                  :class="{active: item.value == currentTime}"
                  @click="handleTimeChange(item)"
                >{{ item.name }}</div>
              </el-form-item>
              <el-form-item label="时间粒度">
                <el-select
                  v-model="timeSteup"
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
            </el-form>
          </div>
          <div
            id="my-chart"
            style="height: 400px;width: 100%"
          />
          <div
            style="padding: 10px 20px 0px;"
            class="chart-todo"
          >
            <div v-if="transmitCompute">
              上行
              <div class="chart-row-collect">
                最大:<span class="chart-row-span">{{ conversion(transmitCompute.max) }}</span>
              </div>
              <div class="chart-row-collect">
                最小:<span class="chart-row-span">{{ conversion(transmitCompute.min) }}</span>
              </div>
              <div class="chart-row-collect">
                平均:<span class="chart-row-span">{{ conversion(transmitCompute.avg) }}</span>
              </div>
              <div class="chart-row-collect">
                95:<span class="chart-row-span">{{ conversion(transmitCompute.percent) }}</span>
              </div>
            </div>
            <div v-if="receiveCompute">
              下行
              <div class="chart-row-collect">
                最大:<span class="chart-row-span">{{ conversion(receiveCompute.max) }}</span>
              </div>
              <div class="chart-row-collect">
                最小:<span class="chart-row-span">{{ conversion(receiveCompute.min) }}</span>
              </div>
              <div class="chart-row-collect">
                平均:<span class="chart-row-span">{{ conversion(receiveCompute.avg) }}</span>
              </div>
              <div class="chart-row-collect">
                95:<span class="chart-row-span">{{ conversion(receiveCompute.percent) }}</span>
              </div>
            </div>
            <div v-if="provinceCompute">
              跨省
              <div class="chart-row-collect">
                最大:<span class="chart-row-span">{{ conversion(provinceCompute.max) }}</span>
              </div>
              <div class="chart-row-collect">
                最小:<span class="chart-row-span">{{ conversion(provinceCompute.min) }}</span>
              </div>
              <div class="chart-row-collect">
                平均:<span class="chart-row-span">{{ conversion(provinceCompute.avg) }}</span>
              </div>
              <div class="chart-row-collect">
                95:<span class="chart-row-span">{{ conversion(provinceCompute.percent) }}</span>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <!--        <a-tab-pane-->
        <!--          key="2"-->
        <!--          tab="监控看板"-->
        <!--          force-render-->
        <!--        >-->
        <!--          Content of Tab Pane 2-->
        <!--        </a-tab-pane>-->
        <a-tab-pane
          key="3"
          tab="拨号"
          force-render
        >
          <RsDial
            :host-id="id"
            :table-fields="[]"
            :idc-id="rowData.idcInfo ? rowData.idcInfo.id : null"
            :show-add="false"
            :search-field="['account']"
          />
        </a-tab-pane>
        <a-tab-pane
          key="4"
          tab="业务切换记录"
          force-render
        >
          <Business
            ref="Business"
            :host-id="id"
          />
        </a-tab-pane>
        <a-tab-pane
          key="5"
          tab="硬件信息"
          force-render
        >
          <a-descriptions title="主机配置">
            <a-descriptions-item label="CPU">
              {{ form.cpu }}核
            </a-descriptions-item>
            <a-descriptions-item label="内存">
              {{ form.system && form.system.memory }}G
            </a-descriptions-item>
            <a-descriptions-item label="网卡信息">
              <template v-if="form.netDevice && form.netDevice.length">
                <a-tag
                  v-for="row in form.netDevice"
                  :key="row.id"
                  color="blue"
                > {{ row.name }}</a-tag>
              </template>
            </a-descriptions-item>
          </a-descriptions>
          <a-divider orientation="left">
            磁盘明细
          </a-divider>
          <el-table
            :data="form.disk"
            style="width: 100%"
          >
            <el-table-column
              prop="dev"
              label="挂载磁盘"
            />
            <el-table-column
              prop="fs"
              label="挂载目录"
            />
            <el-table-column
              prop="t"
              label="总大小(G)"
            />
            <el-table-column
              prop="u"
              label="已使用(G)"
            />
            <el-table-column
              prop="up"
              label="已使用率"
            />
          </el-table>
        </a-tab-pane>
        <a-tab-pane
          key="7"
          tab="费用明细"
          force-render
        >
          <Profit :host-id="id" />
        </a-tab-pane>
        <a-tab-pane
          key="6"
          tab="操作日志"
          force-render
        >
          <Logs
            :id="id"
            ref="logs"
            :mode="'rs_host'"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>

</template>

<script>
import { getRsHost, getRsHostMonitorFlow } from '@/api/cmdb/rs-host'
import echarts from 'echarts'
import dayjs from 'dayjs'
import resize from '@/components/Charts/mixins/resize'
import Business from '@/views/cmdb/rs-host/components/business.vue'
import RsDial from '@/views/dial/indexChild.vue'
import Logs from '@/components/Logs/index.vue'
import Profit from '@/views/cmdb/rs-host/components/profit.vue'

export default {
  name: 'RsHostDetail',
  components: {
    RsDial,
    Business,
    Profit,
    Logs
  },
  mixins: [resize],
  props: {
    id: {
      default: ''
    },
    rowData: {
      type: Object
    }
  },
  data() {
    return {
      eid: 'my-chart',
      chart: null,
      option: null,
      timeRange: this.getTimeRangeBy24(),
      belongOptions: [], ispOptions: [], statusOptions: [], transProvinceOptions: [], lineTypeOptions: [], networkTypeOptions: [],
      form: {
      },
      spinning: false,
      loading: false,
      activeKey: '1',
      businessList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      timeOptions: [
        { name: '近24小时', value: '24' },
        { name: '昨天', value: '1' },
        { name: '近3天', value: '3' },
        { name: '近7天', value: '7' },
        { name: '近14天', value: '14' },
        { name: '近30天', value: '30' }
      ],
      currentTime: '24',
      timeSteup: '300',
      transmitCompute: {},
      receiveCompute: {},
      provinceCompute: {}
    }
  },
  watch: {
    id(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getDataById()
        this.getFlowById()
      }
    },
    timeSteup(newVal, oldVal) {
      this.getFlowById()
    },
    timeRange(newVal, oldVal) {
      this.getFlowById()
    }
  },
  created() {
    if (!this.id) this.id = this.$route.query.id
    this.getDataById()
    this.getFlowById()
    this.getDicts('belong').then(response => {
      this.belongOptions = response.data
    })
    this.getDicts('isp').then(response => {
      this.ispOptions = response.data
    })
    this.getDicts('host_status').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('sys_yes_no').then(response => {
      this.transProvinceOptions = response.data
    })
    this.getDicts('line_type').then(response => {
      this.lineTypeOptions = response.data
    })
    this.getDicts('network_type').then(response => {
      this.networkTypeOptions = response.data
    })
    this.regionOptions = this.$store.getters.region
  },
  mounted() {
    // setTimeout(() => {
    //   this.initChart()
    // }, 100)
  },
  methods: {
    getDataById() {
      this.spinning = true
      if (this.$refs.logs) {
        this.$refs.logs.getDataById()
      }
      getRsHost(this.id).then(response => {
        this.spinning = false
        this.form = response.data
      }).catch(err => {
        this.spinning = false
      })
    },
    tabChange(key) {
      this.activeKey = key
      if (key === '4') {
        this.$refs.Business.queryParams.hostId = this.id
        this.$refs.Business.getList()
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
    getFlowById() {
      this.spinning = true
      const params = {
        id: this.id,
        start: dayjs(this.timeRange[0]).valueOf() / 1000,
        end: dayjs(this.timeRange[1]).valueOf() / 1000,
        setup: this.timeSteup
      }
      getRsHostMonitorFlow(params).then(response => {
        this.spinning = false
        const { transmit, receive, province_out } = response.data
        this.transmitCompute = response.data.transmit.compute
        this.receiveCompute = response.data.receive.compute
        if(province_out) {
          this.provinceCompute = response.data.province_out.compute
        }
        this.initChart(transmit, receive, province_out)
      }).catch(err => {
        this.spinning = false
      })
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
    initChart(transmit, receive, province_out = null) {
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById('my-chart'))
      }
      const legendData = ['上行', '下行']
      const seriesData = [
        {
          name: '上行',
          type: 'line',
          smooth: true,
          symbol: 'none',
          symbolSize: 1,
          lineStyle: {
            color: 'rgb(55, 200, 143)',
            width: 1
          },
          itemStyle: {
            color: 'rgb(55, 200, 143)',
            borderColor: '#fff',
            borderWidth: 0.5,
            shadowColor: 'rgba(0, 0, 0, .3)'
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(55, 200, 143, .4)'
              }, {
                offset: 1,
                color: 'rgba(55, 200, 143, 0)'
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
            color: 'rgb(87, 120, 225)',
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
                color: 'rgb(87, 120, 225, 0.4)'
              }, {
                offset: 1,
                color: 'rgba(87, 120, 225, 0)'
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
            smooth: true,
            symbol: 'none',
            symbolSize: 8,
            itemStyle: {
              color: 'rgba(241,162,42,1)',
              borderColor: '#fff',
              borderWidth: 1
            },
            lineStyle: {
              width: 1
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(241,162,42,.4)' // 渐变色的起始颜色
                  },
                  {
                    offset: 0.9,
                    color: 'rgba(241,162,42,0)' // 渐变线的结束颜色
                  }
                ],
                false
              ),
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            data: province_out.data.length ? province_out.data.map(e => e[1]) : []
          }
        )
      }
      this.option = {
        backgroundColor: '#fff',
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
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 60,
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
              color: '#9eaaba'
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
              color: '#9eaaba'
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

      this.chart.setOption(this.option)
    }
  }
}
</script>
<style scoped>

.el-form-item--mini.el-form-item{
  margin-bottom: 6px !important;
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
.chart-row-collect {
  display: inline-block;
  width: 14%;
  margin-left: 3px;
  text-align: left;
  .chart-row-span{
    color: #f52929;
    font-size: 16px;
    margin-left: 4px;
  }
}
.chart-row-collect{
  padding-bottom: 4px;
}
.chart-todo{
  text-align: center;
}
::v-deep {
  .el-container {
    height: auto!important;
  }
}
</style>
