
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
            v-show="searchField.includes('supplierName')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="供应商名称:"
              prop="supplierName"
            ><el-input
              v-model="queryParams.supplierName"
              placeholder="请输入供应商名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
          </el-col>
          <el-col
            v-if="searchField.length % 4 == 0"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item label=" "><el-input hidden /></el-form-item>
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
              <a-button
                type="link"
                v-if="searchField.length >= 3"
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
        style="transform: translateY(-2px);height: 32px"
      >
        <el-col :span="1.5">
          <a-button
            v-permisaction="['admin:assetSupplier:add']"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <a-button
            v-permisaction="['admin:assetSupplier:remove']"
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
          :data="assetSupplierList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          /><el-table-column
            label="供应商名称"
            align="center"
            prop="supplierName"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="联系人"
            align="center"
            prop="contactPerson"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="联系电话"
            align="center"
            prop="phoneNumber"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="联系人邮箱"
            align="center"
            prop="email"
            :show-overflow-tooltip="true"
          />
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
                v-permisaction="['admin:assetSupplier:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                slot="reference"
                v-permisaction="['admin:assetSupplier:remove']"
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
                label="供应商名称"
                prop="supplierName"
              >
                <el-input
                  v-model="form.supplierName"
                  placeholder="供应商名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="联系人"
                prop="contactPerson"
              >
                <el-input
                  v-model="form.contactPerson"
                  placeholder="联系人"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="联系电话"
                prop="phoneNumber"
              >
                <el-input
                  maxlength="11"
                  v-model="form.phoneNumber"
                  placeholder="联系电话"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="联系人邮箱"
                prop="email"
              >
                <el-input
                  v-model="form.email"
                  placeholder="联系人邮箱"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="remark"
              >
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
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
import { addAssetSupplier, delAssetSupplier, getAssetSupplier, listAssetSupplier, updateAssetSupplier } from '@/api/asset/supplier'

import Detail from './detail.vue'

export default {
  name: 'AssetSupplier',
  components: {
    Detail
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      names: [],
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
      assetSupplierList: [],

      searchField: ['supplierName'],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        supplierName: undefined

      },
      // 表单参数
      form: {
      },
      rowId: undefined,
      // 表单校验
      rules: {
        supplierName: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }],
        contactPerson: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        phoneNumber: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '联系电话格式不正确', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.searchField = this.searchField.slice(0, 3)
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listAssetSupplier(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.assetSupplierList = response.data.list
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
        supplierName: undefined,
        contactPerson: undefined,
        phoneNumber: undefined,
        email: undefined,
        remark: undefined
      }
      this.resetForm('form')
    },
    convertFields(data, mode = 'toString') {
      const fieldsToConvert = []
      // 遍历字段并进行转换
      fieldsToConvert.forEach(field => {
        if (mode === 'toString' && typeof data[field] === 'number') {
          data[field] = data[field].toString()
        } else if (mode === 'toNumber' && typeof data[field] === 'string' && !isNaN(data[field])) {
          data[field] = Number(data[field])
        }
      })
      return data
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
      const fields = ['supplierName']
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
      this.title = '新增供应商'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.names = selection.map(item => item.supplierName)
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
      getAssetSupplier(id).then(response => {
        this.form = this.convertFields(response.data, 'toString')
        this.open = true
        this.title = '修改供应商'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateAssetSupplier(this.convertFields(this.form, 'toNumber')).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addAssetSupplier(this.convertFields(this.form, 'toNumber')).then(response => {
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
      var Names = (row.supplierName && [row.supplierName]) || this.names
      this.$confirm('是否确认供应商为"' + Names + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delAssetSupplier({ 'ids': Ids })
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
