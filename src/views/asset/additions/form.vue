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
                style="margin-bottom: 0"
                label="存放位置"
                prop="storeRoomId"
              >
                <el-select
                  style="width: 100%"
                  filterable
                  v-model="form.storeRoomId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in storeRoomIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item
                style="margin-bottom: 0"
                label="备注"
                prop="desc"
              >
                <el-input
                  v-model="form.desc"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">资产信息</el-divider>
          <div style="margin-bottom: 10px;display: flex;justify-content: space-between">
            <div>
              已增加资产&nbsp; {{form.asset.length}} &nbsp; 条，共计 &nbsp; {{form.asset.reduce((acc, item) => (acc || 0) + (item.price || 0), 0) || 0}} &nbsp;元
            </div>
            <div>
              <a-button
                icon="plus"
                style="margin-right: 10px"
                type="primary"
                @click="addRow"
              >新增
              </a-button>
              <a-button
                type="danger"
                icon="delete"
                :disabled="multiple"
                @click="deleteRows"
              >删除
              </a-button>
            </div>
          </div>
        </div>
        <div style="flex: 1">
          <el-table
            border
            @selection-change="handleSelectionChange"
            :height="'100%'"
            :data="form.asset"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            />
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
                <el-input
                  v-model="form.asset[scope.$index].name"
                  placeholder="请输入"
                />
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              align="center"
              prop="spec"
              :show-overflow-tooltip="true"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>规格型号
              </template>
              <template slot-scope="scope">
                <el-input
                  v-model="form.asset[scope.$index].spec"
                  placeholder="请输入"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="supplierId"
              width="110"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>资产分类
              </template>
              <template slot-scope="scope">
                <el-select
                  v-model="form.asset[scope.$index].categoryId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in categoryIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
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
                <el-input
                  v-model="form.asset[scope.$index].brand"
                  placeholder="请输入"
                />
              </template>
            </el-table-column>
            <el-table-column
              width="180"
              label="资产SN"
              align="center"
              prop="sn"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="form.asset[scope.$index].sn"
                  placeholder="请输入"
                />
              </template>
            </el-table-column>
            <el-table-column
              width="90"
              align="center"
              prop="unitId"
              :show-overflow-tooltip="true"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>计量单位
              </template>
              <template slot-scope="scope">
                <el-select
                  v-model="form.asset[scope.$index].unitId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in unitIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              align="center"
              prop="price"
              width="180"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>价格(元)
              </template>
              <template slot-scope="scope">
                <el-input-number
                  v-model="form.asset[scope.$index].price"
                  style="width: 100%"
                  placeholder="请输入"
                  :min="0"
                  :max="999999"
                />
              </template>
            </el-table-column>
            <el-table-column
              width="110"
              label="采购人员"
              align="center"
              prop="userId"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="form.asset[scope.$index].userId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in userIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              width="162"
              label="采购日期"
              align="center"
              prop="spec"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-date-picker
                  v-model="form.asset[scope.$index].purchaseAt"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                />
              </template>
            </el-table-column>
            <el-table-column
              width="162"
              label="维保到期日"
              align="center"
              prop="expireAt"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-date-picker
                  v-model="form.asset[scope.$index].expireAt"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="supplierId"
              label="供应商"
              width="180"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="form.asset[scope.$index].supplierId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in supplierIdOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
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
                <el-input
                  v-model="form.asset[scope.$index].desc"
                  placeholder="请输入"
                />
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
        </div>
        <div class="footer">
          <a-button key="back" style="margin-right: 10px" @click="handleCancel">
            取消
          </a-button>
          <a-button key="submit" type="primary" :loading="loading" @click="submitForm">
            确定
          </a-button>
        </div>
      </el-form>
    </template>
  </BasicLayout>
</template>
<script>

import { listAssetWarehouse } from '@/api/asset/asset_warehouse'
import { getUserlistByRole } from '@/api/admin/sys-role'
import { listAssetSupplier } from '@/api/asset/supplier'
import { addAssetInboundMember } from '@/api/asset/additions'

export default {
  name: 'AssetWarehouseForm',
  data() {
    return {
      form: {
        asset: []
      },
      keys: [],
      multiple: true,
      // 表单校验
      rules: {
        storeRoomId: [{ required: true, message: '存放位置不能为空', trigger: 'blur' }],
        list: [{ required: true, message: '资产信息不能为空', trigger: 'blur' }]
      },
      key: 1,
      loading: false,
      unitIdOptions: [],
      categoryIdOptions: [],
      supplierIdOptions: [],
      userIdOptions: [],
      storeRoomIdOptions: [],
      assetInboundMemberList: []
    }
  },
  created() {
    this.reset()
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
    copyRow(row) {
      this.form.asset.push({ ...row, key: this.key++ })
    },
    addRow() {
      this.form.asset.push({
        id: undefined,
        name: undefined,
        spec: undefined,
        unitId: undefined,
        brand: undefined,
        sn: undefined,
        price: undefined,
        userId: undefined,
        categoryId: undefined,
        supplierId: undefined,
        desc: undefined,
        key: this.key++
      })
    },
    deleteRow(index) {
      this.form.asset.splice(index, 1)
    },
    deleteRows() {
      this.form.asset = this.form.asset.filter(item => !this.keys.includes(item.key))
    },
    handleSelectionChange(selection, index) {
      this.keys = selection.map(item => item.key)
      console.log(this.keys)
      this.multiple = !selection.length
    },
    handleCancel() {
      this.$router.push({ path: '/asset/additions/index' })
    },
    reset() {
      this.form = {
        id: undefined,
        storeRoomId: undefined,
        desc: undefined,
        asset: [
          {
            id: undefined,
            name: undefined,
            spec: undefined,
            unitId: undefined,
            brand: undefined,
            sn: undefined,
            price: undefined,
            userId: undefined,
            categoryId: undefined,
            supplierId: undefined,
            desc: undefined,
            key: this.key++
          }
        ]
      }
      this.resetForm('form')
    },
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const needValid = ['name', 'spec', 'unitId', 'price', 'categoryId']
          if (!this.form.asset.length) {
            this.msgError('请完善资产信息')
            throw new Error(`完善资产信息`)
          }
          this.form.asset.forEach((item) => {
            Object.keys(item).forEach(key => {
              if (needValid.includes(key) && item[key] === undefined) {
                this.msgError('请完善资产信息')
                throw new Error(`${key}不能为空`)
              }
            })
          })
          const result = {
            ...this.convertFields(this.form, 'toNumber'),
            asset: this.convertToNumbers(this.form.asset, ['unitId', 'price', 'userId', 'supplierId', 'categoryId'])
          }
          console.log(result)
          this.loading = true
          addAssetInboundMember(result).then(response => {
            this.loading = false
            if (response.code === 200) {
              this.msgSuccess(response.msg)
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
      const fieldsToConvert = ['storeRoomId']
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
    convertToNumbers(arr, fields) {
      const res = [...arr]
      return res.map(item => {
        return Object.keys(item).reduce((acc, key) => {
          acc[key] = fields.includes(key) ? Number(item[key]) : item[key]
          return acc
        }, {})
      })
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
