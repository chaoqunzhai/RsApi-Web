
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
            v-show="searchField.includes('orderId')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="入库单号:"
              prop="assetInboundId"
            ><el-input
              v-model="queryParams.orderId"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('name')">
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="5" v-show="searchField.includes('storeRoomId')">
            <el-form-item
              label="存放位置:"
              prop="storeRoomId"
            ><el-select
              filterable
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="7" v-show="searchField.includes('startTimeAt')">
            <el-form-item
              label="入库日期:"
              prop="startTimeAt"
            >
              <el-date-picker
                style="width: 100%"
                size="small"
                v-model="dateRange"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
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
            v-permisaction="['asset:assetInboundMember:add']"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增
          </a-button>
        </el-col>
<!--        <el-col :span="1.5">-->
<!--          <a-button-->
<!--            v-permisaction="['asset:assetInboundMember:edit']"-->
<!--            type="success"-->
<!--            icon="edit"-->
<!--            size="mini"-->
<!--            :disabled="single"-->
<!--            @click="handleUpdate"-->
<!--          >修改-->
<!--          </a-button>-->
<!--        </el-col>-->
        <el-col :span="1.5">
          <a-button
            v-permisaction="['asset:assetInboundMember:remove']"
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
          :data="assetInboundMemberList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            label="入库单号"
            align="center"
            prop="orderId"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="入库资产"
            align="center"
            prop="assetInboundCode"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.asset.join(',') }}
            </template>
          </el-table-column>
          <el-table-column
            label="入库数量"
            align="center"
            prop="assetId"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.asset.length }}
            </template>
          </el-table-column>
          <el-table-column
            label="存放位置"
            align="center"
            prop="storeRoomId"
            width="100"
          >
            <template slot-scope="scope">
              {{ selectDictLabel(storeRoomIdOptions, scope.row.storeRoomId) }}
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            align="center"
            prop="desc"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="入库人员"
            align="center"
            prop="createUser"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="入库时间"
            align="center"
            prop="createdAt"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.createdAt }}
            </template>
          </el-table-column>
          <el-table-column
            width="140"
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
<!--              <el-button-->
<!--                slot="reference"-->
<!--                v-permisaction="['asset:assetInboundMember:edit']"-->
<!--                size="mini"-->
<!--                type="text"-->
<!--                icon="el-icon-edit"-->
<!--                @click="handleUpdate(scope.row)"-->
<!--              >修改-->
<!--              </el-button>-->
              <el-button
                slot="reference"
                v-permisaction="['asset:assetInboundMember:remove']"
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
        :dialog-style="{ right: '0px' }"
        :maskClosable="false"
        ok-text="确定"
        cancel-text="取消"
        width="70%"
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
                label="存放位置"
                prop="storeRoomId"
              >
                <el-select
                  filterable
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
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="desc"
              >
                <el-input
                  v-model="form.desc"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">资产信息</el-divider>
          <el-row>
            <el-table
              v-loading="loading"
              border
              :data="form.asset"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                width="180"
                align="center"
                prop="name"
                :show-overflow-tooltip="true"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>资产名称
                </template>
                <template slot-scope="scope">
                  <el-input
                    v-model="form.asset[scope.$index].name"
                    placeholder="请输入"
                  />
                </template>
              </el-table-column>
              <el-table-column
                width="180"
                align="center"
                prop="spec"
                :show-overflow-tooltip="true"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>规格型号
                </template>
                <template slot-scope="scope">
                  <el-input
                    v-model="form.asset[scope.$index].spec"
                    placeholder="请输入"
                  />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="supplierId"
                label="资产分类"
                width="180"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>资产分类
                </template>
                <template slot-scope="scope">
                  <el-select
                    v-model="form.asset[scope.$index].categoryId"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="dict in categoryIdOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                width="180"
                label="品牌"
                align="center"
                prop="brand"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="form.asset[scope.$index].brand"
                    placeholder="请输入"
                  />
                </template>
              </el-table-column>
              <el-table-column
                width="180"
                label="资产SN"
                align="center"
                prop="sn"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="form.asset[scope.$index].sn"
                    placeholder="请输入"
                  />
                </template>
              </el-table-column>
              <el-table-column
                width="180"
                align="center"
                prop="unitId"
                :show-overflow-tooltip="true"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>计量单位
                </template>
                <template slot-scope="scope">
                  <el-select
                    v-model="form.asset[scope.$index].unitId"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="dict in unitIdOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="价格"
                align="center"
                prop="price"
                width="180"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>价格(元)
                </template>
                <template slot-scope="scope">
                  <el-input-number
                    v-model="form.asset[scope.$index].price"
                    style="width: 100%"
                    placeholder="请输入"
                    :min="0"
                    :max="999999"
                  />
                </template>
              </el-table-column>
              <el-table-column
                width="180"
                label="采购人员"
                align="center"
                prop="userId"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="form.asset[scope.$index].userId"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="dict in userIdOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                width="180"
                label="采购日期"
                align="center"
                prop="spec"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="form.asset[scope.$index].purchaseAtFormat"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                  />
                </template>
              </el-table-column>
              <el-table-column
                width="180"
                label="维保到期日"
                align="center"
                prop="ExpireAtFormat"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="form.asset[scope.$index].ExpireAtFormat"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                  />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="supplierId"
                label="供应商"
                width="180"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="form.asset[scope.$index].supplierId"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="dict in supplierIdOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                width="180"
                align="center"
                prop="desc"
                label="备注"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="form.asset[scope.$index].desc"
                    placeholder="请输入"
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
import { addAssetInboundMember, delAssetInboundMember, getAssetInboundMember, listAssetInboundMember, updateAssetInboundMember } from '@/api/asset/additions'

