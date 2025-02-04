
<template>
  <a-spin :spinning="spinning">
    <div class="spin-content">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="资产编号：" prop="id">
              {{ form.id }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产名称：" prop="name">
              {{ form.name }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产分类：" prop="categoryId">
              {{ selectDictLabel(categoryIdOptions, form.categoryId) }}
            </el-form-item>
          </el-col>
<!--          <el-col :span="8">-->
<!--            <el-form-item label="关联的入库单号：" prop="wId">-->
<!--              {{ form.wId }}-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="8">
            <el-form-item label="规格型号：" prop="spec">
              {{ form.spec }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌：" prop="brand">
              {{ form.brand }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产SN：" prop="sn">
              {{ form.sn }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计量单位：" prop="unitId">
              {{ selectDictLabel(unitIdOptions, form.unitId) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产组合：" prop="combinationSn">
              {{ form.combinationSn }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="desc">
              {{ form.desc }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">购入信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="采购人：" prop="userId">
              {{ form.userName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格(元)：" prop="price">
              {{ form.price }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购日期：" prop="purchaseAt">
              {{ parseTime(form.purchaseAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商：" prop="supplierId">
              {{ form.supplierName }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="维保到期日：" prop="expireAt">
              {{ parseTime(form.expireAt) }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">使用信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所在位置：" prop="userId">
              {{ form.storeRoomInfo && form.storeRoomInfo.name }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资产管理员：" prop="price">
              {{ form.storeRoomInfo && form.storeRoomInfo.manager }}
            </el-form-item>
          </el-col>
<!--          <el-col :span="8">-->
<!--            <el-form-item label="使用客户：" prop="purchaseAt">-->
<!--              {{ form.storeRoomInfo && form.storeRoomInfo.custom_name }}-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="8">
            <el-form-item label="使用日期：" prop="supplierId">
              {{ form.storeRoomInfo && form.storeRoomInfo.date }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">其他信息</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="创建人：" prop="createUser">
              {{ form.createUser }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间：" prop="createdAt">
              {{ parseTime(form.createdAt) }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="更新时间：" prop="updatedAt">
              {{ parseTime(form.updatedAt) }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="操作日志" force-render>
          <div class="block">
            <template v-if="!logs.length">
              暂无数据
            </template>
            <el-timeline v-else>
              <el-timeline-item
                v-for="(item, index) in logs"
                :key="index"
                :timestamp="item.createdAt.substr(0,10)"
                placement="top"
              >
                <el-card>
                  <div style="display: flex">
                    <div style="flex: 1">操作类型：{{item.type == 1 ? '入库' : '出库'}}</div>
                    <div style="flex: 1" v-if="item.info">操作内容：{{item.info}}</div>
                  </div>
                  <p>{{item.user}} 提交于 {{item.createdAt}}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>

</template>

<script>
import { getAdditionsWarehousing, getAdditionsWarehousingLog } from '@/api/asset/property'

export default {
  name: 'AdditionsWarehousingDetail',
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
  },
  data() {
    return {
      categoryIdOptions: [],
      unitIdOptions: [],
      form: {
      },
      logs: [],
      spinning: false
    }
  },
  created() {
    this.getDataById()
    this.getDicts('asset_group_type').then(response => {
      this.categoryIdOptions = response.data
    })
    this.getDicts('asset_unit_type').then(response => {
      this.unitIdOptions = response.data
    })
  },
  methods: {
    getDataById() {
      this.spinning = true
      getAdditionsWarehousing(this.id).then(response => {
        this.spinning = false
        this.form = response.data
      })
      getAdditionsWarehousingLog({ assetId: this.id, assetType: 1 }).then(response => {
        this.logs = response.data.list || []
      })
    }
  }
}
</script>
