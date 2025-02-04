
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        size="mini"
      >
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
      </el-form>
      <a-tabs default-active-key="1">
        <a-tab-pane
          key="1"
          tab="操作日志"
          force-render
        >
          <Logs :id="id" ref="logs" :mode="'rs_custom'"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>

</template>

<script>
import { getRsCustom } from '@/api/custom/index'
import Logs from '@/components/Logs/index.vue'
import { mapState } from 'vuex'

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
      typeOptions: [], cooperationOptions: [], regionOptions: [],
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
      })
    }
  }
}
</script>
