
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>

        </el-row>
      </el-form>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="操作日志" force-render>
          <Logs :id="id" :mode="'RsHostIncome'"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>

</template>

<script>
import Logs from '@/components/Logs/index.vue'
import { getRsHostIncome } from '@/api/income'

export default {
  name: 'RsHostIncomeDetail',
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
      form: {
      },
      spinning: false
    }
  },
  created() {
    this.getDataById()
    this.getDicts('sys_yes_no').then(response => {
      this.ispOptions = response.data
    })
  },
  methods: {
    getDataById() {
      this.spinning = true
      getRsHostIncome(this.id).then(response => {
        this.spinning = false
        this.form = response.data
      })
    }
  }
}
</script>
