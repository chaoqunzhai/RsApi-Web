
<template>
  <BasicLayout>
    <template #header>
      <el-form
        ref="queryForm"
        class="queryForm"
        style="transform: translateY(4px)"
        :model="queryParams"
      >
        <el-row
          :gutter="20"
          style="position: relative"
        >
          <el-col
            v-show="searchField.includes('hostname')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="主机名称:"
              prop="hostname"
            ><el-input
              v-model="queryParams.hostname"
              type="textarea"
              :rows="1"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('idcId')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="所属机房:"
              prop="idcId"
            ><el-select
              v-model="queryParams.idcId"
              filterable
              placeholder="请选择"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in [{label: '(空机房)', value: 'empty'}].concat(idcNameOptions)"
                :key="dict.value"
                :class="[dict.value === 'empty' ? 'empty' : '']"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('customId')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="所属客户:"
              prop="customId"
            ><el-select
              v-model="queryParams.customId"
              placeholder="所属客户"
              clearable
              filterable
              size="small"
            >
              <el-option
                v-for="dict in customIdOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('businessSn')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="业务SN:"
              prop="businessSn"
            ><el-input
              v-model="queryParams.businessSn"
              placeholder="请输入"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('businessId')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="关联业务:"
              prop="businessId"
            ><el-select
              v-model="queryParams.businessId"
              multiple
              placeholder="请选择"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in [{label: '(空业务)', value: 'empty'}].concat(businessOptions)"
                :key="dict.value"
                :class="[dict.value === 'empty' ? 'empty' : '']"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('status')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="主机状态:"
              prop="status"
            ><el-select
              v-model="queryParams.status"
              placeholder="主机状态"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('isp')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="运营商:"
              prop="isp"
            ><el-select
              v-model="queryParams.isp"
              placeholder="运营商"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in ispOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('region')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="所在区域:"
              prop="region"
            >
              <el-cascader
                v-model="queryParams.region"
                filterable
                size="small"
                :options="regionOptions"
                :props="regionProps"
                :style="{width: '100%'}"
                placeholder="请选择所在区域"
                clearable
              />
            </el-form-item>
          </el-col>
<!--          <el-col-->
<!--            v-show="searchField.includes('belong')"-->
<!--            :sm="24"-->
<!--            :xs="24"-->
<!--            :md="12"-->
<!--            :xl="6"-->
<!--            :lg="6"-->
<!--          >-->
<!--            <el-form-item-->
<!--              label="机器归属:"-->
<!--              prop="belong"-->
<!--            ><el-select-->
<!--              v-model="queryParams.belong"-->
<!--              placeholder="机器归属"-->
<!--              clearable-->
<!--              size="small"-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="dict in belongOptions"-->
<!--                :key="dict.value"-->
<!--                :label="dict.label"-->
<!--                :value="dict.value"-->
<!--              />-->
<!--            </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col
            v-show="searchField.includes('lineType')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="线路类型:"
              prop="lineType"
            ><el-select
              v-model="queryParams.lineType"
              placeholder="线路类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in lineTypeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('networkType')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="网络类型:"
              prop="networkType"
            ><el-select
              v-model="queryParams.networkType"
              placeholder="网络类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in networkTypeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-show="searchField.includes('transProd')"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item
              label="可跨省:"
              prop="transProd"
            ><el-select
              v-model="queryParams.transProd"
              placeholder="可跨省"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in transProdOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col-->
