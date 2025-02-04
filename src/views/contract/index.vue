
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('name')">
            <el-form-item
              label="合同名称:"
              prop="name"
            ><el-input
              v-model="queryParams.name"
              placeholder="请输入合同名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('customId')">
            <el-form-item
              label="所属客户:"
              prop="customId"
            ><el-select
              filterable
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
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('type')">
            <el-form-item
              label="合同类型:"
              prop="type"
            ><el-select
              v-model="queryParams.type"
              placeholder="合同类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('settlementType')">
            <el-form-item
              label="结算方式:"
              prop="settlementType"
            ><el-select
              v-model="queryParams.settlementType"
              placeholder="结算方式"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in settlementTypeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :xs="24" :md="12" :xl="6" :lg="6" v-show="searchField.includes('startTimeAt')">
            <el-form-item
              label="签订日期:"
              prop="startTimeAt"
            >
              <el-date-picker
                size="small"
                v-model="dateRange"
                value-format="yyyy-MM-dd hh:MM:ss"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
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
            v-permisaction="['admin:rsContract:add']"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <a-button
            v-permisaction="['admin:rsContract:edit']"
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
            v-permisaction="['admin:rsContract:remove']"
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
          :data="rsContractList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          /><el-table-column
          label="合同名称"
          align="left"
          prop="name"
          :show-overflow-tooltip="true"
        />
<!--          <el-table-column-->
<!--          label="合同编号"-->
<!--          width="200"-->
<!--          align="center"-->
<!--          prop="number"-->
<!--          :show-overflow-tooltip="true"-->
<!--        />-->
          <el-table-column
            label="合同开始日期"
            width="130"
            align="center"
            prop="startTimeAt"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.startTimeAt }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="合同结束日期"
            width="130"
            align="center"
            prop="endTimeAt"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.endTimeAt }}</span>
            </template>
          </el-table-column>
          <el-table-column
          label="所属客户"
          align="center"
          prop="customId"
          :formatter="customIdFormat"
          width="200"
        >
          <template slot-scope="scope">
            {{ customIdFormat(scope.row) }}
          </template>
        </el-table-column>
