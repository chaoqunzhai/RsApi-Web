
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 0" label-width="100px" label="日志输出：">
              <pre class="log" v-html="logInfo">
              </pre>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </a-spin>

</template>

<script>
import { hostReload, getRsHostJobLogByJobId } from '@/api/cmdb/rs-host'

export default {
  name: 'LoggerDialog',
  props: {
    ids: {
      type: Array
    }
  },
  watch: {
    ids(newVal, oldVal) {
      this.ids = newVal
      this.handleHostReload()
    }
  },
  components: {
  },
  data() {
    return {
      spinning: false,
      jobId: undefined,
      intervalId: null,
      logStatus: 0,
      logInfo: ''
    }
  },
  created() {
    this.handleHostReload()
  },
  beforeDestroy() {
    this.stopPolling()
  },
  methods: {
    getLog() {
      getRsHostJobLogByJobId(this.jobId).then(response => {
        this.logInfo = response.data.outPut
        this.logStatus = response.data.status
        if ([-1, 1].includes(this.logStatus)) {
          this.stopPolling()
        }
      })
    },
    // 停止轮询
    stopPolling() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    },
    handleHostReload() {
      this.stopPolling()
      this.spinning = true
      hostReload({ ...this.form, hostIds: this.ids }).then(response => {
        this.spinning = false
        if (response.code === 200) {
          this.jobId = response.data
          this.intervalId = setInterval(this.getLog, 1000)
        } else {
          this.msgError(response.msg)
        }
      }).catch(() => {
        this.spinning = false
      })
    }
  }
}
</script>
<style scoped>
.log {
  width: 100%;
  height: 300px;
  background: #000c17;
  color: #5fff26;
  padding: 2px 15px;
  margin-bottom: 0;
}
</style>
