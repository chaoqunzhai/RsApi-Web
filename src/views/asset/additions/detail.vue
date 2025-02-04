
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="入库单号：" prop="orderId">
              {{ form.orderId }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库时间：" prop="createdAt">
              {{ parseTime(form.createdAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人：" prop="createUser">
              {{ form.createUser }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="存放位置：" prop="storeRoomId">
              {{ selectDictLabel(storeRoomIdOptions, form.storeRoomId) }}
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注：" prop="desc">
              {{ form.desc }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最后更新时间：" prop="updatedAt">
              {{ parseTime(form.updatedAt) }}
            </el-form-item>
          </el-col>
<!--          <el-col :span="8">-->
<!--            <el-form-item label="更新人：" prop="updateBy">-->
<!--              {{ form.updateBy }}-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
        <el-divider content-position="left">
          入库资产明细
        </el-divider>
        <el-row>
          <el-table
            border
            :data="form.asset"
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
                {{form.asset[scope.$index].name}}
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              align="center"
              prop="spec"
              :show-overflow-tooltip="true"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>规格型号
              </template>
              <template slot-scope="scope">
                {{form.asset[scope.$index].spec}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="supplierId"
              label="资产分类"
              width="100"
            >
              <template slot-scope="scope">
                {{ selectDictLabel(categoryIdOptions, form.asset[scope.$index].categoryId) }}
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              label="品牌"
              align="center"
              prop="brand"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{form.asset[scope.$index].brand}}
              </template>
            </el-table-column>
            <el-table-column
              width="130"
              label="资产SN"
              align="center"
              prop="sn"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{form.asset[scope.$index].sn}}
              </template>
            </el-table-column>
            <el-table-column
              width="60"
              align="center"
              prop="unitId"
              :show-overflow-tooltip="true"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>单位
              </template>
              <template slot-scope="scope">
                {{ selectDictLabel(unitIdOptions, form.asset[scope.$index].unitId) }}
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              align="center"
              prop="price"
              width="120"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>价格(元)
              </template>
              <template slot-scope="scope">
                {{form.asset[scope.$index].price}}
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              label="采购人员"
              align="center"
              prop="userId"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ selectDictLabel(userIdOptions, form.asset[scope.$index].userId) }}
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              label="采购日期"
              align="center"
              prop="spec"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ parseTime(form.asset[scope.$index].purchaseAtFormat) }}
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              label="维保到期日"
              align="center"
              prop="ExpireAtFormat"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ parseTime(form.asset[scope.$index].ExpireAtFormat) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="supplierId"
              label="供应商"
              width="180"
            >
              <template slot-scope="scope">
                {{ selectDictLabel(supplierIdOptions, form.asset[scope.$index].supplierId) }}
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
                {{form.asset[scope.$index].desc}}
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <div style="height: 45px;padding-top: 10px">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getDataById"
        />
      </div>
    </div>
  </a-spin>

</template>

<script>
import { getAssetInboundMember } from '@/api/asset/additions'
import { listAssetWarehouse } from '@/api/asset/asset_warehouse'
import { getUserlistByRole } from '@/api/admin/sys-role'
import { listAssetSupplier } from '@/api/asset/supplier'

export default {
  name: 'AssetInboundDetail',
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
  },
  data() {
    return {
      warehouseIdOptions: [],
      storeRoomIdOptions: [],
      userIdOptions: [],
      supplierIdOptions: [],
      unitIdOptions: [],
      categoryIdOptions: [],
      form: {
      },
      total: 0,
      queryParams: {
        pageIndex: 1,
        pageSize: 10
      },
      spinning: false
    }
  },
  created() {
    this.getDataById()
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
    getDataById() {
      this.spinning = true
      getAssetInboundMember({ id: this.id, ...this.queryParams }).then(response => {
        this.spinning = false
        this.form = response.data.list
        this.total = response.data.count
      })
    }
  }
}
</script>
