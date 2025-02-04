
<template>
  <div style="padding: 5px 0px">
    <el-form
      ref="queryForm"
      :inline="true"
      :model="queryParams"
      class="queryForm"
    >
      <el-form-item
        label="业务:"
        prop="businessId"
      ><el-select
        v-model="queryParams.businessId"
        multiple
        placeholder="请选择"
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
      </el-form-item>
      <el-form-item
        label="结算日期:"
        prop="startTimeAt"
      >
        <el-date-picker
          style="width: 250px"
          size="small"
          v-model="dateRange"
          value-format="yyyy-MM-dd hh:MM:ss"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="text-align: right;margin-left: 20px">
        <a-button
          type="primary"
          icon="search"
          @click="handleQuery"
        >搜索</a-button>
        <a-button
          style="margin-left: 10px"
          @click="resetQuery"
        ><a-icon type="sync" />重置</a-button>
      </el-form-item>
    </el-form>
    <el-table
      style="margin-bottom: 15px"
      border
      v-loading="loading"
      :data="incomeList"
    >
      <el-table-column
        label="结算日期"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="业务名称"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{selectDictLabel(businessOptions, scope.row.buId)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="单价(元/G/月)"
        align="center"
        prop="avgDayPrice"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="计费95带宽(G)"
        align="center"
        prop="settleBandwidth"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.bandwidth95 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="利用率"
        align="center"
        prop="usage"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
              <span v-if="scope.row.usage">
                <el-progress
                  :text-inside="true"
                  :stroke-width="14"
                  :percentage="(scope.row.usage * 100).toFixed(0)"
                  :color="customColors"
                />
              </span>
          <span v-else>
                <el-progress
                  :text-inside="true"
                  :stroke-width="14"
                  :percentage="0"
                  :color="customColors"
                />
              </span>
        </template>
      </el-table-column>
      <el-table-column
        label="预估收益"
        align="center"
        prop="income"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.income }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结算收益"
        align="center"
        prop="settlePrice"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.settlePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="SLA扣费"
        align="center"
        prop="slaPrice"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.slaPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="SLA原因"
        align="center"
        prop="slaInfo"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.slaInfo }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { hostIncome } from '@/api/cmdb/rs-host'
import { listRsBusiness } from '@/api/cmdb/rc-business'

export default {
  name: 'Profit',
  props: {
    hostId: {
      type: Number
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      dateRange: [],
      incomeList: [],
      businessOptions: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        businessId: undefined,
        startTimeAt: undefined,
        hostId: this.hostId
      },
      customColors: [
        { color: '#5cb87a', percentage: 100 },
        { color: '#5cb87a', percentage: 90 },
        { color: '#5cb87a', percentage: 80 },
        { color: '#e6a23c', percentage: 60 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#f5222d', percentage: 20 }
      ]
    }
  },
  created() {
    listRsBusiness({ pageSize: -1 }).then(response => {
      this.businessOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      hostIncome(this.addDateRange(this.formatQueryParams(this.queryParams), this.dateRange)).then(response => {
        this.incomeList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
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
  }
}
</script>
<style scoped>
::v-deep .el-form-item {
  margin-bottom: 10px;
}

</style>
