
<template>
  <BasicLayout>
    <template #header>
      <el-form
        class="queryForm"
        ref="queryForm"
        style="transform: translateY(4px)"
        :model="queryParams"
      >
        <el-row :gutter="20" style="position: relative">
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('search')">
            <el-form-item
              label="编号/名称:"
              prop="search"
            ><el-input
              v-model="queryParams.search"
              placeholder="请输入"
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
              filterable
              size="small"
            >
              <el-option
                :class="[dict.value === 'empty' ? 'empty' : '']"
                v-for="dict in [{label: '(空客户)', value: 'empty'}].concat(customIdOptions)"
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
            ><el-cascader
              v-model="queryParams.region"
              size="small"
              collapse-tags
              filterable
              :props="{ multiple: true, checkStrictly: true, label: 'name', value: 'code', children: 'children' }"
              :options="regionOptions"
              :style="{width: '100%'}"
              placeholder="请选择所在地区"
              clearable
            />
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('status')">
            <el-form-item
              label="状态:"
              prop="status"
            ><el-select
              v-model="queryParams.status"
              placeholder="机房状态"
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('belong')">
            <el-form-item
              label="机房归属:"
              prop="belong"
            ><el-select
              v-model="queryParams.belong"
              placeholder="机房归属"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in belongOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('typeId')">
            <el-form-item
              label="机房类型:"
              prop="typeId"
            ><el-select
              v-model="queryParams.typeId"
              placeholder="机房类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in typeIdOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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
        style="transform: translateY(-2px);height: 32px"
        class="mb8"
      >
        <el-col :span="1.5">
          <a-button
            v-permisaction="['admin:rsIdc:add']"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <a-button
            v-permisaction="['admin:rsIdc:edit']"
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
            v-permisaction="['admin:rsIdc:remove']"
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
          :data="rsIdcList"
          :default-sort="{prop: 'number', order: 'descending'}"
          @sort-change="handleSortChang"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          /><el-table-column
          label="机房编号"
          sortable="custom"
          align="center"
          width="100"
          prop="number"
          :show-overflow-tooltip="true"
        />
          <el-table-column
            label="机房名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            label="所在地区"
            align="center"
            prop="region"
          >
            <template slot-scope="scope">
              {{ getNamesFromCodes(scope.row.region, regionOptions) }}
            </template>
          </el-table-column>
          <el-table-column
            label="所属客户"
            align="center"
            prop="customId"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ selectDictLabel(customIdOptions, scope.row.customId) }}
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            prop="status"
            :formatter="statusFormat"
            width="100"
          >
            <template slot-scope="scope">
              <a-tag v-if="scope.row.status == 1" color="green">{{ statusFormat(scope.row) }}</a-tag>
              <template v-else>
                <a-tag v-if="scope.row.status == 4" color="red">{{ statusFormat(scope.row) }}</a-tag>
                <a-tag v-else color="blue">{{ statusFormat(scope.row) }}</a-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="服务器数量"
            align="center"
            width="90"
            prop="sl"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <a-button type="link" @click="toAsset(scope.row)">
                {{ scope.row.rsIdcCount && scope.row.rsIdcCount.allHost }}
              </a-button>
            </template>
          </el-table-column>
          <el-table-column
            label="在线数量"
            align="center"
            width="80"
            prop="sl"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <a-button style="color: #67C23A" type="link" @click="toHost(scope.row, 1)">
                {{ scope.row.rsIdcCount && scope.row.rsIdcCount.onLine }}
              </a-button>
            </template>
          </el-table-column>
          <el-table-column
            sortable="custom"
            label="离线数量"
            align="center"
            width="100"
            prop="offLine"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <a-button style="color: #F56C6C" type="link" @click="toHost(scope.row, -1)">
                {{ scope.row.rsIdcCount && scope.row.rsIdcCount.offLine }}
              </a-button>
            </template>
          </el-table-column>
          <!--          <el-table-column-->
          <!--            label="利用率"-->
          <!--            align="center"-->
          <!--            width="200"-->
          <!--            prop="sl"-->
          <!--            :show-overflow-tooltip="true"-->
          <!--          />-->
          <!--          <el-table-column-->
          <!--            label="业务线数量"-->
          <!--            align="center"-->
          <!--            width="200"-->
          <!--            prop="sl"-->
          <!--            :show-overflow-tooltip="true"-->
          <!--          />-->
          <!--          <el-table-column-->
          <!--            label="管理线数量"-->
          <!--            align="center"-->
          <!--            width="200"-->
          <!--            prop="sl"-->
          <!--            :show-overflow-tooltip="true"-->
          <!--          />-->
          <!--          <el-table-column-->
          <!--            label="单线带宽"-->
          <!--            align="center"-->
          <!--            width="200"-->
          <!--            prop="sl"-->
          <!--            :show-overflow-tooltip="true"-->
          <!--          />-->
          <!--          <el-table-column-->
          <!--            label="总带宽"-->
          <!--            align="center"-->
          <!--            width="200"-->
          <!--            prop="sl"-->
          <!--            :show-overflow-tooltip="true"-->
          <!--          />-->
