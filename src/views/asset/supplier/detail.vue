
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商名称：" prop="supplierName">
              {{ form.supplierName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人：" prop="contactPerson">
              {{ form.contactPerson }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：" prop="phoneNumber">
              {{ form.phoneNumber }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱：" prop="email">
              {{ form.email }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="操作日志" force-render>
          <Logs :id="id" ref="logs" :mode="'AssetSupplier'"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>

</template>

<script>
import Logs from '@/components/Logs/index.vue'
import { getAssetSupplier } from '@/api/asset/supplier'

export default {
  name: 'AssetSupplierDetail',
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

      form: {
      },
      spinning: false
    }
  },
  created() {
    this.getDataById()
  },
  methods: {
    getDataById() {
      this.spinning = true
      if (this.$refs.logs) {
        this.$refs.logs.getDataById()
      }
      getAssetSupplier(this.id).then(response => {
        this.spinning = false
        this.form = response.data
      })
    }
  }
}
</script>