<!--            v-if="searchField.length % 4 == 0"-->
<!--            :sm="24"-->
<!--            :xs="24"-->
<!--            :md="12"-->
<!--            :xl="6"-->
<!--            :lg="6"-->
<!--          >-->
<!--            <el-form-item label=" ">-->
<!--              <el-input hidden />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col
            style="position: absolute;right: 0;bottom: 0px"
            :sm="24"
            :xs="24"
            :md="12"
            :xl="6"
            :lg="6"
          >
            <el-form-item style="text-align: right">
              <a-button
                type="primary"
                icon="search"
                @click="handleQuery"
              >搜索</a-button>
              <a-button
                style="margin-left: 10px"
                @click="resetQuery"
              ><a-icon type="sync" />重置</a-button>
              <a-button
                type="link"
                style="padding-right: 0"
                @click="toggleAdvanced"
              >
                <template v-if="searchField.length > 3">
                  收起<a-icon type="up" />
                </template>
                <template v-else>
                  展开<a-icon type="down" />
                </template>
              </a-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template #wrapper>
      <el-row
        :gutter="10"
        style="transform: translateY(-2px);height: 32px"
        class="mb8"
      >
        <!--          <el-col :span="1.5">-->
        <!--            <el-button-->
        <!--              v-permisaction="['admin:rsHost:add']"-->
        <!--              type="primary"-->
        <!--              icon="el-icon-plus"-->
        <!--              size="mini"-->
        <!--              @click="handleAdd"-->
        <!--            >新增-->
        <!--            </el-button>-->
        <!--          </el-col>-->
        <!--          <el-col :span="1.5">-->
        <!--            <el-button-->
        <!--              v-permisaction="['admin:rsHost:edit']"-->
        <!--              type="success"-->
        <!--              icon="el-icon-edit"-->
        <!--              size="mini"-->
        <!--              :disabled="single"-->
        <!--              @click="handleUpdate"-->
        <!--            >修改-->
        <!--            </el-button>-->
        <!--          </el-col>-->
        <el-col :span="1.5">
          <a-button
            v-permisaction="['admin:rsHost:add']"
            type="primary"
            :disabled="multiple"
            @click="openBindIdc"
          ><a-icon type="paper-clip" />关联机房
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <a-button
            v-permisaction="['admin:rsHost:add']"
            type="primary"
            icon="edit"
            :disabled="multiple"
            @click="openBusinessForm"
          >切换业务
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <a-button
            v-permisaction="['admin:rsHost:add']"
            type="primary"
            icon="code"
            :disabled="multiple"
            @click="openCommandDialog"
          >执行任务
          </a-button>
        </el-col>
        <!--          <el-col :span="1.5">-->
        <!--            <a-button-->
        <!--              v-permisaction="['admin:rsHost:add']"-->
        <!--              type="primary"-->
        <!--              icon="reload"-->
        <!--              size="mini"-->
        <!--              :disabled="multiple"-->
        <!--              @click="openLoggerDialog"-->
        <!--            >重启机器-->
        <!--            </a-button>-->
        <!--          </el-col>-->
        <el-col :span="1.5">
          <a-button
            v-permisaction="['admin:rsHost:remove']"
            type="danger"
            icon="delete"
            :disabled="multiple"
            @click="handleDelete"
          >删除
          </a-button>
        </el-col>
        <el-col :span="1.5">
          <div style="display: flex;height: 32px;justify-items: center;align-items: center">
            <div class="count-item">
              <span class="label">当前在线:</span>
              <span
                class="num"
                style="color: #4CD964"
              >{{ countData.online }}</span>
              <span class="unit">&nbsp;台;</span>
            </div>
            <div class="count-item">
              <span class="label">当前离线:</span>
              <span
                class="num"
                style="color: #E65D6E"
              >{{ offline }}</span>
              <span class="unit">&nbsp;台;</span>
            </div>
            <div class="count-item">
              <span class="label">待上架:</span>
              <span
                class="num"
                style="color: rgb(255,217,28)"
              >{{ awaitCount }}</span>
              <span class="unit">&nbsp;台;</span>
            </div>
            <div class="count-item">
              <span class="label">已知晓:</span>
              <span
                class="num"
                style="color:rgb(121 121 129 / 86%)"
              >{{ todoCount }}</span>
              <span class="unit">&nbsp;台;</span>
            </div>
            <div class="count-item">
              <span class="label">总带宽:</span>
              <span class="num">{{ countData.totalBandwidth }}</span>
              <span class="unit">&nbsp;G</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div
        style="flex: 1"
        class="cu-table"
      >
        <el-table
          v-loading="loading"
          border
          :height="'98%'"
          :data="rsHostList"
          :default-sort="{prop: 'status', order: 'descending'}"
          @sort-change="handleSortChang"
          @selection-change="handleSelectionChange"
        >
<!--          <el-table-column-->
<!--            type="selection"-->
<!--            width="39"-->
<!--          />-->
          <el-table-column
              type="selection"
              width="39"
          />
          <el-table-column
            label="主机备注"
            prop="remark"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">

              {{ scope.row.remark }}
            </template>
          </el-table-column>
          <el-table-column
            label="主机信息"
            width="160"
            prop="hostname"l
          >
            <template slot-scope="scope">
              <a-tooltip placement="topLeft">
                <template slot="title">
                  <div>cpu: {{ scope.row.system.cpu }}核</div>
                  <div v-if="scope.row.system.disk">硬盘: {{ scope.row.system.disk }}G</div>
                  <div>内存：{{ scope.row.system.memory }}G</div>
                  <div>主机名: {{ scope.row.hostname }}   </div>
