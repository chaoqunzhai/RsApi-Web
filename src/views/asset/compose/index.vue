
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
              label="组合编号:"
              prop="code"
            ><el-input
              v-model="queryParams.code"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
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
              label="所在位置"
              prop="idcId"
            ><el-select
              v-model="queryParams.idcId"
              placeholder="所在位置"
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
            v-permisaction="['asset:assetWarehouse:add']"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增资产组合
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <a-button
            v-permisaction="['asset:assetWarehouse:edit']"
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
            v-permisaction="['asset:assetWarehouse:remove']"
            type="danger"
            icon="delete"
            :disabled="multiple"
            @click="handleDelete"
          >删除
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <div style="display: flex;height: 32px;justify-items: center;align-items: center">
            <div class="count-item">
              <span class="label">当前在线:</span>
              <span
                class="num"
                style="color: #4CD964"
              >{{ onlineData }}</span>
              <span class="unit">&nbsp;台;</span>
            </div>
            <div class="count-item">
              <span class="label">当前离线:</span>
              <span
                class="num"
                style="color: #E65D6E"
              >{{ offline }}</span>
              <span class="unit">&nbsp;台;</span>
            </div>
            <div class="count-item">
              <span class="label">当前出库:</span>
              <span
                class="num"
                style="color: rgb(255,217,28)"
              >{{ awaitCount }}</span>
              <span class="unit">&nbsp;台;</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div style="flex: 1">
        <el-table
          v-loading="loading"
          :height="'98%'"
          :data="assetComposeList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            label="组合编号"
            width="220"
            align="center"
            prop="code"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <a style="color: #1890ff" @click="toHost(scope.row)">
                {{scope.row.code}}
              </a>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            width="80"
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
            label="关联资产"
            align="center"
            width="90"
            prop="assetCount"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <a-button type="link" @click="toAsset(scope.row)">
                {{ scope.row.assetCount }}
              </a-button>
            </template>
          </el-table-column>
          <el-table-column
            label="组合价格"
            width="90"
            align="center"
            prop="price"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="所属客户"
            align="left"
            :show-overflow-tooltip="true"
            prop="customId"
          >
            <template slot-scope="scope">
              {{ selectDictLabel(customIdOptions, scope.row.customId) }}
            </template>
          </el-table-column>
          <el-table-column
            label="所在位置"
            align="center"
            prop="status"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.regionInfo && scope.row.regionInfo.val }}
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            label="创建时间"-->
<!--            align="center"-->
<!--            prop="createdAt"-->
<!--            :show-overflow-tooltip="true"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              {{ parseTime(scope.row.createdAt) }}-->
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
                style="margin-left: 6px"
                size="mini"
                type="text"
              >
                <el-dropdown size="mini">
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div @click="handleUpdate(scope.row)">修改组合</div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="updateDesc(scope.row)">修改其他</div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="handleDelete(scope.row)">删除</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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
      <!-- 修改状态、备注 -->
      <a-modal
        title="修改"
        :visible="openDesc"
        :centered="true"
        ok-text="确定"
        cancel-text="取消"
        width="600px"
        @ok="submitDescForm"
        @cancel="openDesc = false"
      >
        <el-form
          ref="descForm"
          :model="descForm"
          label-width="80px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="主机状态"
                prop="status"
              >
                <el-select
                  v-model="descForm.status"
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
                label="所属客户"
                prop="customId"
              >
                <el-select
                  clearable
                  filterable
                  v-model="descForm.customId"
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
                label="所在位置"
                prop="idcId"
              >
                <el-select
                  clearable
                  v-model="descForm.idcId"
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
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="desc"
              >
                <el-input
                  v-model="descForm.desc"
                  type="textarea"
                  placeholder="备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </a-modal>
      <a-modal
        :maskClosable="false"
        :title="title"
        :visible="open"
        :centered="true"
        ok-text="确定"
        cancel-text="取消"
        width="1000px"
        @ok="submitForm"
        @cancel="cancel"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="0px"
        >
          <el-row>
