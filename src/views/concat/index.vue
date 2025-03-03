
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('search')">
            <el-form-item
              label="姓名/电话/邮箱:"
              prop="search"
            ><el-input
              v-model="queryParams.search"
              placeholder="姓名/电话/邮箱"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('customId')">
            <el-form-item
              label="所属客户:"
              prop="customId"
            ><el-select
              v-model="queryParams.customId"
              placeholder="所属客户"
              clearable
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('buId')">
            <el-form-item
              label="商务人员:"
              prop="buId"
            ><el-select
              filterable
              v-model="queryParams.buId"
              placeholder="商务人员"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in buIdOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('region')">
            <el-form-item
              label="所在地区:"
              prop="region"
            >
              <el-cascader
                filterable
                v-model="queryParams.region"
                size="small"
                :options="regionOptions"
                :props="regionProps"
                :style="{width: '100%'}"
                placeholder="请选择所在区域"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-if="searchField.length % 4 == 0">
            <el-form-item label=" ">
              <el-input hidden/>
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
      <el-row
        :gutter="10"
        class="mb8"
      >
        <el-col :span="1.5">
          <a-button
            v-permisaction="['cmdb:rsCustomUser:add']"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <a-button
            v-permisaction="['cmdb:rsCustomUser:edit']"
            type="success"
            icon="edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
          >修改
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <a-button
            v-permisaction="['cmdb:rsCustomUser:remove']"
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
          :height="'98%'"
          v-loading="loading"
          :data="rsCustomUserList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          /><el-table-column
          label="姓名"
          width="90"
          align="center"
          prop="userName"
          :show-overflow-tooltip="true"
        />
          <el-table-column
            label="联系电话"
            width="160"
            align="center"
            prop="phone"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="所属客户"
            align="left"
            prop="customId"
            :formatter="customIdFormat"
          >
            <template slot-scope="scope">
              {{ selectDictLabel(customIdOptions, scope.row.customId) }}
            </template>
          </el-table-column>
          <el-table-column
            label="所在地区"
            align="left"
            :show-overflow-tooltip="true"
            prop="region"
            :formatter="regionFormat"
          >
            <template slot-scope="scope">
              {{ getNamesFromCodes(scope.row.region, regionOptions) }}
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            label="详细地址"-->
<!--            align="left"-->
<!--            prop="address"-->
<!--            :show-overflow-tooltip="true"-->
<!--          />-->
          <el-table-column
            label="商务人员"
            width="90"
            align="center"
            prop="buId"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ selectDictLabel(buIdOptions, scope.row.buId) }}
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
                icon="el-icon-view"
                @click="handleView(scope.row,scope.index)"
              >详情
              </el-button>
              <el-button
                slot="reference"
                v-permisaction="['cmdb:rsCustomUser:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                slot="reference"
                v-permisaction="['cmdb:rsCustomUser:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
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
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="姓名"
                prop="userName"
              >
                <el-input
                  v-model="form.userName"
                  placeholder="姓名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="所属客户"
                prop="customId"
              >
                <el-select
                  filterable
                  v-model="form.customId"
                  placeholder="请选择"
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
            <el-col :span="12">
              <el-form-item
                label="商务人员"
                prop="buId"
              >
                <el-select
                  filterable
                  v-model="form.buId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in buIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="联系电话"
                prop="phone"
              >
                <el-input
                  v-model="form.phone"
                  placeholder="联系电话"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="联系邮箱"
                prop="email"
              >
                <el-input
                  v-model="form.email"
                  placeholder="联系邮箱"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="所在地区"
                prop="region"
              >
                <el-cascader
                  filterable
                  v-model="form.region"
                  :options="regionOptions"
                  :props="regionProps"
                  :style="{width: '100%'}"
                  placeholder="请选择所在地区"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="部门"
                prop="dept"
              >
                <el-input
                  v-model="form.dept"
                  placeholder="部门"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="职务"
                prop="duties"
              >
                <el-input
                  v-model="form.duties"
                  placeholder="职务"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="详细地址"
                prop="address"
              >
                <el-input
                  v-model="form.address"
                  placeholder="详细地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="desc"
              >
                <el-input
                  v-model="form.desc"
                  placeholder="备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </a-modal>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addRsCustomUser,
  delRsCustomUser,
  getRsCustomUser,
  listRsCustomUser,
  updateRsCustomUser,
  listRsCustom
} from '@/api/custom/index'

import Detail from './detail.vue'
import { getUserlistByRole } from '@/api/admin/sys-role'

export default {
  name: 'RsCustomUser',
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
      rsCustomUserList: [],
      customIdOptions: [], regionOptions: [], buIdOptions: [],
      searchField: ['search', 'customId', 'buId', 'region'],
      // 关系表类型
      regionProps: {
        'multiple': false,
        'label': 'name',
        'value': 'code',
        'children': 'children'
      },
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        search: undefined,
        customId: undefined,
        buId: undefined,
        phone: undefined

      },
      // 表单参数
      form: {
      },
      rowId: undefined,
      // 表单校验
      rules: {
        userName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        customId: [{ required: true, message: '所属客户不能为空', trigger: 'blur' }],
        buId: [{ required: true, message: '商务人员不能为空', trigger: 'blur' }],
        region: [{ required: true, message: '所在地区不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.regionOptions = this.$store.getters.region
    this.searchField = this.searchField.slice(0, 3)
    this.getList()
    listRsCustom({ pageSize: -1 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    getUserlistByRole({ name: 'business_user' }).then(response => {
      this.buIdOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listRsCustomUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.rsCustomUserList = response.data.list
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
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        desc: undefined,
        userName: undefined,
        customId: undefined,
        buId: undefined,
        phone: undefined,
        email: undefined,
        region: undefined,
        dept: undefined,
        duties: undefined,
        address: undefined
      }
      this.resetForm('form')
    },
    convertFields(data, mode = 'toString') {
      const result = { ...data }
      const fieldsToConvert = ['customId', 'buId']
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
    customIdFormat(row) {
      return this.selectDictLabel(this.customIdOptions, row.customId)
    },
    regionFormat(row) {
      return this.selectDictLabel(this.regionOptions, row.region)
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 展开收起 */
    toggleAdvanced() {
      const fields = ['search', 'customId', 'buId', 'region']
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
      this.title = '添加联系人'
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
      getRsCustomUser(id).then(response => {
        this.form = this.convertFields(response.data, 'toString')
        this.form.region = response.data.region.split(',').map(e => Number(e))
        this.open = true
        this.title = '修改联系人'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const result = { ...this.convertFields(this.form, 'toNumber'), region: this.form.region.join(',') }
          if (this.form.id !== undefined) {
            updateRsCustomUser(result).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addRsCustomUser(result).then(response => {
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
      var msg = '是否确认删除'
      Ids.length > 1 ? (msg = '确定要删除所选联系人?') : (msg = '确定要删除该联系人吗?')
      this.$confirm(msg, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRsCustomUser({ 'ids': Ids })
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
