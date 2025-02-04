
<template>
  <div class="container">
      <a-row :gutter="16">
        <a-col :span="6" v-for="(row,index) in data" :key="index" @click="Drilling(row.id)">
          <a-card size="small" class="bu-card" >
            <template #extra>
              <a href="#">查看更多</a>
            </template>
            <div class="bu-info">
              <p>{{ row.name }}</p>
              <p>在线主机: <span class="bu-count">{{row.online}}</span></p>
              <p>总计划带宽: <span class="bu-brand">{{row.balance}}G</span></p>
            </div>
          </a-card>
        </a-col>
      </a-row>
  </div>
</template>

<script>
import { CardList } from '@/api/grafana'

export default {
  name: 'Index',
  data() {
    return {
      loading: true,
      data:{}
    }
  },
  created() {
    this.GetCad()
  },
  methods: {
    Drilling(buId) {

      this.$router.push({ path: '/grafana/host', query: { businessId: buId }})
    },
    GetCad() {
      CardList().then(response => {
        this.loading = false
        this.data = response.data
      })
    }
  }
}
</script>
<style scoped lang="scss">
.bu-card{
  width: 300px;
  margin: 20px;
  cursor: pointer;
  .bu-info{
    font-size: 16px;
    font-weight: bold;
    .bu-count{
      color: blue;
    }
    .bu-brand {
      color:green;
    }
  }

}
</style>
