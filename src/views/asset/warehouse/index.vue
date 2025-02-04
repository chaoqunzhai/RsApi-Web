
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('warehouseName')">
            <el-form-item
              label="库房名称:"
              prop="warehouseName"
            ><el-input
              v-model="queryParams.warehouseName"
              placeholder="请输入库房名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('administratorId')">
            <el-form-item
              label="管理员:"
              prop="administratorId"
            ><el-select
              v-model="queryParams.administratorId"
              placeholder="管理员"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in administratorIdOptions"
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
            v-permisaction="['asset:assetWarehouse:add']"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <a-button
            v-permisaction="['asset:assetWarehouse:remove']"
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
          :data="assetWarehouseList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          /><el-table-column
          label="库房名称"
          align="center"
          prop="warehouseName"
          :show-overflow-tooltip="true"
        /><el-table-column
          label="管理员"
          align="center"
          prop="administratorId"
          :formatter="administratorIdFormat"
          width="100"
        >
          <template slot-scope="scope">
            {{ administratorIdFormat(scope.row) }}
          </template>
        </el-table-column>
          <el-table-column
            label="备注"
            align="center"
            prop="remark"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="创建人"
            align="center"
            prop="createUser"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="最后更新时间"
            align="center"
            prop="updatedAt"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.updatedAt) }}
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
                v-permisaction="['asset:assetWarehouse:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                @click="handleDelete(scope.row)"
                slot="reference"
                v-permisaction="['asset:assetWarehouse:remove']"
                size="mini"
                type="text"
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

            <el-col :span="24">
              <el-form-item
                label="库房名称"
                prop="warehouseName"
              >
                <el-input
                  v-model="form.warehouseName"
                  placeholder="库房名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="管理员"
                prop="administratorId"
              >
                <el-select
                  v-model="form.administratorId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in administratorIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="remark"
              >
                <el-input
                  type="textarea"
                  v-model="form.remark"
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
import { addAssetWarehouse, delAssetWarehouse, getAssetWarehouse, listAssetWarehouse, updateAssetWarehouse } from '@/api/asset/asset_warehouse'
import Detail from './detail.vue'
import { getUserlistByRole } from '@/api/admin/sys-role'

export default {
  name: 'AssetWarehouse',
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
      // 是否显示弹出层
      open: false,
      detailVisible: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      assetWarehouseList: [],
      administratorIdOptions: [],
      searchField: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        warehouseName: undefined,
        administratorId: undefined

      },
      // 表单参数
      form: {
      },
      rowId: undefined,
      // 表单校验
      rules: { warehouseName: [{ required: true, message: '库房名称不能为空', trigger: 'blur' }],
        administratorId: [{ required: true, message: '管理员不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.searchField = Object.keys(this.queryParams).slice(2).slice(0, 3)
    this.getList()
    getUserlistByRole({ name: 'warehouse_user' }).then(response => {
      this.administratorIdOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listAssetWarehouse(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.assetWarehouseList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
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
        warehouseName: undefined,
        administratorId: undefined,
        remark: undefined
      }
      this.resetForm('form')
    },
    convertFields(data, mode = 'toString') {
      const fieldsToConvert = ['administratorId']
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
    administratorIdFormat(row) {
      return this.selectDictLabel(this.administratorIdOptions, row.administratorId)
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
      if (this.searchField.length > 3) {
        this.searchField = this.searchField.splice(0, 3)
      } else {
        this.searchField = Object.keys(this.queryParams).slice(2)
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
      this.title = '添加库房'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.names = selection.map(item => item.warehouseName)
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
      getAssetWarehouse(id).then(response => {
        this.form = this.convertFields(response.data, 'toString')
        this.open = true
        this.title = '修改库房'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateAssetWarehouse(this.convertFields(this.form, 'toNumber')).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addAssetWarehouse(this.convertFields(this.form, 'toNumber')).then(response => {
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
      var Names = (row.warehouseName && [row.warehouseName]) || this.names

      this.$confirm('是否确认删除库房名称为"' + Names + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delAssetWarehouse({ 'ids': Ids })
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