<!--                  <div>是否跨省: {{ transProdFormat(scope.row) }}   </div>-->
                  <div>
                    <span v-if="scope.row.gateway">GateWay: {{ scope.row.gateway }}</span>
                    <span v-if="scope.row.mask"> / Mask: {{ scope.row.mask }}</span>
                    <span v-if="scope.row.mac"> / MAC: {{ scope.row.mac }}</span>
                  </div>
                  <div>remark: {{ scope.row.remark }}  </div>
                  <div>最新上报时间: {{ scope.row.healthyAt }}  </div>
                  <!--                <div v-if="scope.row.idcInfo"> 所在地区:{{ getNamesFromCodes(scope.row.idcInfo.region, regionOptions) }}</div>-->
                </template>
                <a
                  style="color: #1890ff"
                  @click="toAsset(scope.row)"
                >{{ scope.row.hostname.slice(0,12) }}

                </a>
                <i
                  class="el-icon-copy-document"
                  @click="copyInfo(scope.row.hostname)"
                />
                <!--                <div class="el-table-custom-row">-->
                <!--                  <a-tag-->
                <!--                    v-if="scope.row.auth === 0"-->
                <!--                    color="red"-->
                <!--                  >无权限</a-tag>-->
                <!--                </div>-->
              </a-tooltip>
            </template>
          </el-table-column>

          <el-table-column
            label="内存使用率"
            prop="monitor"
            width="90"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.monitor && scope.row.status === 1">
                <el-progress
                  :text-inside="true"
                  :stroke-width="14"
                  :percentage="scope.row.monitor.used_percent"
                  :color="customColors"
                />
              </span>
              <span v-else>
                <el-progress
                  :text-inside="true"
                  :stroke-width="14"
                  :percentage="0"
                  :color="customColors"
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column
              label="备注"
              prop="desc"
              width="200"
              :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.desc_json.desc ">
                {{ scope.row.desc_json.desc }}
              </div>
              <div v-if="scope.row.desc_json.suspend_billing">
                计费:{{ scope.row.desc_json.suspend_billing }}
              </div>
              {{ scope.row.desc }}
            </template>
          </el-table-column>
          <el-table-column
            label="利用率"
            sortable="custom"
            width="90"
            prop="usage"
          ><template slot-scope="scope">
            <div>{{ scope.row.usage }}</div>
          </template>
          </el-table-column>
          <el-table-column
            label="状态"
            sortable="custom"
            prop="status"
            width="80"
            :formatter="statusFormat"
          >
            <template slot-scope="scope">
              <a-tooltip placement="topLeft">
                <template slot="title">
                  上报时间:{{ scope.row.healthyAt }}
                </template>
                <span v-if="scope.row.status == 1">
                  <a-badge
                    status="processing"
                    :text="statusFormat(scope.row)"
                  />
                </span>
                <span v-else-if="scope.row.status == -1">
                  <a-badge
                    status="error"
                    :text="statusFormat(scope.row)"
                  />
                </span>
                <span v-else>
                  <a-badge
                    status="default"
                    :text="statusFormat(scope.row)"
                  />
                </span>
              </a-tooltip>
            </template>
          </el-table-column>
          <el-table-column
              label="在线时间"
              sortable="healthyAt"
              width="180"
              prop="healthyAt"
          >
          </el-table-column>
          <el-table-column
            label="关联业务"
            prop="business"
            width="126"
          >
            <template slot-scope="scope">

              <a-tag
                v-for="(item,index) in scope.row.business"
                :key="index"
                color="#108ee9"
              >{{ item.label }}</a-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="业务SN"
            width="200"
            prop="sn"
          >
            <template slot-scope="scope">
              <div
                v-for="(row,index) in scope.row.sn"
                :key="index"
                class="el-table-custom-row"
              >
                <a-tooltip placement="topLeft">
                  <template slot="title">

                    {{ row.label }}:<span class="el-table-span">{{ row.value }}</span>
                  </template>
                  {{ row.label }}:<span class="el-table-span">{{ row.value.slice(0,12) }}</span><i
                    class="el-icon-copy-document"
                    @click="copyInfo(row.value)"
                  />
                </a-tooltip>
              </div>

            </template>
          </el-table-column>
          <el-table-column
            label="运营商"
            width="60"
            prop="system"
          ><template slot-scope="scope">
            <div>{{ ispFormat(scope.row) }}</div>
          </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            label="拨号"-->
