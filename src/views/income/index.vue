
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
                  v-show="searchField.includes('income_month')">
            <el-form-item
                label="结算日期:"
                prop="incomeMonth"
            >
              <el-date-picker
                  v-model="queryParams.month"
                  type="month"
                  @change="handleMonthChange"
                  :style="{width: '100%'}"
                  placeholder="选择月">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col
            v-show="searchField.includes('hostSearch')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="主机名/SN:"
              prop="hostSearch"
            ><el-input
              v-model="queryParams.hostSearch"
              type="textarea"
              :rows="1"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('businessId')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
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
          </el-col>
          <el-col
            v-show="searchField.includes('idcId')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="所属机房:"
              prop="idcId"
            ><el-select
              v-model="queryParams.idcId"
              filterable
              placeholder="请选择"
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
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('region')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="所在区域:"
              prop="region"
            >
              <el-cascader
                v-model="queryParams.region"
                filterable
                size="small"
                :options="regionOptions"
                :props="regionProps"
                :style="{width: '100%'}"
                placeholder="请选择所在区域"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('customId')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="所属客户:"
              prop="customId"
            ><el-select
              v-model="queryParams.customId"
              placeholder="所属客户"
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
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('isp')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="运营商:"
              prop="isp"
            ><el-select
              v-model="queryParams.isp"
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
            </el-form-item>
          </el-col>

          <el-col
            style="position: relative;right: 0;bottom: 0px;float: right;top: 6px"
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
              <a-button
                type="link"
                style="padding-right: 0"
                @click="toggleAdvanced"
              >
                <template v-if="searchField.length > 3">
                  收起<a-icon type="up" />
                </template>
                <template v-else>
                  展开<a-icon type="down" />
                </template>
              </a-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template #wrapper>
      <el-col :span="1.5">
        <div style="display: flex;height: 32px;justify-items: center;align-items: center">
          <div class="count-item">
            <span class="label">当前计算月份:</span>
            <span
                class="num"
                style="color: #4CD964"
            >{{thisMonth}}</span>
            <span class="unit">&nbsp;月;</span>
          </div>
          <div class="count-item">
            <span class="label">当月计算天数:</span>
            <span
                class="num"
                style="color: #4CD964"
            >{{thisDay}}</span>
            <span class="unit">&nbsp;天;</span>
          </div>
        </div>
      </el-col>
      <div style="flex: 1">
        <el-table
          v-loading="loading"
          :height="'98%'"
          :data="rsHostIncomeList"
          @selection-change="handleSelectionChange"
        >

          <el-table-column
            label="主机名称"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <a style="color: #1890ff" @click="toHost(scope.row)">
                {{scope.row.remark}}
              </a>
            </template>
          </el-table-column>
          <el-table-column
            label="当月结算收益"
            align="center"
            prop="settlePrice"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.income_dat.income }}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="当月成本"
              align="center"
              prop="settlePrice"
              :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.income_dat.cost }}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="毛利润"
              align="center"
              prop="settlePrice"
              :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.income_dat.gross_profit }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            fixed="right"
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="detailClick(scope.row)"
                icon="el-icon-view"
              >查看明细
              </el-button>
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
    </template>
  </BasicLayout>
</template>

<script>
import {
  addRsHostIncome,
  delRsHostIncome,
  getRsHostIncome,
  listRsHostMonthIncome,
  updateRsHostIncome
} from '@/api/income'

import Detail from './detail.vue'
import { listRsBusiness } from '@/api/cmdb/rc-business'
import { listRsCustom } from '@/api/custom'
import { listRsIdc } from '@/api/cmdb/rc-idc'

export default {
  name: 'RsHostIncome',
  data() {
    return {
      thisMonth:"",
      thisDay:"",
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
      searchField: ['hostSearch','income_month',
        'businessId', 'idcId',
        'customId', 'isp',
        'region', 'startTimeAt'],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        incomeMonth:undefined,
        month:undefined,
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
    this.searchField = this.searchField.slice(0, 4)
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
    detailClick(row) {
      this.$router.push({ path: '/income/detail',
        query: { hostId: row.id,month: this.queryParams.incomeMonth }})

    },
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listRsHostMonthIncome(this.addDateRange(this.formatQueryParams(this.queryParams), this.dateRange)).then(response => {
        this.rsHostIncomeList = response.data.list.dat
        this.total = response.data.count
        this.loading = false
        this.thisMonth = response.data.list.month
        this.thisDay = response.data.list.day

        if (this.queryParams.incomeMonth === undefined){
          this.queryParams.incomeMonth = this.thisMonth
        }
      }
      )
    },
    toHost(row) {
      this.$router.push({ path: '/cmdb/rs-host', query: { hostId: row.id }})
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
    handleMonthChange(date) {
      if (date) {
        // 提取年份和月份
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 月份从 0 开始，需要加 1
        this.selectedMonth = `${year}-${month.toString().padStart(2, "0")}`;
        this.queryParams.incomeMonth = `${year}-${month.toString().padStart(2, "0")}`;
      } else {
        this.queryParams.incomeMonth = undefined; // 如果日期为空，清空选择的月份
      }
    },
    /** 展开收起 */
    toggleAdvanced() {
      const fields = ['hostSearch','income_month',
        'businessId', 'idcId',
        'customId', 'isp',
        'region', 'startTimeAt']
      if (this.searchField.length > 4) {
        this.searchField = fields.splice(0, 4)
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
<style scoped lang="scss">
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  font-size: 12px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.ant-tooltip-inner{
  width: max-content !important;
}

.ant-drawer-body{
  padding: 15px !important;
}
.count-item {
  margin-left: 5px;
}
.count-item .label {
  color: rgba(0, 0, 0, 0.45)
}
.count-item .num {
  font-size: 24px;
}
.count-item .unit {
  transform: translateY(2px);
}
.table-card {
  height: 100%;
}
.cu-table {
  ::v-deep .el-icon-copy-document{
    cursor:pointer;
    float: right;
    margin-top: 4px;
  }
}
.empty {
  color: #ff0000;
}

</style>
