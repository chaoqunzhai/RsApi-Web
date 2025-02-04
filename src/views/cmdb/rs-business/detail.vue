
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form
        ref="form"
        :model="form"
        label-width="120px"
        size="mini"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="父级业务："
              prop="parentId"
            >
              {{ selectDictLabel(parentIdOptions, form.parentId) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="业务名称："
              prop="name"
            >
              {{ form.name }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="英文名称："
              prop="enName"
            >
              {{ form.enName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="计费方式："
              prop="billingMethod"
            >
              {{ selectDictLabel(billingMethodOptions, form.billingMethod) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              prop="startUsage"
              label="利用率区间："
            >
              {{ form.startUsage }} - {{form.endUsage}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="状态："
              prop="status"
            >
              <a-tag color="green" v-if="form.status === 2">
                正常
              </a-tag>
              <a-tag color="red" v-if="form.status === 1">
                停用
              </a-tag>
<!--              <el-radio-group-->
<!--                v-model="form.status"-->
<!--                disabled-->
<!--              >-->
<!--                <el-radio-->
<!--                  v-for="dict in statusOptions"-->
<!--                  :key="dict.value"-->
<!--                  :label="dict.value"-->
<!--                >{{ dict.label }}</el-radio>-->
<!--              </el-radio-group>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="备注："
              prop="desc"
            >
              {{ form.desc }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">费用信息</el-divider>
        <el-row>
          <el-table
            border
            :data="form.costCnf"
          >
            <el-table-column
              align="center"
              prop="isp"
              :show-overflow-tooltip="true"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>运营商
              </template>
              <template slot-scope="scope">
                {{ selectDictLabel(ispOptions, form.costCnf[scope.$index].isp) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="dipType"
            >
              <template slot="header">
                IP类型
              </template>
              <template slot-scope="scope">
                {{ selectDictLabel(ipTypeOptions, form.costCnf[scope.$index].ipType) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="dialType"
            >
              <template slot="header">
                拨号类型
              </template>
              <template slot-scope="scope">
                {{ selectDictLabel(dialTypeOptions, form.costCnf[scope.$index].dialType) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="price"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>单价(元/G/月)
              </template>
              <template slot-scope="scope">
                {{ form.costCnf[scope.$index].price }}
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <a-tabs default-active-key="1">
        <a-tab-pane
          key="1"
          tab="操作日志"
          force-render
        >
          <Logs :id="id" ref="logs" :mode="'rs_business'"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>
</template>

<script>
import { getRsBusiness, listRsBusiness } from '@/api/cmdb/rc-business'
import Logs from '@/components/Logs/index.vue'

export default {
  name: 'RsBusinessDetail',
  components: {
    Logs
  },
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
  data() {
    return {
      spinning: false,
      statusOptions: [],
      ipTypeOptions: [],
      ispOptions: [],
      dialTypeOptions: [],
      billingMethodOptions: [],
      parentIdOptions: [],
      form: {
      }
    }
  },
  created() {
    this.getDataById()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('isp').then(response => {
      this.ispOptions = response.data
    })
    this.getDicts('ip_type').then(response => {
      this.ipTypeOptions = response.data
    })
    this.getDicts('dial_type').then(response => {
      this.dialTypeOptions = response.data
    })
    this.getDicts('billing_method').then(response => {
      this.billingMethodOptions = response.data
    })
    listRsBusiness({ pageSize: 100 }).then(response => {
      this.parentIdOptions = this.toDictData(response.data.list, 'name', 'id')
      this.parentIdOptions.unshift({ label: '无父级业务', value: '0' })
    })
  },
  methods: {
    getDataById() {
      this.spinning = true
      if (this.$refs.logs) {
        this.$refs.logs.getDataById()
      }
      getRsBusiness(this.id).then(response => {
        this.spinning = false
        this.form = response.data
      })
    }
  }
}
</script>
