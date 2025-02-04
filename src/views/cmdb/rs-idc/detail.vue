
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form
        ref="form"
        :model="form"
        label-width="140px"
        size="mini"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="机房名称："
              prop="name"
            >
              {{ form.name }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="机房编号："
              prop="number"
            >
              {{ form.number }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="机房状态："
              prop="status"
            >
              {{ selectDictLabel(statusOptions, form.status) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="机房归属："
              prop="belong"
            >
              {{ selectDictLabel(belongOptions, form.belong) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属客户：" prop="customId">
              {{ selectDictLabel(customIdOptions, form.customId) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商务人员：" prop="buId">
              {{ selectDictLabel(buIdOptions, form.buId) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="所在地区："
              prop="region"
            >
              {{ getNamesFromCodes(form.region, regionOptions) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="详细地址："
              prop="address"
            >
              {{ form.address }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="机房类型："
              prop="typeId"
            >
              {{ selectDictLabel(typeIdOptions, form.typeId) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="是否跨省："
              prop="transProvince"
            >
              {{ selectDictLabel(transProvinceOptions, form.transProvince) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="是否支持多拨："
              prop="moreDialing"
            >
              {{ selectDictLabel(moreDialingOptions, form.moreDialing) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="是否IPV6："
              prop="ipV6"
            >
              {{ selectDictLabel(ipV6Options, form.ipV6) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="企业微信群名称："
              prop="wechatName"
            >
              {{ form.wechatName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label-width="140"
              label="企业微信群webbook："
              prop="webHookUrl"
            >
              {{ form.webHookUrl }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="更新人："
              prop="updateBy"
            >
              {{ form.updateBy }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          tab="拨号信息"
          force-render
        >
          <RsDial
            :idcId="id"
            :table-fields="['hostId']"
            :search-field="['account']"></RsDial>
        </a-tab-pane>
        <a-tab-pane
          key="2"
          tab="操作日志"
          force-render
        >
          <Logs :id="id" ref="logs" :mode="'rs_idc'"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>

</template>

<script>
import { getRsIdc } from '@/api/cmdb/rc-idc'
import RsDial from '@/views/dial/indexChild.vue'
import { listRsCustom } from '@/api/custom'
import { getUserlistByRole } from '@/api/admin/sys-role'
import Logs from '@/components/Logs/index.vue'

export default {
  name: 'RsIdcDetail',
  components: {
    RsDial,
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
      moreDialingOptions: [],transProvinceOptions: [],
      regionOptions: [], ipV6Options: [], typeIdOptions: [], statusOptions: [], belongOptions: [],buIdOptions: [], customIdOptions: [],
      form: {
      },
      spinning: false
    }
  },
  created() {
    this.getDataById()
    this.regionOptions = this.$store.getters.region
    this.getDicts('sys_yes_no').then(response => {
      this.ipV6Options = response.data
    })
    this.getDicts('idc_type').then(response => {
      this.typeIdOptions = response.data
    })
    this.getDicts('idc_status').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('belong').then(response => {
      this.belongOptions = response.data
    })
    this.getDicts('sys_yes_no').then(response => {
      this.transProvinceOptions = response.data
    })
    this.getDicts('sys_yes_no').then(response => {
      this.moreDialingOptions = response.data
    })
    listRsCustom({ pageSize: 1000 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    getUserlistByRole({ name: 'business_user' }).then(response => {
      this.buIdOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
  },
  methods: {
    getDataById() {
      this.spinning = true
      if (this.$refs.logs) {
        this.$refs.logs.getDataById()
      }
      getRsIdc(this.id).then(response => {
        this.spinning = false
        this.form = response.data
      })
    }
  }
}
</script>
<style scoped>
::v-deep {
  .el-container {
    height: auto!important;
  }
}
</style>
