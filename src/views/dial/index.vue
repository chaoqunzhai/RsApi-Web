
<template>
  <BasicLayout>
    <template #header>
      <el-form
        ref="queryForm"
        class="queryForm"
        style="transform: translateY(4px)"
        :model="queryParams"
      >
        <el-row :gutter="20" style="position: relative">
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('search')">
            <el-form-item
              label="主机名称"
              prop="hostId"
            ><el-input
              v-model="queryParams.search"
              placeholder="主机名称/主机SN"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('status')">
            <el-form-item
              label="拨号状态"
              prop="status"
            ><el-select
              v-model="queryParams.status"
              placeholder="拨号状态"
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('networkingStatus')">
            <el-form-item
              label="联网状态"
              prop="networkingStatus"
            ><el-select
              v-model="queryParams.networkingStatus"
              placeholder="联网状态"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in networkingStatusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('customId')">
            <el-form-item
              label="所属客户"
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('idcId')">
            <el-form-item
              label="机房名称"
              prop="idcId"
            ><el-select
              v-model="queryParams.idcId"
              placeholder="机房名称"
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('ispId')">
            <el-form-item
              label="运营商"
              prop="ispId"
            ><el-select
              v-model="queryParams.ispId"
              placeholder="运营商"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in ispIdOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('account')">
            <el-form-item
              label="账号"
              prop="account"
            ><el-input
              v-model="queryParams.account"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
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
        <el-col :span="1.5" v-if="showAdd">
          <a-button
            v-permisaction="['admin:rsDial:add']"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增
          </a-button>
        </el-col>
        <el-col :span="1.5" v-else>
          <a-button
            v-permisaction="['admin:rsDial:add']"
            type="primary"
            icon="api"
            @click="handleRelation"
          >关联拨号
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <a-button
            v-permisaction="['admin:rsDial:edit']"
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
            v-permisaction="['admin:rsDial:remove']"
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
          :data="rsDialList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
          label="客户名称"
          v-if="tableFields.includes('customId')"
          align="center"
          prop="customId"
          :formatter="customIdFormat"
        >
          <template slot-scope="scope">
            {{ customIdFormat(scope.row) }}
          </template>
        </el-table-column>
