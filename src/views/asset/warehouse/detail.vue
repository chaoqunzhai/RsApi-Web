
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="库房名称：" prop="warehouseName">
              {{ form.warehouseName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="管理员：" prop="administratorId">
              {{ selectDictLabel(administratorIdOptions, form.administratorId) }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              {{ form.remark }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">其他信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="创建人：" prop="createUser">
              {{ form.createUser }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间：" prop="createdAt">
              {{ parseTime(form.createdAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新时间：" prop="updatedAt">
              {{ parseTime(form.updatedAt) }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
<!--      <a-tabs default-active-key="1">-->
<!--        <a-tab-pane key="1" tab="操作日志" force-render>-->
<!--          <Logs :id="id" ref="logs" :mode="'asset_warehouse'"/>-->
<!--        </a-tab-pane>-->
<!--      </a-tabs>-->
    </div>
  </a-spin>

</template>

<script>
import { getAssetWarehouse } from '@/api/asset/asset_warehouse'
import { getUserlistByRole } from '@/api/admin/sys-role'
import Logs from '@/components/Logs/index.vue'

export default {
  name: 'AssetWarehouseDetail',
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
      },
      spinning: false
    }
  },
  created() {
    this.getDataById()
    getUserlistByRole({ name: 'warehouse_user' }).then(response => {
      this.administratorIdOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
  },
  methods: {
    getDataById() {
      this.spinning = true
      getAssetWarehouse(this.id).then(response => {
        this.spinning = false
        this.form = response.data
      })
    }
  }
}
</script>
