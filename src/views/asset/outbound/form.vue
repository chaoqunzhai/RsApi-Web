<template>
  <BasicLayout :show-header="false">
    <template #wrapper>
      <el-form
        ref="form"
        class="form"
        :model="form"
        label-width="90px"
        :rules="rules"
      >
        <div>
          <el-divider content-position="left">基本信息</el-divider>
          <el-row style="padding: 5px 0">
            <el-col :span="8">
              <el-form-item
                label="客户名称"
                prop="customId"
              >
                <el-select
                  @change="changeRegion"
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
            <el-col :span="8">
              <el-form-item
                label="存放位置"
                prop="idcId"
              >
                <el-select
                  v-model="form.idcId"
                  filterable
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
            <el-col :span="8">
              <el-form-item
                label="联系人"
                prop="userId"
              >
                <el-select
                  @change="changePhone"
                  v-model="form.userId"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in userOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="联系电话"
                prop="phoneNumber"
              >
                <el-input
                  v-model="form.phoneNumber"
                  placeholder="联系电话"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="所在地区"
                prop="region"
              >
                <el-cascader
                  v-model="form.region"
                  :options="regionOptions"
                  :props="regionProps"
                  :style="{width: '100%'}"
                  placeholder="请选择所在地区"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="联系地址"
                prop="address"
              >
                <el-input
                  v-model="form.address"
                  placeholder="联系地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="物流公司"
                prop="ems"
              >
                <el-input
                  v-model="form.ems"
                  placeholder="物流公司"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="物流单号"
                prop="trackingNumber"
              >
                <el-input
                  v-model="form.trackingNumber"
                  placeholder="物流单号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="备注"
                prop="desc"
              >
                <el-input
                  v-model="form.desc"
                  placeholder="备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">资产信息</el-divider>
          <div style="margin-bottom: 10px;display: flex;justify-content: space-between">
            <div>
              已增加资产&nbsp; {{ form.asset.length }} &nbsp; 条，共计 &nbsp; {{ sumArray(form.asset)}} &nbsp;元
            </div>
            <div>
              <a-button
                icon="plus"
                style="margin-right: 10px"
                type="primary"
                @click="openAssetList"
              >选择资产
              </a-button>
              <a-button
                type="danger"
                icon="delete"
                :disabled="multiple"
                @click="deleteRows"
              >移除
              </a-button>
            </div>
          </div>
        </div>
        <div style="flex: 1">
          <el-table
            border
            :height="'100%'"
            :span-method="arraySpanMethod"
            :data="form.asset"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            />
            <el-table-column
              width="180"
              label="组合编码"
              align="center"
              prop="combinationId"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ form.asset[scope.$index].combinationSn }}
              </template>
            </el-table-column>
            <el-table-column
              width="180"
              label="资产名称"
              align="center"
              prop="name"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ form.asset[scope.$index].name }}
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              label="规格型号"
              align="center"
              prop="spec"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ form.asset[scope.$index].spec }}
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              label="品牌"
              align="center"
              prop="brand"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ form.asset[scope.$index].brand }}
              </template>
            </el-table-column>
            <el-table-column
              label="资产SN"
              align="center"
              prop="sn"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ form.asset[scope.$index].sn }}
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              align="center"
              prop="price"
              width="180"
            >
              <template slot-scope="scope">
                {{ form.asset[scope.$index].price }}
              </template>
            </el-table-column>
            <el-table-column
              width="130"
              fixed="right"
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  slot="reference"
                  v-permisaction="['admin:rsCustom:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="deleteRow(form.asset[scope.$index].combinationId)"
                >移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <a-button
            key="back"
            style="margin-right: 10px"
            @click="handleCancel"
          >
            取消
          </a-button>
          <a-button
            key="submit"
            type="primary"
            :loading="loading"
            @click="submitForm"
          >
            确定
          </a-button>
        </div>
        <a-modal
          v-if="visible"
          v-model="visible"
          :mask-closable="false"
          ok-text="确定"
          cancel-text="取消"
          :centered="true"
          width="1000px"
          title="选择资产"
          @ok="setFormAsset"
        >
          <AssetListDialog ref="AssetListDialog" />
        </a-modal>
      </el-form>
    </template>
  </BasicLayout>
</template>
<script>

import { listAssetSupplier } from '@/api/asset/supplier'
import { addAssetOutboundOrder } from '@/api/asset/outbound'
import { listRsCustom, listRsCustomUser } from '@/api/custom'
import { listRsIdc } from '@/api/cmdb/rc-idc'
import AssetListDialog from '@/views/asset/components/assetListDialog.vue'

