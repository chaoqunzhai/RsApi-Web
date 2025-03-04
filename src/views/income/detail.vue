
<template>
  <BasicLayout>
    <template #header>
      <el-form
        ref="queryForm"
        :model="queryParams"
        class="queryForm"
        style="transform: translateY(4px)"
      >
        <el-row
          :gutter="20"
          style="position: relative"
        >

          <el-col
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="结算日期:"
              prop="incomeMonth"
            >
              <el-date-picker
                v-model="queryParams.month"
                type="month"
                :style="{width: '60%'}"
                placeholder="选择月"
                @change="handleMonthChange"
              />
            </el-form-item>
          </el-col>
          <el-col
              style="position: absolute;right: 0;bottom: 0px"
              :sm="24"
              :xs="24"
              :md="12"
              :xl="6"
              :lg="6"
          >
            <el-form-item style="text-align: right">
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
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template #wrapper>

      <div style="flex: 1">
        <el-table
          v-loading="loading"
          :height="'98%'"
          :data="rsHostIncomeList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            label="结算日期"
            width="140"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.algDay }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="业务名称"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ selectDictLabel(businessOptions, scope.row.buId) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="主机名称"
            align="center"
            prop="hostName"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <a style="color: #1890ff" @click="toHost(scope.row)">
                {{ scope.row.host_row.remark }}
              </a>
            </template>
          </el-table-column>
          <el-table-column
            label="成本"
            align="center"
            prop="day_cost"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="计费95带宽(G)"
            align="center"
            width="140"
            prop="settleBandwidth"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.bandwidth95 }}</span>
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
            label="结算日期"
            align="center"
            prop="settleTime"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.settleTime }}</span>
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
      </div>
      <div style="height: 45px;padding-top: 5px">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
      <a-drawer
        v-if="detailVisible"
        placement="right"
        :header-style="{position: 'sticky', top: 0, zIndex: 999}"
        :closable="true"
        :width="'65%'"
        :visible="detailVisible"
        @close="detailVisible = false"
      >
        <template #title>
          详情
          <a-button
            type="link"
            @click="reLoadDetail"
          >
            <a-icon type="reload" />刷新
          </a-button>
        </template>
        <Detail
          :id="rowId"
          ref="Detail"
        />
      </a-drawer>

      <!-- 添加或修改对话框 -->
      <a-modal
        :title="title"
        :visible="open"
        :centered="true"
        ok-text="确定"
        cancel-text="取消"
        width="800px"
        @ok="submitForm"
        @cancel="cancel"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="120px"
        >
          <el-row />
        </el-form>
      </a-modal>
    </template>
  </BasicLayout>
</template>

<script>
import { addRsHostIncome, delRsHostIncome, getRsHostIncome, listRsHostIncome, updateRsHostIncome } from '@/api/income'

import Detail from './detail.vue'
import { listRsBusiness } from '@/api/cmdb/rc-business'
import { listRsCustom } from '@/api/custom'
import { listRsIdc } from '@/api/cmdb/rc-idc'

export default {
  name: 'RsHostIncome',
  components: {
    Detail
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      dateRange: [],
      // 是否显示弹出层
      open: false,
      detailVisible: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      rsHostIncomeList: [],
      ispOptions: [],
      businessOptions: [],
      idcIdOptions: [],
      customIdOptions: [],
      searchField: ['hostSearch', 'businessId', 'idcId', 'customId', 'isp', 'region', 'startTimeAt'],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        hostSearch: undefined,
        isp: undefined,
        idcId: undefined,
        region: undefined,
        businessId: undefined,
        customId: undefined
      },
      regionOptions: [],
      regionProps: {
        'multiple': true,
        'checkStrictly': true,
        'label': 'name',
        'value': 'code',
        'children': 'children'
      },
      incomeMonth: '',
      // 表单参数
      form: {
      },
      rowId: undefined,
      // 表单校验
      rules: { hostId: [{ required: true, message: '主机ID不能为空', trigger: 'blur' }],
        isp: [{ required: true, message: '运营商ID不能为空', trigger: 'blur' }],
        idcId: [{ required: true, message: 'IDC ID不能为空', trigger: 'blur' }],
        buId: [{ required: true, message: '业务名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.queryParams.hostId = this.$route.query.hostId
    this.queryParams.incomeMonth = this.$route.query.month
    // console.log("incomeMonth",this.queryParams)
    this.searchField = this.searchField.slice(0, 3)
    this.getList()
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
  },
  methods: {
    handleMonthChange(date) {
      if (date) {
        // 提取年份和月份
        const year = date.getFullYear()
        const month = date.getMonth() + 1 // 月份从 0 开始，需要加 1
        this.selectedMonth = `${year}-${month.toString().padStart(2, '0')}`
        this.queryParams.incomeMonth = `${year}-${month.toString().padStart(2, '0')}`
      } else {
        this.queryParams.incomeMonth = undefined // 如果日期为空，清空选择的月份
      }
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listRsHostIncome(this.addDateRange(this.formatQueryParams(this.queryParams), this.dateRange)).then(response => {
        this.rsHostIncomeList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
    toHost(row) {
      this.$router.push({ path: '/cmdb/rs-host', query: { hostId: row.hostId }})
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {

        id: undefined
      }
      this.resetForm('form')
    },
    convertFields(data, mode = 'toString') {
      const result = { ...data }
      const fieldsToConvert = ['isp']
      // 遍历字段并进行转换
      fieldsToConvert.forEach(field => {
        if (mode === 'toString' && typeof result[field] === 'number') {
          result[field] = result[field].toString() === '0' ? undefined : result[field].toString()
        } else if (mode === 'toNumber' && typeof result[field] === 'string' && !isNaN(result[field])) {
          result[field] = Number(result[field])
        }
      })
      return result
    },
    // 关系
    // 文件
    formatQueryParams() {
      const obj = { ...this.queryParams }
      Object.keys(obj).forEach(key => {
        if (obj[key] instanceof Array) {
          obj[key] = [...new Set(obj[key].flat())].join(',')
        }
      })
      return obj
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 展开收起 */
    toggleAdvanced() {
      const fields = ['hostSearch', 'businessId', 'idcId', 'customId', 'isp', 'region', 'startTimeAt']
      if (this.searchField.length > 3) {
        this.searchField = fields.splice(0, 3)
      } else {
        this.searchField = fields
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加RsHostIncome'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 详细按钮操作
    handleView(row) {
      this.rowId = row.id
      this.detailVisible = true
    },
    reLoadDetail() {
      this.$refs.Detail.getDataById()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id =
          row.id || this.ids
      getRsHostIncome(id).then(response => {
        this.form = this.convertFields(response.data, 'toString')
        this.open = true
        this.title = '修改RsHostIncome'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateRsHostIncome(this.convertFields(this.form, 'toNumber')).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addRsHostIncome(this.convertFields(this.form, 'toNumber')).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRsHostIncome({ 'ids': Ids })
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {
      })
    }
  }
}
</script>
