
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同名称：" prop="name">
              {{ form.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号：" prop="number">
              {{ form.number }}
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
              {{ selectDictLabel(signatoryIdOptions, form.signatoryId) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人名称：" prop="userId">
              {{ form.userId }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同类型：" prop="type">
              {{ selectDictLabel(typeOptions, form.type) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算方式：" prop="settlementType">
              {{ selectDictLabel(settlementTypeOptions, form.settlementType) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同开始时间：" prop="startTime">
              {{ parseTime(form.startTimeAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同结束时间：" prop="endTime">
              {{ parseTime(form.endTimeAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户名称：" prop="accountName">
              {{ form.accountName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行账号：" prop="bankAccount">
              {{ form.bankAccount }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行：" prop="bankName">
              {{ form.bankName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纳税人识别号：" prop="identifyNumber">
              {{ form.identifyNumber }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址：" prop="address">
              {{ form.address }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话：" prop="phone">
              {{ form.phone }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="desc">
              {{ form.desc }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">费用信息</el-divider>
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
        <el-divider content-position="left">其他信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item style="margin-bottom: 0" label="创建人：" prop="createUser">
              {{ form.createUser }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item style="margin-bottom: 0" label="创建时间：" prop="createdAt">
              {{ parseTime(form.createdAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item style="margin-bottom: 0" label="更新时间：" prop="updatedAt">
              {{ parseTime(form.updatedAt) }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="操作日志" force-render>

        </a-tab-pane>
      </a-tabs>
    </div><Logs :id="id" ref="logs" :mode="'rs-contract'"/>
  </a-spin>

</template>

<script>
import { getRsContract } from '@/api/contract/index'
import { getUserlistByRole } from '@/api/admin/sys-role'
import { listRsCustom } from '@/api/custom'
import Logs from '@/components/Logs/index.vue'

export default {
  name: 'RsContractDetail',
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
      ispOptions: [],
      chargingOptions: [],
      moreDialingOptions: [],
      transProdOptions: [],
      userIdOptions: [],
      dateRange: [],
      buIdOptions: [], customIdOptions: [], signatoryIdOptions: [], typeOptions: [], settlementTypeOptions: [],
      form: {
      },
      spinning: false
    }
  },
  created() {
    this.getDataById()
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
  },
  methods: {
    getDataById() {
      this.spinning = true
      if (this.$refs.logs) {
        this.$refs.logs.getDataById()
      }
      getRsContract(this.id).then(response => {
        this.spinning = false
        this.form = response.data
      })
    }
  }
}
</script>
