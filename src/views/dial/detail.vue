
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
          <el-col :span="12">
            <el-form-item
              label="所属客户："
              prop="customId"
            >
              {{ selectDictLabel(customIdOptions, form.customId) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="关联合同："
              prop="contractId"
            >
              {{ selectDictLabel(contractIdOptions, form.contractId) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="带宽类型："
              prop="broadbandType"
            >
              {{ selectDictLabel(broadbandTypeOptions, form.broadbandType) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="是否管理线："
              prop="isManager"
            >
              {{ selectDictLabel(isManagerOptions, form.isManager) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="账号："
              prop="account"
            >
              {{ form.account }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="密码："
              prop="pass"
            >
              {{ form.pass }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="运营商："
              prop="ispId"
            >
              {{ selectDictLabel(ispIdOptions, form.ispId) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="机房名称："
              prop="idcId"
            >
              {{ selectDictLabel(idcIdOptions, form.idcId) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="启用日期："
              prop="runTimeAt"
            >
              {{ parseTime(form.runTimeAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="更新人："
              prop="updateBy"
            >
              {{ form.updateBy }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="最后更新时间："
              prop="updatedAt"
            >
              {{ parseTime(form.updatedAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="备注："
              prop="desc"
            >
              {{ form.desc }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <a-tabs default-active-key="1">
        <a-tab-pane
          key="1"
          tab="操作日志"
          force-render
        >
          <Logs :id="id" ref="logs" :mode="'rs_dial'"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>

</template>

<script>
import { getRsDial } from '@/api/cmdb/rs-dial'
import { listRsContract } from '@/api/contract'
import { listRsCustom } from '@/api/custom'
import { listRsIdc } from '@/api/cmdb/rc-idc'
import Logs from '@/components/Logs/index.vue';

export default {
  name: 'RsDialDetail',
  components: {
    Logs
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      customIdOptions: [], contractIdOptions: [], broadbandTypeOptions: [], isManagerOptions: [], networkingStatusOptions: [], statusOptions: [], ispIdOptions: [], idcIdOptions: [],
      form: {
      },
      spinning: false
    }
  },
  watch: {
    id(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getDataById()
      }
    }
  },
  created() {
    this.getDataById()
    listRsCustom({ pageSize: 1000 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    listRsContract({ pageSize: 1000 }).then(response => {
      this.contractIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    this.getDicts('broadband_type').then(response => {
      this.broadbandTypeOptions = response.data
    })
    this.getDicts('sys_yes_no').then(response => {
      this.isManagerOptions = response.data
    })
    this.getDicts('networking_status').then(response => {
      this.networkingStatusOptions = response.data
    })
    this.getDicts('dial_status').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('isp').then(response => {
      this.ispIdOptions = response.data
    })
    listRsIdc({ pageSize: -1 }).then(response => {
      this.idcIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
  },
  methods: {
    getDataById() {
      this.spinning = true
      if (this.$refs.logs) {
        this.$refs.logs.getDataById()
      }
      getRsDial(this.id).then(response => {
        this.spinning = false
        this.form = response.data
      })
    }
  }
}
</script>