<!--            <el-col :span="24">-->
<!--              <el-form-item-->
<!--                :label="null"-->
<!--                prop="assetNumber"-->
<!--              >-->
<!--                <a @click="selectMasterAsset">请选择</a>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <el-col :span="24">
              <el-form-item
                :label="null"
                prop="remark"
              >
                <div style="display: flex;justify-content: space-between;margin-bottom: 10px" :span="24">
                  <div>
                    已选择资产（{{deleteIds.length}} 条）
                  </div>
                  <div>
                    <a-button
                      v-permisaction="['asset:assetWarehouse:add']"
                      type="primary"
                      icon="plus"
                      @click="selectMasterAsset"
                    >选择主资产
                    </a-button>
                    <a-button
                      style="margin-left: 10px"
                      v-permisaction="['asset:assetWarehouse:add']"
                      type="primary"
                      icon="plus"
                      :disabled="!editTableData.filter(item => item.categoryId == 1).length"
                      @click="relevanceAsset"
                    >关联子资产
                    </a-button>
                    <a-button
                      style="margin-left: 10px"
                      v-permisaction="['asset:assetWarehouse:remove']"
                      type="danger"
                      icon="delete"
                      :disabled="multipleAdd"
                      @click="deleteTableItems"
                    >批量移除
                    </a-button>
                  </div>
                </div>
                <el-table
                  border
                  :height="400"
                  :data="editTableData"
                  @selection-change="deleteSelectionChange"
                >
                  <el-table-column
                    type="selection"
                    width="55"
                    align="center"
                  />
                  <el-table-column
                    label="关联关系"
                    align="center"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.categoryId == 1 ? '主资产' : '配件' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="状态"
                    align="center"
                    prop="status"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      {{ selectDictLabel(statusOptions, scope.row.status) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="资产编号"
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
                    label="规格型号"
                    align="center"
                    prop="spec"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="品牌"
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
                    label="价格(元)"
                    align="center"
                    prop="price"
                    :show-overflow-tooltip="true"
                  />
<!--                  <el-table-column-->
<!--                    label="所在位置"-->
<!--                    align="center"-->
<!--                    prop="storeRoomId"-->
<!--                    width="100"-->
<!--                  >-->
<!--                    <template slot-scope="scope">-->
<!--                      {{ selectDictLabel(storeRoomIdOptions, scope.row.storeRoomId) }}-->
<!--                    </template>-->
<!--                  </el-table-column>-->
                  <el-table-column
                    width="100"
                    fixed="right"
                    label="操作"
                    align="center"
                    class-name="small-padding fixed-width"
                  >
                    <template slot-scope="scope">
                      <el-button
                        slot="reference"
                        @click="deleteTableItems(scope.row)"
                        v-permisaction="['asset:assetWarehouse:remove']"
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                      >移除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </a-modal>
      <!-- 选择资产 -->
      <a-modal
        v-if="visible"
        :maskClosable="false"
        ok-text="确定"
        cancel-text="取消"
        @ok="submitAddAsset"
        :centered="true"
        @cancel="colseAssetList"
        v-model="visible"
        width="800px"
        title="选择资产">
        <el-form
          inline
          ref="searchForm"
          :model="assetQueryParams"
          class="queryForm"
          style="transform: translateY(4px)"
        >
          <el-row
            style="position: relative"
          >
            <el-form-item
              v-if="isMaster"
              label="资产SN/编码:"
            ><el-input
              v-model="assetQueryParams.search"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="searchAssetList"
            />
            </el-form-item>
            <el-form-item
              v-if="!isMaster"
              label="资产名称:"
            ><el-input
              v-model="assetQueryParams.assetName"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="searchAssetList"
            />
            </el-form-item>
            <el-form-item
              v-if="!isMaster"
              label="资产分类:"
              prop="status"
            ><el-select
              v-model="assetQueryParams.categoryId"
              placeholder="请选择"
              clearable
              size="small"
            >
              <el-option label="全部" :value="-1" :key="-1"></el-option>
              <el-option
                v-for="dict in categoryIdOptions.filter(item => item.value != 1)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
            <el-form-item style="text-align: right;margin-left: 10px">
              <a-button
                type="primary"
                icon="search"
                @click="searchAssetList"
              >搜索</a-button>
              <a-button
                style="margin-left: 10px"
                @click="resetAssetQuery"
              ><a-icon type="sync" />重置</a-button>
            </el-form-item>
          </el-row>
        </el-form>
        <el-table
          height="450"
          border
          :data="assetList"
          @selection-change="addSelectionChange"
        >
          <el-table-column
            v-if="!isMaster"
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            v-if="isMaster"
            width="55"
            align="center"
          >
            <template slot-scope="scope">
              <a @click="submitAddAsset(scope.row)">选择</a>
            </template>
          </el-table-column>
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
                v-else-if="scope.row.status == 1"
                type="success"
                size="small"
                effect="plain">
                {{ selectDictLabel(statusOptions, scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="资产编号"
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
            label="规格型号"
            align="center"
            prop="spec"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="品牌"
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
            label="价格(元)"
            align="center"
            prop="price"
            :show-overflow-tooltip="true"
          />
<!--          <el-table-column-->
<!--            label="所在位置"-->
<!--            align="center"-->
<!--            prop="storeRoomId"-->
<!--            width="100"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              {{ selectDictLabel(storeRoomIdOptions, scope.row.storeRoomId) }}-->
<!--            </template>-->
<!--          </el-table-column>-->
        </el-table>
        <div style="transform: translateY(12px)">
          <pagination
            v-show="assetTotal>0"
            :total="assetTotal"
            :page.sync="assetQueryParams.pageIndex"
            :limit.sync="assetQueryParams.pageSize"
            @pagination="getAssetList"
          />
        </div>
      </a-modal>
    </template>
  </BasicLayout>
</template>

<script>
import { addAssetCombination,
  listAssetCombination,
  updateAssetCombination,
  delAssetCombination,
  getHostCountOnLine,
  getHostCountOffLine,
  getHostAwait,
  updateAssetCombinationOtherInfo,
  getAssetCombination } from '@/api/asset/combination'
import Detail from './detail.vue'
import { listAssetWarehouse } from '@/api/asset/asset_warehouse'
import { listAdditionsWarehousing } from '@/api/asset/property'
import { listRsCustom } from '@/api/custom'
import { listRsIdc } from '@/api/cmdb/rc-idc'
export default {
  name: 'AssetCompose',
  components: {
    Detail
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      deleteIds: [],
      addIds: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      multipleAdd: true,
      // 总条数
      total: 0,
      assetTotal: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      detailVisible: false,
      visible: false,
      isMaster: false,
      isEdit: false,
      editTableData: [],
      // 类型数据字典
      typeOptions: [],
      categoryIdOptions: [],
      assetComposeList: [],
      assetList: [],
      statusOptions: [],
      storeRoomIdOptions: [],
      customIdOptions: [],
      idcIdOptions: [],
      searchField: ['code', 'status', 'customId', 'idcId'],
      // 资产列表查询参数
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        code: undefined,
        status: undefined,
        customId: undefined,
        idcId: undefined,
        hostId: undefined
      },
      assetQueryParams: {
        pageIndex: 1,
        pageSize: 10,
        assetName: '',
        categoryId: undefined,
        search: '',
        combinationId: 0
      },
      onlineData: 0,
      offline: 0,
      openDesc: false,
      // 表单参数
      form: {
        code: undefined
      },
      descForm: {},
      rowId: undefined,
      awaitCount: 0,
      // 表单校验
      rules: {}
    }
  },
  created() {
    this.searchField = this.searchField.splice(0, 3)
    if (this.$route.query.idcId) {
      this.queryParams.idcId = this.$route.query.idcId
    }
    if (this.$route.query.hostId) {
      this.queryParams.hostId = this.$route.query.hostId
    }
    this.getList()
    this.getDicts('asset_status').then(response => {
      this.statusOptions = response.data
    })
    listAssetWarehouse({ pageSize: -1 }).then(response => {
      this.storeRoomIdOptions = this.toDictData(response.data.list, 'warehouseName', 'id')
    })
    this.getDicts('asset_group_type').then(response => {
      this.categoryIdOptions = response.data
    })
    listRsCustom({ pageSize: -1 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    listRsIdc({ pageSize: 1000 }).then(response => {
      this.idcIdOptions = response.data.list.map((item) => { return { label: item.number + item['name'], value: item['id'] + '' } })
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listAssetCombination(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.assetComposeList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
      getHostCountOffLine(this.queryParams).then(response => {
        this.offline = response.data
      })
      getHostAwait(this.queryParams).then(response => {
        this.awaitCount = response.data
      })
      getHostCountOnLine(this.queryParams).then(response => {
        this.onlineData = response.data
      })
    },
    getAssetList() {
      listAdditionsWarehousing(this.assetQueryParams).then(response => {
        this.assetList = response.data.list
        this.assetTotal = response.data.count
      })
    },
    toHost(row) {
      this.$router.push({ path: '/cmdb/rs-host', query: { hostId: row.hostId }})
    },
    toAsset(row) {
      this.$router.push({ path: '/asset/property/index', query: { combinationId: row.id }})
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    colseAssetList() {
      this.visible = false
      this.isMaster = false
      this.addIds = []
      this.resetAssetForm()
    },
    // 关联资产
    relevanceAsset() {
      this.isMaster = false
      this.visible = true
      this.assetQueryParams.categoryId = -1
      this.getAssetList()
    },
    // 选择主资产
    selectMasterAsset() {
      this.isMaster = true
      this.visible = true
      this.assetQueryParams.categoryId = 1
      this.getAssetList()
    },
    resetAssetForm() {
      this.resetForm('assetForm')
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
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
    searchAssetList() {
      this.assetQueryParams.pageIndex = 1
      this.getAssetList()
    },
    resetAssetQuery() {
      this.assetQueryParams.assetName = ''
      this.assetQueryParams.categoryId = undefined
      this.assetQueryParams.pageIndex = 1
      this.getAssetList()
    },
    /** 展开收起 */
    toggleAdvanced() {
      const fields = ['code', 'status', 'customId', 'idcId']
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
      this.queryParams.idcId = undefined
      this.queryParams.hostId = undefined
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.editTableData = []
      this.open = true
      this.title = '新增组合'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    deleteSelectionChange(selection) {
      this.deleteIds = selection.map(item => item.id)
      this.multipleAdd = !selection.length
    },
    addSelectionChange(selection) {
      this.addIds = selection
    },
    submitAddAsset(row) {
      this.visible = false
      if (this.isMaster) {
        if (this.editTableData.filter(item => item.categoryId == 1).length) {
          this.editTableData.shift()
        }
        this.editTableData.unshift(row)
      } else {
        if (this.addIds.length) {
          const array = this.editTableData.concat(this.addIds)
          this.editTableData = Array.from(
            new Map(array.map(item => [item.id, item])).values()
          )
        }
      }
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
      getAssetCombination(id).then(response => {
        this.form = response.data
        this.editTableData = response.data.asset.sort((a, b) => b.categoryId === 1 ? 1 : -1)
        this.open = true
        this.title = '修改资产组合'
        this.isEdit = true
      })
    },
    updateDesc(row) {
      this.openDesc = true
      this.descForm = {
        ids: row.id,
        customId: row.customId ? row.customId.toString() : '',
        idcId: row.idcId ? row.idcId.toString() : '',
        status: row.status.toString(),
        desc: row.desc
      }
    },
    submitDescForm: function() {
      this.$refs['descForm'].validate(valid => {
        if (valid) {
          const result = {
            status: parseInt(this.descForm.status),
            ids: [this.descForm.ids],
            idcId: parseInt(this.descForm.idcId) || '',
            customId: parseInt(this.descForm.customId) || '',
            desc: this.descForm.desc
          }
          updateAssetCombinationOtherInfo(result).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.openDesc = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.editTableData.length < 2) {
        this.msgError('组合中至少需要两个资产')
        return
      }
      if (!this.editTableData.filter(item => item.categoryId == 1).length) {
        this.msgError('组合中至少需要一个主资产')
        return
      }
      if (this.form.id !== undefined) {
        updateAssetCombination({ id: this.form.id, asset: this.editTableData.map(item => item.id) }).then(response => {
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      } else {
        addAssetCombination({ asset: this.editTableData.map(item => item.id) }).then(response => {
          if (response.code === 200) {
            this.msgSuccess(response.msg)
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      }
    },
    deleteTableItems(row) {
      var Ids = (row.id && [row.id]) || this.deleteIds
      console.log(Ids)
      this.editTableData = this.editTableData.filter(item => !Ids.includes(item.id))
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delAssetCombination({ 'ids': Ids })
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
.count-item {
  margin-left: 5px;
}
.count-item .label {
  color: rgba(0, 0, 0, 0.45)
}
.count-item .num {
  font-size: 24px;
}
.count-item .unit {
  transform: translateY(2px);
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  font-size: 12px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
