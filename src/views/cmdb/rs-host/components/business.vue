
<template>
  <div style="padding: 5px 0px">
    <el-table
      style="margin-bottom: 15px"
      border
      v-loading="loading"
      :data="businessList"
    >
      <el-table-column
        label="业务名称"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope" v-if="scope.row.businessInfo">
          <span>{{ scope.row.businessInfo.name }} / {{scope.row.businessInfo.enName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="原业务名称"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{scope.row.bu_source}} / {{ scope.row.bu_en_source }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="切换人"
        align="center"
        prop="updatedUser"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="切换时间"
        align="center"
        prop="createdAt"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { hostSwitchLog } from '@/api/cmdb/rs-host'

export default {
  name: 'Business',
  data() {
    return {
      // 遮罩层
      loading: true,
      businessList: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        hostId: undefined
      }
    }
  },
  created() {
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      hostSwitchLog(this.queryParams).then(response => {
        this.businessList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    }
  }
}
</script>
