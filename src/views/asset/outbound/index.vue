
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
            v-show="searchField.includes('code')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="出库单号:"
              prop="code"
            ><el-input
              v-model="queryParams.code"
              placeholder="请输入出库单号"
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
          <el-col
            v-show="searchField.includes('createBy')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="申请人:"
              prop="createBy"
            >
              <el-select
                filterable
                v-model="queryParams.createBy"
                placeholder="请选择"
              >
                <el-option
                  v-for="dict in createByOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('startTimeAt')">
            <el-form-item
              label="出库日期:"
              prop="startTimeAt"
            >
              <el-date-picker
                size="small"
                style="width: 100%"
                v-model="dateRange"
                value-format="yyyy-MM-dd hh:MM:ss"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
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
              label="出库状态:"
              prop="status"
            ><el-input
              v-model="queryParams.status"
              placeholder="请输入出库状态"
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
            v-permisaction="['admin:assetOutboundOrder:add']"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增
          </a-button>
        </el-col>
<!--        <el-col :span="1.5">-->
<!--          <a-button-->
<!--            v-permisaction="['admin:assetOutboundOrder:edit']"-->
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
            v-permisaction="['admin:assetOutboundOrder:remove']"
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
          :data="assetOutboundOrderList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            label="出库单号"
            align="center"
            prop="code"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="出库资产"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.asset.map(item=>item.name).join(',') }}
            </template>
          </el-table-column>
          <el-table-column
            label="出库数量"
            align="center"
            prop="assetId"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.asset.length }}
            </template>
          </el-table-column>
          <el-table-column
            label="客户名称"
            align="center"
            prop="customId"
          >
            <template slot-scope="scope">
              {{ selectDictLabel(customIdOptions, scope.row.customId) }}
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            label="出库状态"-->
<!--            align="center"-->
<!--            prop="status"-->
<!--            :show-overflow-tooltip="true"-->
<!--          />-->
          <el-table-column
            label="申请人"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.createUser }}
            </template>
          </el-table-column>
          <el-table-column
            label="申请时间"
            align="center"
            prop="createdAt"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.createdAt) }}
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
<!--              <el-button-->
<!--                slot="reference"-->
<!--                v-permisaction="['admin:assetOutboundOrder:edit']"-->
<!--                size="mini"-->
<!--                type="text"-->
<!--                icon="el-icon-edit"-->
<!--                @click="handleUpdate(scope.row)"-->
<!--              >修改-->
<!--              </el-button>-->
              <el-button
                slot="reference"
                v-permisaction="['admin:assetOutboundOrder:remove']"
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
      <!--      <a-modal :title="title" :visible="open" :centered="true" @ok="submitForm" @cancel="cancel" okText="确定" cancelText="取消" width="800px">-->
      <!--        <el-form ref="form" :model="form" :rules="rules" label-width="120px">-->
      <!--          <el-row>-->

      <!--            <el-col :span="12">-->
      <!--              <el-form-item label="备注" prop="desc">-->
      <!--                <el-input v-model="form.desc" placeholder="备注"-->
      <!--                />-->
      <!--              </el-form-item>-->
      <!--            </el-col>-->
      <!--            <el-col :span="12">-->
      <!--              <el-form-item label="出库单号" prop="code">-->
      <!--                <el-input v-model="form.code" placeholder="出库单号"-->
      <!--                />-->
      <!--              </el-form-item>-->
      <!--            </el-col>-->
      <!--            <el-col :span="12">-->
      <!--              <el-form-item label="客户名称" prop="customId">-->
      <!--                <el-select v-model="form.customId"-->
      <!--                           placeholder="请选择" >-->
      <!--                  <el-option-->
      <!--                    v-for="dict in customIdOptions"-->
      <!--                    :key="dict.value"-->
      <!--                    :label="dict.label"-->
      <!--                    :value="dict.value"-->
      <!--                  />-->
      <!--                </el-select>-->
      <!--              </el-form-item>-->
      <!--            </el-col>-->
      <!--            <el-col :span="12">-->
      <!--              <el-form-item label="联系电话" prop="phoneNumber">-->
      <!--                <el-input v-model="form.phoneNumber" placeholder="联系电话"-->
      <!--                />-->
      <!--              </el-form-item>-->
      <!--            </el-col>-->
      <!--            <el-col :span="12">-->
      <!--              <el-form-item label="所在地区" prop="region">-->
      <!--                <el-select v-model="form.region"-->
      <!--                           placeholder="请选择" >-->
      <!--                  <el-option-->
      <!--                    v-for="dict in regionOptions"-->
      <!--                    :key="dict.value"-->
      <!--                    :label="dict.label"-->
      <!--                    :value="dict.value"-->
      <!--                  />-->
      <!--                </el-select>-->
      <!--              </el-form-item>-->
      <!--            </el-col>-->
      <!--            <el-col :span="12">-->
      <!--              <el-form-item label="物流公司" prop="ems">-->
      <!--                <el-input v-model="form.ems" placeholder="物流公司"-->
      <!--                />-->
      <!--              </el-form-item>-->
      <!--            </el-col>-->
      <!--            <el-col :span="12">-->
      <!--              <el-form-item label="物流单号" prop="trackingNumber">-->
      <!--                <el-input v-model="form.trackingNumber" placeholder="物流单号"-->
      <!--                />-->
      <!--              </el-form-item>-->
      <!--            </el-col>-->
      <!--            <el-col :span="12">-->
      <!--              <el-form-item label="联系地址" prop="address">-->
      <!--                <el-input v-model="form.address" placeholder="联系地址"-->
      <!--                />-->
      <!--              </el-form-item>-->
      <!--            </el-col>-->
      <!--            <el-col :span="12">-->
      <!--              <el-form-item label="联系人" prop="user">-->
      <!--                <el-select v-model="form.user"-->
      <!--                           placeholder="请选择" >-->
      <!--                  <el-option-->
      <!--                    v-for="dict in userOptions"-->
      <!--                    :key="dict.value"-->
      <!--                    :label="dict.label"-->
      <!--                    :value="dict.value"-->
      <!--                  />-->
      <!--                </el-select>-->
      <!--              </el-form-item>-->
      <!--            </el-col>-->
      <!--            <el-col :span="12">-->
      <!--              <el-form-item label="存放位置" prop="idcId">-->
      <!--                <el-select v-model="form.idcId"-->
      <!--                           placeholder="请选择" >-->
      <!--                  <el-option-->
      <!--                    v-for="dict in idcIdOptions"-->
      <!--                    :key="dict.value"-->
      <!--                    :label="dict.label"-->
      <!--                    :value="dict.value"-->
      <!--                  />-->
      <!--                </el-select>-->
      <!--              </el-form-item>-->
      <!--            </el-col>-->
      <!--            <el-col :span="12">-->
      <!--              <el-form-item label="出库数量" prop="count">-->
      <!--                <el-input v-model="form.count" placeholder="出库数量"-->
      <!--                />-->
      <!--              </el-form-item>-->
      <!--            </el-col>-->
      <!--            <el-col :span="12">-->
      <!--              <el-form-item label="出库状态" prop="status">-->
      <!--                <el-input v-model="form.status" placeholder="出库状态"-->
      <!--                />-->
      <!--              </el-form-item>-->
      <!--            </el-col>-->
      <!--          </el-row>-->
      <!--        </el-form>-->
      <!--      </a-modal>-->
    </template>
  </BasicLayout>
