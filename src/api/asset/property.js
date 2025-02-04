import request from '@/utils/request'

// 查询AdditionsWarehousing列表
export function listAdditionsWarehousing(query) {
  return request({
    url: '/api/v1/asset',
    method: 'get',
    params: query
  })
}

// 查询AdditionsWarehousing详细
export function getAdditionsWarehousing(id) {
  return request({
    url: '/api/v1/asset/' + id,
    method: 'get'
  })
}

// 新增AdditionsWarehousing
export function addAdditionsWarehousing(data) {
  return request({
    url: '/api/v1/asset',
    method: 'post',
    data: data
  })
}

// 修改AdditionsWarehousing
export function updateAdditionsWarehousing(data) {
  return request({
    url: '/api/v1/asset/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除AdditionsWarehousing
export function delAdditionsWarehousing(data) {
  return request({
    url: '/api/v1/asset',
    method: 'delete',
    data: data
  })
}
// 查询AdditionsWarehousing日志
export function getAdditionsWarehousingLog(query) {
  return request({
    url: '/api/v1/asset-recording',
    method: 'get',
    params: query
  })
}

