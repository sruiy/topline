import request from '@/utils/request'

/**
 * 获取评论
 */
export const getComments = ({
  type,
  source,
  offset,
  limit
}) => {
  return request({
    url: '/app/v1_0/comments',
    method: 'GET',
    params: {
      type,
      source,
      offset,
      limit
    }
  })
}

export const addComment = ({
  target,
  content,
  artId
}) => {
  return request({
    url: '/app/v1_0/comments',
    method: 'POST',
    data: {
      target,
      content,
      art_id: artId
    }
  })
}