import Detail from './detail.vue'
import { listAssetWarehouse } from '@/api/asset/asset_warehouse'
import { getUserlistByRole } from '@/api/admin/sys-role'
import { listAssetSupplier } from '@/api/asset/supplier'

export default {
  name: 'AssetInboundMember',
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
      unitIdOptions: [],
      categoryIdOptions: [],
      supplierIdOptions: [],
      userIdOptions: [],
      storeRoomIdOptions: [],
      assetInboundMemberList: [],

      searchField: ['orderId', 'name', 'storeRoomId', 'startTimeAt'],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        orderId: undefined,
        name: undefined,
        startTimeAt: undefined,
        storeRoomId: undefined
      },
      // 表单参数
      form: {
      },
      rowId: undefined,
      // 表单校验
      rules: {
        storeRoomId: [{ required: true, message: '存放位置不能为空', trigger: 'blur' }],
        list: [{ required: true, message: '资产信息不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.searchField = this.searchField.slice(0, 3)
    this.getList()
    listAssetWarehouse({ pageSize: -1 }).then(response => {
      this.storeRoomIdOptions = this.toDictData(response.data.list, 'warehouseName', 'id')
    })
    getUserlistByRole({ name: 'warehouse_user' }).then(response => {
      this.userIdOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
    listAssetSupplier({ pageSize: -1 }).then(response => {
      this.supplierIdOptions = this.toDictData(response.data.list, 'supplierName', 'id')
    })
    this.getDicts('asset_unit_type').then(response => {
      this.unitIdOptions = response.data
    })
    this.getDicts('asset_group_type').then(response => {
      this.categoryIdOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listAssetInboundMember(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.assetInboundMemberList = response.data.list
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
        storeRoomId: undefined,
        desc: undefined,
        asset: [
          {
            id: undefined,
            name: undefined,
            spec: undefined,
            unitId: undefined,
            brand: undefined,
            sn: undefined,
            price: undefined,
            userId: undefined,
            categoryId: undefined,
            supplierId: undefined,
            desc: undefined
          }
        ]
      }
      this.resetForm('form')
    },
    convertFields(data, mode = 'toString') {
      const fieldsToConvert = ['storeRoomId']
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
      const fields = ['orderId', 'name', 'storeRoomId', 'startTimeAt']
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
      this.$router.push({ path: '/asset/additions/form' })
      // this.reset()
      // this.open = true
      // this.title = '添加资产入库成员表'
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
      getAssetInboundMember(id).then(response => {
        this.form = this.convertFields(response.data, 'toString')
        this.open = true
        this.title = '修改入库单'
        this.isEdit = true
      })
    },
    copyRow(row) {
      row.id = undefined
      this.form.asset.push({ ...row })
    },
    deleteRow(index) {
      if (this.form.asset.length > 1) {
        this.form.asset.splice(index, 1)
      }
    },
    convertToNumbers(arr, fields) {
      return arr.map(item => {
        return Object.keys(item).reduce((acc, key) => {
          acc[key] = fields.includes(key) ? Number(item[key]) : item[key]
          return acc
        }, {})
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const needValid = ['name', 'spec', 'unitId', 'price', 'categoryId']
          this.form.asset.forEach((item) => {
            Object.keys(item).forEach(key => {
              if (needValid.includes(key) && item[key] === undefined) {
                this.msgError('请完善资产信息')
                throw new Error(`${key}不能为空`)
              }
            })
          })
          const result = {
            ...this.convertFields(this.form, 'toNumber'),
            asset: this.convertToNumbers(this.form.asset, ['unitId', 'price', 'userId', 'supplierId', 'categoryId'])
          }
          console.log(result)
          if (this.form.id !== undefined) {
            updateAssetInboundMember(result).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addAssetInboundMember(result).then(response => {
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
        return delAssetInboundMember({ 'ids': Ids })
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
