
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="20">
            <el-form-item
              label-width="100px"
              label="输入命令："
              prop="shell"
            >
              <el-input
                style="width: 100%"
                type="textarea"
                :rows="2"
                v-model="form.shell"
                placeholder="请输入命令" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <a-button style="margin-left: 15px" type="primary" @click="handleSubmit">
                执行
              </a-button>
            </el-form-item>
          </el-col>
          <el-col :span="20">
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
import { hostCommand, getRsHostJobLogByJobId } from '@/api/cmdb/rs-host'

export default {
  name: 'CommandDialog',
  props: {
    ids: {
      type: Array
    }
  },
  watch: {
    ids(newVal, oldVal) {
      this.ids = newVal
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
      form: {
        shell: undefined
      },
      logInfo: '',
      rules: {
        shell: [
          { required: true, message: '命令不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
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
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.spinning = true
          hostCommand({ ...this.form, hostIds: this.ids }).then(response => {
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