<!--            width="145"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              <span v-if="scope.row.dialStatus.allLine == 0">{{ scope.row.dialStatus.info }}</span>-->
<!--              <span v-if="scope.row.dialStatus.allLine">{{ scope.row.dialStatus.allLine }}</span>-->
<!--              <span v-if="scope.row.dialStatus.allLine != 0">|<span :style="{ 'color': scope.row.dialStatus.allLine == scope.row.dialStatus.dialUp ? '#67C23A':'#F56C6C' }">拨通{{ scope.row.dialStatus.dialUp }}</span>-->
<!--                |<span :style="{ 'color': scope.row.dialStatus.allLine == scope.row.dialStatus.netUp ? '#67C23A':'#F56C6C' }">联网{{ scope.row.dialStatus.netUp }}</span>-->
<!--              </span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            width="96px"
            label="操作"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                style="margin-left: 6px"
                @click="handleView(scope.row,scope.index)"
              >详情
              </el-button>
              <el-button
                style="margin-left: 6px"
                size="mini"
                type="text"
              >
                <el-dropdown size="mini">
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <el-link
                          type="primary"
                          :underline="false"
                          @click="openBindIdc(scope.row)">关联机房</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link
                          type="primary"
                          :underline="false"
                          @click="openBusinessForm(scope.row)">修改业务</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link
                          type="danger"
                          :underline="false"
                          @click="openSuspendDialog(scope.row)"
                      >计费操作</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-link
                          type="primary"
                          :underline="false"
                        @click="openDescDialog(scope.row)"
                      >添加备注</el-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div
                          :disabled="!scope.row.remotePort"
                          @click="openShellDialog(scope.row)"
                      >修改主机名</div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div

                        @click="updateStatus(scope.row)"
                      >修改状态</div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div

                        @click="openCommandDialog(scope.row)"
                      >执行任务</div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div

                        :disabled="!scope.row.remotePort"
                        @click="openLoggerDialog(scope.row)"
                      >重启机器</div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="handleDelete(scope.row)">删除</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="height: 45px;padding-top: 5px">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
      <a-drawer
        v-if="detailVisible"
        placement="right"
        :header-style="{position: 'sticky', top: 0, zIndex: 999}"
        :closable="true"
        :width="'75%'"
        :visible="detailVisible"
        @close="closeDetail"
      >
        <template #title>
          详情
          <a-button
            type="link"
            @click="reLoadDetail"
          >
            <a-icon type="reload" />刷新
          </a-button>
        </template>

        <Detail
          :id="rowId"
          ref="Detail"
          :row-data="rowData"
        />
      </a-drawer>

      <!-- 添加或修改对话框 -->
      <el-dialog
        :title="title"
        :visible.sync="open"
        width="500px"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
        >

          <el-form-item
            label="排序"
            prop="layer"
          >
            <el-input
              v-model="form.layer"
              placeholder="排序"
            />
          </el-form-item>
          <el-form-item
            label="开关"
            prop="enable"
          >
            <el-select
              v-model="form.enable"
              placeholder="请选择"
            >
              <el-option
                v-for="dict in enableOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="描述信息"
            prop="desc"
          >
            <el-input
              v-model="form.desc"
              placeholder="描述信息"
            />
          </el-form-item>
          <el-form-item
            label="主机名"
            prop="hostname"
          >
            <el-input
              v-model="form.hostname"
              placeholder="主机名"
            />
          </el-form-item>
          <el-form-item
            label="sn"
            prop="sn"
          >
            <el-input
              v-model="form.sn"
              placeholder="sn"
            />
          </el-form-item>
          <el-form-item
            label="cpu"
            prop="cpu"
          >
            <el-input
              v-model="form.cpu"
              placeholder="cpu"
            />
          </el-form-item>
          <el-form-item
            label="ip"
            prop="ip"
          >
            <el-input
              v-model="form.ip"
              placeholder="ip"
            />
          </el-form-item>
          <el-form-item
            label="memory"
            prop="memory"
          >
            <el-input
              v-model="form.memory"
              placeholder="memory"
            />
          </el-form-item>
          <el-form-item
            label="disk"
            prop="disk"
          >
            <el-input
              v-model="form.disk"
              placeholder="disk"
            />
          </el-form-item>
          <el-form-item
            label="内核"
            prop="kernel"
          >
            <el-input
              v-model="form.kernel"
              placeholder="内核"
            />
          </el-form-item>
          <el-form-item
            label="线路类型"
            prop="lineType"
          >
            <el-select
              v-model="form.lineType"
              placeholder="请选择"
            >
              <el-option
                v-for="dict in lineTypeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否跨省"
            prop="transProd"
          >
            <el-select
              v-model="form.transProd"
              placeholder="请选择"
            >
              <el-option
                v-for="dict in transProdOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="机器归属"
            prop="belong"
          >
            <el-select
              v-model="form.belong"
              placeholder="请选择"
            >
              <el-option
                v-for="dict in belongOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
          >
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item
            label="运营商"
            prop="isp"
          >
            <el-select
              v-model="form.isp"
              placeholder="请选择"
            >
              <el-option
                v-for="dict in ispOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="主机状态"
            prop="status"
          >
            <el-select
              v-model="form.status"
              placeholder="请选择"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="submitForm"
          >确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 业务切换对话框 -->
      <a-modal
        title="业务切换"
        :visible="openBusiness"
        width="410px"
        :footer="null"
        @cancel="openBusiness = false"
      >
        <el-form
          ref="businessForm"
          :inline="true"
          :model="idcForm"
          :rules="businessRules"
          label-width="80px"
        >
          <el-form-item
            label="业务类型"
            prop="id"
          ><el-select
            v-model="idcForm.id"
            multiple
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in businessOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
          </el-form-item>
          <el-form-item>
            <a-button
              type="primary"
              @click="submitBusiness"
            >确 定</a-button>
          </el-form-item>
        </el-form>
      </a-modal>
      <!-- 关联机房对话框 -->
      <a-modal
        title="关联机房"
        :visible="openIdc"
        width="370px"
        @cancel="openIdc = false"
      >
        <el-form
          ref="idcForm"
          :model="idcForm"
          :rules="idcRules"
          label-width="80px"
        >
          <el-form-item
            label="机房名称"
            prop="idcId"
          ><el-select
            v-model="idcForm.idcId"
            placeholder="请选择"
            filterable
            clearable
            size="small"
          >
            <el-option
              v-for="dict in idcOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="submitIdc"
          >确 定</el-button>
          <el-button @click="openIdc = false">取 消</el-button>
        </div>
      </a-modal>
      <!-- shell 命令 -->
      <a-modal
        :footer="null"
        title="修改主机名"
        :visible="openExec"
        width="70%"
        @cancel="openExec = false"
      >
        <ShellDialog :id="rowId" />
      </a-modal>
      <a-modal
          :footer="null"
          title="主机计费开关"
          :visible="suspendDialog"
          width="25%"
          @cancel="suspendDialog = false"
      >
        <SuspendDialog :id="rowId" :tag="hostSuspend" @closeSuspendDialog="closeSuspendDialog"/>
      </a-modal>
      <a-modal
          :footer="null"
          title="添加主机备注描述"
          :visible="openDescMsg"
          width="25%"
          @cancel="openDescMsg = false"
      >
        <DescDialog :id="rowId" @closeDescDialog="closeDescDialog"/>
      </a-modal>
      <a-modal
        v-if="openCommand"
        :footer="null"
        title="执行任务"
        :visible="openCommand"
        width="70%"
        @cancel="openCommand = false"
      >
        <CommandDialog :ids="hostIds" />
      </a-modal>
      <a-modal
        v-if="openLogger"
        :footer="null"
        width="70%"
        title="重启机器"
        :visible="openLogger"
        @cancel="openLogger = false"
      >
        <loggerDialog :ids="hostIds" />
      </a-modal>
      <!-- 修改状态、备注 -->
      <a-modal
        title="修改主机状态"
        :visible="openDesc"
        :centered="true"
        ok-text="确定"
        cancel-text="取消"
        width="500px"
        @ok="submitStatusForm"
        @cancel="openDesc = false"
      >
        <el-form
          ref="statusForm"
          :model="statusForm"
          :rules="statusRules"
          label-width="80px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="主机状态"
                prop="status"
              >
                <el-select
                  v-model="statusForm.status"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="dict in statusOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="desc"
              >
                <el-input
                  v-model="statusForm.desc"
                  type="textarea"
                  placeholder="备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </a-modal>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addRsHost,
  delRsHost,
  getRsHost,
  listRsHost,
  updateRsHost,
  getRsHostTotal,
  getRsHostAwait,
  getRsHostCountOffLine,
  hostBindIdc,
  hostSwitch,
  hostStatusUpdate, getRsHostTodo
} from '@/api/cmdb/rs-host'
import { listRsBusiness } from '@/api/cmdb/rc-business'
import { listRsIdc } from '@/api/cmdb/rc-idc'
import { listRsCustom } from '@/api/custom'
import Detail from './detail.vue'
import SuspendDialog from '@/views/cmdb/rs-host/components/suspendDialog'
import DescDialog from '@/views/cmdb/rs-host/components/descDialog.vue'
import ShellDialog from '@/views/cmdb/rs-host/components/shellDialog.vue'
import CommandDialog from '@/views/cmdb/rs-host/components/commandDialog.vue'
import LoggerDialog from '@/views/cmdb/rs-host/components/loggerDialog.vue'

