<template>
  <div>
    <a-tabs default-active-key="1" @change="tabChange">
      <a-tab-pane key="1" tab="选择资产组合">
        <el-form
          inline
          ref="searchForm"
          :model="queryParams"
          class="queryForm"
          style="transform: translateY(4px)"
        >
          <el-row
            style="position: relative"
          >
            <el-form-item
              label="组合编码:"
            ><el-input
              v-model="queryParams.code"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="getComposeList"
            />
            </el-form-item>
            <el-form-item style="text-align: right;margin-left: 10px">
              <a-button
                type="primary"
                icon="search"
                @click="getComposeList"
              >搜索</a-button>
              <a-button
                style="margin-left: 10px"
                @click="resetQuery"
              ><a-icon type="sync" />重置</a-button>
            </el-form-item>
          </el-row>
        </el-form>
        <el-table
          max-height="450"
          border
          :data="composeList"
          @selection-change="addSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            label="组合编号"
            align="center"
            prop="code"
            :show-overflow-tooltip="true"
          />
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
            label="关联资产数量"
            align="center"
            prop="assetCount"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="组合价格"
            align="center"
            prop="price"
            :show-overflow-tooltip="true"
          />
        </el-table>
        <div style="margin-top: 24px">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageIndex"
            :limit.sync="queryParams.pageSize"
            @pagination="getComposeList"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="筛选添加资产" force-render>
        <el-form
          inline
          ref="searchForm"
          :model="queryParams"
          class="queryForm"
          style="transform: translateY(4px)"
        >
          <el-row
            style="position: relative"
          >
            <el-form-item
              label="资产SN/编码:"
            ><el-input
              v-model="queryParams.search"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="getComposeList"
            />
            </el-form-item>
            <el-form-item style="text-align: right;margin-left: 10px">
              <a-button
                type="primary"
                icon="search"
                @click="getComposeList"
              >搜索</a-button>
              <a-button
                style="margin-left: 10px"
                @click="resetQuery"
              ><a-icon type="sync" />重置</a-button>
            </el-form-item>
          </el-row>
        </el-form>
        <el-table
          max-height="450"
          border
          :data="assetList"
          @selection-change="addSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
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
                v-else
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
        </el-table>
        <div style="margin-top: 24px">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageIndex"
            :limit.sync="queryParams.pageSize"
            @pagination="getAssetList"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { listAdditionsWarehousing } from '@/api/asset/property'
import { listAssetSupplier } from '@/api/asset/supplier'
import { listAssetCombination } from '@/api/asset/combination'

export default {
  name: 'AssetListDialog',
  data() {
    return {
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        extend: 2,
        status: 1,
        code: undefined,
        search: undefined,
      },
      total: 0,
      composeList: [],
      assetList: [],
      activeKey: '1',
      ids: [],
      form: {
      },
      statusOptions: [],
      categoryIdOptions: []
    }
  },
  created() {
    this.getComposeList()
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
  },
  methods: {
    getAssetList() {
      listAdditionsWarehousing({...this.queryParams, combinationId: 0}).then(response => {
        this.assetList = response.data.list
        this.total = response.data.count
      })
    },
    tabChange(key) {
      this.activeKey = key
      if(this.activeKey == '1') {
        this.getComposeList()
      } else {
        this.getAssetList()
      }
    },
    getComposeList() {
      listAssetCombination(this.queryParams).then(response => {
        this.composeList = response.data.list
        this.total = response.data.count
      })
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.pageIndex = 1
      this.getAssetList()
    },
    addSelectionChange(selection) {
      this.ids = []
      if (selection.length > 0) {
        for (let i = 0; i < selection.length; i++) {
          if (selection[i].asset) {
            this.ids.push(...selection[i].asset)
          } else {
            selection[i].combinationId = this.generateUUID()
            this.ids.push(selection[i])
          }
        }
      }
      // this.ids = selection
      // console.log(this.ids)
    },
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
  }
}
</script>