export default {
  name: 'AssetWarehouseForm',
  components: { AssetListDialog },
  data() {
    return {
      form: {
        asset: []
      },
      keys: [],
      multiple: true,
      regionProps: {
        'label': 'name',
        'value': 'code',
        'children': 'children'
      },
      // 表单校验
      rules: {
        customId: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
        userId: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        phoneNumber: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '联系电话格式不正确', trigger: 'blur' }
        ],
        region: [{ required: true, message: '所在地区不能为空', trigger: 'blur' }],
        address: [{ required: false, message: '联系地址不能为空', trigger: 'blur' }],
        asset: [{ required: true, message: '资产信息不能为空', trigger: 'blur' }]
      },
      visible: false,
      key: 1,
      loading: false,
      customIdOptions: [],
      customList: [],
      regionOptions: [],
      unitIdOptions: [],
      categoryIdOptions: [],
      supplierIdOptions: [],
      userOptions: [],
      idcIdOptions: [],
      assetInboundMemberList: [],
      userList: []
    }
  },
  computed: {
    tableDataColumn() {
      const dataObject = {}
      this.form.asset.forEach((item, index) => {
        const id = item.combinationId || item.id
        if (dataObject[id]) {
          dataObject[id].push(index)
        } else {
          dataObject[id] = []
          dataObject[id].push(index)
        }
      })
      return dataObject
    }
  },
  created() {
    this.regionOptions = this.$store.getters.region
    this.reset()
    listAssetSupplier({ pageSize: -1 }).then(response => {
      this.supplierIdOptions = this.toDictData(response.data.list, 'supplierName', 'id')
    })
    this.getDicts('asset_unit_type').then(response => {
      this.unitIdOptions = response.data
    })
    this.getDicts('asset_group_type').then(response => {
      this.categoryIdOptions = response.data
    })
    listRsCustom({ pageSize: -1 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
      this.customList = response.data.list
    })
    listRsCustomUser({ pageSize: -1 }).then(response => {
      this.userOptions = this.toDictData(response.data.list, 'userName', 'id')
      this.userList = response.data.list
    })
    listRsIdc({ pageSize: -1 }).then(response => {
      this.idcIdOptions = response.data.list.map((item) => { return { label: item.number + item['name'], value: item['id'] } })
    })
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([0, 1, 7].includes(columnIndex)) { // 第一列相同数据合并
        if (rowIndex > 0 && row.combinationId === this.form.asset[rowIndex - 1].combinationId) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          const code = row.combinationId
          const rows = this.tableDataColumn[code]
          const length = rows.length
          return {
            rowspan: length,
            colspan: 1
          }
        }
      }
    },
    changePhone() {
      const user = this.userList.find(item => item.id == this.form.userId)
      if (user) {
        this.form.phoneNumber = user.phone
      }
    },
    changeRegion() {
      const region = this.customList.find(item => item.id == this.form.customId)
      this.form.region = region.region.split(',').map(e => Number(e))
    },
    openAssetList() {
      this.visible = true
    },
    deleteRow(combinationId) {
      this.form.asset = this.form.asset.filter(item => item.combinationId !== combinationId)
    },
    deleteRows() {
      this.form.asset = this.form.asset.filter(item => !this.keys.includes(item.key))
    },
    handleSelectionChange(selection, index) {
      this.keys = selection.map(item => item.combinationId)
      this.multiple = !selection.length
    },
    handleCancel() {
      this.$router.push({ path: '/asset/outbound/index' })
    },
    sumArray(arr) {
      if (!arr || !arr.length) return 0
      const sum = arr.reduce((acc, curr) => acc + curr.price, 0)
      return Number(sum.toFixed(10))
    },
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
        userId: undefined,
        idcId: undefined,
        asset: []
      }
      this.resetForm('form')
    },
    setFormAsset(data) {
      this.visible = false
      if (this.form.asset.length) {
        const array = [...this.form.asset]
        array.push(...this.$refs.AssetListDialog.ids)
        this.form.asset = Array.from(new Map(array.map(item => [item.id, item])).values())
      } else {
        this.form.asset = this.$refs.AssetListDialog.ids
      }
    },
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (!this.form.asset.length) {
            this.msgError('请完善资产信息')
            throw new Error(`完善资产信息`)
          }
          const result = {
            ...this.convertFields(this.form, 'toNumber'),
            region: this.form.region.join(','),
            asset: this.form.asset.map(item => item.id),
            combination: this.form.asset.map(item => item.combinationId).filter(Number.isFinite)
          }
          this.loading = true
          addAssetOutboundOrder(result).then(response => {
            this.loading = false
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.reset()
              this.handleCancel()
            } else {
              this.msgError(response.msg)
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    convertFields(data, mode = 'toString') {
      const result = { ...data }
      const fieldsToConvert = ['idcId', 'customId', 'userId']
      // 遍历字段并进行转换
      fieldsToConvert.forEach(field => {
        if (mode === 'toString' && typeof result[field] === 'number') {
          result[field] = result[field].toString() === '0' ? undefined : result[field].toString()
        } else if (mode === 'toNumber' && typeof result[field] === 'string' && !isNaN(result[field])) {
          result[field] = Number(result[field])
        }
      })
      return result
    }
  }
}
</script>
<style scoped>
.form {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.footer {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
