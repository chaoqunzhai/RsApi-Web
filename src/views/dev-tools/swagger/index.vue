<template>
  <BasicLayout :show-header="false">
    <template #wrapper>
      <el-card class="box-card">
        <div v-loading="loading" :style="'height:' + height">
          <iframe
            :src="src"
            frameborder="no"
            style="width: 100%; height: 100%"
            scrolling="auto"
          />
        </div>
      </el-card>
    </template>
  </BasicLayout>
</template>
<script>
export default {
  name: 'Swagger',
  components: {},
  data() {
    return {
      src: process.env.VUE_APP_BASE_API + '/swagger/admin/index.html',
      height: document.documentElement.clientHeight - 94.5 + 'px;',
      loading: true
    }
  },
  mounted: function() {
    setTimeout(() => {
      this.loading = false
    }, 230)
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 94.5 + 'px;'
    }
  }
}
</script>
