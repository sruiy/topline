import request from '@/utils/request'

export const getSearchSuggestion = q => {
  return request({
    url: '/app/v1_0/suggestion',
    method: 'GET',
    params: {
      q
    }

  })
}

export const getSearchArticle = ({
  page,
  perPage,
  q
}) => {
  return request({
    url: '/app/v1_0/search',
    method: 'GET',
    params: {
      page,
      per_page: perPage,
      q
    }
  })
}
