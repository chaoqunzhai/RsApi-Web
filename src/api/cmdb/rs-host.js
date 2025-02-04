import request from '@/utils/request'

// 查询RsHost列表
export function listRsHost(query) {
  return request({
    url: '/api/v1/rs-host',
    method: 'get',
    params: query
  })
}

// 查询RsHost详细
export function getRsHost(id) {
  return request({
    url: '/api/v1/rs-host/' + id,
    method: 'get'
  })
}

// 查询RsHost汇总
export function getRsHostTotal(query) {
  return request({
    url: '/api/v1/rs-host/count/online',
    method: 'get',
    params: query
  })
}

export function getRsHostTodo(query) {
  return request({
    url: '/api/v1/rs-host/count/todo',
    method: 'get',
    params: query
  })
}
// 查询RsHost待上架
export function getRsHostAwait(query) {
  return request({
    url: '/api/v1/rs-host/count/wait',
    method: 'get',
    params: query
  })
}

// 查询RsHost离线
export function getRsHostCountOffLine(query) {
  return request({
    url: '/api/v1/rs-host/count/offline',
    method: 'get',
    params: query
  })
}

// 新增RsHost
export function addRsHost(data) {
  return request({
    url: '/api/v1/rs-host',
    method: 'post',
    data: data
  })
}

// 修改RsHost
export function updateRsHost(data) {
  return request({
    url: '/api/v1/rs-host/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除RsHost
export function delRsHost(data) {
  return request({
    url: '/api/v1/rs-host',
    method: 'delete',
    data: data
  })
}
// 关联idc
export function hostBindIdc(data) {
  return request({
    url: '/api/v1/rs-host/bindIdc',
    method: 'post',
    data: data
  })
}
// 切换业务
export function hostSwitch(data) {
  return request({
    url: '/api/v1/rs-host/switch',
    method: 'post',
    data: data
  })
}
// 查询主机流量
export function getRsHostMonitorFlow(query) {
  return request({
    url: '/api/v1/rs-host/monitor_flow/' + query.id,
    method: 'get',
    params: query
  })
}
// 获取主机业务切换记录
export function hostSwitchLog(query) {
  return request({
    url: '/api/v1/rs-host-switch-log',
    method: 'get',
    params: query
  })
}
// 获取主机计费记录
export function hostIncome(query) {
  return request({
    url: '/api/v1/rs-host-income',
    method: 'get',
    params: query
  })
}
export function hostSuspend(data) {
  return request({
    url: '/api/v1/rs-host/action/suspend',
    method: 'post',
    data: data
  })
}
export function hostDescUpdate(data) {
  return request({
    url: '/api/v1/rs-host/exec/upHostDesc',
    method: 'post',
    data: data
  })
}
// 主机名修改
export function hostNameUpdate(data) {
  return request({
    url: '/api/v1/rs-host/exec/upHostName',
    method: 'post',
    data: data
  })
}
// 命令执行
export function hostCommand(data) {
  return request({
    url: '/api/v1/rs-host/exec/command',
    method: 'post',
    data: data
  })
}
// 重启
export function hostReload(data) {
  return request({
    url: '/api/v1/rs-host/exec/reboot',
    method: 'post',
    data: data
  })
}
// 获取指定JOB日志内容
export function getRsHostJobLogByJobId(id) {
  return request({
    url: '/api/v1/rs-host/exec/log/' + id,
    method: 'get'
  })
}
// 获取单台主机Exec日志记录
export function getRsHostJobLogByHostId(id) {
  return request({
    url: '/api/v1/rs-host/exec/hostLog/' + id,
    method: 'get'
  })
}
export function hostStatusUpdate(data) {
  return request({
    url: '/api/v1/rs-host/status',
    method: 'post',
    data: data
  })
}

export function dataBurning(query) {
  return request({
    url: '/api/v1/graph/host/dataBurning',
    method: 'get',
    params: query
  })
}