<!--          <el-table-column-->
<!--          label="签订人"-->
<!--          align="center"-->
<!--          prop="signatoryId"-->
<!--          :formatter="signatoryIdFormat"-->
<!--          width="100"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            {{ signatoryIdFormat(scope.row) }}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--          <el-table-column-->
<!--            label="联系人"-->
<!--            align="center"-->
<!--            prop="userId"-->
<!--            :show-overflow-tooltip="true"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              {{ selectDictLabel(userIdOptions, scope.row.userId) }}-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="合同类型"-->
<!--            align="center"-->
<!--            prop="type"-->
<!--            :formatter="typeFormat"-->
<!--            width="100"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              {{ typeFormat(scope.row) }}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
          label="结算方式"
          align="center"
          prop="settlementType"
          :formatter="settlementTypeFormat"
          width="90"
        >
          <template slot-scope="scope">
            {{ settlementTypeFormat(scope.row) }}
          </template>
        </el-table-column>
          <el-table-column
            label="商务人员"
            align="center"
            prop="buId"
            width="100"
          >
            <template slot-scope="scope">
              {{ buIdFormat(scope.row) }}
            </template>
          </el-table-column>
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
                v-permisaction="['admin:rsContract:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                slot="reference"
                v-permisaction="['admin:rsContract:remove']"
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
        :width="'70%'"
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
        width="900px"
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
                label="合同名称"
                prop="name"
              >
                <el-input
                  v-model="form.name"
                  placeholder="合同名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="合同编号"
                prop="number"
              >
                <el-input
                  v-model="form.number"
                  placeholder="合同编号"
                />
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
                label="签订人"
                prop="signatoryId"
              >
                <el-select
                  filterable
                  v-model="form.signatoryId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in signatoryIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="联系人名称"
                prop="userId"
              >
                <el-select
                  filterable
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
                label="合同类型"
                prop="type"
              >
                <el-select
                  v-model="form.type"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in typeOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="结算方式"
                prop="settlementType"
              >
                <el-select
                  v-model="form.settlementType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in settlementTypeOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="合同开始日期"
                prop="startTimeAt"
              >
                <el-date-picker
                  v-model="form.startTimeAt"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="合同结束日期"
                prop="endTimeAt"
              >
                <el-date-picker
                  v-model="form.endTimeAt"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="开户名称"
                prop="accountName"
              >
                <el-input
                  v-model="form.accountName"
                  placeholder="开户名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="银行账号"
                prop="bankAccount"
              >
                <el-input
                  v-model="form.bankAccount"
                  placeholder="银行账号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="开户银行"
                prop="bankName"
              >
                <el-input
                  v-model="form.bankName"
                  placeholder="开户银行"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="纳税人识别号"
                prop="identifyNumber"
              >
                <el-input
                  v-model="form.identifyNumber"
                  placeholder="纳税人识别号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="地址"
                prop="address"
              >
                <el-input
                  v-model="form.address"
                  placeholder="地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="电话"
                prop="phone"
              >
                <el-input
                  v-model="form.phone"
                  placeholder="电话"
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
          <el-divider content-position="left">费用信息</el-divider>
          <el-row>
            <el-table
              v-loading="loading"
              border
              :data="form.bandwidthFees"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                width="180"
                align="center"
                prop="isp"
                :show-overflow-tooltip="true"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>运营商
                </template>
                <template slot-scope="scope">
                  <el-select
                    v-model="form.bandwidthFees[scope.$index].isp"
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
                prop="up"
                width="180"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>上行带宽(M)
                </template>
                <template slot-scope="scope">
                  <el-input-number
                    v-model="form.bandwidthFees[scope.$index].up"
                    style="width: 100%"
                    placeholder="请输入"
                    :min="0"
                    :max="999999"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="下行带宽(M)"
                align="center"
                prop="down"
                width="180"
              >
                <template slot-scope="scope">
                  <el-input-number
                    v-model="form.bandwidthFees[scope.$index].down"
                    style="width: 100%"
                    placeholder="请输入"
                    :min="0"
                    :max="999999"
                  />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="charging"
                width="180"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>计费方式
                </template>
                <template slot-scope="scope">
                  <el-select
                    v-model="form.bandwidthFees[scope.$index].charging"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="dict in chargingOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="业务线单价(元/M)"
                align="center"
                prop="linePrice"
                width="180"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>业务线单价(元/M/月)
                </template>
                <template slot-scope="scope">
                  <el-input-number
                    v-model="form.bandwidthFees[scope.$index].linePrice"
                    style="width: 100%"
                    placeholder="请输入"
                    :min="0"
                    :max="999999"
                  />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="managerLineCost"
                width="180"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>管理线价格(元/条/月)
                </template>
                <template slot-scope="scope">
                  <el-input-number
                    v-model="form.bandwidthFees[scope.$index].managerLineCost"
                    style="width: 100%"
                    placeholder="请输入"
                    :min="0"
                    :max="999999"
                  />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="transProd"
                width="180"
              >
                <template slot="header">
                  <span style="color: #ff4949">*</span>是否可跨省
                </template>
                <template slot-scope="scope">
                  <el-select
                    v-model="form.bandwidthFees[scope.$index].transProd"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="dict in transProdOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="是否支持多拨"
                align="center"
                prop="moreDialing"
                width="180"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="form.bandwidthFees[scope.$index].moreDialing"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="dict in moreDialingOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
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
import { addRsContract, delRsContract, getRsContract, listRsContract, updateRsContract } from '@/api/contract/index'
import { getUserlistByRole } from '@/api/admin/sys-role'

import Detail from './detail.vue'
import { listRsCustom, listRsCustomUser} from '@/api/custom'
import { listUser } from '@/api/admin/sys-user'

