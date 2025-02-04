import request from '@/utils/request'

// 查询AssetOutboundOrder列表
export function listAssetOutboundOrder(query) {
  return request({
    url: '/api/v1/asset-outbound-order',
    method: 'get',
    params: query
  })
}

// 查询AssetOutboundOrder详细
export function getAssetOutboundOrder(query) {
  return request({
    url: '/api/v1/asset-outbound-order/' + query.id,
    method: 'get',
    params: query
  })
}

// 新增AssetOutboundOrder
export function addAssetOutboundOrder(data) {
  return request({
    url: '/api/v1/asset-outbound-order',
    method: 'post',
    data: data
  })
}

// 修改AssetOutboundOrder
export function updateAssetOutboundOrder(data) {
  return request({
    url: '/api/v1/asset-outbound-order/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除AssetOutboundOrder
export function delAssetOutboundOrder(data) {
  return request({
    url: '/api/v1/asset-outbound-order',
    method: 'delete',
    data: data
  })
}