<!--          <el-table-column-->
<!--            label="关联合同"-->
<!--            v-if="tableFields.includes('contractId')"-->
<!--            align="center"-->
<!--            prop="contractId"-->
<!--            :formatter="contractIdFormat"-->
<!--            width="100"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              {{ contractIdFormat(scope.row) }}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            label="机房名称"
            v-if="tableFields.includes('idcId')"
            align="center"
            prop="idcId"
            width="200"
            :show-overflow-tooltip="true"
            :formatter="idcIdFormat"
          >
            <template slot-scope="scope">
              {{ scope.row.idcInfo && scope.row.idcInfo.name }}
            </template>
          </el-table-column>
          <el-table-column
            label="运营商"
            v-if="tableFields.includes('ispId')"
            align="center"
            prop="ispId"
            :formatter="ispIdFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ ispIdFormat(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            label="拨号状态"
            align="center"
            prop="status"
            :formatter="statusFormat"
            width="100"
          >
            <template slot-scope="scope">

              <a-tag :color="tagMap[scope.row.status.toString()]">{{ statusFormat(scope.row)}} </a-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="联网状态"
            align="center"
            prop="networkingStatus"
            :formatter="networkingStatusFormat"
            width="100"
          >
            <template slot-scope="scope">
              <a-tag :color="tagMap[scope.row.networkingStatus.toString()]">{{ networkingStatusFormat(scope.row)}} </a-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="主机信息"
            align="left"
            width="330"
          >
            <template slot-scope="scope">
              <a-tooltip placement="topLeft">
                <template slot="title">
                  <div v-if="scope.row.ip">ip：{{ scope.row.ip }}</div>
                  <div v-if="scope.row.ipV6">ipV6：{{ scope.row.ipV6 }}</div>
                  <div v-if="scope.row.mac">mac：{{ scope.row.mac }}</div>
                </template>
                <div class="el-table-custom-row">主机名称:
                  <span>{{ scope.row.hostInfo && scope.row.hostInfo.hostname }}</span>
                </div>
                <div class="el-table-custom-row">SN:
                  <span>{{ scope.row.hostInfo && scope.row.hostInfo.sn }}</span>
                </div>
              </a-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="网卡信息"
            align="left"
            width="300"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <a-tooltip placement="topLeft">
                <div class="el-table-custom-row">物理网卡:
                  <span>{{ scope.row.deviceName }}</span>
                </div>
                <div class="el-table-custom-row">虚拟网卡:
                  <span>{{ scope.row.dialName  }}</span>
                </div>
              </a-tooltip>
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            v-if="tableFields.includes('broadbandType')"-->
<!--            label="带宽类型"-->
<!--            align="center"-->
<!--            prop="broadbandType"-->
<!--            :formatter="broadbandTypeFormat"-->
<!--            width="100"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              {{ broadbandTypeFormat(scope.row) }}-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="账号"-->
<!--            align="center"-->
<!--            width="150"-->
<!--            prop="account"-->
<!--            :show-overflow-tooltip="true"-->
<!--          />-->
<!--          <el-table-column-->
<!--            label="密码"-->
<!--            align="center"-->
<!--            prop="pass"-->
<!--            :show-overflow-tooltip="true"-->
<!--          />-->
<!--          <el-table-column-->
<!--            label="是否管理线"-->
<!--            align="center"-->
<!--            prop="isManager"-->
<!--            :formatter="isManagerFormat"-->
<!--            width="100"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              <a-tag :color="scope.row.isManager ? 'cyan':''"> {{ isManagerFormat(scope.row) }} </a-tag>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="启用日期"-->
<!--            width="200"-->
<!--            align="center"-->
<!--            prop="runTimeAt"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              <span>{{ parseTime(scope.row.runTimeAt) }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="最后更新时间"-->
<!--            align="center"-->
<!--            width="180"-->
<!--            prop="updatedAt"-->
<!--            :show-overflow-tooltip="true"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              {{ parseTime(scope.row.updatedAt) }}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            width="240"
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
                v-permisaction="['admin:rsDial:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-copy-document"
                @click="copyRow(scope.row)"
              >复制
              </el-button>
              <el-button
                slot="reference"
                v-permisaction="['admin:rsDial:remove']"
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
                label="客户名称"
                prop="customId"
              >
                <el-select
                  v-model="form.customId"
                  filterable
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
                label="关联合同"
                prop="contractId"
              >
                <el-select
                  filterable
                  v-model="form.contractId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in contractIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="机房名称"
                prop="idcId"
              >
                <el-select
                  filterable
                  :disabled="idcId"
                  v-model="form.idcId"
                  placeholder="请选择"
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
            <el-col :span="12">
              <el-form-item
                label="运营商"
                prop="ispId"
              >
                <el-select
                  v-model="form.ispId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in ispIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="带宽类型"
                prop="broadbandType"
              >
                <el-select
                  v-model="form.broadbandType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in broadbandTypeOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="启用日期"
                prop="runTimeAt"
              >
                <el-date-picker
                  style="width: 100%"
                  value-format="yyyy-MM-dd hh:MM:ss"
                  v-model="form.runTimeAt"
                  type="datetime"
                  placeholder="选择日期"
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
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">账户信息</el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="账号"
                prop="account"
              >
                <el-input
                  v-model="form.account"
                  placeholder="账号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="密码"
                prop="pass"
              >
                <el-input
                  v-model="form.pass"
                  placeholder="密码"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="是否管理线"
                prop="isManager"
              >
                <el-select
                  v-model="form.isManager"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in isManagerOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </a-modal>
      <!-- 关联拨号对话框 -->
      <a-modal
        title="关联拨号"
        :visible="openRelation"
        width="370px"
        @cancel="openRelation = false"
      >
        <el-form
          ref="relationForm"
          :model="relationForm"
          :rules="relationRules"
          label-width="80px"
        >
          <el-form-item
            label="物理网卡"
            prop="driverId"
          ><el-select
            v-model="relationForm.driverId"
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in driverIdOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
          </el-form-item>
          <el-form-item
            label="账号"
            prop="dialId"
          >
            <el-select
              filterable
              v-model="relationForm.dialId"
              placeholder="请选择"
            >
              <el-option-group
                v-for="group in dialIdOptions"
                :key="group.label"
                :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-option-group>
              <!--                <el-option-->
              <!--                  v-for="dict in dialIdOptions"-->
              <!--                  :key="dict.value"-->
              <!--                  :label="dict.label"-->
              <!--                  :value="dict.value"-->
              <!--                />-->
            </el-select>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="submitRelation"
          >确 定</el-button>
          <el-button @click="openRelation = false">取 消</el-button>
        </div>
      </a-modal>
    </template>
  </BasicLayout>
</template>

<script>
import { addRsDial, delRsDial, getDriver, getRsDial, hostBindDial, listRsDial, updateRsDial } from '@/api/cmdb/rs-dial'
import Detail from '@/views/dial/detail.vue'
import { listRsCustom } from '@/api/custom'
import { listRsIdc } from '@/api/cmdb/rc-idc'
import { listRsContract } from '@/api/contract'

export default {
  name: 'RsDial',
  components: {
    Detail
  },
  props: {
    searchField: {
      type: Array,
      default: ['search', 'customId', 'networkingStatus', 'idcId', 'ispId', 'status']
    },
    tableFields: {
      type: Array,
      default: ['customId', 'contractId', 'idcId', 'ispId', 'hostId', 'broadbandType']
    },
    showAdd: {
      type: Boolean,
      default: true
    },
    idcId: {
      type: Number,
      default: undefined
    },
    hostId: {
      type: Number,
      default: undefined
    }
  },
  watch: {
    idcId(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.queryParams.idcId = newValue
        this.getList()
      }
    },
    hostId(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.queryParams.hostId = newValue
        this.getList()
        // this.getDriverList(newValue)
      }
    }
  },
  data() {
    return {
      tagMap:{
        "0":"",
        "1":"blue",
        "-1":"red",
      },
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
      openRelation: false,
      detailVisible: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      rsDialList: [],
      driverIdOptions: [],
      dialIdOptions: [],
      customIdOptions: [], contractIdOptions: [], broadbandTypeOptions: [], isManagerOptions: [], networkingStatusOptions: [], statusOptions: [], ispIdOptions: [], idcIdOptions: [],
      // 关系表类型
      relationForm: {},
      relationRules: {
        driverId: [{ required: true, message: '物理网卡不能为空', trigger: 'blur' }],
        dialId: [{ required: true, message: '账号不能为空', trigger: 'blur' }]
      },
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        account: undefined,
        customId: undefined,
        networkingStatus: undefined,
        status: undefined,
        ispId: undefined,
        idcId: this.idcId || undefined,
        hostId: this.hostId || undefined,
        search: undefined
      },
      // 表单参数
      form: {
      },
      rowId: undefined,
      // 表单校验
      rules: { customId: [{ required: false, message: '客户名称不能为空', trigger: 'blur' }],
        networkingStatus: [{ required: true, message: '联网状态不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '拨号状态不能为空', trigger: 'blur' }],
        ispId: [{ required: true, message: '运营商不能为空', trigger: 'blur' }],
        idcId: [{ required: true, message: '机房名称不能为空', trigger: 'blur' }],
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        pass: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.searchField = ['search', 'customId', 'networkingStatus']
    this.getList()
    this.getDicts('broadband_type').then(response => {
      this.broadbandTypeOptions = response.data
    })
    this.getDicts('sys_yes_no').then(response => {
      this.isManagerOptions = response.data
    })
    this.getDicts('networking_status').then(response => {
      this.networkingStatusOptions = response.data
    })
    this.getDicts('dial_status').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('isp').then(response => {
      this.ispIdOptions = response.data
    })
    listRsCustom({ pageSize: -1 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    listRsIdc({ pageSize: -1 }).then(response => {
      this.idcIdOptions = response.data.list.map((item) => { return { label: item.number + item['name'], value: item['id']+'' } })
    })
    listRsContract({ pageSize: -1 }).then(response => {
      this.contractIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
  },
  methods: {
    getDriverList(hostId) {
      getDriver(hostId).then(response => {
        this.driverIdOptions = this.toDictData(response.data.list, 'name', 'id')
      })
    },
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listRsDial(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.rsDialList = response.data.list
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
    toggleAdvanced() {
      const fields = ['search', 'customId', 'networkingStatus', 'idcId', 'ispId', 'status']
      if (this.searchField.length > 3) {
        this.searchField = fields.splice(0, 3)
      } else {
        this.searchField = fields
      }
    },
    ispChange(){

    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        desc: undefined,
        customId: undefined,
        contractId: undefined,
        broadbandType: undefined,
        isManager: undefined,
        account: undefined,
        pass: undefined,
        ispId: undefined,
        idcId: undefined,
        runTimeAt: undefined
      }
      this.resetForm('form')
    },
    convertFields(data, mode = 'toString') {
      const result = { ...data }
      const fieldsToConvert = []
      fieldsToConvert.push('customId')
      fieldsToConvert.push('contractId')
      fieldsToConvert.push('broadbandType')
      fieldsToConvert.push('isManager')
      fieldsToConvert.push('networkingStatus')
      fieldsToConvert.push('status')
      fieldsToConvert.push('ispId')
      fieldsToConvert.push('idcId')
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
    contractIdFormat(row) {
      return this.selectDictLabel(this.contractIdOptions, row.contractId)
    },
    broadbandTypeFormat(row) {
      return this.selectDictLabel(this.broadbandTypeOptions, row.broadbandType)
    },
    isManagerFormat(row) {
      return this.selectDictLabel(this.isManagerOptions, row.isManager)
    },
    networkingStatusFormat(row) {
      return this.selectDictLabel(this.networkingStatusOptions, row.networkingStatus)
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    ispIdFormat(row) {
      return this.selectDictLabel(this.ispIdOptions, row.ispId)
    },
    idcIdFormat(row) {
      return this.selectDictLabel(this.idcIdOptions, row.idcId)
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
      this.queryParams.idcId = this.idcId || undefined
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '新增拨号'
      this.isEdit = false
      if (this.idcId) {
        this.form.idcId = this.idcId.toString()
      }
    },
    /** 关联拨号 */
    handleRelation() {
      this.getDriverList(this.hostId)
      listRsDial({ hostId: '', pageSize: -1, emptyHost: 1, idcId: this.idcId }).then(response => {
        // this.dialIdOptions = this.toDictData(response.data.list, 'account', 'id')
        this.dialIdOptions = this.transformData(response.data.list)
        console.log(this.dialIdOptions)
      })
      this.relationForm = {
        dialId: undefined,
        hostId: this.hostId,
        driverId: undefined
      }
      this.openRelation = true
    },
    transformData(data) {
      const result = []
      // 创建一个映射对象以处理不同的 ispName
      const ispMap = {}
      data.forEach(item => {
        const { account, id, ispName } = item
        if (!ispMap[ispName]) {
          ispMap[ispName] = {
            label: ispName,
            options: []
          }
          result.push(ispMap[ispName])
        }
        ispMap[ispName].options.push({
          value: id,
          label: account
        })
      })
      return result
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
      getRsDial(id).then(response => {
        this.form = this.convertFields(response.data, 'toString')
        this.open = true
        this.title = '修改拨号信息'
        this.isEdit = true
      })
    },
    copyRow(row) {
      getRsDial(row.id).then(response => {
        this.form = this.convertFields(response.data, 'toString')
        this.form.id = undefined
        this.open = true
        this.title = '新增拨号'
        this.isEdit = true
      })
    },
    submitRelation: function() {
      this.$refs['relationForm'].validate(valid => {
        if (valid) {
          const result = { driverId: Number(this.relationForm.driverId), dialId: Number(this.relationForm.dialId), hostId: this.hostId }
          hostBindDial(result).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.openRelation = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          }).catch(() => {
            this.openRelation = false
          })
        }
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateRsDial(this.convertFields(this.form, 'toNumber')).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            }).catch(() => {
              this.open = false
            })
          } else {
            addRsDial(this.convertFields(this.form, 'toNumber')).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            }).catch(() => {
              this.open = false
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids
      var msg = '是否确认删除'
      Ids.length > 1 ? (msg = '确定要删除所选拨号?') : (msg = '确定要删除该拨号吗?')
      this.$confirm(msg, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRsDial({ 'ids': Ids })
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
<style>
.ant-tooltip-inner{
  width: max-content !important;
}
</style>
