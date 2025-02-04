import request from '@/utils/request'

// 查询RsHostIncome列表
export function listRsHostIncome(query) {
  return request({
    url: '/api/v1/rs-host-income',
    method: 'get',
    params: query
  })
}

// 查询RsHostIncome详细
export function getRsHostIncome(id) {
  return request({
    url: '/api/v1/rs-host-income/' + id,
    method: 'get'
  })
}

// 新增RsHostIncome
export function addRsHostIncome(data) {
  return request({
    url: '/api/v1/rs-host-income',
    method: 'post',
    data: data
  })
}

// 修改RsHostIncome
export function updateRsHostIncome(data) {
  return request({
    url: '/api/v1/rs-host-income/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除RsHostIncome
export function delRsHostIncome(data) {
  return request({
    url: '/api/v1/rs-host-income',
    method: 'delete',
    data: data
  })
}
// 汇总
export function graphIncome(query) {
  return request({
    url: '/api/v1/graph/income',
    method: 'get',
    params: query
  })
}

