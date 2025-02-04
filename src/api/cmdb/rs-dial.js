import request from '@/utils/request'

// 查询RsDial列表
export function listRsDial(query) {
  return request({
    url: '/api/v1/rs-dial',
    method: 'get',
    params: query
  })
}

// 查询RsDial详细
export function getRsDial(id) {
  return request({
    url: '/api/v1/rs-dial/' + id,
    method: 'get'
  })
}

// 新增RsDial
export function addRsDial(data) {
  return request({
    url: '/api/v1/rs-dial',
    method: 'post',
    data: data
  })
}

// 修改RsDial
export function updateRsDial(data) {
  return request({
    url: '/api/v1/rs-dial/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除RsDial
export function delRsDial(data) {
  return request({
    url: '/api/v1/rs-dial',
    method: 'delete',
    data: data
  })
}

// 查询主机网卡信息
export function getDriver(id) {
  return request({
    url: '/api/v1/rs-host/driver/' + id,
    method: 'get'
  })
}
// 关联主机
export function hostBindDial(data) {
  return request({
    url: '/api/v1/rs-host/bindDial',
    method: 'post',
    data: data
  })
}
