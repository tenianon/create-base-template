import { request, type Option } from '@/utils/http'

export const getUserInfo = (id: number, opt?: Option) => {
  return request({
    url: `/user/get`,
    method: '',
    params: {
      id,
      pas: '123123',
    },
    data: {
      sd: 1321,
    },
    ...opt,
  })
}

export const postUserInfo = (id: number) => {
  return request({
    url: '/user/post',
    method: 'post',
    data: {
      id,
    },
  })
}
