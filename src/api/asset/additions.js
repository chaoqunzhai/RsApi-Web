import request from '@/utils/request'

// 查询AssetInboundMember列表 /api/v1/asset-inbound-member
export function listAssetInboundMember(query) {
  return request({
    url: '/api/v1/asset-store',
    method: 'get',
    params: query
  })
}

// 查询AssetInboundMember详细
export function getAssetInboundMember(query) {
  return request({
    url: '/api/v1/asset-store/' + query.id,
    method: 'get',
    params: query
  })
}

// 新增AssetInboundMember
export function addAssetInboundMember(data) {
  return request({
    url: '/api/v1/asset-store',
    method: 'post',
    data: data
  })
}

// 修改AssetInboundMember
export function updateAssetInboundMember(data) {
  return request({
    url: '/api/v1/asset-store/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除AssetInboundMember
export function delAssetInboundMember(data) {
  return request({
    url: '/api/v1/asset-store',
    method: 'delete',
    data: data
  })
}