export default {
  name: 'RsContract',
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
      rsContractList: [],
      ispOptions: [],
      chargingOptions: [],
      moreDialingOptions: [],
      transProdOptions: [],
      userIdOptions: [],
      dateRange: [],
      buIdOptions: [], customIdOptions: [], signatoryIdOptions: [], typeOptions: [], settlementTypeOptions: [],
      // 关系表类型
      searchField: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        buId: undefined,
        customId: undefined,
        type: undefined,
        settlementType: undefined,
        startTimeAt: undefined
      },
      // 表单参数
      form: {
      },
      rowId: undefined,
      // 表单校验
      rules: { name: [{ required: true, message: '合同名称不能为空', trigger: 'blur' }],
        buId: [{ required: true, message: '商务人员不能为空', trigger: 'blur' }],
        customId: [{ required: true, message: '所属客户不能为空', trigger: 'blur' }],
        userId: [{ required: true, message: '联系人名称不能为空', trigger: 'blur' }],
        signatoryId: [{ required: true, message: '合同签订人不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '合同类型不能为空', trigger: 'blur' }],
        settlementType: [{ required: true, message: '结算方式不能为空', trigger: 'blur' }],
        startTimeAt: [{ required: true, message: '合同开始日期不能为空', trigger: 'blur' }],
        endTimeAt: [{ required: true, message: '合同结束日期不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.searchField = Object.keys(this.queryParams).slice(2).slice(0, 3)
    this.getList()
    this.getDicts('contract_type').then(response => {
      this.typeOptions = response.data
    })
    this.getDicts('settlement_type').then(response => {
      this.settlementTypeOptions = response.data
    })
    this.getDicts('isp').then(response => {
      this.ispOptions = response.data
    })
    this.getDicts('charging').then(response => {
      this.chargingOptions = response.data
    })
    this.getDicts('sys_yes_no').then(response => {
      this.moreDialingOptions = response.data
      this.transProdOptions = response.data
    })
    getUserlistByRole({ name: 'business_user' }).then(response => {
      this.buIdOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
    listUser({ pageSize: -1 }).then(response => {
      this.signatoryIdOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
    listRsCustomUser({ pageSize: -1 }).then(response => {
      this.userIdOptions = this.toDictData(response.data.list, 'userName', 'id')
    })
    listRsCustom({ pageSize: -1 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listRsContract(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.rsContractList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    toggleAdvanced(){
      if(this.searchField.length > 3) {
        this.searchField = this.searchField.splice(0, 3)
        console.log(this.searchField)
      } else {
        this.searchField = Object.keys(this.queryParams).slice(2)
      }
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        desc: undefined,
        name: undefined,
        number: undefined,
        buId: undefined,
        customId: undefined,
        signatoryId: undefined,
        userId: undefined,
        type: undefined,
        settlementType: undefined,
        startTimeAt: undefined,
        endTimeAt: undefined,
        accountName: undefined,
        bankAccount: undefined,
        bankName: undefined,
        identifyNumber: undefined,
        address: undefined,
        phone: undefined,
        bandwidthFees: [
          {
            id: undefined,
            isp: undefined,
            up: undefined,
            down: undefined,
            linePrice: undefined,
            managerLineCost: undefined,
            charging: undefined,
            transProd: undefined,
            moreDialing: undefined
          }
        ]
      }
      this.resetForm('form')
    },
    convertFields(data, mode = 'toString') {
      const result = { ...data }
      const fieldsToConvert = []
      fieldsToConvert.push('buId')
      fieldsToConvert.push('customId')
      fieldsToConvert.push('signatoryId')
      fieldsToConvert.push('type')
      fieldsToConvert.push('userId')
      fieldsToConvert.push('settlementType')
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
    buIdFormat(row) {
      return this.selectDictLabel(this.buIdOptions, row.buId.toString())
    },
    customIdFormat(row) {
      return this.selectDictLabel(this.customIdOptions, row.customId)
    },
    signatoryIdFormat(row) {
      return this.selectDictLabel(this.signatoryIdOptions, row.signatoryId)
    },
    typeFormat(row) {
      return this.selectDictLabel(this.typeOptions, row.type)
    },
    settlementTypeFormat(row) {
      return this.selectDictLabel(this.settlementTypeOptions, row.settlementType)
    },
    copyRow(row) {
      row.id = undefined
      this.form.bandwidthFees.push({ ...row })
    },
    deleteRow(index) {
      if (this.form.bandwidthFees.length > 1) {
        this.form.bandwidthFees.splice(index, 1)
      }
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
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加合同'
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
      getRsContract(id).then(response => {
        this.form = this.convertFields(response.data, 'toString')
        this.form.bandwidthFees = this.convertToString(this.form.bandwidthFees)
        this.open = true
        this.title = '修改合同'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.form)
      this.$refs['form'].validate(valid => {
        if (valid) {
          const needValid = ['isp', 'up', 'down', 'linePrice', 'managerLineCost', 'charging', 'transProd']
          this.form.bandwidthFees.forEach((item) => {
            Object.keys(item).forEach(key => {
              if (needValid.includes(key) && item[key] === undefined) {
                this.msgError('请完善费用信息')
                throw new Error(`${key}不能为空`)
              }
            })
          })
          const result = {
            ...this.convertFields(this.form, 'toNumber'),
            bandwidthFees: this.convertToNumbers(this.form.bandwidthFees)
          }
          if (this.form.id !== undefined) {
            updateRsContract(result).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addRsContract(result).then(response => {
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
      Ids.length > 1 ? (msg = '确定要删除所选合同?') : (msg = '确定要删除该合同吗?')
      this.$confirm(msg, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRsContract({ 'ids': Ids })
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
