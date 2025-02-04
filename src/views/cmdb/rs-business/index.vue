
<template>
  <BasicLayout>
    <template #header>
      <el-form
        :model="queryParams"
        class="queryForm"
        ref="queryForm"
        style="transform: translateY(4px)"
      >
        <el-row :gutter="20" style="position: relative">
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6">
            <el-form-item
              label="业务名称:"
              prop="name"
            ><el-input
              v-model="queryParams.name"
              placeholder="请输入业务名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6">
            <el-form-item
              label="状态:"
              prop="status"
            ><el-select
              v-model="queryParams.status"
              placeholder="状态"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col style="position: absolute;right: 0;bottom: 0px" :sm="24" :xs="24" :md="12" :xl="6" :lg="6" >
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
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <a-button
            v-permisaction="['admin:rsBusiness:add']"
            type="primary"
            icon="plus"
            @click="handleAdd({})"
          >新增
          </a-button>
        </el-col>
        <!--          <el-col :span="1.5">-->
        <!--            <a-button-->
        <!--              v-permisaction="['admin:rsBusiness:edit']"-->
        <!--              type="success"-->
        <!--              icon="edit"-->
        <!--              size="mini"-->
        <!--              :disabled="single"-->
        <!--              @click="handleUpdate"-->
        <!--            >修改-->
        <!--            </a-button>-->
        <!--          </el-col>-->
        <el-col :span="1.5">
          <a-button
            v-permisaction="['admin:rsBusiness:remove']"
            type="danger"
            icon="delete"
            :disabled="multiple"
            @click="handleDelete"
          >删除
          </a-button>
        </el-col>
      </el-row>
      <div style="flex: 1">
        <el-table
          v-loading="loading"
          :height="'98%'"
          default-expand-all
          :tree-props="{children: 'children'}"
          :data="rsBusinessList"
          row-key="id"
        >
          <el-table-column
            label="业务名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <a-button type="link" @click="toHost(scope.row)">
                {{ scope.row.name }}
              </a-button>
            </template>
          </el-table-column>
          <el-table-column
            label="英文名称"
            align="center"
            prop="enName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="状态"
            align="center"
            prop="status"
            :formatter="statusFormat"
            width="100"
          >
            <template slot-scope="scope">
              <a-tag color="green" v-if="scope.row.status === 2">
                {{ statusFormat(scope.row) }}
              </a-tag>
              <a-tag color="red" v-if="scope.row.status === 1">
                {{ statusFormat(scope.row) }}
              </a-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            align="center"
            prop="desc"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            width="200"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleView(scope.row,scope.index)"
              >详情
              </el-button>
              <el-button
                slot="reference"
                v-permisaction="['admin:rsBusiness:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                :disabled="scope.row.parentId != 0"
                v-permisaction="['admin:rsBusiness:edit']"
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="handleAdd(scope.row)"
              >新增
              </el-button>
              <el-button
                slot="reference"
                v-permisaction="['admin:rsBusiness:remove']"
                size="mini"
                type="text"
                @click="handleDelete(scope.row)"
                icon="el-icon-delete"
              >删除
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
      <a-drawer
        v-if="detailVisible"
        placement="right"
        :headerStyle="{position: 'sticky', top: 0, zIndex: 999}"
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
          label-width="100px"
        >
          <el-divider content-position="left">基本信息</el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="父级业务"
                prop="parentId"
              >
                <el-select
                  filterable
                  v-model="form.parentId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in parentIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="业务名称"
                prop="name"
              >
                <el-input
                  v-model="form.name"
                  placeholder="业务名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="英文名称"
                prop="enName"
              >
                <el-input
                  v-model="form.enName"
                  placeholder="英文名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="计费方式"
                prop="billingMethod"
              >
                <el-select
                  filterable
                  v-model="form.billingMethod"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in billingMethodOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="startUsage"
                label="利用率区间"
              >
                <div style="display: flex">
                  <el-form-item prop="startUsage">
                    <el-time-select
                      style="width: 130px"
                      placeholder="开始时间"
                      :picker-options="{
                      start: '00:00',
                      end: '24:00',
                      step: '00:15',
                    }"
                      v-model="form.startUsage">
                    </el-time-select>
                  </el-form-item>
                  <span style="margin: 0 6px">-</span>
                  <el-form-item prop="endUsage">
                    <el-time-select
                      style="width: 130px"
                      placeholder="结束时间"
                      :picker-options="{
                      start: '00:00',
                      end: '24:00',
                      step: '00:15',
                      minTime: form.startUsage
                    }"
                      v-model="form.endUsage">
                    </el-time-select>
                  </el-form-item>
                </div>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="状态"
                prop="status"
              >
                <el-radio-group v-model="form.status">
                  <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.value"
                    :label="dict.value"
                  >{{ dict.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="desc"
              >
                <el-input
                  v-model="form.desc"
                  type="textarea"
                  placeholder="备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">费用信息</el-divider>
          <el-row>
            <el-table
              border
              :data="form.costCnf"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                width="120"
                align="center"
                prop="isp"
                :show-overflow-tooltip="true"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>运营商
                </template>
                <template slot-scope="scope">
                  <el-select
                    v-model="form.costCnf[scope.$index].isp"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="dict in ispOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="ipType"
                width="120"
              >
                <template slot="header">IP 类型</template>
                <template slot-scope="scope">
                  <el-select
                    v-model="form.costCnf[scope.$index].ipType"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="dict in ipTypeOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="dialType"
                width="140"
              >
                <template slot="header">拨号类型</template>
                <template slot-scope="scope">
                  <el-select
                    v-model="form.costCnf[scope.$index].dialType"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="dict in dialTypeOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="单价(元/G/月)"
                align="center"
                prop="price"
                width="180"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>单价(元/G/月)
                </template>
                <template slot-scope="scope">
                  <el-input-number
                    v-model="form.costCnf[scope.$index].price"
                    style="width: 100%"
                    placeholder="请输入"
                    :min="0"
                    :max="999999"
                  />
                </template>
              </el-table-column>
              <el-table-column
                width="180"
                fixed="right"
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-copy-document"
                    @click="copyRow(scope.row)"
                  >复制
                  </el-button>
                  <el-button
                    slot="reference"
                    v-permisaction="['admin:rsCustom:remove']"
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="deleteRow(scope.$index)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-form>
      </a-modal>
    </template>
  </BasicLayout>
</template>

<script>
import { addRsBusiness, delRsBusiness, getRsBusiness, listRsBusiness, updateRsBusiness } from '@/api/cmdb/rc-business'
import Detail from './detail.vue'

export default {
  name: 'RsBusiness',
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
      // 是否显示弹出层
      open: false,
      detailVisible: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      rsBusinessList: [],
      statusOptions: [],
      ipTypeOptions: [],
      ispOptions: [],
      dialTypeOptions: [],
      billingMethodOptions: [],
      parentIdOptions: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        status: undefined,
        name: undefined

      },
      // 表单参数
      form: {
      },
      rowId: undefined,
      // 表单校验
      rules: { status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '业务名称不能为空', trigger: 'blur' }],
        billingMethod: [{ required: true, message: '计费方式不能为空', trigger: 'blur' }],
        startUsage: [{ required: true, message: '利用率开始时间不能为空', trigger: 'blur' }],
        endUsage: [{ required: true, message: '利用率结束时间不能为空', trigger: 'blur' }],
        enName: [{ required: true, message: '英文名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('isp').then(response => {
      this.ispOptions = response.data
    })
    this.getDicts('ip_type').then(response => {
      this.ipTypeOptions = response.data
    })
    this.getDicts('dial_type').then(response => {
      this.dialTypeOptions = response.data
    })
    this.getDicts('billing_method').then(response => {
      this.billingMethodOptions = response.data
    })
    listRsBusiness({ pageSize: 100 }).then(response => {
      this.parentIdOptions = this.toDictData(response.data.list, 'name', 'id')
      this.parentIdOptions.unshift({ label: '无父级业务', value: '0' })
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listRsBusiness({ ...this.queryParams, treeTag: 1 }).then(response => {
        this.rsBusinessList = response.data.list
        this.rsBusinessList.forEach((item) => {
          delete item.hasChildren
          if (item.children) {
            item.children.forEach((child) => {
              delete child.hasChildren
            })
          }
        })
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    reLoadDetail() {
      this.$refs.Detail.getDataById()
    },
    toHost(row) {
      this.$router.push({ path: '/cmdb/rs-host', query: { businessId: row.id }})
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        layer: undefined,
        status: undefined,
        desc: undefined,
        name: undefined,
        enName: undefined,
        startUsage: undefined,
        endUsage: undefined,
        parentId: 0,
        costCnf: [
          {
            id: undefined,
            isp: undefined,
            bandwidthLower: undefined,
            bandwidthLimit: undefined,
            price: undefined,
            minimum: undefined,
            ipType: undefined,
            dialType: undefined
          }
        ]
      }
      this.resetForm('form')
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 关系
    // 文件
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
    /** 新增按钮操作 */
    handleAdd(e) {
      this.reset()
      this.form.parentId = String(e.id || 0)
      this.form.status = '2'
      this.open = true
      this.title = '添加业务'
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id =
        row.id || this.ids
      getRsBusiness(id).then(response => {
        this.form = this.convertFields(response.data, 'toString')
        this.form.costCnf = this.convertToString(this.form.costCnf)
        if (!this.form.costCnf.length) {
          this.form.costCnf.push({
            id: undefined,
            isp: undefined,
            bandwidthLower: undefined,
            bandwidthLimit: undefined,
            price: undefined,
            minimum: undefined,
            ipType: undefined,
            dialType: undefined
          })
        }
        this.open = true
        this.title = '业务修改'
        this.isEdit = true
      })
    },
    convertFields(data, mode = 'toString') {
      const result = { ...data }
      const fieldsToConvert = ['status', 'parentId', 'billingMethod']
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
    convertToNumbers(arr) {
      return arr.map(item => {
        return Object.keys(item).reduce((acc, key) => {
          acc[key] = Number(item[key])
          return acc
        }, {})
      })
    },
    convertToString(arr) {
      return arr.map(item => {
        return Object.keys(item).reduce((acc, key) => {
          acc[key] = item[key].toString()
          return acc
        }, {})
      })
    },
    copyRow(row) {
      row.id = undefined
      this.form.costCnf.push({ ...row })
    },
    deleteRow(index) {
      if (this.form.costCnf.length > 1) {
        this.form.costCnf.splice(index, 1)
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const needValid = ['isp', 'price']
          this.form.costCnf.forEach((item) => {
            Object.keys(item).forEach(key => {
              if (needValid.includes(key) && item[key] === undefined) {
                this.msgError('请完善费用信息')
                throw new Error(`${key}不能为空`)
              }
            })
          })
          const result = {
            ...this.convertFields(this.form, 'toNumber'),
            costCnf: this.convertToNumbers(this.form.costCnf)
          }
          if (this.form.id !== undefined) {
            updateRsBusiness(result).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addRsBusiness(result).then(response => {
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
      this.$confirm('确定要删除该业务吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRsBusiness({ 'ids': Ids })
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
