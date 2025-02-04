
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组合编号：" prop="code">
              {{ form.code }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在位置：" prop="administratorId">
              {{ form.regionInfo && form.regionInfo.val }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人：" prop="createUser">
              {{ form.createUser }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间：" prop="createdAt">
              {{ parseTime(form.createdAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后更新时间：" prop="updatedAt">
              {{ parseTime(form.updatedAt) }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">组合明细</el-divider>
        <el-row>
          <el-table
            border
            max-height="500"
            :data="form.asset"
          >
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
            >
              <template slot-scope="scope">
                <a-button type="link" @click="toAsset(scope.row)">{{ scope.row.id }}</a-button>
              </template>
            </el-table-column>
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
<!--            <el-table-column-->
<!--              label="所在位置"-->
<!--              align="center"-->
<!--              prop="storeRoomId"-->
<!--              width="100"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                {{ selectDictLabel(storeRoomIdOptions, scope.row.storeRoomId) }}-->
<!--              </template>-->
<!--            </el-table-column>-->
          </el-table>
        </el-row>
      </el-form>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="操作日志" force-render>
          <div class="block">
            <template v-if="!logs.length">
              暂无数据
            </template>
            <el-timeline v-else>
              <el-timeline-item
                v-for="(item, index) in logs"
                :key="index"
                :timestamp="item.createdAt.substr(0,10)"
                placement="top"
              >
                <el-card>
                  <div>操作内容：{{item.info}}</div>
                  <p>{{item.user}} 提交于 {{item.createdAt}}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>

</template>

<script>
import { getAssetCombination } from '@/api/asset/combination'
import { getUserlistByRole } from '@/api/admin/sys-role'
import Logs from '@/components/Logs/index.vue'
import { listAssetWarehouse } from '@/api/asset/asset_warehouse'
import { getAdditionsWarehousingLog } from '@/api/asset/property'

export default {
  name: 'AssetComposeDetail',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  watch: {
    id(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getDataById()
      }
    }
  },
  components: {
    Logs
  },
  data() {
    return {
      administratorIdOptions: [],
      form: {
        asset: []
      },
      statusOptions: [],
      storeRoomIdOptions: [],
      logs: [],
      spinning: false
    }
  },
  created() {
    this.getDataById()
    this.getDicts('asset_status').then(response => {
      this.statusOptions = response.data
    })
    getUserlistByRole({ name: 'warehouse_user' }).then(response => {
      this.administratorIdOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
    listAssetWarehouse({ pageSize: -1 }).then(response => {
      this.storeRoomIdOptions = this.toDictData(response.data.list, 'warehouseName', 'id')
    })
  },
  methods: {
    toAsset(row) {
      this.$router.push({ path: '/asset/property/index', query: { id: row.id }})
    },
    getDataById() {
      this.spinning = true
      getAssetCombination(this.id).then(response => {
        this.spinning = false
        this.form = response.data
      })
      getAdditionsWarehousingLog({ assetId: this.id, assetType: 2 }).then(response => {
        this.logs = response.data.list || []
      })
    }
  }
}
</script>
