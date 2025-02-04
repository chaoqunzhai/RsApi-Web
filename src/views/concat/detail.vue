
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-divider content-position="left">基本信息</el-divider>
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
          <Logs :id="id" ref="logs" :mode="'rs_custom_user'"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>

</template>

<script>
import { getRsCustomUser, listRsCustom } from '@/api/custom/index'
import { getUserlistByRole } from '@/api/admin/sys-role'
import Logs from '@/components/Logs/index.vue'

export default {
  name: 'RsCustomUserDetail',
  props: {
    id: {
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
      customIdOptions: [],regionOptions: [],buIdOptions: [],
      form: {
      },
      spinning: false
    }
  },
  created() {
    this.getDataById()
    this.regionOptions = this.$store.getters.region
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
      getRsCustomUser(this.id).then(response => {
        this.spinning = false
        this.form = response.data
      })
    }
  }
}
</script>
