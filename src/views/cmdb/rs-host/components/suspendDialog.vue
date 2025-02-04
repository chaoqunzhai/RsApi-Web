
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form"

               :rules="rules" label-width="80px">

        <el-form-item
          label-width="100px"
          label=""
          prop="desc"
        >
          <el-switch
            v-model="form.tag"
            style="display: block"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text=" 开启计费"
            inactive-text="停止计费"
          />
        </el-form-item>

        <el-form-item
          label-width="100px"
          label="原因："
          prop="desc"
          required
        >

          <el-input
            v-model="form.desc"
            style="width: 100%"
            :rows="1"
            placeholder="请输入操作计费原因"
          />

        </el-form-item>

        <el-form-item label-width="100px">
          <a-button style="margin-left: 15px" type="primary" @click="handleSubmit">
            提交
          </a-button>
        </el-form-item>

      </el-form>
    </div>
  </a-spin>

</template>

<script>
import { hostSuspend } from '@/api/cmdb/rs-host'

export default {
  name: 'SuspendDialog',
  components: {
  },
  props: {
    id: {
      type: Number
    },
    tag: {
      type: Boolean
    }
  },
  data() {
    return {
      spinning:false,
      logStatus: 0,
      form: {
        tag: false,
        desc: ''
      },
      rules: {
        desc: [
          { required: false, message: '原因不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    id(newVal, oldVal) {
      this.id = newVal
    },
    tag(newVal, oldVal) {
      this.tag = newVal

    },
  },
  created() {
    this.form.desc = ''
    this.$nextTick(() =>{

      this.form.tag = this.tag
    })
  },
  beforeDestroy() {

  },
  methods: {
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.form.desc) {
            this.msgError('备注不能为空')
            return
          }
          this.spinning = true
          hostSuspend({ ...this.form, hostId: this.id }).then(response => {
            this.spinning = false
            this.msgSuccess('操作成功')
            this.$emit('closeSuspendDialog')
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
