import request from '@/utils/request'

// 查询RsContract列表
export function listRsContract(query) {
  return request({
    url: '/api/v1/rs-contract',
    method: 'get',
    params: query
  })
}

// 查询RsContract详细
export function getRsContract(id) {
  return request({
    url: '/api/v1/rs-contract/' + id,
    method: 'get'
  })
}

// 新增RsContract
export function addRsContract(data) {
  return request({
    url: '/api/v1/rs-contract',
    method: 'post',
    data: data
  })
}

// 修改RsContract
export function updateRsContract(data) {
  return request({
    url: '/api/v1/rs-contract/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除RsContract
export function delRsContract(data) {
  return request({
    url: '/api/v1/rs-contract',
    method: 'delete',
    data: data
  })
}