<!--          <el-table-column-->
<!--            label="商务人员"-->
<!--            align="center"-->
<!--            prop="buId"-->
<!--            :show-overflow-tooltip="true"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              {{ buIdFormat(scope.row) }}-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="机房归属"-->
<!--            align="center"-->
<!--            prop="belong"-->
<!--            :formatter="belongFormat"-->
<!--            width="100"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              {{ belongFormat(scope.row) }}-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="所属客户"-->
<!--            align="center"-->
<!--            prop="customId"-->
<!--            :show-overflow-tooltip="true"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              {{ selectDictLabel(customIdOptions, scope.row.customId) }}-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="机房类型"-->
<!--            align="center"-->
<!--            prop="typeId"-->
<!--            :formatter="typeIdFormat"-->
<!--            width="100"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              {{ typeIdFormat(scope.row) }}-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="是否IPV6"-->
<!--            align="center"-->
<!--            prop="ipV6"-->
<!--            :formatter="ipV6Format"-->
<!--            width="100"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              {{ ipV6Format(scope.row) }}-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="企业微信群名称"-->
<!--            align="center"-->
<!--            width="180"-->
<!--            prop="wechatName"-->
<!--            :show-overflow-tooltip="true"-->
<!--          />-->
<!--          <el-table-column-->
<!--            label="企业微信群webbook"-->
<!--            align="center"-->
<!--            width="200"-->
<!--            prop="webHookUrl"-->
<!--            :show-overflow-tooltip="true"-->
<!--          />-->
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
            label="操作"
            fixed="right"
            width="180"
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
                v-permisaction="['admin:rsIdc:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                slot="reference"
                v-permisaction="['admin:rsIdc:remove']"
                @click="handleDelete(scope.row)"
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
        :centered="true"
        cancel-text="取消"
        width="800px"
        @ok="submitForm"
        @cancel="cancel"
      >
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          :rules="rules"
        >
          <el-row >
            <el-col :span="12">
              <el-form-item
                label="机房编号:"
                prop="number"
              >
                <el-input
                  v-model="form.number"
                  placeholder="机房编号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="机房名称:"
                prop="name"
              >
                <el-input
                  v-model="form.name"
                  placeholder="机房名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="机房状态"
                prop="status"
              >
                <el-select
                  v-model="form.status"
                  placeholder="请选择"
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
            <el-col :span="12">
              <el-form-item
                label="机房归属"
                prop="belong"
              >
                <el-select
                  v-model="form.belong"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in belongOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
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
                label="详细地址"
                prop="address"
              >
                <el-input
                  v-model="form.address"
                  placeholder="详细地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="机房类型"
                prop="typeId"
              >
                <el-select
                  v-model="form.typeId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in typeIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="是否跨省"
                prop="transProvince"
              >
                <el-select
                  v-model="form.transProvince"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in transProvinceOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="是否支持多拨"
                prop="moreDialing"
              >
                <el-select
                  v-model="form.moreDialing"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in moreDialingOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="是否IPV6"
                prop="ipV6"
              >
                <el-select
                  v-model="form.ipV6"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in ipV6Options"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="企业微信群名称:"
                prop="wechatName"
              >
                <el-input
                  v-model="form.wechatName"
                  placeholder="企业微信群名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="企微webhook:"
                prop="webHook"
              >
                <el-input
                  v-model="form.webHookUrl"
                  placeholder="企业微信webhookUrl"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="描述信息"
                prop="desc"
              >
                <el-input
                  type="textarea"
                  v-model="form.desc"
                  placeholder="描述信息"
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
import { addRsIdc, delRsIdc, getRsIdc, listRsIdc, updateRsIdc } from '@/api/cmdb/rc-idc'
import Detail from './detail.vue'
import { listRsCustom } from '@/api/custom'
import { getUserlistByRole } from '@/api/admin/sys-role'

