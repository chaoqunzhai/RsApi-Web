import request from '@/utils/request'

// 查询RsBusiness列表
export function listRsBusiness(query) {
  return request({
    url: '/api/v1/rs-business',
    method: 'get',
    params: query
  })
}

// 查询RsBusiness详细
export function getRsBusiness (id) {
  return request({
    url: '/api/v1/rs-business/' + id,
    method: 'get'
  })
}


// 新增RsBusiness
export function addRsBusiness(data) {
  return request({
    url: '/api/v1/rs-business',
    method: 'post',
    data: data
  })
}

// 修改RsBusiness
export function updateRsBusiness(data) {
  return request({
    url: '/api/v1/rs-business/'+data.id,
    method: 'put',
    data: data
  })
}

// 删除RsBusiness
export function delRsBusiness(data) {
  return request({
    url: '/api/v1/rs-business',
    method: 'delete',
    data: data
  })
}

