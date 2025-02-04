
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
            v-show="searchField.includes('id')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="资产编码:"
              prop="name"
            ><el-input
              v-model="queryParams.id"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('name')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="资产名称:"
              prop="name"
            ><el-input
              v-model="queryParams.name"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('categoryId')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="资产分类:"
              prop="categoryId"
            >
              <el-select
                v-model="queryParams.categoryId"
                placeholder="资产分类"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in categoryIdOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('sn')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="资产SN:"
              prop="sn"
            ><el-input
              v-model="queryParams.sn"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('storeRoomId')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="库房:"
              prop="storeRoomId"
            >
              <el-select
                v-model="queryParams.storeRoomId"
                placeholder="请选择"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in storeRoomIdOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('status')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('idcId')">
            <el-form-item
              label="机房名称:"
              prop="idcId"
            ><el-select
              v-model="queryParams.idcId"
              placeholder="请输入"
              clearable
              filterable
              size="small"
            >
              <el-option
                v-for="dict in idcIdOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增入库
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <a-button
            v-permisaction="['asset:additionsWarehousing:edit']"
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
            v-permisaction="['asset:additionsWarehousing:remove']"
            type="danger"
            icon="delete"
            :disabled="multiple"
            @click="handleDelete"
          >删除
          </a-button>
        </el-col>
        <el-col :span="19.5">
          <div style="height: 32px;line-height: 32px">
            <template v-for="tag in [{label: '全部', value:undefined}].concat(categoryIdOptions)">
              <a-checkable-tag
                style="font-size: 14px"
                :key="tag.value"
                :checked="queryParams.categoryId === tag.value"
                @change="checked => handleChange(tag, checked)"
              >
                {{ tag.label }}
              </a-checkable-tag>
            </template>
          </div>
        </el-col>
      </el-row>

      <div style="flex: 1">
        <el-table
          v-loading="loading"
          :height="'98%'"
          :data="additionsWarehousingList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            label="资产编码"
            align="center"
            prop="id"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="资产名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="资产分类"
            align="center"
            prop="categoryId"
            width="100"
          >
            <template slot-scope="scope">
              {{ selectDictLabel(categoryIdOptions, scope.row.categoryId) }}
            </template>
          </el-table-column>
          <el-table-column
            label="规格型号"
            align="center"
            prop="spec"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="品牌名称"
            align="center"
            prop="brand"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="资产SN"
            align="center"
            prop="sn"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="状态"
            align="center"
            prop="status"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.status == 2"
                type="info"
                size="small"
                effect="plain">
                {{ selectDictLabel(statusOptions, scope.row.status) }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.status == 3"
                type="success"
                size="small"
                effect="plain">
                {{ selectDictLabel(statusOptions, scope.row.status) }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.status == 4"
                type="danger"
                size="small"
                effect="plain"
              >
                {{ selectDictLabel(statusOptions, scope.row.status) }}
              </el-tag>
              <el-tag
                v-else
                size="small"
                effect="plain">
                {{ selectDictLabel(statusOptions, scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="资产组合"
            align="center"
            prop="combinationSn"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="所在位置"
            align="center"
            prop="storeRoomId"
            width="100"
          >
            <template slot-scope="scope">
              {{ selectDictLabel(storeRoomIdOptions, scope.row.storeRoomId) }}
            </template>
          </el-table-column>
          <el-table-column
            label="使用客户"
            align="center"
            prop="customId"
            width="100"
          >
            <template slot-scope="scope">
              {{ selectDictLabel(customIdOptions, scope.row.customId) }}
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            label="价格"-->
<!--            align="center"-->
<!--            prop="price"-->
<!--            :show-overflow-tooltip="true"-->
<!--          />-->
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
                v-permisaction="['asset:additionsWarehousing:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                slot="reference"
                v-permisaction="['asset:additionsWarehousing:remove']"
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
          <el-divider content-position="left">基本信息</el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="资产名称"
                prop="name"
              >
                <el-input
                  v-model="form.name"
                  placeholder="资产名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="规格型号"
                prop="spec"
              >
                <el-input
                  v-model="form.spec"
                  placeholder="规格型号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="品牌"
                prop="brand"
              >
                <el-input
                  v-model="form.brand"
                  placeholder="品牌"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="资产SN"
                prop="sn"
              >
                <el-input
                  v-model="form.sn"
                  placeholder="资产SN"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="计量单位"
                prop="unitId"
              >
                <el-select
                  v-model="form.unitId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in unitIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="资产分类"
                prop="categoryId"
              >
                <el-select
                  v-model="form.categoryId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in categoryIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="存放位置"
                prop="storeRoomId"
              >
                <el-select
                  v-model="form.storeRoomId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in storeRoomIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="备注"
                prop="desc"
              >
                <el-input
                  v-model="form.desc"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">购入信息</el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="采购人"
                prop="userId"
              >
                <el-select
                  v-model="form.userId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in userIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="价格"
                prop="price"
              >
                <el-input-number
                  v-model="form.price"
                  style="width: 100%"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="采购日期"
                prop="purchaseAt"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="form.purchaseAt"
                  type="datetime"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="供应商"
                prop="supplierId"
              >
                <el-select
                  v-model="form.supplierId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in supplierIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="维保到期日"
                prop="expireAt"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="form.expireAt"
                  type="datetime"
                  placeholder="选择日期"
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
  addAdditionsWarehousing,
  delAdditionsWarehousing,
  getAdditionsWarehousing,
  listAdditionsWarehousing,
  updateAdditionsWarehousing
} from '@/api/asset/property'

import Detail from './detail.vue'
import { listAssetWarehouse } from '@/api/asset/asset_warehouse'
import { listRsIdc } from '@/api/cmdb/rc-idc'
import { listRsCustom } from '@/api/custom'
import { getUserlistByRole } from '@/api/admin/sys-role'
import { listAssetSupplier } from '@/api/asset/supplier'

export default {
  name: 'AdditionsWarehousing',
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
      statusOptions: [],
      storeRoomIdOptions: [],
      idcIdOptions: [],
      customIdOptions: [],
      userIdOptions: [],
      additionsWarehousingList: [],
      categoryIdOptions: [], supplierIdOptions: [], unitIdOptions: [],
      searchField: ['id', 'name', 'sn', 'storeRoomId', 'status', 'idcId'],
      // 关系表类型
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        id: undefined,
        categoryId: undefined,
        sn: undefined,
        status: undefined,
        storeRoomId: undefined
      },
      // 表单参数
      form: {
      },
      rowId: undefined,
      // 表单校验
      rules: {
        name: [{ required: true, message: '资产名称不能为空', trigger: 'blur' }],
        spec: [{ required: true, message: '规格型号不能为空', trigger: 'blur' }],
        unitId: [{ required: true, message: '计量单位不能为空', trigger: 'blur' }],
        storeRoomId: [{ required: true, message: '所在位置不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.searchField = this.searchField.slice(0, 3)
    if (this.$route.query.combinationId) {
      this.queryParams.combinationId = this.$route.query.combinationId
    }
    if (this.$route.query.id) {
      this.queryParams.id = this.$route.query.id
    }
    this.getList()
    this.getDicts('asset_group_type').then(response => {
      this.categoryIdOptions = response.data
    })
    listAssetSupplier({ pageSize: -1 }).then(response => {
      this.supplierIdOptions = this.toDictData(response.data.list, 'supplierName', 'id')
    })
    this.getDicts('asset_unit_type').then(response => {
      this.unitIdOptions = response.data
    })
    this.getDicts('asset_status').then(response => {
      this.statusOptions = response.data
    })
    getUserlistByRole({ name: 'warehouse_user' }).then(response => {
      this.userIdOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
    listAssetWarehouse({ pageSize: -1 }).then(response => {
      this.storeRoomIdOptions = this.toDictData(response.data.list, 'warehouseName', 'id')
    })
    listRsIdc({ pageSize: -1 }).then(response => {
      this.idcIdOptions = response.data.list.map((item) => { return { label: item.number + item['name'], value: item['name'] + '' } })
    })
    listRsCustom({ pageSize: -1 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listAdditionsWarehousing(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.additionsWarehousingList = response.data.list
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
    handleChange(tag, checked) {
      this.queryParams.categoryId = tag.value
      this.handleQuery()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        purchaseAt: undefined,
        expireAt: undefined,
        categoryId: undefined,
        supplierId: undefined,
        wId: undefined,
        name: undefined,
        spec: undefined,
        brand: undefined,
        sn: undefined,
        unitId: undefined,
        price: undefined,
        userId: undefined,
        desc: undefined
      }
      this.resetForm('form')
    },
    convertFields(data, mode = 'toString') {
      const fieldsToConvert = ['categoryId', 'supplierId', 'unitId', 'userId', 'storeRoomId', 'price']
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
      const fields = ['id', 'name', 'sn', 'storeRoomId', 'status', 'idcId']
      if (this.searchField.length > 3) {
        this.searchField = fields.splice(0, 3)
      } else {
        this.searchField = fields
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      if (this.$route.query.combinationId) {
        this.$router.push({ path: '/asset/property/index' })
      }
      this.dateRange = []
      this.resetForm('queryForm')
      this.queryParams.combinationId = undefined
      this.queryParams.id = undefined
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ path: '/asset/additions/form' })
      // this.reset()
      // this.open = true
      // this.title = '添加AdditionsWarehousing'
      // this.isEdit = false
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
      getAdditionsWarehousing(id).then(response => {
        this.form = this.convertFields(response.data, 'toString')
        this.open = true
        this.title = '修改资产'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateAdditionsWarehousing(this.convertFields(this.form, 'toNumber')).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addAdditionsWarehousing(this.convertFields(this.form, 'toNumber')).then(response => {
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
        return delAdditionsWarehousing({ 'ids': Ids })
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