</template>

<script>
import { addAssetOutboundOrder, delAssetOutboundOrder, getAssetOutboundOrder, listAssetOutboundOrder, updateAssetOutboundOrder } from '@/api/asset/outbound'

import Detail from './detail.vue'
import { listUser } from '@/api/admin/sys-user'
import { listRsCustom } from '@/api/custom'

export default {
  name: 'AssetOutboundOrder',
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
      createByOptions: [],
      assetOutboundOrderList: [],
      customIdOptions: [], regionOptions: [], userOptions: [], idcIdOptions: [],
      searchField: ['code', 'name', 'createBy', 'startTimeAt'],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        code: undefined,
        name: undefined,
        createBy: undefined,
        startTimeAt: undefined,
        status: undefined
      },
      // 表单参数
      form: {
      },
      rowId: undefined,
      // 表单校验
      rules: { code: [{ required: true, message: '出库单号不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '出库状态不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.searchField = this.searchField.slice(0, 3)
    this.getList()
    listUser({ pageSize: -1 }).then(response => {
      this.createByOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
    listRsCustom({ pageSize: -1 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    this.getDicts('sys_yes_no').then(response => {
      this.userOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listAssetOutboundOrder(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.assetOutboundOrderList = response.data.list
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
        code: undefined,
        customId: undefined,
        phoneNumber: undefined,
        region: undefined,
        ems: undefined,
        trackingNumber: undefined,
        address: undefined,
        user: undefined,
        idcId: undefined,
        count: undefined,
        status: undefined
      }
      this.resetForm('form')
    },
    convertFields(data, mode = 'toString') {
      const result = { ...data }
      const fieldsToConvert = ['customId', 'region', 'user', 'idcId']
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 展开收起 */
    toggleAdvanced() {
      const fields = ['code', 'name', 'createBy', 'startTimeAt']
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
      this.$router.push({ path: '/asset/outbound/form' })
      // this.reset()
      // this.open = true
      // this.title = '添加AssetOutboundOrder'
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
      getAssetOutboundOrder(id).then(response => {
        this.form = this.convertFields(response.data, 'toString')
        this.open = true
        this.title = '修改AssetOutboundOrder'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateAssetOutboundOrder(this.convertFields(this.form, 'toNumber')).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addAssetOutboundOrder(this.convertFields(this.form, 'toNumber')).then(response => {
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
        return delAssetOutboundOrder({ 'ids': Ids })
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
