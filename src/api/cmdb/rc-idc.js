import request from '@/utils/request'

// 查询RsIdc列表
export function listRsIdc(query) {
  return request({
    url: '/api/v1/rs-idc',
    method: 'get',
    params: query
  })
}

// 查询RsIdc详细
export function getRsIdc(id) {
  return request({
    url: '/api/v1/rs-idc/' + id,
    method: 'get'
  })
}


// 新增RsIdc
export function addRsIdc(data) {
  return request({
    url: '/api/v1/rs-idc',
    method: 'post',
    data: data
  })
}

// 修改RsIdc
export function updateRsIdc(data) {
  return request({
    url: '/api/v1/rs-idc/'+data.id,
    method: 'put',
    data: data
  })
}

// 删除RsIdc
export function delRsIdc(data) {
  return request({
    url: '/api/v1/rs-idc',
    method: 'delete',
    data: data
  })
}

