<template>
  <div class="block">
    <template v-if="!logs.length">
      暂无数据
    </template>
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in logs"
        :key="index"
        :timestamp="item.createdAt.substr(0,10)"
        placement="top"
      >
        <el-card>
          <h4>{{item.info}}</h4>
          <p>{{item.createBy}} 提交于 {{item.createdAt}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>

import { logList } from '@/api/admin/sys-opera-log'

export default {
  name: 'Logs',
  props: {
    id: {
      type: Number,
      required: true
    },
    mode: {
      type: String,
      default: 'log',
      required: true
    }
  },
  data() {
    return {
      logs: []
    }
  },
  watch: {
    id(newVal, oldVal) {
      this.getDataById()
    }
  },
  created() {
    console.log('created')
    this.getDataById()
  },
  methods: {
    getDataById() {
      logList({ module: this.mode, id: this.id }).then(response => {
        this.logs = response.data.list
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
