import request from '@/utils/request'

// 查询RsCustom列表
export function listRsCustom(query) {
  return request({
    url: '/api/v1/rs-custom',
    method: 'get',
    params: query
  })
}

// 查询RsCustom详细
export function getRsCustom(id) {
  return request({
    url: '/api/v1/rs-custom/' + id,
    method: 'get'
  })
}

// 新增RsCustom
export function addRsCustom(data) {
  return request({
    url: '/api/v1/rs-custom',
    method: 'post',
    data: data
  })
}

// 修改RsCustom
export function updateRsCustom(data) {
  return request({
    url: '/api/v1/rs-custom/' + data.id,
    method: 'put',
    data: data
  })
}




// 新增RsCustom
export function addRsCustomIntegration(data) {
  return request({
    url: '/api/v1/rs-custom/integration',
    method: 'post',
    data: data
  })
}

// 修改RsCustom
export function updateRsCustomIntegration(data) {
  return request({
    url: '/api/v1/rs-custom/integration' + data.id,
    method: 'put',
    data: data
  })
}




// 删除RsCustom
export function delRsCustom(data) {
  return request({
    url: '/api/v1/rs-custom',
    method: 'delete',
    data: data
  })
}

// 查询RsCustomUser列表
export function listRsCustomUser(query) {
  return request({
    url: '/api/v1/rs-custom-user',
    method: 'get',
    params: query
  })
}

// 查询RsCustomUser详细
export function getRsCustomUser(id) {
  return request({
    url: '/api/v1/rs-custom-user/' + id,
    method: 'get'
  })
}


// 新增RsCustomUser
export function addRsCustomUser(data) {
  return request({
    url: '/api/v1/rs-custom-user',
    method: 'post',
    data: data
  })
}

// 修改RsCustomUser
export function updateRsCustomUser(data) {
  return request({
    url: '/api/v1/rs-custom-user/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除RsCustomUser
export function delRsCustomUser(data) {
  return request({
    url: '/api/v1/rs-custom-user',
    method: 'delete',
    data: data
  })
}



