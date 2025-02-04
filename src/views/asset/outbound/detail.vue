
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="8">
            <el-form-item label="出库单号：" prop="code">
              {{ form.code }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人：" prop="createUser">
              {{ form.createUser }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请时间：" prop="updatedAt">
              {{ parseTime(form.createdAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称：" prop="customId">
              {{ form.customInfo && form.customInfo.name}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="存放位置：" prop="idcId">
              {{ form.regionInfo && form.regionInfo.name }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人：" prop="user">
              {{ form.userInfo && form.userInfo.username}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：" prop="phoneNumber">
              {{ form.phoneNumber }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在地区：" prop="region">
              {{ getNamesFromCodes(form.region, regionOptions) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址：" prop="address">
              {{ form.address }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物流公司：" prop="ems">
              {{ form.ems }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物流单号：" prop="trackingNumber">
              {{ form.trackingNumber }}
            </el-form-item>
          </el-col>
<!--          <el-col :span="8">-->
<!--            <el-form-item label="出库数量：" prop="count">-->
<!--              {{ form.asset.length }}-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="8">
            <el-form-item label="备注：" prop="desc">
              {{ form.desc }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">
          出库资产明细
        </el-divider>
        <el-row>
          <el-table
            border
            :data="form.asset"
          >
            <el-table-column
              align="center"
              prop="name"
              :label="'组合编码'"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{form.asset[scope.$index].categoryId}}
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
              label="资产编码"
              align="center"
              prop="id"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{form.asset[scope.$index].code}}
              </template>
            </el-table-column>
            <el-table-column
              label="资产名称"
              align="center"
              prop="name"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{form.asset[scope.$index].name}}
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              label="规格型号"
              align="center"
              prop="spec"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{form.asset[scope.$index].spec}}
              </template>
            </el-table-column>
<!--            <el-table-column-->
<!--              align="center"-->
<!--              prop="supplierId"-->
<!--              label="资产分类"-->
<!--              width="100"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                {{ selectDictLabel(categoryIdOptions, form.asset[scope.$index].categoryId) }}-->
<!--              </template>-->
<!--            </el-table-column>-->
            <el-table-column
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
              label="价格(元)"
              align="center"
              prop="price"
            >
              <template slot-scope="scope">
                {{form.asset[scope.$index].price}}
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <div style="height: 45px;margin-top: 15px;position: relative">
        <div style="position: absolute;left: 0;top: 5px">
          资产明细（小计：共{{ form.asset && form.asset.length }}件，{{sumArray(form.asset)}}元）&nbsp;
        </div>
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
import { getAssetOutboundOrder } from '@/api/asset/outbound'

export default {
  name: 'AssetOutboundOrderDetail',
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
      regionOptions: [],
      form: {
      },
      statusOptions: [],
      spinning: false,
      total: 0,
      queryParams: {
        pageIndex: 1,
        pageSize: 10
      },
    }
  },
  created() {
    this.getDataById()
    this.regionOptions = this.$store.getters.region
    this.getDicts('asset_status').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    getDataById() {
      this.spinning = true
      if (this.$refs.logs) {
        this.$refs.logs.getDataById()
      }
      getAssetOutboundOrder({ id: this.id, ...this.queryParams }).then(response => {
        this.spinning = false
        this.form = response.data.list
        this.total = response.data.count
      })
    },
    sumArray(arr) {
      if (!arr || !arr.length) return 0
      const sum = arr.reduce((acc, curr) => acc + curr.price, 0)
      return Number(sum.toFixed(10))
    },
  }
}
</script>