export default {
  name: 'RsHost',
  components: {
    SuspendDialog,
    Detail,
    DescDialog,
    ShellDialog,
    CommandDialog,
    LoggerDialog
  },
  data() {
    return {
      customColors: [
        { color: '#5cb87a', percentage: 20 },
        { color: '#5cb87a', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#e6a23c', percentage: 80 },
        { color: '#e6a23c', percentage: 90 },
        { color: '#f5222d', percentage: 100 }
      ],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      suspendDialog:false,
      openBusiness: false,
      openDescMsg:false,
      openExec: false,
      openCommand: false,
      openLogger: false,
      openIdc: false,
      openDesc: false,
      isEdit: false,
      hostIds: null,

      businessOptions: [],
      idcNameOptions: [],
      idcIdOptions: [],
      idcOptions: [],
      rsHostList: [],
      customIdOptions: [],
      enableOptions: [], belongOptions: [], ispOptions: [], statusOptions: [], lineTypeOptions: [], transProdOptions: [], networkTypeOptions: [],
      // 关系表类型
      searchField: ['hostname', 'customId', 'businessSn', 'idcId', 'region', 'businessId', 'lineType', 'isp', 'networkType', 'transProd', 'status'],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        businessId: undefined,
        customerId:undefined,
        lineType: undefined,
        hostname: undefined,
        idcId: undefined,
        customId: undefined,
        region: undefined,
        businessSn: undefined,
        isp: undefined,
        belong: undefined,
        networkType: undefined,
        transProd: undefined,
        status: undefined,
        hostId: undefined
      },
      expand: false,
      detailVisible: false,
      rowId: undefined,
      rowData: {},
      hostSuspend:false,
      // 表单参数
      form: {
      },
      idcForm: {
        ids: undefined,
        status: undefined,
        desc: undefined
      },
      statusForm: {},
      statusRules: {
        status: [{ required: true, message: '主机状态不能为空', trigger: 'blur' }]
      },
      idcRules: {
        idcId: [{ required: true, message: '机房不能为空', trigger: 'blur' }]
      },
      businessRules: {
        id: [{ required: true, message: '业务类型不能为空', trigger: 'blur' }]
      },
      // 表单校验
      rules: { enable: [{ required: true, message: '开关不能为空', trigger: 'blur' }],
        hostname: [{ required: true, message: '主机名不能为空', trigger: 'blur' }],
        sn: [{ required: true, message: 'sn不能为空', trigger: 'blur' }],
        ip: [{ required: true, message: 'ip不能为空', trigger: 'blur' }],
        belong: [{ required: true, message: '机器归属不能为空', trigger: 'blur' }],
        transProd: [{ required: true, message: '是否跨省不能为空', trigger: 'blur' }],
        lineType: [{ required: true, message: '线路类型不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '主机状态不能为空', trigger: 'blur' }]
      },
      regionOptions: [],
      regionProps: {
        'multiple': true,
        'checkStrictly': true,
        'label': 'name',
        'value': 'code',
        'children': 'children'
      },
      countData: {
        'totalBandwidth': 0,
        'online': 0
      },
      awaitCount: 0,
      offline: 0,
      todoCount: 0,
      order: 'statusOrder'
    }
  },
  created() {
    this.searchField = this.searchField.slice(0, 3)
    if (this.order) {
      this.queryParams['statusOrder'] = 'asc'
    }
    if (this.$route.query.hostId) {
      this.queryParams.hostId = this.$route.query.hostId
    }
    if (this.$route.query.idcId) {
      this.queryParams.idcId = this.$route.query.idcId
      this.queryParams.status = this.$route.query.status
    }
    if (this.$route.query.businessId) {
      this.queryParams.businessId = [this.$route.query.businessId]
      this.toggleAdvanced()
    }
    this.getList()
    this.getDicts('sys_normal_disable').then(response => {
      this.enableOptions = response.data
    })
    // this.getDicts('belong').then(response => {
    //   this.belongOptions = response.data
    // })
    this.getDicts('line_type').then(response => {
      this.lineTypeOptions = response.data
    })
    this.getDicts('isp').then(response => {
      this.ispOptions = response.data
    })
    this.getDicts('host_status').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('sys_yes_no').then(response => {
      this.transProdOptions = response.data
    })
    this.getDicts('network_type').then(response => {
      this.networkTypeOptions = response.data
    })
    this.regionOptions = this.$store.getters.region
    listRsBusiness({ pageSize: -1 }).then(response => {
      this.businessOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    listRsCustom({ pageSize: -1 }).then(response => {
      this.customIdOptions = this.toDictData(response.data.list, 'name', 'id')
    })
    listRsIdc({ pageSize: -1 }).then(response => {
      this.idcNameOptions = response.data.list.map((item) => { return { label: item.number + item['name'], value: item['id'] + '' } })
      // this.idcNameOptions = this.toDictData(response.data.list, 'name', 'name')
      this.idcIdOptions = this.toDictData(response.data.list, 'number', 'number')
      this.idcOptions = this.toDictData(response.data.list, 'name', 'id')
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listRsHost(this.formatQueryParams()).then(response => {
        this.rsHostList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
      getRsHostTotal(this.formatQueryParams()).then(response => {
        this.countData = response.data
      })
      getRsHostAwait(this.formatQueryParams()).then(response => {
        this.awaitCount = response.data
      })
      getRsHostTodo(this.formatQueryParams()).then(response => {
        this.todoCount = response.data
      })
      getRsHostCountOffLine(this.formatQueryParams()).then(response => {
        this.offline = response.data
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    /** 排序回调函数 */
    handleSortChang(column, prop, order) {
      this.queryParams[this.order] = undefined
      prop = column.prop
      order = column.order
      if (this.order !== '' && this.order !== prop + 'Order') {
        this.queryParams[this.order] = undefined
      }
      if (order === 'descending') {
        this.queryParams[prop + 'Order'] = 'desc'
        this.order = prop + 'Order'
      } else if (order === 'ascending') {
        this.queryParams[prop + 'Order'] = 'asc'
        this.order = prop + 'Order'
      } else {
        this.queryParams[prop + 'Order'] = undefined
      }
      this.getList()
    },
    toggleAdvanced() {
      const fields = ['hostname', 'customId', 'businessSn', 'idcId', 'region', 'businessId', 'lineType', 'isp', 'networkType', 'transProd', 'status']
      if (this.searchField.length > 3) {
        this.searchField = fields.splice(0, 3)
      } else {
        this.searchField = fields
      }
    },
    toAsset(row) {
      this.$router.push({ path: '/asset/compose/index', query: { hostId: row.id }})
    },
    // 表单重置
    reset() {
      this.form = {

        id: undefined,
        layer: undefined,
        enable: undefined,
        desc: undefined,
        hostname: undefined,
        lineType: undefined,
        transProd: undefined,
        sn: undefined,
        cpu: undefined,
        ip: undefined,
        memory: undefined,
        disk: undefined,
        kernel: undefined,
        belong: undefined,
        remark: undefined,
        isp: undefined,
        status: undefined
      }
      this.resetForm('form')
    },
    transProdFormat(row) {
      return this.selectDictLabel(this.transProdOptions, row.transProd)
    },
    belongFormat(row) {
      return this.selectDictLabel(this.belongOptions, row.belong)
    },
    lineTypeFormat(row) {
      return this.selectDictLabel(this.lineTypeOptions, row.lineType)
    },
    ispFormat(row) {
      return this.selectDictLabel(this.ispOptions, row.isp)
    },
    copyInfo(textToCopy) {
      if (navigator.clipboard) {
        // navigator clipboard 向剪贴板写文本
        navigator.clipboard.writeText(textToCopy).then(() => {
          this.msgSuccess('复制成功')
          // eslint-disable-next-line handle-callback-err
        }).catch(err => {
          this.msgError('复制失败')
        })
      } else {
        // 创建text area
        const textArea = document.createElement('textarea')
        textArea.value = textToCopy
        // 使text area不在viewport，同时设置不可见
        textArea.style.position = 'absolute'
        textArea.style.opacity = 0
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
        this.msgSuccess('复制成功')
      }
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    networkTypeFormat(row) {
      return this.selectDictLabel(this.networkTypeOptions, row.networkType)
    },
    // 格式化查询参数
    formatQueryParams() {
      const obj = { ...this.queryParams }
      Object.keys(obj).forEach(key => {
        if (obj[key] instanceof Array) {
          obj[key] = [...new Set(obj[key].flat())].join(',')
        }
      })
      return obj
    },
    handleDataScope(row) {
      console.log(row)
      this.reset()
      this.openBusiness = true
    },
    openBindIdc(row) {
      var Ids = (row.id && [row.id]) || this.ids
      this.idcForm = {
        hostIds: Ids,
        idcId: ''
      }
      this.openIdc = true
    },
    openSuspendDialog(row) {
      this.rowId = row.id
      this.suspendDialog = true
      this.hostSuspend = row.suspend_billing
      console.log("hostSuspend",this.hostSuspend)
    },
    openDescDialog(row) {
      this.rowId = row.id
      this.openDescMsg = true
    },
    openShellDialog(row) {
      this.rowId = row.id
      this.openExec = true
    },
    openCommandDialog(row) {
      this.hostIds = (row.id && [row.id]) || this.ids
      this.openCommand = true
    },
    openLoggerDialog(row) {
      this.hostIds = (row.id && [row.id]) || this.ids
      this.openLogger = true
    },
    openBusinessForm(row) {
      var Ids = (row.id && [row.id]) || this.ids
      this.idcForm = {
        hostIds: Ids,
        id: ''
      }
      this.openBusiness = true
    },
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    toggle() {
      this.expand = !this.expand
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.$nextTick(() => {
        this.queryParams.hostId = ''
        this.queryParams.idcId = ''
        this.queryParams.status = ''
        this.queryParams.businessId = undefined
        this.handleQuery()
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加RsHost'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 详细按钮操作
    handleView(row) {
      this.rowId = row.id
      this.rowData = { ...row }
      this.detailVisible = true
    },
    reLoadDetail() {
      this.$refs.Detail.getDataById()
      this.$refs.Detail.getFlowById()
    },
    closeDetail() {
      this.$refs.Detail.activeKey = '1'
      this.detailVisible = false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id =
        row.id || this.ids
      getRsHost(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改RsHost'
        this.isEdit = true
      })
    },
    updateStatus(row) {
      this.openDesc = true
      this.statusForm = {
        ids: row.id,
        status: row.status.toString(),
        desc: row.desc
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateRsHost(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addRsHost(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    submitIdc: function() {
      this.$refs['idcForm'].validate(valid => {
        if (valid) {
          const result = { ...this.idcForm, idcId: parseInt(this.idcForm.idcId) }
          hostBindIdc(result).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.openIdc = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    closeSuspendDialog(){
      this.suspendDialog = false
      this.getList()
    },
    closeDescDialog(){
      this.openDescMsg = false
      this.getList()
    },
    submitStatusForm: function() {
      this.$refs['statusForm'].validate(valid => {
        if (valid) {
          const result = { status: parseInt(this.statusForm.status), ids: [this.statusForm.ids], desc: this.statusForm.desc }
          hostStatusUpdate(result).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.openDesc = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    submitBusiness: function() {
      this.$refs['businessForm'].validate(valid => {
        if (valid) {
          console.log(this.idcForm)
          var { hostIds } = this.idcForm
          var business = this.idcForm.id.map(item => { return { id: item } })
          hostSwitch({ hostIds, business: business }).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.openBusiness = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids
      var msg = '是否确认删除'
      Ids.length > 1 ? (msg = '是否确认删除所选主机?') : (msg = '是否确认删除主机"' + row.hostname + '"?')
      this.$confirm(msg, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRsHost({ 'ids': Ids })
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  font-size: 12px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.ant-tooltip-inner{
  width: max-content !important;
}

.ant-drawer-body{
  padding: 15px !important;
}
.count-item {
  margin-left: 5px;
}
.count-item .label {
  color: rgba(0, 0, 0, 0.45)
}
.count-item .num {
  font-size: 24px;
}
.count-item .unit {
  transform: translateY(2px);
}
.table-card {
  height: 100%;
}
.cu-table {
  ::v-deep .el-icon-copy-document{
    cursor:pointer;
    float: right;
    margin-top: 4px;
  }
}
.empty {
  color: #ff0000;
}

</style>
