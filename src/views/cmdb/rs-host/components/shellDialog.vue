
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="20">
            <el-form-item
              label-width="100px"
              label="主机名称："
              prop="hostName"
            >
              <div style="display: flex;">
                <a-switch
                  style="width: 70px;margin-right: 20px;transform: translateY(5px)"
                  v-model="isAuto"
                  checked-children="自动"
                  un-checked-children="手动"/>
                <el-input
                  v-if="!isAuto"
                  style="width: 100%"
                  type="textarea"
                  :rows="1"
                  v-model="form.hostName"
                  placeholder="请输入主机名称" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <a-button style="margin-left: 15px" type="primary" @click="handleSubmit">
                提交
              </a-button>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item style="margin-bottom: 0" label-width="100px" label="日志输出：">
              <pre class="log" v-html="logInfo"></pre>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </a-spin>

</template>

<script>
import { hostNameUpdate, getRsHostJobLogByJobId } from '@/api/cmdb/rs-host'

export default {
  name: 'ShellDialog',
  props: {
    id: {
      type: Number
    }
  },
  watch: {
    id(newVal, oldVal) {
      this.id = newVal
    }
  },
  components: {
  },
  data() {
    return {
      spinning: false,
      jobId: undefined,
      intervalId: null,
      isAuto: true,
      logStatus: 0,
      form: {
        hostName: undefined
      },
      logInfo: '',
      rules: {
        hostName: [
          { required: false, message: '主机名不能为空', trigger: 'blur' }
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
          if (!this.isAuto) {
            if (!this.form.hostName) {
              this.msgError('主机名称不能为空')
              return
            }
            if (this.form.hostName.length < 10 || this.form.hostName.length > 20) {
              this.msgError('主机名称长度在 10 到 20 个字符')
              return
            }
          }
          this.spinning = true
          hostNameUpdate({ ...this.form, hostId: this.id, automation: this.isAuto ? 1 : 2 }).then(response => {
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
