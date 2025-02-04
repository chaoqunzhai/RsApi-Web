
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="20">
            <el-form-item
                label-width="100px"
                label="主机备注："
                prop="desc"
                required
            >

                <el-input
                    style="width: 100%"
                    :rows="1"
                    v-model="form.desc"
                    placeholder="请输入主机备注信息" />

            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <a-button style="margin-left: 15px" type="primary" @click="handleSubmit">
                提交
              </a-button>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </div>
  </a-spin>

</template>

<script>
import {hostDescUpdate} from '@/api/cmdb/rs-host'

export default {
  name: 'ShellDialog',
  components: {
  },
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
  data() {
    return {
      spinning:false,
      form: {
        desc: ""
      },
      rules: {
        desc: [
          { required: false, message: '备注不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.form.desc = ''
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
          hostDescUpdate({ ...this.form, hostId: this.id}).then(response => {
            this.spinning = false
            this.msgSuccess("修改成功")
            this.$emit("closeDescDialog")
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
