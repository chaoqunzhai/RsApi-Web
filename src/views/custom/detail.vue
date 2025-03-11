
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        size="mini"
      >
        <el-divider content-position="left">客户信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="客户名称："
              prop="name"
            >
              {{ form.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="客户类型："
              prop="type"
            >
              {{ selectDictLabel(typeOptions, form.type) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="合作状态："
              prop="cooperation"
            >
              {{ selectDictLabel(cooperationOptions, form.cooperation) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="所在地区："
              prop="region"
            >
              {{ getNamesFromCodes(form.region, regionOptions) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="详细地址："
              prop="address"
            >
              {{ form.address }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="备注："
              prop="desc"
            >
              {{ form.desc }}
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
              label="更新时间："
              prop="updatedAt"
            >
              {{ parseTime(form.updatedAt) }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">联系人信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名：" prop="userName">
              {{ form.userName }}
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
            <el-form-item label="联系电话：" prop="phone">
              {{ form.phone }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系邮箱：" prop="email">
              {{ form.email }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在地区：" prop="region">
              {{ getNamesFromCodes(form.region, regionOptions) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门：" prop="dept">
              {{ form.dept }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职务：" prop="duties">
              {{ form.duties }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址：" prop="address">
              {{ form.address }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="desc">
              {{ form.desc }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">合同信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同名称：" prop="name">
              {{ form.contract_name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号：" prop="number">
              {{ form.contract_number }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商务人员：" prop="buId">
              {{ selectDictLabel(buIdOptions, form.buId) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属客户：" prop="customId">
              {{ selectDictLabel(customIdOptions, form.customId) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签订人：" prop="signatoryId">
              {{ selectDictLabel(signatoryIdOptions, form.contract_signatoryId) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人名称：" prop="userId">
              {{ form.userId }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同类型：" prop="type">
              {{ selectDictLabel(typeOptions, form.contract_type) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算方式：" prop="settlementType">
              {{ selectDictLabel(settlementTypeOptions, form.contract_settlementType) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同开始时间：" prop="startTime">
              {{ parseTime(form.contract_startTimeAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同结束时间：" prop="endTime">
              {{ parseTime(form.contract_endTimeAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户名称：" prop="accountName">
              {{ form.contract_accountName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行账号：" prop="bankAccount">
              {{ form.contract_bankAccount }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行：" prop="bankName">
              {{ form.contract_bankName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纳税人识别号：" prop="identifyNumber">
              {{ form.contract_identifyNumber }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-table
              border
              :data="form.bandwidthFees"
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
                {{ selectDictLabel(ispOptions, form.bandwidthFees[scope.$index].isp) }}
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="up"
                width="110"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>上行带宽(M)
              </template>
              <template slot-scope="scope">
                {{form.bandwidthFees[scope.$index].up}}
              </template>
            </el-table-column>
            <el-table-column
                label="下行带宽(M)"
                align="center"
                prop="down"
                width="110"
            >
              <template slot-scope="scope">
                {{form.bandwidthFees[scope.$index].down}}
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="charging"
                width="110"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>计费方式
              </template>
              <template slot-scope="scope">
                {{ selectDictLabel(chargingOptions, form.bandwidthFees[scope.$index].charging) }}
              </template>
            </el-table-column>
            <el-table-column
                label="业务线单价(元/M)"
                align="center"
                prop="linePrice"
                width="160"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>业务线单价(元/M/月)
              </template>
              <template slot-scope="scope">
                {{form.bandwidthFees[scope.$index].linePrice}}
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="managerLineCost"
                width="160"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>管理线价格(元/条/月)
              </template>
              <template slot-scope="scope">
                {{form.bandwidthFees[scope.$index].managerLineCost}}
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="transProd"
                width="110"
            >
              <template slot="header">
                <span style="color: #ff4949">*</span>是否可跨省
              </template>
              <template slot-scope="scope">
                {{ selectDictLabel(transProdOptions, form.bandwidthFees[scope.$index].transProd) }}
              </template>
            </el-table-column>
            <el-table-column
                label="是否支持多拨"
                align="center"
                prop="moreDialing"
                width="110"
            >
              <template slot-scope="scope">
                {{ selectDictLabel(moreDialingOptions, form.bandwidthFees[scope.$index].moreDialing) }}
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
<!--      <a-tabs default-active-key="1">-->
<!--        <a-tab-pane-->
<!--          key="1"-->
<!--          tab="操作日志"-->
<!--          force-render-->
<!--        >-->
<!--          <Logs :id="id" ref="logs" :mode="'rs_custom'"/>-->
<!--        </a-tab-pane>-->
<!--      </a-tabs>-->
    </div>
  </a-spin>

</template>

<script>
import {getRsCustom, listRsCustom} from '@/api/custom/index'
import Logs from '@/components/Logs/index.vue'
import { mapState } from 'vuex'
import {getUserlistByRole} from "@/api/admin/sys-role";

export default {
  name: 'RsCustomDetail',
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
      cooperationOptions: [], regionOptions: [],
      form: {
      },
      ispOptions: [],
      chargingOptions: [],
      moreDialingOptions: [],
      transProdOptions: [],
      userIdOptions: [],
      dateRange: [],
      buIdOptions: [], customIdOptions: [],
      signatoryIdOptions: [], typeOptions: [],
      settlementTypeOptions: [],
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
  computed: {
    // 将 Vuex state 映射为计算属性
    ...mapState({
      regionOptions: state => state.region
    })
  },
  created() {
    this.getDataById()
    this.getDicts('customer_type').then(response => {
      this.typeOptions = response.data
    })
    this.getDicts('work_status').then(response => {
      this.cooperationOptions = response.data
    })
    this.getDicts('contract_type').then(response => {
      this.typeOptions = response.data
    })
    this.getDicts('settlement_type').then(response => {
      this.settlementTypeOptions = response.data
    })
    this.getDicts('isp').then(response => {
      this.ispOptions = response.data
    })
    this.getDicts('charging').then(response => {
      this.chargingOptions = response.data
    })
    this.getDicts('sys_yes_no').then(response => {
      this.moreDialingOptions = response.data
      this.transProdOptions = response.data
    })
    getUserlistByRole({ name: 'business_user' }).then(response => {
      this.buIdOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
    getUserlistByRole({ name: 'signatory_user' }).then(response => {
      this.signatoryIdOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
    getUserlistByRole({ name: 'liaison_user' }).then(response => {
      this.userIdOptions = this.toDictData(response.data.list, 'nickName', 'userId')
    })
    listRsCustom({ pageSize: 1000 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    this.regionOptions = this.$store.getters.region
  },
  methods: {
    getDataById() {
      this.spinning = true
      if (this.$refs.logs) {
        this.$refs.logs.getDataById()
      }
      getRsCustom(this.id).then(response => {
        this.spinning = false
        this.form = response.data
        console.log("详情数据",this.form)
      })
    }
  }
}
</script>