export default {
  name: 'RsIdc',
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
      // 是否显示详情弹出层
      openDetail: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      rsIdcList: [],
      regionProps: {
        'multiple': false,
        'label': 'name',
        'value': 'code',
        'children': 'children'
      },
      buIdOptions: [],
      customIdOptions: [],
      regionOptions: [], ipV6Options: [], typeIdOptions: [], statusOptions: [], belongOptions: [], moreDialingOptions: [],transProvinceOptions: [],
      // 关系表类型
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        search: undefined,
        customId: undefined,
        region: undefined,
        typeId: undefined,
        buId: undefined,
        status: undefined,
        belong: undefined
      },
      searchField: ['search', 'customId', 'region', 'buId', 'status', 'belong', 'typeId'],
      // 表单参数
      form: {
      },
      detailVisible: false,
      rowId: undefined,
      // 表单校验
      rules: { number: [{ required: true, message: '机房编号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '机房名称不能为空', trigger: 'blur' }],
        customId: [{ required: false, message: '所属客户不能为空', trigger: 'blur' }],
        region: [{ required: true, message: '所在地区不能为空', trigger: 'blur' }],
        typeId: [{ required: true, message: '机房类型不能为空', trigger: 'blur' }],
        buId: [{ required: false, message: '商务人员不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '机房状态不能为空', trigger: 'blur' }],
        belong: [{ required: true, message: '机房归属不能为空', trigger: 'blur' }],
        transProvince: [{ required: true, message: '是否可跨省不能为空', trigger: 'blur' }],
        moreDialing: [{ required: true, message: '是否支持多拨不能为空', trigger: 'blur' }],
      }
    }
  },
  created() {
    if (!this.order) this.queryParams['numberOrder'] = 'desc'
    this.searchField = ['search', 'customId', 'region']
    if (this.$route.query.customId) {
      this.queryParams.customId = this.$route.query.customId
    }
    this.getList()
    this.getDicts('sys_yes_no').then(response => {
      this.ipV6Options = response.data
    })
    this.getDicts('idc_type').then(response => {
      this.typeIdOptions = response.data
    })
    this.getDicts('idc_status').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('belong').then(response => {
      this.belongOptions = response.data
    })
    this.regionOptions = this.$store.getters.region
    this.getDicts('sys_yes_no').then(response => {
      this.transProvinceOptions = response.data
    })
    this.getDicts('sys_yes_no').then(response => {
      this.moreDialingOptions = response.data
    })
    listRsCustom({ pageSize: 1000 }).then(response => {
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
      listRsIdc(this.formatQueryParams()).then(response => {
        this.rsIdcList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    toHost(row, status = undefined) {
      this.$router.push({ path: '/cmdb/rs-host', query: { idcId: row.id, status: status }})
    },
    toAsset(row) {
      this.$router.push({ path: '/asset/compose/index', query: { idcId: row.id }})
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    toggleAdvanced() {
      const fields = ['search', 'customId', 'region', 'buId', 'status', 'belong', 'typeId']
      if (this.searchField.length > 3) {
        this.searchField = fields.splice(0, 3)
      } else {
        this.searchField = fields
      }
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        desc: undefined,
        number: undefined,
        name: undefined,
        customId: undefined,
        region: undefined,
        address: undefined,
        ipV6: undefined,
        typeId: undefined,
        buId: undefined,
        wechatName: undefined,
        webHookUrl: undefined,
        status: undefined,
        transProvince: undefined,
        moreDialing: undefined,
        belong: undefined
      }
      this.resetForm('form')
    },
    convertFields(data, mode = 'toString') {
      const result = { ...data }
      const fieldsToConvert = []
      fieldsToConvert.push('ipV6')
      fieldsToConvert.push('typeId')
      fieldsToConvert.push('status')
      fieldsToConvert.push('belong')
      fieldsToConvert.push('buId')
      fieldsToConvert.push('customId')
      fieldsToConvert.push('number')
      fieldsToConvert.push('transProvince')
      fieldsToConvert.push('moreDialing')
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
    formatQueryParams() {
      const obj = { ...this.queryParams }
      Object.keys(obj).forEach(key => {
        if (obj[key] instanceof Array) {
          obj[key] = [...new Set(obj[key].flat())].join(',')
        }
      })
      return obj
    },
    ipV6Format(row) {
      return this.selectDictLabel(this.ipV6Options, row.ipV6)
    },
    typeIdFormat(row) {
      return this.selectDictLabel(this.typeIdOptions, row.typeId)
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    belongFormat(row) {
      return this.selectDictLabel(this.belongOptions, row.belong)
    },
    buIdFormat(row) {
      return this.selectDictLabel(this.buIdOptions, row.buId)
    },
    /** 排序回调函数 */
    handleSortChang(column, prop, order) {
      prop = column.prop
      order = column.order
      this.queryParams[this.order] = undefined
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.queryParams[this.order] = undefined
      }
      if (order === 'descending') {
        this.queryParams[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.queryParams[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.queryParams[prop + 'Order'] = undefined
      }
      this.getList()
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      console.log(this.queryParams)
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.queryParams.customId = undefined
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.form.typeId = '3'
      this.form.transProvince = '2'
      this.form.moreDialing = '2'
      this.form.ipV6 = '1'
      this.open = true
      this.title = '添加机房'
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
      getRsIdc(id).then(response => {
        this.form = this.convertFields(response.data, 'toString')
        this.form.region = response.data.region.split(',').map(e => Number(e))
        this.open = true
        this.title = '修改机房'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateRsIdc({ ...this.convertFields(this.form, 'toNumber'), region: this.form.region.join(',') }).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addRsIdc({ ...this.convertFields(this.form, 'toNumber'), region: this.form.region.join(',') }).then(response => {
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
      Ids.length > 1 ? (msg = '是否确认删除所选机房?') : (msg = '是否确认删除机房"' + row.name + '"?')
      this.$confirm(msg, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRsIdc({ 'ids': Ids })
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
<style scoped>
.empty {
  color: #ff0000;
}
</style>
